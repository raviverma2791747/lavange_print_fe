<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import ProductCard from "../../../components/ProductCard.svelte";
  import { getCollectionSlug } from "../../../helper/endpoints";
  import { header_title_store } from "../../../helper/store";
  import { collection_cache } from "../../../helper/cache_store";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../../components/BreadcrumbShimmer.svelte";
  import ProductCardShimmer from "../../../components/ProductCardShimmer.svelte";

  let collection;
  let loading = true;

  const initCollection = async (collection_id) => {
    loading = true;
    if ($collection_cache.get(collection_id)) {
      collection = $collection_cache.get(collection_id);
    } else {
      const response = await httpClient(
        `${getCollectionSlug}/${collection_id}`
      );
      if (response.status === 200) {
        collection = response.data.collection ?? [];
        $collection_cache.set(collection_id, collection);
      }
    }
    loading = false;
  };

  $: {
    $header_title_store = "Collection";
  }

  $: {
    initCollection($page.params._id);
  }
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4 min-h-[calc(100vh-64px)] flex flex-col"
>
  {#if loading}
    <BreadcrumbShimmer count={3} />
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {#each Array(5) as A}
        <ProductCardShimmer />
      {/each}
    </div>
  {:else}
    <Breadcrumb
      routes={[
        {
          name: "Home",
          path: "/",
        },
        {
          name: "Collection",
          path: `/collection`,
        },
        {
          name: collection.name,
          path: `/collection/${collection.slug}`,
        },
      ]}
    />
    <!-- <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
      {collection.name} Collection
    </h1> -->
    <div class="mb-4 dynamic-html">
      {@html collection.description}
    </div>
    {#if collection.products.length}
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {#each collection.products as product}
          <ProductCard {product} />
        {/each}
      </div>
    {:else}
      <div class=" grow flex items-center justify-center">
        <p class="text-xl font-semibold">No products found!</p>
      </div>
    {/if}
  {/if}
</div>
