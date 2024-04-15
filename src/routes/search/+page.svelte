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
  import Pagination from "../../components/Pagination.svelte";

  let products = [];
  let loading = true;
  let filters = {
    categories: [],
    collections: [],
    facets: {},
    sort: "createdAt",
    order: "desc",
  };
  let facets = [];

  const initFilters = async () => {
    console.log("filters");
    const response = await httpClient(getSearchFilters);
    if (response.status === 200) {
      searchFilters_store.set(response.data ?? $searchFilters_store);
      facets = [...response.data.facets];
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

    let f = Object.keys(filters.facets).map((key) => {
      return filters.facets[key];
    });

    f = f.flat(1);

    if (f.length > 0) {
      queryParams.facets = f;
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

  const initFacets = async () => {
    //console.log(filters.facets.length);
    if (filters.categories.length) {
      let categories = [];
      categories = filters.categories.map((category) => {
        return $searchFilters_store.categories.find((f) => f._id === category);
      });

      let raw_facets = [];

      categories.forEach((category) => {
        raw_facets = [...raw_facets, ...category.facets];
      });

      raw_facets = [...new Set(raw_facets)];

      raw_facets = raw_facets.map((facet) => {
        return $searchFilters_store.facets.find((f) => f._id === facet);
      });

      raw_facets = raw_facets.filter((f) => f !== undefined);

      let raw_filters = {};

      raw_facets.forEach((facet) => {
        raw_filters[facet.name] = filters.facets[facet.name] ?? [];
      });

      facets = [...raw_facets];
      filters.facets = { ...raw_filters };
    } else {
      facets = [...$searchFilters_store.facets];
    }
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

  onMount(async () => {
    if (
      $searchFilters_store.categories.length == 0 &&
      $searchFilters_store.collections.length == 0 &&
      $searchFilters_store.facets.length == 0
    ) {
      await initFilters();
    }
  });

  // const handleToggleCategory = (category) => {
  //   if (filters.categories.includes(category)) {
  //     filters.categories = filters.categories.filter((c) => c !== category);
  //   } else {
  //     filters.categories = [...filters.categories, category];
  //   }
  // };

  // const handleToggleCollection = (collection) => {
  //   if (filters.collections.includes(collection)) {
  //     filters.collections = filters.collections.filter((c) => c !== collection);
  //   } else {
  //     filters.collections = [...filters.collections, collection];
  //   }
  // };

  // initProducts("", filters);
  $: {
    initFacets();
    initProducts($page.url.searchParams.get("q") ?? "", filters);
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 mt-4">
  <div class="mb-4">
    {#if $page.url.searchParams.get("q")}
      <h1 class="font-semibold mb-4 text-gray-800">
        Search results for "{$page.url.searchParams.get("q")}"
      </h1>
    {/if}
  </div>
  <div class="grid md:grid-cols-4 gap-2 mb-16">
    <div class="col-span-1 hidden md:flex flex-col divide-y">
      <div class="py-2 first:pt-0">
        <div class="mb-2 font-semibold">Categories</div>
        <div class="flex flex-col gap-2">
          {#each $searchFilters_store.categories as category}
            <div class="flex gap-2">
              <input
                id={`categories-${category._id}`}
                bind:group={filters.categories}
                value={category._id}
                type="checkbox"
                class="accent-primary-500 h-4 w-4 cursor-pointer"
              />
              <label
                for={`categories-${category._id}`}
                class=" text-sm cursor-pointer"
              >
                {category.name}
              </label>
            </div>

            <!-- <label
              for={`categories-${category._id}`}
              class="border border-gray-200 p-2 rounded-lg text-sm cursor-pointer"
              class:bg-primary-50={filters.categories.includes(category._id)}
              class:border-primary-500={filters.categories.includes(
                category._id
              )}
              class:text-primary-500={filters.categories.includes(category._id)}
            >
              {category.name}

              <input
                id={`categories-${category._id}`}
                value={category._id}
                bind:group={filters.categories}
                type="checkbox"
                class="hidden"
              />
            </label> -->
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
                bind:group={filters.collections}
                value={collection._id}
                type="checkbox"
                class="accent-primary-500 h-4 w-4 cursor-pointer"
              />
              <label
                for={`categories-${collection._id}`}
                class=" text-sm cursor-pointer"
              >
                {collection.name}
              </label>
            </div>

            <!-- <label
              for={`categories-${collection._id}`}
              class="border border-gray-200 p-2 rounded-lg text-sm cursor-pointer"
              class:bg-primary-50={filters.collections.includes(collection._id)}
              class:border-primary-500={filters.collections.includes(
                collection._id
              )}
              class:text-primary-500={filters.collections.includes(
                collection._id
              )}
            >
              {collection.name}

              <input
                id={`categories-${collection._id}`}
                value={collection._id}
                bind:group={filters.collections}
                type="checkbox"
                class="hidden"
              />
            </label> -->

            <!-- <div
              class="flex items-center"
              class:text-primary-500={filters.collections.includes(
                collection._id
              )}
            >
              <input
                type="checkbox"
                id={`categories-${collection._id}`}
                class="mr-2 h-4 w-4 rounded-lg"
                value={collection._id}
                bind:group={filters.collections}
              />
              <label for={`categories-${collection._id}`} class="text-sm">
                {collection.name}
              </label>
            </div> -->
          {/each}
        </div>
      </div>
      {#each facets as facet}
        <div class="py-2">
          <div class="mb-2 font-semibold">{facet.displayName}</div>
          <div class="flex flex-col gap-2">
            {#each facet.options as option}
              <div class="flex gap-2">
                <input
                  id={`facet-${facet.name}-${option.value}`}
                  bind:group={filters.facets[facet.name]}
                  value={option.value}
                  type="checkbox"
                  class="accent-primary-500 h-4 w-4 cursor-pointer"
                />
                <label
                  for={`facet-${facet.name}-${option.value}`}
                  class=" text-sm cursor-pointer"
                >
                  {option.displayName}
                </label>
              </div>
              <!-- <label
                for={`facet-${facet.name}-${option.value}`}
                class="border border-gray-200 p-2 rounded-lg text-sm cursor-pointer"
                class:bg-primary-50={filters.facets[facet.name]?.includes(
                  option.value
                )}
                class:border-primary-500={filters.facets[facet.name]?.includes(
                  option.value
                )}
                class:text-primary-500={filters.facets[facet.name]?.includes(
                  option.value
                )}
              >
                {option.displayName}

                <input
                  id={`facet-${facet.name}-${option.value}`}
                  bind:group={filters.facets[facet.name]}
                  value={option.value}
                  type="checkbox"
                  class="hidden"
                />
              </label> -->
            {/each}
          </div>
        </div>
      {/each}
      <!-- <div class="mb-4">

         <div class="mb-2 font-semibold">Sizes</div>
        <div class="flex gap-2 flex-wrap">
          {#each $searchFilters_store.sizes as size}
            <button
              class="border border-gray-200 p-2 rounded-lg text-sm"
              class:border-primary-500={filters.sizes.includes(size.value)}
              class:text-primary-500={filters.sizes.includes(size.value)}
              on:click={() => {
                handleToggleSize(size.value);
              }}
            >
              {size.displayName}
            </button>
          {/each}
        </div>
      </div> -->
    </div>
    <div class="md:col-span-3">
      <div class="flex justify-end mb-4">
        <div>
          <select
            class="py-2 px-2 cursor-pointer outline-primary-500 block w-fit border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none"
            on:change={(e) => {
              let v = e.target.value.split("-");
              let s = v[0];
              let d = v[1];
              filters = { ...filters, sort: s, order: d };
            }}
          >
            <option value="title-asc">A-Z</option>
            <option value="createdAt-desc">Newest</option>
            <option selected value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {#if loading}
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {#each Array(8) as A}
            <ProductCardShimmer />
          {/each}
        </div>
      {:else if products.length === 0}
        <div class="flex justify-center items-center w-full h-full text-xl">
          No products found!
        </div>
      {:else}
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full"
        >
          {#each products as product}
            <ProductCard {product} />
          {/each}
        </div>
      {/if}
    </div>
  </div>

  {#if products.length > 0}
    <div class="w-full flex justify-center">
      <Pagination />
    </div>
  {/if}
</div>
