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
    {#each $cart_store as cartItem}
      <a
        class="w-full p-2 flex gap-2 cursor-pointer hover:bg-gray-200 rounded-lg"
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

    <div class="mb-4">
      Total Price {$cart_store.reduce((a, b) => {
        let price = 0;
        let variant;

        if (b.variant) {
          console.log(b.variant),
            (variant = b.product.variants.find((v) => v._id === b.variant));
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
    <div class="mb-4">
      <a
        href="/checkout"
        class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
        >Checkout</a
      >
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
