<script>
  import HeartIcon from "./svg/HeartIcon.svelte";
  import HouseIcon from "./svg/HouseIcon.svelte";
  import SearchIcon from "./svg/SearchIcon.svelte";
  import ShoppingCartIcon from "./svg/ShoppingCartIcon.svelte";
  import UserIcon from "./svg/UserIcon.svelte";
</script>

<div class="fixed bottom-0 w-full z-50 bg-white shadow border-t border-gray-200 text-gray-600 md:hidden">
  <div class="flex justify-center gap-2">
    <div class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer">
      <SearchIcon class="h-6 w-6" />
      <div class="text-sm">Search</div>
    </div>
    <div class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer">
      <ShoppingCartIcon class="h-6 w-6" />
      <div class="text-sm">Cart</div>
    </div>
    <div class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer">
      <HouseIcon class="h-6 w-6" />
      <div class="text-sm">Home</div>
    </div>
    <div class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer">
      <HeartIcon class="h-6 w-6" />
      <div class="text-sm">Wishlist</div>
    </div>
    <div class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer">
      <UserIcon class="h-6 w-6" />
      <div class="text-sm">Log in</div>
    </div>
  </div>
</div>
