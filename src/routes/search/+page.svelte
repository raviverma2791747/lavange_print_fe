<script>
  //@ts-nocheck
  import ProductCard from "../../components/ProductCard.svelte";
  import { httpClient } from "../../helper/httpClient";
  import {
    fetchUserCategory,
    fetchUserCollection,
    fetchUserProduct,
    getSearchFilters,
  } from "../../helper/endpoints";
  import ProductCardShimmer from "../../components/ProductCardShimmer.svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { searchFilters_store } from "../../helper/store";

  let products = [];
  let loading = true;
  let filters = {
    categories: [],
    collections: [],
    sizes: [],
    sort: "createdAt",
    order: "desc",
  };

  const initFilters = async () => {
    const response = await httpClient(getSearchFilters);
    if (response.status === 200) {
      searchFilters_store.set(response.data ?? $searchFilters_store);
    }
  };

  const initProducts = async (search = "", filters = {}) => {
    loading = true;
    let queryParams = {};

    if (search) {
      queryParams.search = search;
    }

    if (filters.categories.length > 0) {
      queryParams.categories = filters.categories;
    }

    if (filters.collections.length > 0) {
      queryParams.collections = filters.collections;
    }

    if (filters.sizes.length > 0) {
      queryParams.sizes = filters.sizes;
    }

    if (filters.sort) {
      queryParams.sort = filters.sort;
      queryParams.order = filters.order;
    }

    const response = await httpClient(fetchUserProduct, {
      queryParams: queryParams,
    });
    if (response.status === 200) {
      products = response.data.products ?? [];
    }
    loading = false;
  };

  // const initCategories = async () => {
  //   const response = await httpClient(fetchUserCategory);
  //   if (response.status === 200) {
  //     categories = response.data.categories ?? [];
  //   }
  // };

  // const initCollections = async () => {
  //   const response = await httpClient(fetchUserCollection);
  //   if (response.status === 200) {
  //     collections = response.data.collections ?? [];
  //   }
  // };

  onMount(() => {
    if (
      $searchFilters_store.categories.length == 0 &&
      $searchFilters_store.collections.length == 0 &&
      $searchFilters_store.sizes.length == 0
    ) {
      initFilters();
    }
  });

  const handleToggleSize = (size) => {
    if (filters.sizes.includes(size)) {
      filters.sizes = filters.sizes.filter((s) => s !== size);
      //$page.url.searchParams.delete("size");
    } else {
      filters.sizes = [...filters.sizes, size];
      //$page.url.searchParams.set("size", size);
    }
  };

  const handleToggleCategory = (category) => {
    if (filters.categories.includes(category)) {
      filters.categories = filters.categories.filter((c) => c !== category);
    } else {
      filters.categories = [...filters.categories, category];
    }
  };

  const handleToggleCollection = (collection) => {
    if (filters.collections.includes(collection)) {
      filters.collections = filters.collections.filter((c) => c !== collection);
    } else {
      filters.collections = [...filters.collections, collection];
    }
  };

  initProducts("", filters);

  $: {
    initProducts($page.url.searchParams.get("q") ?? "", filters);
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 mt-4">
  <div class="mb-4">
    <h1 class="font-semibold text-xl mb-4 text-gray-800">
      Search results

      {#if $page.url.searchParams.get("q")}
        for "{$page.url.searchParams.get("q")}"
      {/if}
    </h1>
  </div>
  <div class="grid md:grid-cols-4">
    <div class="col-span-1 hidden md:block">
      <div class="mb-4 font-semibold">Filters</div>
      <div class="mb-4">
        <div class="mb-2 font-semibold">Categories</div>
        <div>
          {#each $searchFilters_store.categories as category}
            <div
              class="flex items-center"
              class:text-purple-500={filters.categories.includes(category.name)}
            >
              <input
                id={`categories-${category._id}`}
                type="checkbox"
                class="mr-2 h-4 w-4 rounded-lg"
                on:change={() => handleToggleCategory(category.name)}
              />
              <label for={`categories-${category._id}`} class="text-sm">
                {category.name}
              </label>
            </div>
          {/each}
        </div>
      </div>
      <div class="mb-4">
        <div class="mb-2 font-semibold">Collections</div>
        <div>
          {#each $searchFilters_store.collections as collection}
            <div
              class="flex items-center"
              class:text-purple-500={filters.collections.includes(
                collection._id
              )}
            >
              <input
                type="checkbox"
                id={`categories-${collection._id}`}
                class="mr-2 h-4 w-4 rounded-lg"
                on:change={() => handleToggleCollection(collection._id)}
              />
              <label for={`categories-${collection._id}`} class="text-sm">
                {collection.name}
              </label>
            </div>
          {/each}
        </div>
      </div>
      <div class="mb-4">
        <div class="mb-2 font-semibold">Sizes</div>
        <div class="flex gap-2 flex-wrap">
          {#each $searchFilters_store.sizes as size}
            <button
              class="border border-gray-200 p-2 rounded-lg text-sm"
              class:border-purple-500={filters.sizes.includes(size.value)}
              class:text-purple-500={filters.sizes.includes(size.value)}
              on:click={() => {
                handleToggleSize(size.value);
              }}
            >
              {size.displayName}
            </button>
          {/each}
        </div>
      </div>
    </div>
    <div class=" md:col-span-3">
      <div class="mb-4 font-semibold flex justify-end">
        <div class="flex gap-2 items-center">
          <div>Filters</div>
          <select
            class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            on:change={(e) => {
              let v = e.target.value.split("-");
              let s = v[0];
              let d = v[1];
              filters = { ...filters, sort: s, order: d };
            }}
          >
            <option value="createdAt-desc">New</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {#if loading}
          {#each Array(8) as A}
            <ProductCardShimmer />
          {/each}
        {/if}

        {#each products as product}
          <ProductCard {product} />
        {/each}
      </div>
    </div>
  </div>
</div>
