<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import ProductCard from "../../../components/ProductCard.svelte";
  import { getCollection } from "../../../helper/endpoints";

  let collection;
  let loading = true;
  let active_asset = 0;

  onMount(async () => {
    const response = await httpClient(`${getCollection}/${$page.params._id}`);
    collection = response.data.collection ?? [];
    loading = false;
  });
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4">
  {#if loading}{:else}
    <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
      {collection.name} Collection
    </h1>
    <div class="grid grid-cols-4 gap-4">
      {#each collection.products as product}
        <ProductCard {product} />
      {/each}
    </div>
  {/if}
</div>
