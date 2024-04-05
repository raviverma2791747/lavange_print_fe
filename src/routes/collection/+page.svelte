<script>
  //@ts-nocheck
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";
  import CollectionCard from "../../components/CollectionCard.svelte";
  import CollectionCardShimmer from "../../components/CollectionCardShimmer.svelte";
  import { fetchUserCollection } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";

  let loading = true;
  let collections = [];

  const initCollections = async () => {
    loading = true;
    const response = await httpClient(fetchUserCollection);

    if (response.status === 200) {
      collections = response.data.collections ?? [];
    }
    loading = false;
  };

  $: {
    initCollections();
  }
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4 min-h-[calc(100vh-64px)] flex flex-col"
>
  {#if loading}
    <BreadcrumbShimmer count={2} />
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {#each Array(5) as A}
        <CollectionCardShimmer />
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
      ]}
    />
    <!-- <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
      {collection.name} Collection
    </h1> -->
    {#if collections.length}
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {#each collections as collection}
          <CollectionCard {collection} />
        {/each}
      </div>
    {:else}
      <div class=" grow flex items-center justify-center">
        <p class="text-xl font-semibold">No collections found!</p>
      </div>
    {/if}
  {/if}
</div>
