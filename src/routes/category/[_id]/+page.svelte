<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import ProductCard from "../../../components/ProductCard.svelte";
  import { getCategory } from "../../../helper/endpoints";
  import { header_title_store } from "../../../helper/store";
  import { category_cache } from "../../../helper/cache_store";

  let category;
  let loading = true;
  let active_asset = 0;

  const initCategory = async (category_id) => {
    loading = true;
    if ($category_cache.get(category_id)) {
      category = $category_cache.get(category_id);
    } else {
      const response = await httpClient(`${getCategory}/${category_id}`);
      if (response.status === 200) {
        category = response.data.category ?? [];
        $category_cache.set(category_id, category);
      }
    }
    loading = false;
  };

  $: {
    $header_title_store = "Category";
  }

  $: {
    initCategory($page.params._id);
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4">
  {#if loading}{:else}
    <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
      {category.name} Category
    </h1>
    <!-- <div>
        {
          @html category.description
        }
      </div> -->
    <div class="grid grid-cols-4 gap-4">
      {#each category.products as product}
        <ProductCard {product} />
      {/each}
    </div>
  {/if}
</div>
