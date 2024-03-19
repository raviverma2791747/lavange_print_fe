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
  class="relative block rounded-lg hover:shadow-lg border border-gray-200 w-full overflow-hidden  p-2"
>
<div class="absolute bg-purple-500 text-white text-xs p-1 rounded-tr-lg rounded-br-lg top-0 left-0 mt-2">
 Collection
</div>
  <div class="aspect-square bg-gray-200 rounded-t-lg p-2 bg-white">
    <img
      class="object-cover object-center w-full h-full rounded-t-lg"
      src={collection.assetUrl}
      alt={collection.name}
    />
  </div>
  <div class="pb-4 px-2 pt-2">
    <div class="font-semibold text-sm grow truncate">
      {collection.name}
    </div>
  </div>
</a>
