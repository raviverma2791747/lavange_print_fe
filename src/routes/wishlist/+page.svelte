<script>
  //@ts-nocheck
  import ProductCard from "../../components/ProductCard.svelte";
  import TrashIcon from "../../components/svg/TrashIcon.svelte";
  import { product_cache } from "../../helper/cache_store";
  import { getUserWishlist, removeUserWishlist } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import {
    header_title_store,
    token_store,
    wishlist_store,
  } from "../../helper/store";
  import { formatCurrency } from "../../helper/utils";

  const handleRemoveFromWishlist = async (product_id) => {
    const response = await httpClient(removeUserWishlist, {
      method: "POST",
      token: $token_store,
      payload: {
        productId: product_id,
      },
    });

    if (response.status === 200) {
      initWishlist();
    }
  };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist, {
      token: $token_store,
    });

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    }
  };

  $: {
    $header_title_store = "Wishlist";
  }
</script>

{#if $wishlist_store.length > 0}
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0">
    <h1
      class="hidden md:block font-semibold text-xl md:text-3xl text-center mb-4 capitalize"
    >
      Wishlist
    </h1>
    <div class="grid gap-4 md:grid-cols-4 lg:grid-cols-6 py-4">
      {#each $wishlist_store as product}
        <a
          class="w-full p-2 flex gap-2 cursor-pointer hover:bg-gray-200 md:hidden border border-gray-200 rounded-lg"
          href={`/product/${product.slug}`}
        >
          <div class="w-16">
            {#if product.assets.length}
            <img
              class="aspect-square object-cover rounded-lg"
              src={product.assets[0].url}
              alt={product.title}
            />
            {:else}
            <div class="aspect-square bg-gray-300 rounded-lg"></div>
            {/if}
          </div>
          <div class="grow">
            <h1 class="font-semibold">{product.title}</h1>
            {#if product.status === "active"}
              <p>{formatCurrency(product.price)}</p>
            {:else}
              <p class="text-red-500">Unavailable</p>
            {/if}
          </div>
          <button
            class="hover:text-red-500"
            on:click={(e) => {
              e.stopImmediatePropagation();
              e.preventDefault();
              handleRemoveFromWishlist(product._id);
            }}
          >
            <TrashIcon />
          </button>
        </a>

        <div class="hidden md:block">
          <ProductCard {product} />
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center flex-col gap-4 p-4 h-full">
    <div>Your wishlist is empty</div>
    <a
      href="/search"
      class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
      >Continue shopping</a
    >
  </div>
{/if}
