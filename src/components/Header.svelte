<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import Dropdown from "./Dropdown.svelte";
  import ShoppingCartIcon from "./svg/ShoppingCartIcon.svelte";
  import MenuIcon from "./svg/MenuIcon.svelte";
  import UserIcon from "./svg/UserIcon.svelte";
  import HeartIcon from "./svg/HeartIcon.svelte";
  import {
    login_signup_modal_open,
    user_info_store,
    wishlist_store,
    cart_store,
    header_title_store,
    searchFilters_store,
    appliedFilters_store,
  } from "../helper/store";
  import SearchIcon from "./svg/SearchIcon.svelte";
  import SliderIcon from "./svg/SliderIcon.svelte";
  import { page } from "$app/stores";
  import ChevronLeft from "./svg/ChevronLeft.svelte";
  import { PUBLIC_BRAND_NAME } from "$env/static/public";
  import ShoppingBagIcon from "./svg/ShoppingBagIcon.svelte";
  import { getAvatarName } from "../helper/utils";
  import { httpClient } from "../helper/httpClient";
  import {
    fetchUserProduct,
    getSearchFilters,
    userLogout,
  } from "../helper/endpoints";
  import { fade } from "svelte/transition";
  import { Dialog, Separator, Label, DropdownMenu } from "bits-ui";
  import CloseIcon from "./svg/CloseIcon.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let hidden = false;
  let innnerWidth;
  let loading = true;
  let products = [];
  let search_query = $page.url.searchParams.get("q") ?? "";;

  $appliedFilters_store = {
    categories: $page.url.searchParams.get("categories")?.split(",") ?? [],
    collections: $page.url.searchParams.get("collections")?.split(",") ?? [],
    facets: {},
    sort: $page.url.searchParams.get("sort") ?? "createdAt",
    order: $page.url.searchParams.get("order") ?? "desc",
    q: $page.url.searchParams.get("q") ?? "",
    page: 1,
    limit: 10,
  };

  let applied_filters_clone = structuredClone($appliedFilters_store);

  let facets = [];

  const initFilters = async () => {
    const response = await httpClient(getSearchFilters);
    if (response.status === 200) {
      searchFilters_store.set(response.data ?? $searchFilters_store);
    }
  };

  // $: {
  //   if (innnerWidth < 768) {
  //     applied_filters_clone = { ...$appliedFilters_store };
  //   }
  // }

  const logout = async () => {
    const response = await httpClient(userLogout, {
      method: "POST",
    });

    if (response.status === 200) {
      user_info_store.set(null);
      wishlist_store.set([]);
      cart_store.set([]);
    }
  };

  onMount(() => {
    // const collections =
    //   $page.url.searchParams.get("collections")?.split(",") ?? [];
    // const categories =
    //   $page.url.searchParams.get("categories")?.split(",") ?? [];
    // const sort = $page.url.searchParams.get("sort") ?? "createdAt";
    // const order = $page.url.searchParams.get("order") ?? "desc";
    // const q = $page.url.searchParams.get("q") ?? "";
    // $appliedFilters_store = {
    //   collections: collections,
    //   categories: categories,
    //   sort: sort,
    //   order: order,
    //   q: q,
    // };
    // if (
    //   $searchFilters_store.categories.length == 0 &&
    //   $searchFilters_store.collections.length == 0 &&
    //   $searchFilters_store.facets.length == 0
    // ) {
    //    initFilters();
    // }

    search_query = $page.url.searchParams.get("q") ?? "";
    applied_filters_clone.q = $page.url.searchParams.get("q") ?? "";
  });

  // $: {
  //   initFilters
  // }
  const getFacets = (entries) => {
    let facets = {};
    for (const [key, value] of entries) {
      if (key.startsWith("facets.")) {
        facets = {
          ...facets,
          [key.replace("facets.", "")]: value,
        };
      }
    }
    return facets;
  };

  const initAppliedFilters = () => {
    $appliedFilters_store.collections =
      $page.url.searchParams.get("collections")?.split(",") ?? [];
    $appliedFilters_store.categories =
      $page.url.searchParams.get("categories")?.split(",") ?? [];
    $appliedFilters_store.sort =
      $page.url.searchParams.get("sort") ?? "createdAt";
    $appliedFilters_store.order = $page.url.searchParams.get("order") ?? "desc";
    $appliedFilters_store.q = $page.url.searchParams.get("q") ?? "";
    $appliedFilters_store.facets = getFacets($page.url.searchParams.entries());
  };

  const initQueryParams = (filters = {}) => {
    let q = filters.q;

    let queryParams = {};

    if (q) {
      queryParams.q = q;
    }

    if (filters.categories.length > 0) {
      queryParams.categories = filters.categories;
    }

    if (filters.collections.length > 0) {
      queryParams.collections = filters.collections;
    }

    Object.keys(filters.facets).forEach((key) => {
      queryParams[`facets.${key}`] = filters.facets[key];
    });

    if (filters.sort) {
      queryParams.sort = filters.sort;
      queryParams.order = filters.order;
    }

    if (filters.page) {
      queryParams.page = filters.page;
    }

    if (filters.limit) {
      queryParams.limit = filters.limit;
    }

    let searchParams = new URLSearchParams(queryParams);

    goto(`/search?${searchParams.toString()}`, {
      invalidateAll: true,
    });
  };

  $: initAppliedFilters($page);
