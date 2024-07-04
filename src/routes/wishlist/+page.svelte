<script>
  //@ts-nocheck
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";
  import LoginSpinner from "../../components/LoginSpinner.svelte";
  import ProductCard from "../../components/ProductCard.svelte";
  import TrashIcon from "../../components/svg/TrashIcon.svelte";
  import { product_cache } from "../../helper/cache_store";
  import { STATUS } from "../../helper/constants";
  import { getUserWishlist, removeUserWishlist } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import {
    authenticating_store,
    header_title_store,
    wishlist_store,
    user_info_store,
  } from "../../helper/store";
  import { formatCurrency } from "../../helper/utils";

  let loading = false;
  const handleRemoveFromWishlist = async (product_id) => {
    const response = await httpClient(removeUserWishlist, {
      method: "POST",
      payload: {
        productId: product_id,
      },
    });

    if (response.status === 200) {
      initWishlist();
    }
  };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist);

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    }
  };

  $: {
    $header_title_store = "Wishlist";
  }
</script>

{#if $wishlist_store.length > 0}
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4">
    {#if loading}
      <BreadcrumbShimmer count={2} />
    {:else}
      <Breadcrumb
        routes={[
          { name: "Home", path: "/" },
          { name: "Wishlist", path: "/wishlist" },
        ]}
      />
    {/if}

    <!-- <h1
      class="hidden md:block font-semibold text-xl md:text-3xl text-center mb-4 capitalize"
    >
      Wishlist
    </h1> -->
    <div class="grid gap-4 md:grid-cols-4 lg:grid-cols-6 py-4">
      {#each $wishlist_store as product}
        <a
          class="w-full p-2 grid grid-cols-8 gap-2 cursor-pointer hover:bg-primary-250 md:hidden rounded-lg"
          href={`/product/${product.slug}`}
        >
          <div class="col-span-2">
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
          <div class="col-span-5">
            <h1 class="font-semibold">{product.title}</h1>
            {#if product.status === STATUS.ACTIVE}
              <p>{formatCurrency(product.price)}</p>
            {:else}
              <p class="text-red-500">Unavailable</p>
            {/if}
          </div>
          <div>
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
          </div>
        </a>

        <div class="hidden md:block">
          <ProductCard {product} />

          <button
            class="hover:text-red-500 inline-flex gap-2"
            on:click={(e) => {
              handleRemoveFromWishlist(product._id);
            }}
          >
            Remove <TrashIcon />
          </button>
        </div>
      {/each}
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
    <div>Your wishlist is empty</div>
    <a
      href="/search"
      class="w-full sm:w-fit hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >Continue shopping</a
    >
  </div>
{/if}
