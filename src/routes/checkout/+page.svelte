<script>
  //@ts-nocheck
  import {
    authenticating_store,
    cart_store,
    header_title_store,
    loading_store,
    user_info_store,
    wishlist_store,
  } from "../../helper/store";
  import { formatCurrency, processCart } from "../../helper/utils";
  import { httpClient } from "../../helper/httpClient";
  import {
    createUserOrder,
    getCheckout,
    getUserCart,
    getUserWishlist,
    razorpayCallback,
  } from "../../helper/endpoints";
  import { goto } from "$app/navigation";
  import CloseIcon from "../../components/svg/CloseIcon.svelte";
  import CartItem from "../../components/cart/CartItem.svelte";
  import { STATUS, PAYMENT_GATEWAY } from "../../helper/constants";
  import { page } from "$app/stores";
  import { PUBLIC_BRAND_NAME, PUBLIC_API_URI } from "$env/static/public";
  import CartItemShimmer from "../../components/cart/CartItemShimmer.svelte";
  import LoginSpinner from "../../components/LoginSpinner.svelte";

  let selected_address;
  let selected_payment_method;
  let enable_checkout = false;

  let coupon_code = "";
  let coupon_valid = false;
  let coupon_msg = "";
  let loading = true;
  let disabled = false;

  let order_data = {
    cart: [],
    cart_total: 0,
    delivery_charge: 0,
    discount: 0,
    tax: 0,
    total: 0,
  };

  let paymentGateways = [];

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist);

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    } else {
      wishlist_store.set([]);
    }
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart);

    if (response.status === 200) {
      const cart = processCart(response.data.cart);
      cart_store.set([...cart]);
    } else {
      cart_store.set([]);
    }
  };

  const handleRazorpayPayment = async (rzorder, razorpay_id_key, order_id) => {
    const options = {
      key: razorpay_id_key,
      amount: rzorder.amount,
      currency: rzorder.currency,
      name: PUBLIC_BRAND_NAME,
      description: `"Payment for order ${order_id}`,
      order_id: rzorder.id,
      callback_url: `${PUBLIC_API_URI}${razorpayCallback}?redirectUrl=${$page.url.origin}/checkout`,
      //handler: async (response) => {
      // console.log(response);
      // try {
      //   const callback_response = await httpClient(razorpayCallback, {
      //     method: "POST",
      //     payload: {
      //       razorpay_order_id: response.razorpay_order_id,
      //       razorpay_payment_id: response.razorpay_payment_id,
      //       razorpay_signature: response.razorpay_signature,
      //     },
      //   });

      //   if (callback_response.status === 200) {
      //     goto(`/checkout/success/${callback_response.order.id}`);
      //   } else {
      //     goto(`/checkout/failure/${callback_response.order.id}`);
      //   }
      // } catch (error) {
      //   console.log(error);
      //   goto(`/checkout/failure/${order_id}`);
      // }
      //},
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePlaceOrder = async () => {
    if (
      selected_address === undefined ||
      selected_payment_method === undefined
    ) {
      return;
    }

    $loading_store = true;

    const response = await httpClient(createUserOrder, {
      method: "POST",
      payload: {
        coupon_code: coupon_valid ? coupon_code : null,
        items: $cart_store.map((ci) => {
          return {
            product: ci.product._id,
            quantity: ci.quantity,
            variant: ci.variant,
            variantSchema: ci.variantSchema,
          };
        }),
        address: selected_address,
        redirectUrl: `${$page.url.origin}/checkout`,
        paymentMethod: selected_payment_method,
      },
    });
    console.log(response);
    if (response.status === 200) {
      const paymentGateway = response.data.paymentGateway;
      if (PAYMENT_GATEWAY.PHONEPE === paymentGateway) {
        window.location.href = response.data.paymentUrl;
      } else if (PAYMENT_GATEWAY.RAZORPAY === paymentGateway) {
        await handleRazorpayPayment(
          response.data.razorpay_order,
          response.data.razorpay_id_key,
          response.data.order.id
        );
      }
    } else {
      $loading_store = false;
      if (response?.data?.order?.id) {
        goto(`/checkout/failure/${response.data.order.id}`);
      } else {
        goto(`/checkout/failure`);
      }
    }
    $loading_store = false;
  };

  const initCheckout = async () => {
    loading = true;
    const response = await httpClient(getCheckout, {
      method: "POST",
      payload: {
        coupon_code: coupon_code,
      },
    });

    if (response.status === 200) {
      order_data.cart = processCart(response.data.cart) ?? [];
      order_data.cart_total = response.data.cartTotal;
      order_data.discount = response.data.discount;
      order_data.total = response.data.grandTotal;
      coupon_valid = response.data.couponValid;
      if (coupon_valid && coupon_code.trim()) {
        coupon_msg = "Coupon applied successfully!";
      } else if (coupon_code.trim()) {
        coupon_msg = "Coupon not valid!";
      }
      paymentGateways = response.data.paymentMethod.paymentGateways ?? [];
    } else {
    }
    loading = false;
    disabled = false;
  };

  const handleApplyCoupon = async () => {
    if (coupon_code.trim() === "") {
      return;
    }

    await initCheckout($cart_store);
  };

  const handleRemoveCoupon = async () => {
    coupon_code = "";
    coupon_valid = false;
    coupon_msg = "";
    await initCheckout();
  };

  $: {
    if (!$user_info_store && !$authenticating_store) {
      goto("/");
    } else {
      $user_info_store && $cart_store && initCheckout();
    }
  }

  $: {
    $header_title_store = "Checkout";
  }

  // $ : {
  //   coupon_code = $page.p
  // }

  const validateCheckout = (
    orderData,
    loading,
    selected_address,
    selected_payment_method
  ) => {
    if (loading) {
      return false;
    }

    if (!selected_address) {
      return false;
    }

    if (!selected_payment_method) {
      return false;
    }

    if (!orderData.cart.length) {
      return false;
    }

    if (!order_data.cart.every((c) => !c.isOutOfStock)) {
      return false;
    }

    return true;
  };

  $: {
    enable_checkout = validateCheckout(
      order_data,
      loading,
      selected_address,
      selected_payment_method
    );
  }
</script>

{#if $cart_store.length > 0}
  <div
    class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 pt-4 min-h-[calc(100vh-80px)] flex"
  >
    <div class="grid md:grid-cols-3 gap-4 grow">
      <div class="col-span-3 md:col-span-2">
        <div class="mb-4">
          <h1 class="font-semibold text-lg mb-4">Billing Address</h1>
          {#if $user_info_store.addresses.length}
            <div class="flex flex-col gap-4">
              {#each $user_info_store.addresses as address}
                <label
                  for={`address-${address._id}`}
                  class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow flex gap-2 "
                  class:bg-primary-50={selected_address === address._id}
                >
                  <div>
                    <input
                    class="focus:border-primary-500 focus:ring-primary-500 focus:checked:bg-primary-500 checked:bg-primary-500 hover:checked:bg-primary-500"
                      disabled={loading || disabled}
                      id={`address-${address._id}`}
                      type="radio"
                      name="address"
                      bind:group={selected_address}
                      value={address._id}
                    />
                  </div>
                  <div class="flex gap-1 flex-wrap">
                    <div class="font-semibold">{address.fullName}</div>
                    <div>{address.mobile}</div>
                    <div>{address.addressLine1}</div>
                    <div>{address.addressLine2}</div>
                    <div>{address.landmark}</div>
                    <div>{address.city}</div>
                    <div>{address.state}</div>
                    <div>{address.pincode}</div>
                    <div>{address.country}</div>
                  </div>
                </label>
              {/each}
            </div>
          {:else}
            <p>No address found!</p>
            <a
              href="/account/address/create"
              class="text-primary-500 hover:underline"
              >Click here to add address</a
            >
          {/if}
        </div>
        <div class="mb-4">
          <h1 class="font-semibold text-lg mb-4">Payment Method</h1>
          <div class="flex flex-col gap-4">
            {#if loading}
              {#each Array(3) as _}
                <label
                  class="border border-gray-200 rounded-lg p-4 hover:shadow flex gap-2 cursor-pointer"
                >
                  <div>
                    <input type="radio" disabled={true} />
                  </div>
                  <div class="bg-gray-200 animate-pulse w-32 rounded-lg">
                    &nbsp;
                  </div>
                </label>
              {/each}
            {:else}
              {#each paymentGateways.filter((g) => g.status) as paymentGateway}
                <label
                  for={paymentGateway.name}
                  class="border border-gray-200 rounded-lg p-4 hover:shadow flex gap-2 cursor-pointer"
                  class:bg-primary-50={selected_payment_method ===
                    paymentGateway.code}
                >
                  <div>
                    <input
                      type="radio"
                      id={paymentGateway.name}
                      value={paymentGateway.code}
                      bind:group={selected_payment_method}
                      class="focus:border-primary-500 focus:ring-primary-500  focus:checked:bg-primary-500 checked:bg-primary-500 hover:checked:bg-primary-500"
                    />
                  </div>
                  <div class="capitalize">{paymentGateway.name}</div>
                </label>
              {/each}
            {/if}
          </div>
        </div>
        <div>
          <h1 class="font-semibold text-lg mb-4">Order Details</h1>
          <div class="grid gap-4 mb-4">
            {#if loading}
              {#each Array(3) as _}
                <CartItemShimmer />
              {/each}
            {:else}
              {#each order_data.cart as cartItem}
                <CartItem
                  on:addToCart={async () => {
                    disabled = true;
                  }}
                  on:deleteCartItem={async () => {
                    disabled = true;
                  }}
                  on:removeFromCart={async () => {
                    disabled = true;
                  }}
                  on:updateCart={async () => {
                    await initCart();
                  }}
                  disabled={loading || disabled}
                  item={cartItem}
                />
              {/each}
            {/if}
          </div>
          <!-- <div class="mb-4">
            <span class="font-semibold">Total Price</span>

            {#if $cart_store.every((c) => c.product.status === STATUS.ACTIVE) && $cart_store.every( (c) => {
                  if (c.variant && !c.product.variants) {
                    return false;
                  }
                  return true;
                } )}
              {formatCurrency(
                $cart_store.reduce((a, b) => {
                  let price = 0;
                  let variant;

                  if (b.variant && b.product.variants) {
                    variant = b.product.variants.find(
                      (v) => v._id === b.variant
                    );
                  } else {
                    price = b.product.price;
                  }

                  if (variant) {
                    price = variant.price;
                  }

                  //console.log(price);

                  return a + b.quantity * price;
                }, 0)
              )}
            {:else}
              ---
            {/if}
          </div> -->
        </div>
      </div>
      <div class="col-span-3 md:col-span-1">
        <div class="md:sticky md:top-[80px]">
          <div class="border border-gray-200 rounded-lg p-4 mb-4">
            <div class="font-semibold mb-4">Order Summary</div>
            <div class="text-sm flex flex-col gap-4 mb-2">
              <div class="flex">
                <div class="grow">Bag Total</div>
                <div class:w-16={loading}>
                  {#if loading}
                    <div class=" bg-gray-300 rounded-lg">&nbsp;</div>
                  {:else if order_data.cart.every((c) => c.product.status === STATUS.ACTIVE) && $cart_store.every( (c) => {
                        if (c.variant && !c.product.variants) {
                          return false;
                        }
                        return true;
                      } )}
                    {formatCurrency(order_data.cart_total)}
                  {:else}
                    ---
                  {/if}
                </div>
              </div>

              <div class="flex">
                <div class="grow">Bag Discount</div>
                <div class:w-16={loading}>
                  {#if loading}
                    <div class=" bg-gray-300 rounded-lg">&nbsp;</div>
                  {:else if order_data.cart.every((c) => c.product.status === STATUS.ACTIVE) && $cart_store.every( (c) => {
                        if (c.variant && !c.product.variants) {
                          return false;
                        }
                        return true;
                      } )}-{formatCurrency(order_data.discount)}{:else}---{/if}
                </div>
              </div>

              <div class="flex">
                <div class="grow">Tax</div>
                <div class:w-16={loading}>
                  {#if loading}
                    <div class=" bg-gray-300 rounded-lg">&nbsp;</div>
                  {:else if $cart_store.every((c) => c.product.status === STATUS.ACTIVE) && $cart_store.every( (c) => {
                        if (c.variant && !c.product.variants) {
                          return false;
                        }
                        return true;
                      } )}{formatCurrency(order_data.tax)}{:else}---{/if}
                </div>
              </div>

              <div class="flex">
                <div class="grow">Delivery Charges</div>
                <div class:w-16={loading}>
                  {#if loading}
                    <div class=" bg-gray-300 rounded-lg">&nbsp;</div>
                  {:else if $cart_store.every((c) => c.product.status === STATUS.ACTIVE) && $cart_store.every( (c) => {
                        if (c.variant && !c.product.variants) {
                          return false;
                        }
                        return true;
                      } )}{formatCurrency(
                      order_data.delivery_charge
                    )}{:else}---{/if}
                </div>
              </div>
            </div>
            <hr class="mb-2" />
            <div class="flex font-semibold mb-4">
              <div class="grow">Total</div>
              <div class:w-16={loading}>
                {#if loading}
                  <div class=" bg-gray-300 rounded-lg">&nbsp;</div>
                {:else if $cart_store.every((c) => c.product.status === STATUS.ACTIVE) && $cart_store.every( (c) => {
                      if (c.variant && !c.product.variants) {
                        return false;
                      }
                      return true;
                    } )}
                  {formatCurrency(order_data.total)}
                {:else}
                  ---
                {/if}
              </div>
            </div>
            <button
              href="/checkout"
              class="w-full grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
              on:click={handlePlaceOrder}
              disabled={!enable_checkout}>Place Order</button
            >
            {#if !order_data.cart.every((c) => !c.isOutOfStock)}
              <p class="text-red-500 text-sm">
                Remove all out of stock or unavailable items to checkout
              </p>
            {/if}
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <div class="mb-2">
              <div class="relative">
                <input
                  type="text"
                  class="w-full rounded-lg border border-gray-200 p-2 pe-8"
                  placeholder="Enter coupon code"
                  bind:value={coupon_code}
                  disabled={!loading &&
                  $cart_store.every(
                    (c) => c.product.status === STATUS.ACTIVE
                  ) &&
                  $cart_store.every((c) => {
                    if (c.variant && !c.product.variants) {
                      return false;
                    }
                    return true;
                  })
                    ? false
                    : true}
                />
                <button
                  class:hidden={!coupon_code}
                  class="absolute top-1/2 -translate-y-1/2 right-2"
                  on:click={handleRemoveCoupon}><CloseIcon /></button
                >
              </div>
            </div>
            {#if coupon_msg && coupon_code}
              {#if coupon_valid}
                <div class="text-sm text-green-500 font-semibold mb-4">
                  {coupon_msg}
                </div>
              {:else}
                <div class="text-sm text-red-500 font-semibold mb-4">
                  {coupon_msg}
                </div>
              {/if}
            {/if}
            <button
              disabled={!loading &&
              $cart_store.every((c) => c.product.status === STATUS.ACTIVE) &&
              $cart_store.every((c) => {
                if (c.variant && !c.product.variants) {
                  return false;
                }
                return true;
              })
                ? false
                : true}
              href="/checkout"
              class="w-full grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
              on:click={handleApplyCoupon}>Apply Coupon</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if !$user_info_store && $authenticating_store}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 mt-4 min-h-[calc(100vh-64px)] flex"
  >
    <div class="flex items-center justify-center grow">
      <div class="flex flex-col items-center">
        <LoginSpinner />
        <div>Please wait while we log you in...</div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 pt-4 flex items-center flex-col justify-center h-[calc(100vh-80px)]"
  >
    <h1 class="font-semibold text-2xl mb-4">No product in the cart!</h1>
    <a
      href="/search"
      class="w-full md:w-auto hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >Continue shopping</a
    >
  </div>
{/if}
