<script>
  //@ts-nocheck
  import TrashIcon from "../../components/svg/TrashIcon.svelte";
  import { getUserCart, removeUserCart } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import {
    cart_store,
    header_title_store,
    user_info_store,
    authenticating_store,
  } from "../../helper/store";
  import { formatCurrency } from "../../helper/utils";
  import { goto } from "$app/navigation";
  import CartItem from "../../components/cart/CartItem.svelte";
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";
  import { STATUS } from "../../helper/constants";
  import CartItemShimmer from "../../components/cart/CartItemShimmer.svelte";
  import LoginSpinner from "../../components/LoginSpinner.svelte";

  let loading = false;
  let disabled = false;

  const initCart = async () => {
    loading = true;
    const response = await httpClient(getUserCart, {});

    if (response.status === 200) {
      cart_store.set([...response.data.cart]);
    }
    loading = false;
  };

  $: {
    $header_title_store = "Cart";
  }
</script>

{#if $cart_store.length > 0}
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4">
    {#if loading}
      <BreadcrumbShimmer count={2} />
    {:else}
      <Breadcrumb
        routes={[
          { name: "Home", path: "/" },
          { name: "Bag", path: "/cart" },
        ]}
      />
    {/if}
    <!-- <h1
      class="hidden md:block font-semibold text-3xl text-center mb-4 capitalize rou"
    >
      Cart
    </h1> -->
    <div class="grid md:grid-cols-3 gap-4">
      <div class="grid gap-4 pt-4 md:pt-0 md:col-span-2">
        {#if loading}
          {#each Array(3) as _}
            <CartItemShimmer />
          {/each}
        {:else}
          {#each $cart_store as cartItem}
            <CartItem
              disabled={disabled || loading}
              item={cartItem}
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
                disabled = false;
                await initCart();
              }}
            />
          {/each}
        {/if}
      </div>

      <div>
        <div class="mb-4">
          <span class="font-semibold">Total Items:</span>
          {#if loading}
            <span class="animate-pulse bg-gray-200 rounded-lg w-8 inline-block"
              >&nbsp;</span
            >
          {:else}
            {$cart_store.reduce((a, b) => a + b.quantity, 0)}
          {/if}
        </div>
        <div class="mb-4">
          <span class="font-semibold">Grand Total Price:</span>
          {#if loading}
            <span class="animate-pulse bg-gray-200 rounded-lg w-16 inline-block"
              >&nbsp;</span
            >
          {:else if $cart_store.every((c) => c.product.status === STATUS.ACTIVE)}
            {formatCurrency(
              $cart_store.reduce((a, b) => {
                let price = 0;
                let variant;

                if (b.variant && b.product.variants) {
                  variant = b.product.variants.find((v) => v._id === b.variant);
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
          {:else}{/if}
        </div>
        <div class="mb-4">
          <button
            on:click={() => {
              goto("/checkout");
            }}
            disabled={loading ||
              $cart_store.length === 0 ||
              !$cart_store.every((c) => c.product.status === STATUS.ACTIVE) ||
              !$cart_store.every((c) => {
                if (c.variant && !c.product.variants) {
                  return false;
                }
                return true;
              })}
            class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Checkout</button
          >
          {#if !$cart_store.every((c) => c.product.status === STATUS.ACTIVE) || !$cart_store.every( (c) => {
                if (c.variant && !c.product.variants) {
                  return false;
                }
                return true;
              } )}
            <p class="text-red-500">
              Remove all out of stock or unavailable items to checkout
            </p>
          {/if}
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
    class="flex justify-center items-center flex-col gap-4 p-4 h-[calc(100vh-64px)]"
  >
    <div>Your cart is empty</div>
    <a
      href="/search"
      class="w-full sm:w-fit hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >Continue shopping</a
    >
  </div>
{/if}
