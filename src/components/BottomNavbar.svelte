<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { login_signup_modal_open, user_info_store } from "../helper/store";
  import HeartIcon from "./svg/HeartIcon.svelte";
  import HouseIcon from "./svg/HouseIcon.svelte";
  import SearchIcon from "./svg/SearchIcon.svelte";
  import ShoppingCartIcon from "./svg/ShoppingCartIcon.svelte";
  import UserIcon from "./svg/UserIcon.svelte";
</script>

<div
  class="fixed bottom-0 w-full z-50 bg-white shadow border-t border-gray-200 text-gray-600 md:hidden"
>
  <div class="flex justify-center gap-2">
    <a
      href="/search"
      class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer"
    >
      <SearchIcon class="h-6 w-6" />
      <div class="text-sm">Search</div>
    </a>
    <a
      href="/cart"
      class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer"
    >
      <ShoppingCartIcon class="h-6 w-6" />
      <div class="text-sm">Cart</div>
    </a>
    <a
      href="/"
      class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer"
    >
      <HouseIcon class="h-6 w-6" />
      <div class="text-sm">Home</div>
    </a>
    <a
      href="/wishlist"
      class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer"
    >
      <HeartIcon class="h-6 w-6" />
      <div class="text-sm">Wishlist</div>
    </a>
    <button
      on:click={() => {
        if (!$user_info_store) {
          $login_signup_modal_open = true;
        } else {
          goto("/account");
        }
      }}
      class="p-2 hover:text-purple-500 flex flex-col items-center cursor-pointer"
    >
      {#if $user_info_store}
        <div
          class="rounded-full w-6 h-6 bg-gray-600 text-white text-xs flex justify-center items-center"
        >
          <div>
            {$user_info_store?.firstName.charAt(0) +
              $user_info_store?.lastName.charAt(0)}
          </div>
        </div>
      {:else}
        <UserIcon class="h-6 w-6" />
      {/if}
      <div class="text-sm"> {#if $user_info_store} Account {:else} Log in {/if}</div>
    </button>
  </div>
</div>
