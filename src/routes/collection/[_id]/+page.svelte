<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import ProductCard from "../../../components/ProductCard.svelte";
  import {  getCollectionSlug } from "../../../helper/endpoints";
  import { header_title_store } from "../../../helper/store";
  import { collection_cache } from "../../../helper/cache_store";

  let collection;
  let loading = true;
  let active_asset = 0;

  const initCollection = async (collection_id) => {
    loading = true;
    if($collection_cache.get(collection_id)){
      collection = $collection_cache.get(collection_id);
    } else {
      const response = await httpClient(`${getCollectionSlug}/${collection_id}`);
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

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4">
  {#if loading}{:else}
    <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
      {collection.name} Collection
    </h1>
    <div>
      {
        @html collection.description
      }
    </div>
    <div class="grid grid-cols-4 gap-4">
      {#each collection.products as product}
        <ProductCard {product} />
      {/each}
    </div>
  {/if}
</div>
