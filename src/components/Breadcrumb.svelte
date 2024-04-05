<script>
  //@ts-nocheck
  export let routes = [];
</script>

<div class="mb-4">
  {#each routes as route, index}
    <a class="hover:text-primary-500" href={route.path}>{route.name}</a>&nbsp;
    {#if index < routes.length - 1}
      /&nbsp;
    {/if}
  {/each}
</div>
