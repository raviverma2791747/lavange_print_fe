<script>
  //@ts-nocheck
  import TrashIcon from "../../components/svg/TrashIcon.svelte";
  import { getUserCart, removeUserCart } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import {
    cart_store,
    header_title_store,
    token_store,
  } from "../../helper/store";
  import { formatCurrency } from "../../helper/utils";
  import { goto } from "$app/navigation";
  import CartItem from "../../components/cart/CartItem.svelte";
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";

  let loading = false;

  const handleRemoveFromCart = async (item_id) => {
    const response = await httpClient(removeUserCart, {
      method: "POST",
      token: $token_store,
      payload: {
        itemId: item_id,
      },
    });

    if (response.status === 200) {
      initCart();
    }
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart, {
      token: $token_store,
    });

    if (response.status === 200) {
      cart_store.set([...response.data.cart]);
    }
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
        {#each $cart_store as cartItem}
          <CartItem item={cartItem} />
        {/each}
      </div>

      <div>
        <div class="mb-4">
          <span class="font-semibold">Total Items:</span>
          {$cart_store.reduce((a, b) => a + b.quantity, 0)}
        </div>
        <div class="mb-4">
          <span class="font-semibold">Grand Total Price:</span>
          {#if $cart_store.every((c) => c.product.status === "active")}
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
            disabled={$cart_store.length === 0 ||
              !$cart_store.every((c) => c.product.status === "active") ||
              !$cart_store.every((c) => {
                if (c.variant && !c.product.variants) {
                  return false;
                }
                return true;
              })}
            class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
            >Checkout</button
          >
          {#if !$cart_store.every((c) => c.product.status === "active") || !$cart_store.every( (c) => {
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
{:else}
  <div class="flex justify-center items-center flex-col gap-4 p-4 h-[calc(100vh-64px)]">
    <div>Your cart is empty</div>
    <a
      href="/search"
      class="w-full sm:w-fit hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >Continue shopping</a
    >
  </div>
{/if}
