<script>
  //@ts-nocheck
  import '@splidejs/svelte-splide/css';
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { onMount } from "svelte";
  import { httpClient } from "../helper/httpClient";
  import Announcement from "../components/home/Announcement.svelte";
  import ProductCard from "../components/ProductCard.svelte";
  import CollectionCard from "../components/CollectionCard.svelte";
  import { homeConfig_store, network_error } from "../helper/store";
  import { getHomeConfig } from "../helper/endpoints";
  import AllCategory from "../components/home/AllCategory.svelte";
  import ProductCardShimmer from "../components/ProductCardShimmer.svelte";
  import CollectionCardShimmer from "../components/CollectionCardShimmer.svelte";

  let loading = true;

  let homeConfig = {
    featuredAnnouncements: [],
    exploreProducts: [],
    exploreCollections: [],
    featuredCategories: [],
    newArrivalProducts: [],
    bestSellerProducts: [],
    featuredCollections: [],
  };

  const slideOptions = {
    // type: "loop",
    perPage: 5,
    gap: "1rem",
    pagination: false,
    breakpoints: {
      768: {
        perPage: 4,
        gap: ".7rem",
      },
      640: {
        perPage: 3,
        gap: ".7rem",
      },
      480: {
        perPage: 2,
        gap: ".7rem",
      },
    },
  };

  const slideOptionsExplore = {
    // type: "loop",
    perPage: 8,
    gap: "1rem",
    pagination: false,
    breakpoints: {
      1024: {
        perPage: 5,
        gap: ".7rem",
      },
      768: {
        perPage: 4,
        gap: ".7rem",
      },
      640: {
        perPage: 3,
        gap: ".7rem",
      },
      480: {
        perPage: 2,
        gap: ".7rem",
      },
    },
  };

  onMount(async () => {
    if ($homeConfig_store) {
      homeConfig = $homeConfig_store;
    } else {
      const response = await httpClient(getHomeConfig);

      if (response.status === 200) {
        homeConfig = response.data.homeConfig;
        homeConfig_store.set(homeConfig);
      } else {
      }
    }
    loading = false;
  });
</script>

<div class="border-b border-gray-200 mb-4 sticky top-[64px] z-30">
  <div class="bg-white max-w-7xl mx-auto py-4 px-4 7xl:px-0">
    <AllCategory categories={homeConfig.featuredCategories} {loading} />
  </div>
</div>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 flex flex-col gap-8 mb-4">
  <div>
    <Announcement announcements={homeConfig.featuredAnnouncements} {loading} />
  </div>

  <div>
    <div class="bg-gradient-to-b from-primary-300 to-primary-50 rounded-lg p-4">
      <div class="mb-4">
        <h2 class="font-semibold text-xl md:text-3xl mb-4 text-gray-800">
          Explore
        </h2>
        <p>Explore our wide range of products</p>
      </div>
      <div class="w-full mb-4">
        {#if homeConfig.exploreProducts.length === 0 && loading}
          <Splide options={slideOptionsExplore}>
            {#each Array(3) as A, index}
              <SplideSlide>
                <ProductCardShimmer hidePrice hideWishlist />
              </SplideSlide>
            {/each}
          </Splide>
        {:else}
          <Splide  options={slideOptionsExplore}>
            {#each homeConfig.exploreProducts as product}
              <SplideSlide>
                <ProductCard {product} hideWishlist hidePrice hideShare />
              </SplideSlide>
            {/each}
          </Splide>
        {/if}
      </div>

      <a
        href="/search"
        class="hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        Explore
      </a>
    </div>
    <!-- <div
      class="hidden bg-gradient-to-b from-primary-300 to-primary-50 rounded-lg p-4"
    >
      <div class="mb-4">
        <h1 class="font-semibold text-xl md:text-3xl mb-4">Personalize</h1>
        <p>Things that truly reflect you</p>
      </div>
      <div class="grid grid-cols-4 mb-4 gap-4">
        <div class="rounded-lg bg-gray-600 aspect-square"></div>
        <div class="rounded-lg bg-gray-600 aspect-square"></div>
        <div class="rounded-lg bg-gray-600 aspect-square"></div>
        <div class="rounded-lg bg-gray-600 aspect-square"></div>
      </div>
      <button
        type="button"
        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-800 text-white hover:bg-primary-900 disabled:opacity-50 disabled:pointer-events-none"
      >
        Design
      </button>
    </div> -->
  </div>

  <section>
    <h2 class="font-semibold text-xl md:text-3xl text-center mb-4">
      Explore Collections
    </h2>
    <div class="w-full">
      {#if homeConfig.exploreCollections.length === 0 && loading}
        <Splide options={slideOptions}>
          {#each Array(4) as A, index}
            <SplideSlide>
              <CollectionCardShimmer />
            </SplideSlide>
          {/each}
        </Splide>
      {:else}
        <Splide options={slideOptions}>
          {#each homeConfig.exploreCollections as collection}
            <SplideSlide>
              <CollectionCard {collection} />
            </SplideSlide>
          {/each}
        </Splide>
      {/if}
    </div>
  </section>

  <section>
    <h2 class="font-semibold text-xl md:text-3xl text-center mb-4">
      Best Sellers
    </h2>
    <div class="w-full">
      {#if homeConfig.bestSellerProducts.length === 0 && loading}
        <Splide options={slideOptions}>
          {#each Array(4) as A, index}
            <SplideSlide>
              <ProductCardShimmer />
            </SplideSlide>
          {/each}
        </Splide>
      {:else}
        <Splide options={slideOptions}>
          {#each homeConfig.bestSellerProducts as product}
            <SplideSlide>
              <ProductCard {product} />
            </SplideSlide>
          {/each}
        </Splide>
      {/if}
    </div>
  </section>

  <section>
    <h2 class="font-semibold text-xl md:text-3xl text-center mb-4">
      New Arrivals
    </h2>
    <div class="w-full">
      {#if homeConfig.newArrivalProducts.length === 0 && loading}
        <Splide options={slideOptions}>
          {#each Array(4) as A, index}
            <SplideSlide>
              <ProductCardShimmer />
            </SplideSlide>
          {/each}
        </Splide>
      {:else}
        <Splide options={slideOptions}>
          {#each homeConfig.newArrivalProducts as product}
            <SplideSlide>
              <ProductCard {product} />
            </SplideSlide>
          {/each}
        </Splide>
      {/if}
    </div>
  </section>
  {#each homeConfig.featuredCollections as collection}
    <section>
      <h2 class="font-semibold text-xl md:text-3xl text-center mb-4 capitalize">
        {collection.name} Collection
      </h2>
      <div class="w-full">
        {#if collection.products.length === 0 && loading}
          <Splide options={slideOptions}>
            {#each Array(4) as A, index}
              <SplideSlide>
                <ProductCardShimmer />
              </SplideSlide>
            {/each}
          </Splide>
        {:else}
          <Splide options={slideOptions}>
            {#each collection.products as product}
              <SplideSlide>
                <ProductCard {product} />
              </SplideSlide>
            {/each}
          </Splide>
        {/if}
      </div>
    </section>
  {/each}
  <!-- <div class="mb-4">
    <h1 class="font-semibold text-xl md:text-3xl text-center mb-4">
      New Designs
    </h1>
    <div class="grid grid-cols-5 gap-4 animate-pulse">
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
    </div>
  </div> -->
</div>
