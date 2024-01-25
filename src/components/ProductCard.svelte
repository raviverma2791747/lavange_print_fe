<script>
  //@ts-nocheck
  import { formatCurrency } from "../helper/utils";
  import HeartIcon from "./svg/HeartIcon.svelte";
  import { httpClient } from "../helper/httpClient";
  import {
    addUserWishlist,
    removeUserWishlist,
    getUserWishlist,
  } from "../helper/endpoints";
  import { token_store, wishlist_store } from "../helper/store";
  export let product;
  export let hidePrice = false;
  export let hideWishlist = false;
  let class_ = "";
  export { class_ as class };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist, {
      token: $token_store,
    });

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    } else {
      wishlist_store.set([]);
    }
  };

  const addToWishlist = async (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    console.log("ok");
    const response = await httpClient(addUserWishlist, {
      method: "POST",
      token: $token_store,
      payload: {
        productId: product._id,
      },
    });

    if (response.status === 200) {
      initWishlist();
    }
  };

  const removeFromWishlist = async () => {
    const data = await httpClient(removeUserWishlist, {
      method: "POST",
      token: $token_store,
      payload: {
        productId: product._id,
      },
    });
  };
</script>

<a
  href={`/product/${product._id}`}
  class="relative block rounded-lg bg-white hover:shadow-lg border border-gray-200 w-full"
>
  <!-- <div
    class="absolute bg-purple-500 text-white text-xs p-1 rounded-tr-lg rounded-br-lg top-0 left-0 mt-2"
  >
    Collection
  </div> -->
  <div class="aspect-square bg-gray-200 rounded-t-lg">
    <img
      class="object-cover object-center w-full h-full rounded-t-lg"
      src={product.assets[0].url}
      alt={product.title}
    />
  </div>
  <div class="pb-4 pt-2">
    <div class="flex px-2 mb-2">
      <div class="font-semibold text-sm grow truncate">
        {product.title}
      </div>
      {#if !hideWishlist}
        <div class="relative">
          <button
            class=" hover:text-purple-500 hover:bg-purple-200 rounded-full "
            on:click={addToWishlist}
          >
            <HeartIcon />
          </button>
        </div>
      {/if}
    </div>
    <!-- <div class="text-sm text-gray-500 px-2">xyz</div> -->
    {#if !hidePrice}
      <div class="font-semibold px-2">
        {formatCurrency(product.price)}
      </div>
    {/if}
  </div>
</a>
