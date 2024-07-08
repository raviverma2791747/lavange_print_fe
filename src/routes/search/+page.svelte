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
  import {
    searchFilters_store,
    homeConfig_store,
    appliedFilters_store,
  } from "../../helper/store";
  import { Pagination } from "bits-ui";
  import AllCategory from "../../components/home/AllCategory.svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import ChevronRight from "../../components/svg/ChevronRight.svelte";
  import ChevronLeft from "../../components/svg/ChevronLeft.svelte";

  let products = [];
  let loading = true;
  //let facets = [];
  let total = 0;
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

  $appliedFilters_store = {
    categories: $page.url.searchParams.get("categories")?.split(",") ?? [],
    collections: $page.url.searchParams.get("collections")?.split(",") ?? [],
    facets: getFacets($page.url.searchParams.entries()),
    sort: $page.url.searchParams.get("sort") ?? "createdAt",
    order: $page.url.searchParams.get("order") ?? "desc",
    q: $page.url.searchParams.get("q") ?? "",
    page: 1,
    limit: 12,
  };

  const initFilters = async () => {
    const response = await httpClient(getSearchFilters);
    if (response.status === 200) {
      searchFilters_store.set(response.data ?? $searchFilters_store);
      //facets = [...response.data.facets];
    }
  };

  const initProducts = async (page) => {
    loading = true;
    const response = await httpClient(
      `${fetchUserProduct}?${page.url.searchParams.toString()}`
    );
    if (response.status === 200) {
      products = response.data.products ?? [];
      total = response.data.total;
    }
    //await initFacets();
    loading = false;
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

  const initFacets = async (filters) => {
    if (filters.categories.length) {
      let categories = [];
      categories = filters.categories
        .map((category) => {
          return $searchFilters_store.categories.find(
            (f) => f._id === category
          );
        })
        .filter((item) => item !== undefined);

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

      //facets = [...raw_facets];
      filters.facets = { ...raw_filters };
    } else {
      //facets = [...$searchFilters_store.facets];
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
    //initProducts($pag);
    if (
      $searchFilters_store.categories.length == 0 &&
      $searchFilters_store.collections.length == 0 &&
      $searchFilters_store.facets.length == 0
    ) {
      await initFilters();
      await initFacets($appliedFilters_store);
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
    browser && initFacets($appliedFilters_store);
  }

  $: {
    browser && initProducts($page);
  }

  $: {
    browser && initQueryParams($appliedFilters_store);
  }
</script>

<!-- <div class="border-b border-gray-200 mb-4 sticky top-[64px] z-30">
  <div class="bg-white max-w-7xl mx-auto py-4 px-4 7xl:px-0">
    <AllCategory categories={ $homeConfig_store.featuredCategories} {loading} />
  </div>
</div> -->

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 mt-4 flex flex-col min-h-[calc(100vh-64px)]"
>
  <div class="mb-4">
    {#if $appliedFilters_store.q}
      <h1 class="font-semibold text-gray-800">
        Search results for "{$appliedFilters_store.q}"
      </h1>
    {/if}
  </div>
  <div class="grid md:grid-cols-4 gap-4 mb-4 grow">
    <div class="col-span-1 hidden md:flex flex-col divide-y">
      {#if $searchFilters_store.categories.length > 0}
        <div class="py-2 first:pt-0">
          <div class="mb-2 font-semibold">Categories</div>
          <div class="flex flex-col gap-2">
            {#each $searchFilters_store.categories as category}
              <div class="flex gap-2">
                <input
                  id={`categories-${category._id}`}
                  bind:group={$appliedFilters_store.categories}
                  value={category._id}
                  type="checkbox"
                  class="focus:border-primary-500 focus:ring-primary-500 checked:bg-primary-500 focus:checked:bg-primary-500 hover:checked:bg-primary-500 h-4 w-4 cursor-pointer"
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
      {/if}
      {#if $appliedFilters_store.collections.length > 0}
        <div class="py-2">
          <div class="mb-2 font-semibold">Collections</div>

          <div class="flex flex-col gap-2">
            {#each $searchFilters_store.collections as collection}
              <div class="flex gap-2">
                <input
                  id={`categories-${collection._id}`}
                  bind:group={$appliedFilters_store.collections}
                  value={collection._id}
                  type="checkbox"
                  class="focus:border-primary-500 focus:ring-primary-500 checked:bg-primary-500 focus:checked:bg-primary-500 hover:checked:bg-primary-500 h-4 w-4 cursor-pointer"
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
      {/if}
      {#each $searchFilters_store.facets as facet}
        <div class="py-2">
          <div class="mb-2 font-semibold">{facet.displayName}</div>
          <div class="flex flex-col gap-2">
            {#each facet.options as option}
              <div class="flex gap-2">
                <input
                  id={`facet-${facet.name}-${option.value}`}
                  bind:group={$appliedFilters_store.facets[facet.name]}
                  value={option.value}
                  type="checkbox"
                  class="focus:border-primary-500 focus:ring-primary-500 checked:bg-primary-500 focus:checked:bg-primary-500 hover:checked:bg-primary-500 h-4 w-4 cursor-pointer"
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
      <div class="hidden md:flex justify-end mb-4">
        <select
          class="cursor-pointer focus:border-primary-500 focus:ring-primary-500 block w-fit border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none"
          value={`${$appliedFilters_store.sort}-${$appliedFilters_store.order}`}
          on:change={(e) => {
            let v = e.target.value.split("-");
            let s = v[0];
            let d = v[1];
            $appliedFilters_store = {
              ...$appliedFilters_store,
              sort: s,
              order: d,
            };
          }}
        >
          <option value="title-asc">A-Z</option>
          <option value="createdAt-desc">Newest</option>
          <option selected value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
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
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
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
      <Pagination.Root
        count={total}
        perPage={$appliedFilters_store.limit}
        bind:page={$appliedFilters_store.page}
        let:pages
        let:range
      >
        <div class="my-8 flex items-center">
          <Pagination.PrevButton
            class="mr-[25px] inline-flex size-10 items-center justify-center rounded-[9px] bg-primary-500 text-white hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:opacity-75"
          >
            <ChevronLeft />
          </Pagination.PrevButton>
          <div class="flex items-center gap-2.5">
            {#each pages as page (page.key)}
              {#if page.type === "ellipsis"}
                <div class="text-[15px] font-medium text-foreground-alt">
                  ...
                </div>
              {:else}
                <Pagination.Page
                  {page}
                  class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent border-2 data-[selected]:border-primary-500 data-[selected]:text-background"
                >
                  {page.value}
                </Pagination.Page>
              {/if}
            {/each}
          </div>
          <Pagination.NextButton
            class="ml-[29px] inline-flex size-10 items-center justify-center rounded-[9px] bg-primary-500 text-white hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:opacity-75"
          >
            <ChevronRight />
          </Pagination.NextButton>
        </div>
        <!-- <p class="text-center text-[13px] text-muted-foreground">
          Showing {range.start} - {range.end}
        </p> -->
      </Pagination.Root>
    </div>
  {/if}
</div>
