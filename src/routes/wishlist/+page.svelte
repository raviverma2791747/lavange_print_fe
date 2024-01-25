<script>
  //@ts-nocheck
  import { wishlist_store } from "../../helper/store";
</script>

{#if $wishlist_store.length > 0}
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0">
    <h1 class="font-semibold text-3xl text-center mb-4 capitalize">
        Wishlist
      </h1>
    {#each $wishlist_store as product}
      <a
        class="w-full p-2 flex gap-2 cursor-pointer hover:bg-gray-200"
        href={`/product/${product._id}`}
      >
        <div class="w-16">
          <img
            class="aspect-square object-cover rounded-lg"
            src={product.assets[0].url}
            alt={product.title}
          />
        </div>
        <div class="grow">
          <h1 class="font-semibold">{product.title}</h1>
        </div>
      </a>
    {/each}
  </div>
{:else}
  <h1>No product in wishlist</h1>
{/if}
