<script>
    //@ts-nocheck
    import { formatCurrency } from "../helper/utils";
    import HeartIcon from "./svg/HeartIcon.svelte";
  
    export let category;
    let class_ = "";
    export { class_ as class };
  </script>
  
  <a
    href={`/category/${category.slug}`}
    class="relative block rounded-lg hover:shadow-lg w-full overflow-hidden"
  >
    <div
      class="absolute bg-primary-500 text-white text-xs p-1 rounded-tr-lg rounded-br-lg top-0 left-0 mt-2"
    >
      category
    </div>
    <div class="aspect-square bg-gray-200 rounded-t-lg ">
      {#if category.asset}
        <img
          class="object-cover object-center w-full h-full rounded-t-lg bg-white"
          src={category.asset.url}
          alt={category.name}
        />
      {/if}
    </div>
    <div class="pb-4 px-2 pt-2">
      <div class="font-semibold text-sm grow truncate">
        {category.name}
      </div>
    </div>
  </a>
  