</script>

<svelte:window bind:innerWidth={innnerWidth} />

<header class="border-b border-gray-200 sticky top-0 bg-white z-50 h-16">
  <div
    class:hidden
    class="max-w-7xl mx-auto flex items-center py-2 px-4 7xl:px-0 gap-4"
  >
    <div>
      <a class="flex-none text-xl font-semibold" href="/">
        {PUBLIC_BRAND_NAME}</a
      >
    </div>
    <div class="grow">
      <div class="lg:w-4/12 mx-auto relative">
        <input
          type="text"
          placeholder="Search"
          bind:value={search_query}
          class="w-full py-3 pe-10 px-4 block border border-gray-200 rounded-full text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          on:keypress={(e) => {
            if (e.key === "Enter") {
              applied_filters_clone.q = search_query;
              $appliedFilters_store = {
                ...applied_filters_clone,
              };
              initQueryParams(applied_filters_clone);
            }
          }}
        />
        <div
          class="absolute right-0 top-0 bottom-0 text-gray-400 flex items-center pe-2"
        >
          <SearchIcon />
        </div>
      </div>
    </div>
    <div class="md:hidden">
      <Dialog.Root
        onOutsideClick={() => {
          applied_filters_clone = { ...$appliedFilters_store };
        }}
      >
        <Dialog.Trigger class="text-gray-600 hover:text-primary-500">
          <SliderIcon />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            transition={fade}
            transitionConfig={{ duration: 150 }}
            class="fixed inset-0 z-50 bg-black/80"
          />
          <Dialog.Content
            class="bg-white fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
          >
            <Dialog.Title
              class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
              >Filters</Dialog.Title
            >
            <Dialog.Description class="">
              <div class="mb-4">
                <div class="mb-2 font-semibold">Sort</div>
                <select
                  class="cursor-pointer focus:border-primary-500 focus:ring-primary-500 block w-full border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none"
                  on:change={(e) => {
                    let v = e.target.value.split("-");
                    let s = v[0];
                    let d = v[1];
                    applied_filters_clone = {
                      ...applied_filters_clone,
                      sort: s,
                      order: d,
                    };
                  }}
                  value={`${applied_filters_clone.sort}-${applied_filters_clone.order}`}
                >
                  <option value="title-asc">A-Z</option>
                  <option value="createdAt-desc">Newest</option>
                  <option selected value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
              <div class="col-span-1 flex flex-col divide-y">
                <div class="py-2 first:pt-0">
                  <div class="mb-2 font-semibold">Categories</div>
                  <div class="flex flex-col gap-2">
                    {#each $searchFilters_store.categories as category}
                      <div class="flex gap-2">
                        <input
                          id={`categories-${category._id}`}
                          bind:group={applied_filters_clone.categories}
                          value={category._id}
                          type="checkbox"
                          class="focus:border-primary-500 focus:ring-primary-500 checked:bg-primary-500 hover:checked:bg-primary-500 h-4 w-4 cursor-pointer"
                        />
                        <label
                          for={`categories-${category._id}`}
                          class=" text-sm cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    {/each}
                  </div>
                </div>
                <div class="py-2">
                  <div class="mb-2 font-semibold">Collections</div>
                  <div class="flex flex-col gap-2">
                    {#each $searchFilters_store.collections as collection}
                      <div class="flex gap-2">
                        <input
                          id={`categories-${collection._id}`}
                          bind:group={applied_filters_clone.collections}
                          value={collection._id}
                          type="checkbox"
                          class="focus:border-primary-500 focus:ring-primary-500 focus checked:bg-primary-500 hover:checked:bg-primary-500 h-4 w-4 cursor-pointer"
                        />
                        <label
                          for={`categories-${collection._id}`}
                          class=" text-sm cursor-pointer"
                        >
                          {collection.name}
                        </label>
                      </div>
                    {/each}
                  </div>
                </div>
                {#each $searchFilters_store.facets as facet}
                  <div class="py-2">
                    <div class="mb-2 font-semibold">{facet.displayName}</div>
                    <div class="flex flex-col gap-2">
                      {#each facet.options as option}
                        <div class="flex gap-2">
                          <input
                            id={`facet-${facet.name}-${option.value}`}
                            bind:group={applied_filters_clone.facets[
                              facet.name
                            ]}
                            value={option.value}
                            type="checkbox"
                            class="focus:border-primary-500 focus:ring-primary-500 checked:bg-primary-500 hover:checked:bg-primary-500 h-4 w-4 cursor-pointer"
                          />
                          <label
                            for={`facet-${facet.name}-${option.value}`}
                            class=" text-sm cursor-pointer"
                          >
                            {option.displayName}
                          </label>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </Dialog.Description>
            <div class="flex w-full justify-end gap-4">
              <Dialog.Close
                on:click={() => {
                  applied_filters_clone = {
                    ...$appliedFilters_store,
                  };
                }}
                class="text-sm grow hover:scale-105 transition duration-100 ease-in-out py-1.5 px-2 inline-flex justify-center items-center gap-x-2  font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
              >
                Cancel
              </Dialog.Close>
              <Dialog.Close
                on:click={() => {
                  applied_filters_clone.q = search_query;
                  $appliedFilters_store = {
                    ...applied_filters_clone,
                  };
                  initQueryParams(applied_filters_clone);
                }}
                class="text-sm grow hover:scale-105 transition duration-100 ease-in-out py-1.5 px-2 inline-flex justify-center items-center gap-x-2  font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Apply
              </Dialog.Close>
            </div>
            <Dialog.Close
              class="absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
            >
              <div>
                <CloseIcon class="size-5 text-foreground" />
                <span class="sr-only">Close</span>
              </div>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
    <div class="hidden md:flex gap-4 items-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="hover:text-primary-500 text-gray-600 relative py-2"
        >
          <ShoppingBagIcon />
          {#if $cart_store.length > 0}
            <div
              class=" absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-4"
            >
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
              ></span>
              {#if $cart_store.reduce((a, b) => a + b.quantity, 0) > 9}
                9+
              {:else}
                {$cart_store.reduce((a, b) => a + b.quantity, 0)}
              {/if}
            </div>
          {/if}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          class="w-full max-w-[20rem] bg-white rounded-xl border border-muted bg-background py-2 shadow-lg z-[75]"
        >
          {#if !$user_info_store}
            <p class="px-4 py-2">Please sign in to view your cart</p>
          {:else if $cart_store.length === 0}
            <p class="px-4 py-2 text-center">Your cart is empty</p>
          {:else}
            {#each $cart_store.slice(0, 3) as cart_item}
              <DropdownMenu.Item>
                <a
                  class="w-full p-2 grid grid-cols-4 gap-2 cursor-pointer hover:bg-gray-200"
                  href={`/product/${cart_item.product.slug}`}
                >
                  <div>
                    {#if cart_item.product.assets.length}
                      <img
                        class="aspect-square object-cover rounded-lg"
                        src={cart_item.product.assets[0].url}
                        alt={cart_item.product.title}
                      />
                    {:else}
                      <div class="aspect-square bg-gray-300 rounded-lg"></div>
                    {/if}
                  </div>
                  <div class="col-span-3">
                    <h1 class="font-semibold truncate">
                      {cart_item.product.title}
                    </h1>
                    <div class="flex gap-2 flex-wrap">
                      {#if cart_item.variant && cart_item.product.variants && cart_item.product.variants.find((v) => v._id === cart_item.variant)}
                        {#each Object.entries(cart_item.product.variants.find((v) => v._id === cart_item.variant).attributes).map( (a) => {
                            return cart_item.product.variantOptions
                              .find((v) => v.name === a[0])
                              .options.find((o) => o.value === a[1]).displayName;
                          } ) as attribute}
                          <div
                            class="border border-primary-500 text-primary-500 bg-primary-200 px-2 rounded-lg"
                          >
                            {attribute}
                          </div>
                        {/each}
                      {/if}
                    </div>
                    <p>Quantity {cart_item.quantity}</p>
                  </div>
                </a>
              </DropdownMenu.Item>
            {/each}
            <DropdownMenu.Item>
              <a
                href="/cart"
                class="block w-full p-2 cursor-pointer hover:bg-gray-200 text-center underline"
              >
                View All
              </a>
            </DropdownMenu.Item>
          {/if}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="hover:text-primary-500 text-gray-600 relative py-2"
        >
          <HeartIcon />
          {#if $wishlist_store.length > 0}
            <div
              class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-4"
            >
              {#if $wishlist_store.length > 9}
                9+
              {:else}
                {$wishlist_store.length}
              {/if}
            </div>
          {/if}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          class="w-full max-w-[20rem] bg-white rounded-xl border border-muted bg-background py-2 shadow-lg z-[75]"
        >
          {#if !$user_info_store}
            <p class="px-4 py-2">Please sign in to view your wishlist</p>
          {:else if $wishlist_store.length === 0}
            <p class="px-4 py-2 text-center">Your wishlist is empty</p>
          {:else}
            {#each $wishlist_store.slice(0, 3) as product}
              <DropdownMenu.Item>
                <a
                  class="w-full p-2 grid grid-cols-4 gap-2 cursor-pointer hover:bg-gray-200"
                  href={`/product/${product.slug}`}
                >
                  <div>
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
                  <div class="col-span-3">
                    <h1 class="font-semibold truncate">{product.title}</h1>
                  </div>
                </a>
              </DropdownMenu.Item>
            {/each}
            <DropdownMenu.Item>
              <a
                href="/wishlist"
                class="block w-full p-2 cursor-pointer hover:bg-gray-200 text-center underline"
              >
                View All
              </a>
            </DropdownMenu.Item>
          {/if}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="text-gray-600 flex gap-2 py-2 px-3 border border-gray-200 rounded-full hover:shadow"
        >
          <MenuIcon />

          {#if $user_info_store}
            <div
              class="rounded-full w-6 h-6 bg-gray-600 text-white text-xs flex justify-center items-center"
            >
              <div>
                {getAvatarName($user_info_store)}
              </div>
            </div>
          {:else}
            <UserIcon />
          {/if}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          class="w-full max-w-[10rem] bg-white rounded-xl border border-muted bg-background py-2 shadow-lg z-[75]"
        >
          {#if $user_info_store}
            <DropdownMenu.Item>
              <button
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={() => {
                  goto("/account");
                }}
              >
                Account
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={() => {
                  goto("/order");
                }}
              >
                Orders
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={() => {
                  goto("/cart");
                }}
              >
                Cart
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={() => {
                  goto("/wishlist");
                }}
              >
                Wishlist
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={() => {
                  goto("/help");
                }}
              >
                Help
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={logout}
              >
                Logout
              </button>
            </DropdownMenu.Item>
          {:else}
            <DropdownMenu.Item>
              <button
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={() => {
                  login_signup_modal_open.set(true);
                }}
              >
                Sign up
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <button
                data-hs-overlay="#hs-slide-up-animation-modal"
                class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:bg-gray-100"
                on:click={() => {
                  login_signup_modal_open.set(true);
                }}
              >
                Login
              </button>
            </DropdownMenu.Item>
          {/if}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>

  <div
    class:hidden={!hidden}
    class="max-w-7xl mx-auto px-4 py-[15.2px] 7xl:px-0 flex items-center"
  >
    <button>
      <ChevronLeft class="text-gray-600 w-8 h-8" />
    </button>
    <div class="grow text-xl font-semibold text-center">
      {$header_title_store}
    </div>
  </div>
</header>
