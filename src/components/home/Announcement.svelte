<script>
  //@ts-nocheck
  import ChevronLeft from "../svg/ChevronLeft.svelte";
  import ChevronRight from "../svg/ChevronRight.svelte";

  export let announcements = [];
  export let loading = true;

  let active_slide = 0;

  const slideRight = () => {
    if (active_slide < announcements.length - 1) {
      active_slide += 1;
    }
  };

  const slideLeft = () => {
    if (active_slide > 0) {
      active_slide -= 1;
    }
  };

  setInterval(() => {
    active_slide = (active_slide + 1) % announcements.length;
  }, 5000);
</script>

<div class="relative w-full">
  <div class="relative overflow-hidden rounded-lg">
    {#if loading}
      <div
        class="transition duration-1000 ease-in-out bg-gray-200 h-64 animate-pulse"
      ></div>
    {:else}
      {#each announcements as announcement, index}
        <a href={announcement.ctaUrl}>
          {#if announcement.asset}
          <img
            src={announcement.asset.url}
            alt={announcement.title}
            class="transition duration-1000 ease-in-out bg-gray-400 h-64 object-cover"
            class:hidden={active_slide !== index}
          />
          {:else}
          <div
            class="transition duration-1000 ease-in-out bg-gray-400 h-64"
            class:hidden={active_slide !== index}
          ></div>
          {/if}
        </a>
      {/each}
    {/if}
  </div>

  <button
    on:click={slideLeft}
    class="ml-2 absolute top-0 z-20 left-0 flex items-center h-full cursor-pointer"
    class:hidden={active_slide === 0}
  >
    <div class="bg-white rounded-full">
      <ChevronLeft class="h-8 w-8" />
    </div>
  </button>
  <button
    on:click={slideRight}
    class="mr-2 absolute top-0 z-20 right-0 flex items-center h-full cursor-pointer"
    class:hidden={active_slide === announcements.length - 1}
  >
    <div class="bg-white rounded-full">
      <ChevronRight class="h-8 w-8" />
    </div>
  </button>
</div>
