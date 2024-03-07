<script>
  //@ts-nocheck
  import { stringify } from "postcss";
  import TrashIcon from "../../components/svg/TrashIcon.svelte";
  import { getUserCart, removeUserCart } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import {
    cart_store,
    header_title_store,
    token_store,
  } from "../../helper/store";
  import { formatCurrency } from "../../helper/utils";

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
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0">
    <h1
      class="hidden md:block font-semibold text-3xl text-center mb-4 capitalize rou"
    >
      Cart
    </h1>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="grid gap-4 pt-4 md:pt-0 md:col-span-2">
        {#each $cart_store as cartItem}
          <a
            class="w-full p-2 flex gap-2 cursor-pointer hover:bg-gray-200 rounded-lg border border-gray-200"
            href={`/product/${cartItem.product.slug}`}
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

              <div class="flex gap-2 flex-wrap">
                {#if cartItem.variant && cartItem.product.variants.find((v) => v._id === cartItem.variant)}
                  {#each Object.entries(
                    cartItem.product.variants.find(
                      (v) => v._id === cartItem.variant
                    ).attributes
                  ).map((a) => {
                    return cartItem.product.variantOptions
                      .find((v) => v.name === a[0])
                      .options.find((o) => o.value === a[1]).displayName;
                  }) as attribute}
                  <div class="border border-purple-500 text-purple-500 bg-purple-200 px-2 rounded-lg">{attribute}</div>
                  {/each}
                {/if}
              </div>

              <p>
                {#if cartItem.variant}
                  {#if cartItem.product.variants.find((v) => v._id === cartItem.variant)}
                    {formatCurrency(
                      cartItem.variant
                        ? cartItem.product.variants.find(
                            (v) => v._id === cartItem.variant
                          ).price
                        : cartItem.product.price
                    )}
                  {:else}
                    Out of stock
                  {/if}
                {:else}
                  {formatCurrency(cartItem.product.price)}
                {/if}
              </p>
              <p>
                <span class="font-semibold">Quantity</span>
                {cartItem.quantity}
              </p>
              <p>
                <span class="font-semibold">Total Price</span>
                {#if cartItem.variant}
                  {#if cartItem.product.variants.find((v) => v._id === cartItem.variant)}
                    {formatCurrency(
                      (cartItem.variant
                        ? cartItem.product.variants.find(
                            (v) => v._id === cartItem.variant
                          ).price
                        : cartItem.product.price) * cartItem.quantity
                    )}
                  {:else}
                    Out of stock
                  {/if}
                {:else}
                  {formatCurrency(cartItem.product.price * cartItem.quantity)}
                {/if}
              </p>
            </div>
            <button
              class="hover:text-red-500"
              on:click={(e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
                handleRemoveFromCart(cartItem._id);
              }}
            >
              <TrashIcon />
            </button>
          </a>
        {/each}
      </div>

      <div>
        <div class="mb-4">
          <span class="font-semibold">Total Items:</span>
          {$cart_store.reduce((a, b) => a + b.quantity, 0)}
        </div>
        <div class="mb-4">
          <span class="font-semibold">Grand Total Price:</span>
          {formatCurrency(
            $cart_store.reduce((a, b) => {
              let price = 0;
              let variant;

              if (b.variant) {
                console.log(b.variant),
                  (variant = b.product.variants.find(
                    (v) => v._id === b.variant
                  ));
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
        </div>
        <div class="mb-4">
          <a
            href="/checkout"
            class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
            >Checkout</a
          >
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center flex-col gap-4 p-4 h-full">
    <div>Your cart is empty</div>
    <a
      href="/search"
      class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
      >Continue shopping</a
    >
  </div>
{/if}
