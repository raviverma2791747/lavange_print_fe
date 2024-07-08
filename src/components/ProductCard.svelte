<script>
  //@ts-nocheck
  import { formatCurrency, formatPercentage } from "../helper/utils";
  import HeartIcon from "./svg/HeartIcon.svelte";
  import { httpClient } from "../helper/httpClient";
  import {
    addUserWishlist,
    removeUserWishlist,
    getUserWishlist,
  } from "../helper/endpoints";
  import {
    wishlist_store,
    user_info_store,
    login_signup_modal_open,
  } from "../helper/store";
  import ShareIcon from "./svg/ShareIcon.svelte";
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";
  import HeartFillIcon from "./svg/HeartFillIcon.svelte";
  import HeartDuotoneIcon from "./svg/HeartDuotoneIcon.svelte";
  import { STATUS } from "../helper/constants";
  export let product;
  export let hidePrice = false;
  export let hideWishlist = false;
  export let hideShare = false;

  let class_ = "";
  let price;
  let compareAtPrice = 0;
  let active_slide = 0;
  let interval;

  export { class_ as class };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist);

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    } else {
      wishlist_store.set([]);
    }
  };

  const addToWishlist = async (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    if (!$user_info_store) {
      $login_signup_modal_open = true;
    } else {
      const response = await httpClient(addUserWishlist, {
        method: "POST",
        payload: {
          productId: product._id,
        },
      });

      if (response.status === 200) {
        initWishlist();
        //product.favorite = true;
      }
    }
  };

  const removeFromWishlist = async (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    const data = await httpClient(removeUserWishlist, {
      method: "POST",
      payload: {
        productId: product._id,
      },
    });

    if (data.status === 200) {
      initWishlist();
      //product.favorite = false;
    }
  };

  const calculateDiscount = (price, compareAtPrice) => {
    //calculate percentage of discount
    return (compareAtPrice - price) / compareAtPrice;
  };

  const handleShare = async (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    // To be implemented
  };

  const init = (product_) => {
    active_slide = 0;
    if (product_.variants) {
      price = product_.minPrice;
      compareAtPrice = product_.minCompareAtPrice;
    } else {
      price = product_.price;
      compareAtPrice = product_.compareAtPrice;
    }
  };

  if (product.assets.length) {
    interval = setInterval(() => {
      active_slide = (active_slide + 1) % product.assets.length;
    }, 5000);
  }

  onDestroy(() => {
    clearInterval(interval);
  });

  $: {
    init(product);
  }

  $: {
    const exist = $wishlist_store.find((item) => {
      return item._id === product._id;
    });

    if (exist) {
      product.favorite = true;
    } else {
      product.favorite = false;
    }
  }
</script>

<a
  href={`/product/${product.slug}`}
  class="relative block rounded-lg bg-white w-full"
>
  {#if compareAtPrice}
    <div
      class="absolute bg-green-500 font-semibold text-white text-sm p-1 rounded-tr-lg rounded-br-lg top-0 left-0 mt-2"
    >
      {formatPercentage(calculateDiscount(price, compareAtPrice))} Off
    </div>
  {/if}

  <!-- <div
    class="absolute bg-primary-500 text-white text-xs p-1 rounded-tr-lg rounded-br-lg top-0 left-0 mt-2"
  >
    Collection
  </div> -->
  {#if !hideShare}
    <button
      on:click={handleShare}
      class="absolute top-2 right-2 hover:text-primary-500 bg-primary-50 rounded-full p-2"
    >
      <ShareIcon />
    </button>
  {/if}

  <div class="aspect-square bg-gray-200 rounded-t-lg">
    {#if product.assets.length}
      <img
        class="object-cover object-center w-full h-full rounded-t-lg"
        src={product.assets[active_slide].url}
        alt={product.title}
      />
    {/if}
  </div>
  <div class="pb-2 pt-2">
    <div class="flex px-2">
      <div class="font-semibold text-sm grow line-clamp-2">
        {product.title}
      </div>
      {#if !hideWishlist}
        <div class="relative">
          {#if !product.favorite}
            <button
              class=" hover:text-primary-500 rounded-full"
              on:click={addToWishlist}
            >
              <HeartIcon />
            </button>
          {:else}
            <button
              class=" text-primary-500 rounded-full"
              on:click={removeFromWishlist}
            >
              <HeartDuotoneIcon />
            </button>
          {/if}
        </div>
      {/if}
    </div>
    <!-- <div class="text-sm text-gray-500 px-2">xyz</div> -->
    {#if !hidePrice}
      {#if product.status === STATUS.ACTIVE}
        <div class="px-2 flex gap-1 items-center">
          <div class="font-semibold">
            {formatCurrency(price)}
          </div>
          {#if compareAtPrice}
            <div class="line-through text-gray-500 font-semibold text-sm">
              {formatCurrency(compareAtPrice)}
            </div>
          {/if}
        </div>
      {:else}
        <div class="text-red-500 px-2">Unavailable</div>
      {/if}
    {/if}
  </div>
</a>
