<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";
  import ChevronRight from "./svg/ChevronRight.svelte";
  import ChevronLeft from "./svg/ChevronLeft.svelte";
  const dispatch = createEventDispatcher();
  export let count = 10;
  export let current = 1;

  const getAdjacent = (current) => {
    if (count < 4) {
      return [1, 2, 3];
    }

    if (current === 1) {
      return [1, 2, 3];
    }

    if (current === count) {
      return [count - 2, count - 1, count];
    }

    return [current - 1, current, current + 1];
  };
</script>

<div class="flex items-center gap-2 w-fit">
  <button
    class="border cursor-pointer bg-primary-500 text-white rounded-lg w-10 h-10 flex justify-center items-center disabled:opacity-75 disabled:pointer-events-none"
    on:click={() => {
      dispatch("prev");
      current = current - 1;
    }}
    disabled={current === 1}
  >
    <ChevronLeft />
  </button>
  {#if count >= 4 && current > 2}
    <button
      class="border cursor-pointer border-grey-300 rounded-lg w-10 h-10 flex justify-center items-center hover:bg-primary-50 hover:border-primary-500 hover:text-primary-500"
      on:click={() => {
        dispatch("select", 1);
        current = 1;
      }}
    >
      1
    </button>
    <div class="w-10 h-10 flex justify-center items-center font-semibold">
      ...
    </div>
  {/if}
  {#each getAdjacent(current) as item, i}
    <button
      class="border cursor-pointer border-grey-300 rounded-lg w-10 h-10 flex justify-center items-center hover:bg-primary-50 hover:border-primary-500 hover:text-primary-500"
      class:bg-primary-50={current === item}
      class:border-primary-500={current === item}
      class:text-primary-500={current === item}
      on:click={() => {
        dispatch("select", item);
        current = item;
      }}
    >
      {item}
    </button>
  {/each}
  {#if count >= 4 && current < count - 1}
    <div class="w-10 h-10 flex justify-center items-center font-semibold">
      ...
    </div>
    <button
      class="border cursor-pointer border-grey-300 rounded-lg w-10 h-10 flex justify-center items-center hover:bg-primary-50 hover:border-primary-500 hover:text-primary-500"
      on:click={() => {
        dispatch("select", count);
        current = count;
      }}
    >
      {count}
    </button>
  {/if}
  <button
    class="border cursor-pointer bg-primary-500 text-white rounded-lg w-10 h-10 flex justify-center items-center disabled:opacity-75 disabled:pointer-events-none"
    on:click={() => {
      dispatch("next");
      current = current + 1;
    }}
    disabled={current === count}
  >
    <ChevronRight />
  </button>
</div>
