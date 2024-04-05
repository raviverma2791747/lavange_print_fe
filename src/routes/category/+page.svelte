<script>
  //@ts-nocheck
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";
  import { fetchUserCategory } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import CategoryCard from "../../components/CategoryCard.svelte";
  import CategoryCardShimmer from "../../components/CategoryCardShimmer.svelte";

  let loading = true;
  let categories = [];

  const initcategories = async () => {
    loading = true;
    const response = await httpClient(fetchUserCategory);

    if (response.status === 200) {
      categories = response.data.categories ?? [];
    }
    loading = false;
  };

  $: {
    initcategories();
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
        <CategoryCardShimmer />
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
          name: "Category",
          path: `/category`,
        },
      ]}
    />
    <!-- <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
        {collection.name} Collection
      </h1> -->
    {#if categories.length}
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {#each categories as category}
         <CategoryCard {category} />
        {/each}
      </div>
    {:else}
      <div class=" grow flex items-center justify-center">
        <p class="text-xl font-semibold">No categories found!</p>
      </div>
    {/if}
  {/if}
</div>
