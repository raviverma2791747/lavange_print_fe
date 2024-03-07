<script>
  //@ts-nocheck
  import Carousel from "../Carousel.svelte";
  import ChevronLeft from "../svg/ChevronLeft.svelte";
  import ChevronRight from "../svg/ChevronRight.svelte";

  export let categories = [];
  export let loading = true;
</script>

{#if loading}
  <Carousel gap={8} disabled>
    {#each Array(10) as A}
      <div class="bg-gray-200 w-[110px] animate-pulse rounded-lg shrink-0">&nbsp;</div>
    {/each}
  </Carousel>
{:else}
  <div class="relative">
    <div class="flex gap-2">
      {#each categories as category}
        <a href={`/category/${category.slug}`} class="font-bold">
          {category.name}
        </a>
      {/each}
    </div>
    <!-- <button class="absolute left-0 bg-white rounded-full shadow">
      <ChevronLeft />
    </button>
    <button class="absolute right-0 bg-white rounded-full shadow">
      <ChevronRight />
    </button> -->
  </div>
{/if}
