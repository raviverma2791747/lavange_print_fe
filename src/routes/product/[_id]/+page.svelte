<script>
  //@ts-nocheck
  import "@splidejs/svelte-splide/css";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { httpClient } from "../../../helper/httpClient";
  import { page } from "$app/stores";
  import { formatCurrency } from "../../../helper/utils";
  import HeartIcon from "../../../components/svg/HeartIcon.svelte";
  import HeartDuotoneIcon from "../../../components/svg/HeartDuotoneIcon.svelte";
  import ShoppingCartIcon from "../../../components/svg/ShoppingCartIcon.svelte";
  import {
    cart_store,
    header_title_store,
    login_signup_modal_open,
    user_info_store,
    wishlist_store,
  } from "../../../helper/store";
  import {
    category_cache,
    product_cache,
    collection_cache,
  } from "../../../helper/cache_store";
  import {
    getProduct,
    addUserCart,
    getUserCart,
    addUserWishlist,
    getUserWishlist,
    getCategory,
    getCollection,
    removeUserWishlist,
  } from "../../../helper/endpoints";
  import not_found_img from "$lib/assets/images/not_found.svg";
  import ProductCard from "../../../components/ProductCard.svelte";
  import { goto } from "$app/navigation";
  import { assets } from "$app/paths";
  import { onMount } from "svelte";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../../components/BreadcrumbShimmer.svelte";

  let product;
  let quantity = 1;
  let loading = true;
  let active_asset = 0;
  let active_variant = null;
  let variantsMap;
  let variantFilter;
  let active_tab = 0;
  let category;
  let product_inactive = false;
  let collections = [];
  const MAX_QUANTITY = 100;
  const MIN_QUANTITY = 1;

  const slideOptions = {
    // type: "loop",
    perPage: 6,
    gap: "1rem",
    breakpoints: {
      640: {
        perPage: 3,
        gap: ".7rem",
      },
      480: {
        perPage: 2,
        gap: ".7rem",
      },
    },
  };

  const initProduct = async (product_id) => {
    loading = true;
    let product_cached = $product_cache.get(product_id);
    if (product_cached) {
      product = product_cached;
    } else {
      const data = await httpClient(`${getProduct}/${product_id}`);

      if (data.status === 200) {
        product = data["data"]["product"] ?? null;

        console.log(product);
        $product_cache.set(product_id, product);
      }
    }

    if (product === null) {
      product_inactive = true;
      loading = false;
      return;
    }

    if (product?.variants) {
      variantFilter = {};
      product.variantOptions.forEach((option) => {
        variantFilter[option.name] = option.options[0].value;
      });
      variantsMap = new Map();
      product.variants.forEach((variant) => {
        variantsMap.set(variant._id, variant);
      });
      active_variant = product.variants[0]._id;
    } else {
      active_variant = null;
    }

    if (product) {
      initCategory(product.category._id);
    }

    if (product.collections.length) {
      fetchCollection();
    }
    loading = false;
  };

  const fetchCollection = async () => {
    product.collections.forEach((collection_id) => {
      initCollection(collection_id);
    });
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart);

    if (response.status === 200) {
      cart_store.set([...response.data.cart]);
    } else {
      cart_store.set([]);
    }
  };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist);

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    } else {
      wishlist_store.set([]);
    }
  };

  const calculateDiscount = (price, compareAtPrice) => {
    if (compareAtPrice) {
      return compareAtPrice - price;
    } else {
      return 0;
    }
  };

  const handleAddToCart = async () => {
    if (!$user_info_store) {
      $login_signup_modal_open = true;
      return;
    }
    const data = await httpClient(addUserCart, {
      method: "POST",

      payload: {
        productId: product._id,
        variantId: active_variant ?? undefined,
        variantSchemaId: product?.schemaId ?? undefined,
        quantity: quantity,
      },
    });

    if (data.status === 200) {
      initCart();
    }
  };

  const handleBuy = async () => {
    if (!$user_info_store) {
      $login_signup_modal_open = true;
      return;
    }
    const data = await httpClient(addUserCart, {
      method: "POST",

      payload: {
        productId: product._id,
        variantId: active_variant ?? undefined,
        variantSchemaId: product?.schemaId ?? undefined,
        quantity: quantity,
      },
    });

    if (data.status === 200) {
      initCart();
      goto("/cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!$user_info_store) {
      $login_signup_modal_open = true;
      return;
    }

    const response = await httpClient(addUserWishlist, {
      method: "POST",

      payload: {
        productId: product._id,
      },
    });

    if (response.status === 200) {
      initWishlist();
    }
  };

  const handleRemoveFromWishlist = async () => {
    if (!$user_info_store) {
      $login_signup_modal_open = true;
      return;
    }

    const response = await httpClient(removeUserWishlist, {
      method: "POST",

      payload: {
        productId: product._id,
      },
    });

    if (response.status === 200) {
      initWishlist();
    }
  };

  const initActiveVariant = (filter) => {
    if (product) {
      const av = product.variants.find((v) => {
        return Object.keys(filter).every(
          (key) => filter[key] === v.attributes[key]
        );
      });

      if (av) {
        active_variant = av._id;
      }
    }
  };

  const initCategory = async (category_id) => {
    if ($category_cache.get(category_id)) {
      category = $category_cache.get(category_id);
    } else {
      const response = await httpClient(`${getCategory}/${category_id}`);
      if (response.status === 200) {
        category = response.data.category ?? [];
        $category_cache.set(category_id, category);
      }
    }
  };

  const initCollection = async (collection_id) => {
    if ($collection_cache.get(collection_id)) {
      collections = [...collections, $collection_cache.get(collection_id)];
    } else {
      const response = await httpClient(`${getCollection}/${collection_id}`);
      if (response.status === 200) {
        collections = [...collections, response.data.collection];
        $collection_cache.set(collection_id, response.data.collection);
      }
    }
  };

  onMount(() => {
    category = null;
    collections = [];
  });

  $: {
    category = null;
    collections = [];
    initProduct($page.params._id);
  }

  $: {
    product?.variants && initActiveVariant(variantFilter);
  }

  // export let csr=true;
  // export let ssr=false;

  $: {
    $header_title_store = "Product";
  }

  $: {
    if (product) {
      const exist = $wishlist_store.find((item) => {
        return item._id === product._id;
      });

      if (exist) {
        product.favorite = true;
      } else {
        product.favorite = false;
      }
    }
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4 text-gray-800">
  {#if product_inactive}
    <div class="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
      <img src={not_found_img} class="w-1/2 mb-5" />
      <h1 class="font-semibold text-3xl">Oops! product not found</h1>
      <p class="italic">
        Maybe the product was unlisted or something went wrong!
      </p>
    </div>
  {:else}
    <div class="mb-4 flex">
      {#if loading}
        <BreadcrumbShimmer count={3} />
      {:else}
        <Breadcrumb
          routes={[
            {
              name: "Home",
              path: "/",
            },
            {
              name: product.category.name,
              path: `/category/${product.category.slug}`,
            },
            {
              name: product.title,
              path: `/product/${product.slug}`,
            },
          ]}
        />
      {/if}

      {#if !loading}
        <div class="ms-auto">
          {#if !product.favorite}
            <button
              class=" hover:text-primary-500 hover:bg-primary-200 rounded-full"
              on:click={handleAddToWishlist}
            >
              <HeartIcon />
            </button>
          {:else}
            <button
              class=" text-primary-500 hover:bg-primary-200 rounded-full"
              on:click={handleRemoveFromWishlist}
            >
              <HeartDuotoneIcon />
            </button>
          {/if}
        </div>
      {/if}
    </div>
    <div class="lg:grid lg:grid-cols-5 gap-8">
      <div class="lg:col-span-3 mb-4">
        {#if loading}
          <div
            class="rounded-lg animate-pulse bg-gray-200 h-auto aspect-[5/3]"
          ></div>
        {:else if product.assets.length}
          <div>
            <div class="mb-4 grow">
              <img
                class="rounded-lg border border-gray-200 w-full h-auto aspect-[5/3] object-contain"
                src={product.assets[active_asset].url}
                alt={`${product.title}-${active_asset}`}
              />
            </div>

            {#if product.assets.length > 1}
              <Splide
                options={{
                  height: "100%",
                  perPage: 8,
                }}
              >
                {#each product.assets as asset, index}
                  <SplideSlide>
                    <button
                      class="hover:scale-105 transition w-20 cursor-pointer shrink-0"
                      on:click={() => {
                        active_asset = index;
                      }}
                    >
                      <img
                        class="rounded-lg border border-gray-200 w-full aspect-square object-contain"
                        src={asset.url}
                        alt={`${product.title}-${index}`}
                      />
                    </button>
                  </SplideSlide>
                {/each}
              </Splide>
            {/if}
          </div>
        {:else}
          <div class="rounded-lg bg-gray-200 h-auto aspect-[5/3]"></div>
        {/if}
      </div>
      <div class="lg:col-span-2 mb-4 flex flex-col">
        {#if loading}
          <div
            class="h-4 font-semibold text-3xl mb-4 animate-pulse bg-gray-200 rounded-lg"
          ></div>
        {:else}
          <h1 class="font-semibold text-3xl mb-2">{product.title}</h1>
          <div class="mb-2">
            <!-- <Rating count rating={4.95}>
            <span
              class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"
            />
            <a
              href="/"
              class="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
            >
              73 reviews
            </a>
          </Rating> -->
          </div>
          <div class="mb-2">
            {#if product.variants ? variantsMap.get(active_variant)?.compareAtPrice : product.compareAtPrice}
              <div class="text-sm font-semibold line-through">
                {formatCurrency(
                  product.variants
                    ? variantsMap.get(active_variant)?.compareAtPrice
                    : product.compareAtPrice
                )}
              </div>
            {/if}
            <div class="text-xl font-semibold">
              {formatCurrency(
                (product.variants
                  ? variantsMap.get(active_variant)?.price
                  : product.price) * quantity
              )}
            </div>
            <div class="text-sm text-gray-600">inclusive of all taxes</div>
            <div>
              {#if product.variants ? variantsMap.get(active_variant)?.compareAtPrice : product.compareAtPrice}
                <div class="text-sm text-green-500 font-semibold">
                  You save {formatCurrency(
                    calculateDiscount(
                      product.variants
                        ? variantsMap.get(active_variant)?.price
                        : product.price,
                      product.variants
                        ? variantsMap.get(active_variant)?.compareAtPrice
                        : product.compareAtPrice
                    ) * quantity
                  )}
                </div>
              {/if}
            </div>
          </div>
          {#if product.variantOptions}
            <div class="flex flex-col gap-2 mb-4">
              {#each product.variantOptions as variantOption}
                <div>
                  <div class="block text-sm font-semibold mb-2">
                    {variantOption.displayName}
                  </div>
                  {#if variantOption.type === "color"}
                    <div class="flex gap-4">
                      {#each variantOption.options as option}
                        <div class="cursor-pointer">
                          <button
                            class="border-2 rounded-full w-fit p-0.5"
                            class:border-gray-200={option.value !==
                              variantFilter[variantOption.name]}
                            class:border-primary-500={option.value ===
                              variantFilter[variantOption.name]}
                            on:click={() => {
                              variantFilter[variantOption.name] = option.value;
                            }}
                          >
                            <div
                              class="hover:scale-105 transition duration-100 ease-in-out h-8 w-8 rounded-full"
                              style={`background-color:${option.value}`}
                            ></div>
                          </button>
                          <div class="text-sm text-gray-600">
                            {option.displayName}
                          </div>
                        </div>
                      {/each}
                    </div>
                  {:else if variantOption.type === "size"}
                    <div class="flex gap-4">
                      {#each variantOption.options as option}
                        <button
                          class="hover:scale-105 border border-gray-600 p-2 rounded-lg transition duration-100 ease-in-out cursor-pointer text-sm text-gray-600"
                          class:border-primary-500={option.value ===
                            variantFilter[variantOption.name]}
                          on:click={() => {
                            variantFilter[variantOption.name] = option.value;
                          }}
                          class:border-2={option.value ===
                            variantFilter[variantOption.name]}
                          on:click={() => {
                            variantFilter[variantOption.name] = option.value;
                          }}
                          class:text-primary-500={option.value ===
                            variantFilter[variantOption.name]}
                          on:click={() => {
                            variantFilter[variantOption.name] = option.value;
                          }}
                        >
                          {option.displayName}
                        </button>
                      {/each}
                    </div>
                  {:else}
                    <select
                      class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      value={variantFilter[variantOption.name]}
                      on:change={(e) => {
                        variantFilter[variantOption.name] = e.target.value;
                      }}
                    >
                      {#each variantOption.options as option}
                        <option value={option.value}
                          >{option.displayName}</option
                        >
                      {/each}
                    </select>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <!-- <p class="text-sm grow ">
            {@html product.description}
          </p> -->
          <div class="mb-4 mt-auto">
            <label for="quantity" class="block text-sm font-semibold mb-2"
              >Quantity</label
            >

            <div
              class="bg-white border border-gray-200 rounded-lg w-full md:w-36"
            >
              <div class="w-full flex justify-between items-center gap-x-1">
                <div class="grow py-2 px-3">
                  <input
                    class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    min={MIN_QUANTITY}
                    max={MAX_QUANTITY}
                    bind:value={quantity}
                    on:change={() => {
                      if (quantity < MIN_QUANTITY) {
                        quantity = MIN_QUANTITY;
                      }
                      if (quantity > MAX_QUANTITY) {
                        quantity = MAX_QUANTITY;
                      }
                    }}
                  />
                </div>
                <div
                  class="flex items-center -gap-y-px divide-x divide-gray-200 border-s border-gray-200"
                >
                  <button
                    on:click={() => {
                      if (quantity < MAX_QUANTITY) {
                        quantity++;
                      }
                    }}
                    type="button"
                    class="w-10 h-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <svg
                      class="flex-shrink-0 w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      ><path d="M5 12h14" /><path d="M12 5v14" /></svg
                    >
                  </button>

                  <button
                    on:click={() => {
                      if (quantity > MIN_QUANTITY) {
                        quantity--;
                      }
                    }}
                    type="button"
                    class="w-10 h-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <svg
                      class="flex-shrink-0 w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"><path d="M5 12h14" /></svg
                    >
                  </button>
                </div>
              </div>
            </div>

            {#if quantity === MAX_QUANTITY}
              <div class="text-sm text-gray-500 mt-2">
                For bulk order, please contact us
              </div>
            {/if}
          </div>
          <div class="grid md:grid-cols-2 gap-4 mb-4 md:mb-0">
            <button
              type="button"
              class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
              on:click={handleBuy}
            >
              <span>Buy</span>
            </button>
            <button
              type="button"
              class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
              on:click={handleAddToCart}
            >
              <!-- <ShoppingCartIcon /> -->
              <span>Add to Cart</span>

              <!-- <HeartIcon />
              <span>Wish List</span> -->
            </button>
          </div>
          <!-- <div class="mb-4">
            <label for="pincode" class="block text-sm font-semibold mb-2"
              >Pincode</label
            >
            <div class="relative w-36">
              <input
                type="number"
                class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
                step="1"
                placeholder="Pincode"
                name="pincode"
              />
              <button
                type="button"
                class="absolute top-0 right-0 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Check
              </button>
            </div>
          </div> -->
        {/if}
      </div>
    </div>

    {#if !loading}
      <div class="mb-4">
        <div class="flex mb-2 border-b-2 border-gray-200">
          <button
            class="font-semibold hover:bg-primary-50 px-4 py-2"
            class:text-primary-500={active_tab === 0}
            on:click={() => {
              active_tab = 0;
            }}>Description</button
          >
          <button
            class="font-semibold hover:bg-primary-50 px-4 py-2"
            class:text-primary-500={active_tab === 1}
            on:click={() => {
              active_tab = 1;
            }}>Specification</button
          >
        </div>
        {#if active_tab === 0}
          <p class="text-sm">
            {@html product.description}
          </p>
        {:else if active_tab === 1}
          <p class="text-sm">
            {@html product.specification}
          </p>
        {/if}
      </div>
    {/if}

    {#if category && !loading && category.products.filter((p) => p._id !== product._id).length > 0}
      <div>
        <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
          Related Products
        </h1>
        <div class="w-full">
          <Splide options={slideOptions}>
            {#each category.products.filter((p) => p._id !== product._id) as product}
              <SplideSlide>
                <ProductCard {product} />
              </SplideSlide>
            {/each}
          </Splide>
        </div>
      </div>
    {/if}

    {#if collections.length > 0 && !loading}
      <div>
        {#if collections.reduce((acc, collection) => {
          return acc + collection.products.filter((p) => p._id !== product._id).length;
        }, 0)}
          <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
            You may also like
          </h1>
        {/if}
        {#each collections as collection}
          {#if collection.products.filter((p) => p._id !== product._id).length > 0}
            <h1 class="font-semibold text-xl text-center mb-4 capitalize">
              {collection.name} Collection
            </h1>
          {/if}
          <div class="w-full">
            <Splide options={slideOptions}>
              {#each collection.products.filter((p) => p._id !== product._id) as product}
                <SplideSlide>
                  <ProductCard {product} />
                </SplideSlide>
              {/each}
            </Splide>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
