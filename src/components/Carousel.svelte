<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import ChevronLeft from "./svg/ChevronLeft.svelte";
  import ChevronRight from "./svg/ChevronRight.svelte";

  export let gap = 0;
  export let slideWidth = 0;
  export let disabled = false;
  let carousel;
  let showLeft = false;
  let showRight = false;
  let xLeft = 0;
  let xScroll = 0;
  let xWidth = 0;
  let yTop = 0;
  let yScroll = 0;
  let yHeight = 0;
  let xOffset = 0;

  function parseScroll() {
    xLeft = carousel.scrollLeft;
    xScroll = carousel.scrollWidth;
    xWidth = carousel.clientWidth;
    yTop = carousel.scrollTop;
    yHeight = carousel.clientHeight;
    yScroll = carousel.scrollHeight;
    xOffset = carousel.offsetWidth;
  }

  const slideLeft = () => {
    if (carousel) {
      carousel.scrollLeft -= slideWidth + gap;
    }
  };

  const slideRight = () => {
    if (carousel) {
      carousel.scrollLeft += slideWidth + gap;
    }
  };

  onMount(() => parseScroll());

  $: {
    showLeft = !(xLeft > 0);
  }

  $: {
    showRight = !(xLeft < xScroll - xOffset - gap);
  }

  $: {
    if (carousel) {
      try {
        slideWidth = carousel.children[0].offsetWidth;
      } catch (error) {}
    }
  }
</script>

<div class="relative w-full">
  <div
    class="flex max-w-full gap-4 flex-nowrap overflow-scroll no-scrollbar scroll-smooth"
    bind:this={carousel}
    on:scroll={parseScroll}
    on:mousemove={parseScroll}
  >
    <slot />
  </div>
  <button
    on:click={slideLeft}
    class="ml-2 absolute top-0 z-20 left-0 flex items-center h-full cursor-pointer"
    class:hidden={showLeft || disabled}
  >
    <div class="bg-white rounded-full shadow">
      <ChevronLeft class="h-6 w-6  md:h-8 md:w-8" />
    </div>
  </button>
  <button
    class="mr-2 absolute top-0 z-20 right-0 flex items-center h-full cursor-pointer"
    class:hidden={showRight || disabled}
    on:click={slideRight}
  >
    <div class="bg-white rounded-full shadow">
      <ChevronRight class="h-6 w-6  md:h-8 md:w-8" />
    </div>
  </button>
</div>
