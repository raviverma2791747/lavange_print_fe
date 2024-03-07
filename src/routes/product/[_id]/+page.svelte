<script>
  //@ts-nocheck
  import { httpClient } from "../../../helper/httpClient";
  import { page } from "$app/stores";
  import { formatCurrency } from "../../../helper/utils";
  import HeartIcon from "../../../components/svg/HeartIcon.svelte";
  import ShoppingCartIcon from "../../../components/svg/ShoppingCartIcon.svelte";
  import {
    cart_store,
    header_title_store,
    token_store,
    login_signup_modal_open,
    user_info_store,
    wishlist_store,
  } from "../../../helper/store";
  import { product_cache } from "../../../helper/cache_store";
  import {
    getProduct,
    addUserCart,
    getUserCart,
    addUserWishlist,
    getUserWishlist,
  } from "../../../helper/endpoints";
  import Carousel from "../../../components/Carousel.svelte";

  let product;
  let quantity = 1;
  let loading = true;
  let active_asset = 0;
  let active_variant = null;
  let variantsMap;
  let variantFilter;
  let active_tab = 0;
  const MAX_QUANTITY = 10;
  const MIN_QUANTITY = 1;

  const initProduct = async (product_id) => {
    loading = true;
    let product_cached = $product_cache.get(product_id);
    if (product_cached) {
      product = product_cached;
    } else {
      const data = await httpClient(`${getProduct}/${product_id}`);
      product = data["data"]["product"] ?? null;
      $product_cache.set(product_id, product);
    }

    if (product.variants) {
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
    loading = false;
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart, {
      token: $token_store,
    });

    if (response.status === 200) {
      cart_store.set([...response.data.cart]);
    } else {
      cart_store.set([]);
    }
  };

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

  const handleAddToCart = async () => {
    if (!$user_info_store) {
      $login_signup_modal_open = true;
      return;
    }
    const data = await httpClient(addUserCart, {
      method: "POST",
      token: $token_store,
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

  const handleAddToWishlist = async () => {
    if (!$user_info_store) {
      $login_signup_modal_open = true;
      return;
    }

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

  $: {
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
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4 text-gray-800">
  <div class="mb-4">
    {#if loading}
      <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
        &nbsp;
      </div>
      /
      <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
        &nbsp;
      </div>
      /
      <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
        &nbsp;
      </div>
    {:else}
      <a class="hover:text-purple-500" href="/">Home</a> /
      <a
        class="hover:text-purple-500"
        href={`/category/${product.category._id}`}>{product.category.name}</a
      >/ {product.title}
    {/if}
  </div>
  <div class="lg:grid lg:grid-cols-5 gap-8 mb-4">
    <div class="lg:col-span-3">
      {#if loading}
        <div
          class="rounded-lg animate-pulse bg-gray-200 h-auto aspect-[5/3]"
        ></div>
      {:else}
        <div>
          <div class="mb-4">
            <img
              class="rounded-lg border border-gray-200 w-full h-auto aspect-[5/3] object-contain"
              src={product.assets[active_asset].url}
              alt={`${product.title}-${active_asset}`}
            />
          </div>
          {#if product.assets.length > 1}
            <Carousel>
              {#each product.assets as asset, index}
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
              {/each}
            </Carousel>
          {/if}
        </div>
      {/if}
    </div>
    <div class="lg:col-span-2 mb-4">
      {#if loading}
        <div
          class="h-4 font-semibold text-3xl mb-4 animate-pulse bg-gray-200 rounded-lg"
        ></div>
      {:else}
        <h1 class="font-bold text-3xl mb-2">{product.title}</h1>
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
          <div class="text-xl font-semibold">
            {formatCurrency(
              (product.variants
                ? variantsMap.get(active_variant)?.price
                : product.price) * quantity
            )}
          </div>
          <div class="text-sm text-gray-600">inclusive of all taxes</div>
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
                          class:border-purple-500={option.value ===
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
                        class:border-purple-500={option.value ===
                          variantFilter[variantOption.name]}
                        on:click={() => {
                          variantFilter[variantOption.name] = option.value;
                        }}
                        class:border-2={option.value ===
                          variantFilter[variantOption.name]}
                        on:click={() => {
                          variantFilter[variantOption.name] = option.value;
                        }}
                        class:text-purple-500={option.value ===
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
                      <option value={option.value}>{option.displayName}</option>
                    {/each}
                  </select>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
        <div class="mb-4">
          <label for="quantity" class="block text-sm font-semibold mb-2"
            >Quantity</label
          >

          <div class="bg-white border border-gray-200 rounded-lg w-32">
            <div class="w-full flex justify-between items-center gap-x-1">
              <div class="grow py-2 px-3">
                <input
                  class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  min={MIN_QUANTITY}
                  max={MAX_QUANTITY}
                  bind:value={quantity}
                />
              </div>
              <div
                class="flex items-center -gap-y-px divide-x divide-gray-200 border-s border-gray-200"
              >
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
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <button
            type="button"
            class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
            on:click={handleAddToCart}
          >
            <ShoppingCartIcon />
            <span>Add to Cart</span>
          </button>
          <button
            type="button"
            class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-600 text-purple-600 disabled:opacity-50 disabled:pointer-events-none"
            on:click={handleAddToWishlist}
          >
            <HeartIcon />
            <span>Wish List</span>
          </button>
        </div>
        <div class="mb-4">
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
              class="absolute top-0 right-0 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Check
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if !loading}
    <div>
      <div class="flex mb-2 border-b-2 border-gray-200">
        <button
          class="font-semibold hover:bg-purple-50 px-4 py-2"
          class:text-purple-500={active_tab === 0}
          on:click={() => {
            active_tab = 0;
          }}>Description</button
        >
        <button
          class="font-semibold hover:bg-purple-50 px-4 py-2"
          class:text-purple-500={active_tab === 1}
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
</div>
