<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { httpClient } from "../helper/httpClient";
  import Announcement from "../components/home/Announcement.svelte";
  import Carousel from "../components/Carousel.svelte";
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

<div class="border-b border-gray-200 mb-4 sticky top-[60.4px] z-30">
  <div class="bg-white max-w-7xl mx-auto py-4 px-4 7xl:px-0">
    <AllCategory categories={homeConfig.featuredCategories} {loading} />
  </div>
</div>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 flex flex-col gap-8 mb-4">
  <div>
    <Announcement announcements={homeConfig.featuredAnnouncements} {loading} />
  </div>

  <div>
    <div class="bg-gradient-to-b from-purple-300 to-purple-50 rounded-lg p-4">
      <div class="mb-4">
        <h2 class="font-semibold text-xl md:text-3xl mb-4 text-gray-800">
          Explore
        </h2>
        <p>Explore our wide range of products</p>
      </div>
      <div class="w-full mb-4">
        {#if homeConfig.exploreProducts.length === 0 && loading}
          <Carousel disabled>
            {#each Array(3) as A, index}
              <div class="w-32 shrink-0">
                <ProductCardShimmer hidePrice hideWishlist />
              </div>
            {/each}
          </Carousel>
        {:else}
          <Carousel slideWidth={128} gap={16}>
            {#each homeConfig.exploreProducts as product}
              <div class="w-32 shrink-0">
                <ProductCard {product} hideWishlist hidePrice hideShare />
              </div>
            {/each}
          </Carousel>
        {/if}
      </div>

      <a
        href="/search"
        class="hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        Explore
      </a>
    </div>
    <!-- <div class="hidden bg-gradient-to-b from-purple-300 to-purple-50 rounded-lg p-4">
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
          class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-800 text-white hover:bg-purple-900 disabled:opacity-50 disabled:pointer-events-none"
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
        <Carousel disabled>
          {#each Array(4) as A, index}
            <div class=" w-48 md:w-64 shrink-0">
              <CollectionCardShimmer />
            </div>
          {/each}
        </Carousel>
      {:else}
        <Carousel gap={16}>
          {#each homeConfig.exploreCollections as collection}
            <div class="w-48 md:w-64 shrink-0">
              <CollectionCard {collection} />
            </div>
          {/each}
        </Carousel>
      {/if}
    </div>
  </section>

  <section>
    <h2 class="font-semibold text-xl md:text-3xl text-center mb-4">
      Best Sellers
    </h2>
    <div class="w-full">
      {#if homeConfig.bestSellerProducts.length === 0 && loading}
        <Carousel disabled>
          {#each Array(4) as A, index}
            <div class="w-48 md:w-64 shrink-0">
              <ProductCardShimmer />
            </div>
            <!-- <div
              class="rounded-lg bg-gray-200 w-24 h-24 md:w-48 md:h-32 lg:w-48 lg:h-48 shrink-0 animate-pulse"
            ></div> -->
          {/each}
        </Carousel>
      {:else}
        <Carousel gap={16}>
          {#each homeConfig.bestSellerProducts as product}
            <div class="w-48 md:w-64 shrink-0">
              <ProductCard {product} />
            </div>
          {/each}
        </Carousel>
      {/if}
    </div>
  </section>


  <section>
    <h2 class="font-semibold text-xl md:text-3xl text-center mb-4">
      New Arrivals
    </h2>
    <div class="w-full">
      {#if homeConfig.newArrivalProducts.length === 0 && loading}
        <Carousel disabled>
          {#each Array(4) as A, index}
            <div class="w-48 md:w-64 shrink-0">
              <ProductCardShimmer />
            </div>
          {/each}
        </Carousel>
      {:else}
        <Carousel gap={16}>
          {#each homeConfig.newArrivalProducts as product}
            <div class="w-48 md:w-64 shrink-0">
              <ProductCard {product} />
            </div>
          {/each}
        </Carousel>
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
          <Carousel disabled>
            {#each Array(4) as A, index}
              <div class="w-48 md:w-64 shrink-0">
                <ProductCardShimmer />
              </div>
            {/each}
          </Carousel>
        {:else}
          <Carousel gap={16}>
            {#each collection.products as product}
              <div class="w-48 md:w-64 shrink-0">
                <ProductCard {product} />
              </div>
            {/each}
          </Carousel>
        {/if}
      </div>
    </section>
  {/each}
  <!-- <div class="mb-4">
    <h1 class="font-semibold text-xl md:text-3xl text-center mb-4">New Designs</h1>
    <div class="grid grid-cols-5 gap-4 animate-pulse">
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
      <div class="rounded-lg bg-gray-200 h-auto aspect-square"></div>
    </div>
  </div> -->
</div>
