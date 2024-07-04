<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import ProductCard from "../../../components/ProductCard.svelte";
  import { getCategorySlug } from "../../../helper/endpoints";
  import { header_title_store } from "../../../helper/store";
  import { category_cache } from "../../../helper/cache_store";
  import BreadcrumbShimmer from "../../../components/BreadcrumbShimmer.svelte";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";
  import ProductCardShimmer from "../../../components/ProductCardShimmer.svelte";
  import { MetaTags } from "svelte-meta-tags";
  import { PUBLIC_BRAND_NAME } from "$env/static/public";

  let category;
  let loading = true;

  const initCategory = async (category_id) => {
    loading = true;
    if ($category_cache.get(category_id)) {
      category = $category_cache.get(category_id);
    } else {
      const response = await httpClient(`${getCategorySlug}/${category_id}`);
      if (response.status === 200) {
        category = response.data.category ?? null;
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
    <MetaTags
      title={`${category.name} Category ${PUBLIC_BRAND_NAME}`}
      titleTemplate="%s"
      description={''}
      canonical="https://www.print.lavange.in"
      openGraph={{
        url: "https://www.print.lavange.in",
        title: "Brand Print",
        description: "Brand Print - Home of your next print.",
        images: [
          {
            url: "https://www.print.lavange.in/og_img.png",
            width: 1200,
            height: 630,
            alt: "Og Image Alt",
          },
        ],
        siteName: "SiteName",
      }}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
        title: category.name,
        description: '',
        image: "https://www.print.lavange.in/og_img.png",
        imageAlt: "Twitter image alt",
      }}
    />
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
        {
          name: category.name,
          path: `/category/${category.slug}`,
        },
      ]}
    />
    <!-- </div>
    <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
      {category.name} Category
    </h1> -->
    <!-- <div>
      {@html category.description}
    </div> -->
    {#if category.products.length}
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {#each category.products as product}
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
