<script>
  //@ts-nocheck
  import "@splidejs/svelte-splide/css";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { httpClient } from "../../../helper/httpClient";
  import { page } from "$app/stores";
  import { formatCurrency, processCart } from "../../../helper/utils";
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
  import { FACET_TYPE } from "../../../helper/constants";
  import ProductCardShimmer from "../../../components/ProductCardShimmer.svelte";
  import { Accordion } from "bits-ui";
  import CaretDownIcon from "../../../components/svg/CaretDownIcon.svelte";
  import { slide } from "svelte/transition";
  import { MetaTags } from "svelte-meta-tags";
  import { PUBLIC_BRAND_NAME } from "$env/static/public";
  import { browser } from "$app/environment";
  import IntersectionObserver from "svelte-intersection-observer";
  import ShareIcon from "../../../components/svg/ShareIcon.svelte";

  let product;
  let quantity = 1;
  let loading = true;
  let active_asset = 0;
  let active_variant = null;
  let variantsMap;
  let variantFilter = {};
  let active_tab = 0;
  let category;
  let product_inactive = false;
  let collections = [];
  const MAX_QUANTITY = 100;
  const MIN_QUANTITY = 1;
  let actions;
  let isActionsVisible = false;
  let disable = false;

  const slideOptions = {
    // type: "loop",
    perPage: 6,
    gap: "0.5rem",
    breakpoints: {
      1280: {
        perPage: 8,
        gap: ".7rem",
      },
      1024: {
        perPage: 5,
        gap: ".7rem",
      },
      768: {
        perPage: 4,
        gap: ".7rem",
      },
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

  const productSlideOptions = {
    // type: "loop",
    perPage: 6,
    gap: ".7rem",
    breakpoints: {
      1280: {
        perPage: 8,
        gap: ".7rem",
      },
      1024: {
        perPage: 8,
        gap: ".7rem",
      },
      768: {
        perPage: 6,
        gap: ".7rem",
      },
      640: {
        perPage: 5,
        gap: ".7rem",
      },
      480: {
        perPage: 5,
        gap: ".7rem",
      },
    },
  };

  const initProduct = async (product_id) => {
    console.log("initProduct", product_id);
    loading = true;
    let product_cached = $product_cache.get(product_id);
    if (product_cached) {
      product = product_cached;
      console.log("product_cached", product_cached);
    } else {
      const response = await httpClient(`${getProduct}/${product_id}`);

      if (response.status === 200) {
        product = response.data.product ?? null;
        $product_cache.set(product_id, product);
      }
    }

    if (product === null) {
      product_inactive = true;
      loading = false;
      return;
    }

    if (product?.variants.length) {
      variantFilter = {};
      product.variantSchema.forEach((option) => {
        variantFilter[option.name] = option.options[0].value;
      });
      variantsMap = new Map();
      product.variants.forEach((variant) => {
        variantsMap.set(variant._id, variant);
      });
      active_variant = product.variants[0]._id;
      active_asset = 0;
    } else {
      active_variant = null;
      active_asset = 0;
      console.log("no variants");
    }

    if (product) {
      initCategory(product.category._id);
    }

    if (product.collections.length) {
      fetchCollection();
    }
    console.log("product", product);
    loading = false;
    product_inactive = false;

    console.log(product_inactive);
    console.log(loading);
  };

  const fetchCollection = async () => {
    product.collections.forEach((collection_id) => {
      initCollection(collection_id);
    });
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart);

    if (response.status === 200) {
      const cart = processCart(response.data.cart);
      cart_store.set([...cart]);
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
      quantity = 1;
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
      await initCart();
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
    if (product && product.variants.length) {
      const av = product.variants.find((v) => {
        return Object.keys(filter).every((key) => {
          return v.attributes[key] && filter[key] === v.attributes[key].value;
        });
      });

      if (av) {
        active_variant = av._id;
        active_asset = 0;
        disable = false;
      } else {
        active_variant = null;
        active_asset = 0;
        disable = true;
      }
    } else {
      disable = false;
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
    loading = true;
  });

  $: {
    category = null;
    collections = [];
    product_inactive = false;
    disable = false;
    loading = true;
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

<div
  id="product-page"
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4 text-gray-800"
>
  {#if product && !product_inactive}
    <MetaTags
      title={product.title}
      titleTemplate="%s"
      description={product.description}
      canonical="https://www.print.lavange.in"
      openGraph={{
        url: "https://www.print.lavange.in",
        title: "Brand Print",
        description: "Brand Print - Home of your next print.",
        images: [
          {
            url: "https://www.print.lavange.in/og_img.png",
            width: 1200,
            height: 630,
            alt: "Og Image Alt",
          },
        ],
        siteName: "SiteName",
      }}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
        title: product.title,
        description: product.description,
        image: "https://www.print.lavange.in/og_img.png",
        imageAlt: "Twitter image alt",
      }}
    />

    <IntersectionObserver
      element={actions}
      bind:intersecting={isActionsVisible}
    >
      <div class="mb-4 flex">
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
          <button
            class=" hover:text-primary-500 hover:bg-primary-200 rounded-full"
          >
            <ShareIcon />
          </button>
        </div>
      </div>
      <div class="lg:grid lg:grid-cols-5 gap-8">
        <div class="lg:col-span-3 mb-4">
          {#if active_variant && variantsMap.get(active_variant)?.assets.length}
            <div>
              <div class="mb-4 grow">
                <img
                  class="rounded-lg border border-gray-200 w-full h-auto aspect-[5/3] object-contain"
                  src={variantsMap.get(active_variant)?.assets[active_asset]
                    .url}
                  alt={`${product.title}-${active_asset}`}
                />
              </div>

              {#if variantsMap.get(active_variant)?.assets.length > 1}
                <Splide options={productSlideOptions}>
                  {#each variantsMap.get(active_variant)?.assets as asset, index}
                    <SplideSlide>
                      <button
                        class="hover:scale-105 transition cursor-pointer shrink-0"
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
                <Splide options={productSlideOptions}>
                  {#each product.assets as asset, index}
                    <SplideSlide>
                      <button
                        class="hover:scale-105 transition cursor-pointer shrink-0"
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
          <h1 class="font-semibold text-2xl lg:text-xl mb-2">
            {product.title}
          </h1>
          <!-- <div class="mb-2">
            <Rating count rating={4.95}>
            <span
              class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"
            />
            <a
              href="/"
              class="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
            >
              73 reviews
            </a>
          </Rating> 
           </div> -->
          {#if active_variant && product.variants.length}
            <div class="mb-2">
              {#if variantsMap.get(active_variant).compareAtPrice}
                <div class="text-sm font-semibold line-through">
                  {formatCurrency(
                    variantsMap.get(active_variant).compareAtPrice * quantity
                  )}
                </div>
              {/if}

              <div class="text-lg font-semibold">
                {formatCurrency(
                  variantsMap.get(active_variant).price * quantity
                )}
              </div>
              <div class="text-sm text-gray-600">inclusive of all taxes</div>
              {#if variantsMap.get(active_variant).compareAtPrice}
                <div>
                  <div class="text-sm text-green-500 font-semibold">
                    You save {formatCurrency(
                      calculateDiscount(
                        variantsMap.get(active_variant).price,
                        variantsMap.get(active_variant).compareAtPrice *
                          quantity
                      )
                    )}
                  </div>
                </div>
              {/if}
            </div>
          {:else if !active_variant && product.variants.length === 0}
            <div class="mb-2">
              {#if product.compareAtPrice}
                <div class="text-sm font-semibold line-through">
                  {formatCurrency(product.compareAtPrice * quantity)}
                </div>
              {/if}

              <div class="text-lg font-semibold">
                {formatCurrency(product.price * quantity)}
              </div>
              <div class="text-sm text-gray-600">inclusive of all taxes</div>
              {#if product.compareAtPrice}
                <div>
                  <div class="text-sm text-green-500 font-semibold">
                    You save {formatCurrency(
                      calculateDiscount(
                        product.price,
                        product.compareAtPrice * quantity
                      )
                    )}
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="mb-2">
              <p class="text-red-500 text-sm">The product is not available</p>
            </div>
          {/if}
          {#if product.variantSchema}
            <div class="flex flex-col gap-2 mb-4">
              {#each product.variantSchema as variantOption}
                <div>
                  <div class="block text-sm font-semibold mb-2">
                    {variantOption.displayName}
                  </div>
                  {#if variantOption.type === FACET_TYPE.COLOR}
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
                  {:else if variantOption.type === FACET_TYPE.SIZE}
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
                      class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
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
          <div
            bind:this={actions}
            id="actions"
            class="grid md:grid-cols-2 gap-4 mb-4 md:mb-0"
          >
            <button
              type="button"
              disabled={disable}
              class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
              on:click={handleBuy}
            >
              <span>Buy</span>
            </button>
            <button
              type="button"
              disabled={disable}
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
                class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        </div>
      </div>

      <div class="mb-4">
        <Accordion.Root class="w-full">
          {#each [{ title: "Description", content: product.description }, { title: "Specifications", content: product.specification }] as item, i}
            <Accordion.Item
              value="${i}"
              class="group border-b border-dark-10 px-1.5"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  class="font-semibold flex w-full flex-1 items-center justify-between py-5 text-[15px]  transition-all [&[data-state=open]>span>svg]:rotate-180 "
                >
                  {item.title}
                  <span
                    class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
                  >
                    <CaretDownIcon
                      class="size-[18px] transition-all duration-200"
                    />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                transition={slide}
                transitionConfig={{ duration: 200 }}
                class="pb-[25px]  tracking-[-0.01em]"
              >
                {@html item.content}
              </Accordion.Content>
            </Accordion.Item>
          {/each}
        </Accordion.Root>
      </div>

      {#if category && !loading && category.products.filter((p) => p._id !== product._id).length > 0}
        <div>
          <h1
            class="font-semibold text-xl lg:text-xl text-center mb-4 capitalize"
          >
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
            <h1
              class="font-semibold text-xl lg:text-3xl text-center mb-4 capitalize"
            >
              You may also like
            </h1>
          {/if}
          {#each collections as collection}
            {#if collection.products.filter((p) => p._id !== product._id).length > 0}
              <h1 class="font-semibold text-lg text-center mb-4 capitalize">
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
    </IntersectionObserver>

    {#if !isActionsVisible && !loading && !product_inactive}
      <div
        transition:slide={{ delay: 100 }}
        class="bg-white shadow border-t border-gray-200 fixed bottom-0 w-full mb-16 z-[75] p-4 md:hidden"
      >
        <div class="grid grid-cols-7 gap-2 items-end">
          <div class="col-span-3">
            <label for="quantity" class="block text-xs font-semibold mb-1"
              >Quantity</label
            >

            <div class="bg-white border border-gray-200 rounded-lg w-full">
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
            <!-- 
        {#if quantity === MAX_QUANTITY}
          <div class="text-sm text-gray-500 mt-2">
            For bulk order, please contact us
          </div>
        {/if} -->
          </div>

          <button
            type="button"
            class="col-span-2 hover:scale-105 transition duration-100 ease-in-out py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
            on:click={handleBuy}
            disabled={disable}
          >
            <span>Buy</span>
          </button>
          <button
            type="button"
            class="col-span-2 hover:scale-105 transition duration-100 ease-in-out py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
            on:click={handleAddToCart}
            disabled={disable}
          >
            <!-- <ShoppingCartIcon /> -->
            <span>Add</span>

            <!-- <HeartIcon />
          <span>Wish List</span> -->
          </button>

          <!-- <div>
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
    </div> -->
        </div>
      </div>
    {/if}
  {:else if loading}
    <div class="mb-4 flex">
      <BreadcrumbShimmer count={3} />

      <div class="ms-auto">
        <button class=" text-gray-500" disabled={true}>
          <HeartIcon />
        </button>
      </div>
    </div>
    <div class="lg:grid lg:grid-cols-5 gap-8">
      <div class="lg:col-span-3 mb-4">
        <div
          class="rounded-lg animate-pulse bg-gray-200 h-auto aspect-[5/3] mb-4"
        ></div>
        <Splide options={productSlideOptions}>
          {#each Array(3) as _, index}
            <SplideSlide>
              <div class="hover:scale-105 transition cursor-pointer shrink-0">
                <div
                  class="rounded-lg border border-gray-200 w-full bg-gray-200 aspect-square object-contain"
                />
              </div>
            </SplideSlide>
          {/each}
        </Splide>
      </div>
      <div class="lg:col-span-2 mb-4 flex flex-col">
        <div class="mb-4">
          <div
            class=" font-semibold text-3xl animate-pulse bg-gray-200 rounded-lg"
          >
            &nbsp;
          </div>
        </div>

        <div class="mb-2">
          <div
            class="text-sm font-semibold line-through animate-pulse bg-gray-200 rounded-lg mb-1 w-10"
          >
            &nbsp;
          </div>
          <div
            class="text-xl font-semibold animate-pulse bg-gray-200 rounded-lg mb-1 w-16"
          >
            &nbsp;
          </div>
          <div class="text-sm animate-pulse bg-gray-200 rounded-lg mb-1 w-32">
            &nbsp;
          </div>

          <div
            class="text-sm font-semibold animate-pulse bg-gray-200 rounded-lg mb-1 w-24"
          >
            &nbsp;
          </div>
        </div>
        <!-- {#if product.variantSchema}
            <div class="flex flex-col gap-2 mb-4">
              {#each product.variantSchema as variantOption}
                <div>
                  <div class="block text-sm font-semibold mb-2">
                    {variantOption.displayName}
                  </div>
                  {#if variantOption.type === FACET_TYPE.COLOR}
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
                  {:else if variantOption.type === FACET_TYPE.SIZE}
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
                      class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
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
          {/if} -->

        <div class="mb-4 mt-auto">
          <label for="quantity" class="block text-sm font-semibold mb-2"
            >&nbsp;</label
          >

          <div
            class="bg-white border border-gray-200 rounded-lg w-full md:w-36"
          >
            <div class="w-full flex justify-between items-center gap-x-1">
              <div class="grow py-2 px-3">
                <input
                  disabled
                  class="w-full p-0 bg-transparent border-0 text-gray-200 focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                />
              </div>
              <div
                class="flex items-center -gap-y-px divide-x divide-gray-200 border-s border-gray-200"
              >
                <button
                  disabled
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
                  disabled
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
        </div>
        <div class="grid md:grid-cols-2 gap-4 mb-4 md:mb-0">
          <button
            type="button"
            class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>&nbsp;</span>
          </button>
          <button
            type="button"
            class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>&nbsp;</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex mb-2 border-b-2 border-gray-200">
        <button class="font-semibold bg-gray-50 px-4 py-2"
          ><span class="inline-block bg-gray-200 animate-pulse rounded-lg w-24">
            &nbsp;
          </span></button
        >
        <button class="font-semibold px-4 py-2"
          ><span class="inline-block bg-gray-200 animate-pulse rounded-lg w-24">
            &nbsp;
          </span></button
        >
      </div>

      <p class="text-sm">
        <span
          class="inline-block bg-gray-200 animate-pulse rounded-lg w-full mb-2"
        >
          &nbsp;
        </span>
        <span
          class="inline-block bg-gray-200 animate-pulse rounded-lg w-2/3 mb-2"
        >
          &nbsp;
        </span>
        <span class="inline-block bg-gray-200 animate-pulse rounded-lg w-1/3">
          &nbsp;
        </span>
      </p>
    </div>

    <div>
      <h1 class="font-semibold text-xl lg:text-3xl text-center mb-4 capitalize">
        Related Products
      </h1>
      <div class="w-full">
        <Splide options={slideOptions}>
          {#each Array(3) as _, index}
            <SplideSlide>
              <ProductCardShimmer />
            </SplideSlide>
          {/each}
        </Splide>
      </div>
    </div>

    <!-- <div>
      <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
        You may also like
      </h1>
      {#each Array(3) as c}
        <h1 class="font-semibold text-xl text-center mb-4 capitalize">
           <span class="inline-block bg-gray-200 animate-pulse rounded-lg w-24">&nbsp;</span>
        </h1>
        <div class="w-full">
          <Splide options={slideOptions}>
            {#each Array(3) as p, index}
              <SplideSlide>
                <ProductCardShimmer />
              </SplideSlide>
            {/each}
          </Splide>
        </div>
      {/each}
    </div> -->
  {:else}
    <div class="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
      <img src={not_found_img} alt="not found" class="w-1/2 mb-5" />
      <h1 class="font-semibold text-3xl">Oops! product not found</h1>
      <p class="italic">
        Maybe the product was unlisted or something went wrong!
      </p>
    </div>
  {/if}
</div>

<style>
  :global(.splide__arrow) {
    opacity: 1;
    background-color: white !important;
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
</style>
