<script>
  //@ts-nocheck
  import "@splidejs/svelte-splide/css";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import ChevronLeft from "../svg/ChevronLeft.svelte";
  import ChevronRight from "../svg/ChevronRight.svelte";

  export let announcements = [];
  export let loading = true;
  const slideOptions = {
    perPage: 3,
    gap: "1rem",
    autoplay: true,
    rewind: true,
    // focus  : 'center',
    breakpoints: {
      1024: {
        perPage: 2,
        gap: ".7rem",
      },
      768: {
        perPage: 2,
        gap: ".7rem",
      },
      640: {
        perPage: 1,
        gap: ".7rem",
      },
      480: {
        perPage: 1,
        gap: ".7rem",
      },
    },
  };

  // let active_slide = 0;

  // const slideRight = () => {
  //   if (active_slide < announcements.length - 1) {
  //     active_slide += 1;
  //   }
  // };

  // const slideLeft = () => {
  //   if (active_slide > 0) {
  //     active_slide -= 1;
  //   }
  // };

  // setInterval(() => {
  //   active_slide = (active_slide + 1) % announcements.length;
  // }, 5000);
</script>

<div>
  {#if loading}
    <Splide options={slideOptions}>
      {#each { length: 3 } as A}
        <SplideSlide>
          <div
            class="transition duration-1000 ease-in-out bg-gray-200 h-64 animate-pulse"
          ></div>
        </SplideSlide>
      {/each}
    </Splide>
  {:else}
    <Splide options={slideOptions}>
      {#each announcements as announcement, index}
        <SplideSlide>
          <a href={announcement.ctaUrl}>
            {#if announcement.asset}
              <img
                src={announcement.asset.url}
                alt={announcement.title}
                class="transition duration-1000 ease-in-out bg-gray-400 h-64 object-cover object-center w-full rounded-lg"
              />
            {:else}
              <div
                class="transition duration-1000 ease-in-out bg-gray-400 h-64 w-full rounded-lg"
              ></div>
            {/if}
          </a>
        </SplideSlide>
      {/each}
    </Splide>
  {/if}
</div>
