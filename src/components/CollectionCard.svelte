<script>
  //@ts-nocheck
  import { formatCurrency } from "../helper/utils";
  import HeartIcon from "./svg/HeartIcon.svelte";

  export let collection;
  let class_ = "";
  export { class_ as class };
</script>

<a
  href={`/collection/${collection.slug}`}
  class="relative block rounded-lg w-full overflow-hidden"
>
  <!-- <div
    class="absolute bg-primary-500 text-white text-xs p-1 rounded-tr-lg rounded-br-lg top-0 left-0 mt-2"
  >
    Collection
  </div> -->
  <div class=" bg-gray-200 rounded-full aspect-square border-gray-200 border hover:border-primary-200  overflow-hidden">
    {#if collection.asset}
      <img
        class="object-cover object-center w-full h-full bg-white"
        src={collection.asset.url}
        alt={collection.name}
      />
    {/if}
  </div>
  <div class="pb-4 px-2 pt-2">
    <div class="text-center font-semibold text-base grow truncate hover:text-primary-500">
      {collection.name}
    </div>
  </div>
</a>
