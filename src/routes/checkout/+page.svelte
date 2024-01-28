<script>
  //@ts-nocheck
  import {
    cart_store,
    header_title_store,
    token_store,
    user_info_store,
  } from "../../helper/store";
  import { formatCurrency } from "../../helper/utils";
  import { httpClient } from "../../helper/httpClient";
  import { createUserOrder } from "../../helper/endpoints";

  let selected_address;
  let selected_payment_method;

  let order_data = {
    cart_total: 0,
    delivery_charge: 0,
    discount: 0,
    tax: 0,
  };

  console.log($cart_store);

  const handlePlaceOrder = async () => {
    const data = await httpClient(createUserOrder, {
      method: "POST",
      token: $token_store,
      payload: {
        items: $cart_store.map((ci) => {
          return {
            product: ci.product._id,
            quantity: ci.quantity,
            variant: ci.variant,
            variantSchema: ci.variantSchema,
          };
        }),
        address: selected_address,
      },
    });
    if (data.status === 200) {
      alert("Order created successfully");
    }
  };

  $: {
    order_data.cart_total = $cart_store.reduce((a, b) => {
      let price = 0;
      let variant;

      if (b.variant) {
        variant = b.product.variants.find((v) => v._id === b.variant);
      } else {
        price = b.product.price;
      }

      if (variant) {
        price = variant.price;
      }

      //console.log(price);

      return a + b.quantity * price;
    }, 0);
  }

  $: {
    $header_title_store = "Checkout";
  }
</script>

{#if $cart_store.length > 0}
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 pt-4">
    <div class="grid md:grid-cols-3 gap-4">
      <div class="col-span-3 md:col-span-2">
        <div class="mb-4">
          <h1 class="font-semibold text-lg mb-4">Billing Address</h1>
          <div class="flex flex-col gap-4">
            {#each $user_info_store.addresses as address}
              <div
                class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow flex gap-2"
                class:bg-purple-50={selected_address === address._id}
                on:click={() => {
                  selected_address = address._id;
                }}
              >
                <div>
                  <input
                    type="radio"
                    name="address"
                    checked={selected_address === address._id}
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
              </div>
            {/each}
          </div>
        </div>
        <div class="mb-4">
          <h1 class="font-semibold text-lg mb-4">Payment Method</h1>
          <div class="flex flex-col gap-4">
            <div
              class="border border-gray-200 rounded-lg p-4 hover:shadow flex gap-2"
              class:bg-purple-50={true}
            >
              <div>
                <input type="radio" checked={true} />
              </div>
              <div>Paytm</div>
            </div>
          </div>
        </div>
        <div>
          <h1 class="font-semibold text-lg mb-4">Order Details</h1>
          {#each $cart_store as cartItem}
            <a
              class="w-full p-2 flex gap-2 cursor-pointer hover:bg-gray-200"
              href={`/product/${cartItem.product._id}`}
            >
              <div class="w-16">
                <img
                  class="aspect-square object-cover rounded-lg"
                  src={cartItem.product.assets[0].url}
                  alt={cartItem.product.title}
                />
              </div>
              <div class="grow">
                <h1 class="font-semibold">{cartItem.product.title}</h1>

                <p>
                  {#if cartItem.variant}
                    {#if cartItem.product.variants.find((v) => v._id === cartItem.variant)}
                      {cartItem.variant
                        ? cartItem.product.variants.find(
                            (v) => v._id === cartItem.variant
                          ).price
                        : cartItem.product.price}
                    {:else}
                      Out of stock
                    {/if}
                  {:else}
                    {cartItem.product.price}
                  {/if}
                </p>
                <p>Quantity {cartItem.quantity}</p>
              </div>
            </a>
          {/each}

          <div class="mb-4">
            Total Price {$cart_store.reduce((a, b) => {
              let price = 0;
              let variant;

              if (b.variant) {
                variant = b.product.variants.find((v) => v._id === b.variant);
              } else {
                price = b.product.price;
              }

              if (variant) {
                price = variant.price;
              }

              //console.log(price);

              return a + b.quantity * price;
            }, 0)}
          </div>
        </div>
      </div>
      <div class="col-span-3 md:col-span-1">
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="font-semibold mb-4">Order Summary</div>
          <div class="text-sm flex flex-col gap-4 mb-2">
            <div class="flex">
              <div class="grow">Bag Total</div>
              <div>{formatCurrency(order_data.cart_total)}</div>
            </div>

            <div class="flex">
              <div class="grow">Bag Discount</div>
              <div>{formatCurrency(order_data.discount)}</div>
            </div>

            <div class="flex">
              <div class="grow">Tax</div>
              <div>{formatCurrency(order_data.tax)}</div>
            </div>

            <div class="flex">
              <div class="grow">Delivery Charges</div>
              <div>{formatCurrency(order_data.delivery_charge)}</div>
            </div>
          </div>
          <hr class="mb-2" />
          <div class="flex font-semibold mb-4">
            <div class="grow">Total</div>
            <div>
              {formatCurrency(
                order_data.cart_total +
                  order_data.delivery_charge +
                  order_data.tax -
                  order_data.discount
              )}
            </div>
          </div>
          <button
            href="/checkout"
            class="w-full grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
            on:click={handlePlaceOrder}>Place Order</button
          >
        </div>
      </div>
    </div>
  </div>
{:else}
  <h1>No product in cart_store</h1>
{/if}
