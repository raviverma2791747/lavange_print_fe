<script>
  //@ts-nocheck
  import HeartIcon from "./svg/HeartIcon.svelte";

  export let hidePrice = false;
  export let hideWishlist = false;
</script>

<a
  href="/"
  class="block rounded-lg bg-white hover:shadow-lg border border-gray-200 w-full"
>
  <div class="aspect-square bg-gray-200 rounded-t-lg animate-pulse"></div>
  <div class="pb-4 pt-2">
    <div class="flex px-2 mb-2">
      <div class="font-semibold text-sm grow truncate">
        <div class="bg-gray-200 animate-pulse rounded-lg w-6/12">&nbsp;</div>
      </div>
      {#if !hideWishlist}
        <div class="relative">
          <button class="position absolute top-0 right-0 z-50 text-gray-200">
            <HeartIcon />
          </button>
        </div>
      {/if}
    </div>
    <!-- <div class="text-sm text-gray-500 px-2">xyz</div> -->
    {#if !hidePrice}
      <div class="mx-2">
        <div class="w-3/12 bg-gray-200 animate-pulse rounded-lg">&nbsp;</div>
      </div>
    {/if}
  </div>
</a>
