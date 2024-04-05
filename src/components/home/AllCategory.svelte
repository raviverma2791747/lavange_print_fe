<script>
  //@ts-nocheck
  import "@splidejs/svelte-splide/css";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import ChevronLeft from "../svg/ChevronLeft.svelte";
  import ChevronRight from "../svg/ChevronRight.svelte";

  export let categories = [];
  export let loading = true;

  const slideOptions = {
    gap: "0.75rem",
    pagination: false,
    arrows: false,
    autoWidth: true,
    autoplay: true,
    rewind: true,
    // breakpoints: {
    //   1024: {
    //     perMove: 1,
    //     perPage: 6,
    //     gap: ".7rem",
    //     autoplay: true,
    //   },
    //   768: {
    //     perPage: 5,
    //     gap: ".7rem",
    //     autoplay: true,
    //   },
    //   640: {
    //     perPage: 4,
    //     gap: ".7rem",
    //     autoplay: true,
    //   },
    //   480: {
    //     perPage: 3,
    //     gap: ".7rem",
    //     autoplay: true,
    //   },
    // },
  };
</script>

{#if loading}
  <Splide options={slideOptions}>
    {#each Array(10) as A}
      <SplideSlide>
        <div class="bg-gray-200 animate-pulse w-[110px] rounded-lg">&nbsp;</div>
      </SplideSlide>
    {/each}
  </Splide>
{:else}
  <Splide options={slideOptions}>
    {#each categories as category}
      <SplideSlide>
        <a href={`/category/${category.slug}`} class="font-semibold uppercase hover:text-primary-500">
          {category.name}
        </a>
      </SplideSlide>
    {/each}

    <!-- <div class="splide__arrows">
      <button class="splide__arrow splide__arrow--prev "
        ><ChevronLeft />
      </button>
      <button class="splide__arrow splide__arrow--next "><ChevronRight /></button
      >
    </div> -->
  </Splide>
  <!-- <button class="absolute left-0 bg-white rounded-full shadow">
      <ChevronLeft />
    </button>
    <button class="absolute right-0 bg-white rounded-full shadow">
      <ChevronRight />
    </button> -->
{/if}
