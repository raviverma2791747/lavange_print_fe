<script>
  //@ts-nocheck
  export let count;
  let arr = Array(count);
</script>

<div class="mb-4">
  {#each arr as A, index}
    <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
      &nbsp;
    </div>
    {#if index < arr.length - 1}
      /
    {/if}
  {/each}
</div>
