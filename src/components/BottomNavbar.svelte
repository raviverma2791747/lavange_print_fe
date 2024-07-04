<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import {
    cart_store,
    login_signup_modal_open,
    user_info_store,
    wishlist_store,
  } from "../helper/store";
  import HeartIcon from "./svg/HeartIcon.svelte";
  import HouseIcon from "./svg/HouseIcon.svelte";
  import SearchIcon from "./svg/SearchIcon.svelte";
  import ShoppingCartIcon from "./svg/ShoppingCartIcon.svelte";
  import UserIcon from "./svg/UserIcon.svelte";
  import { page } from "$app/stores";
  import ShoppingBagIcon from "./svg/ShoppingBagIcon.svelte";
  import { getAvatarName } from "../helper/utils";
</script>


<div class="h-16 md:hidden"></div>
<div
  class="h-16 fixed bottom-0 w-full z-[100] bg-white shadow border-t border-gray-200 text-gray-600 md:hidden"
>
  <div class="grid grid-cols-5 gap-2 sm:mx-8">
    <a
      href="/search"
      class="p-2 hover:text-primary-500 hover:bg-primary-50 flex flex-col items-center cursor-pointer"
      class:text-primary-500={$page.url.pathname === "/search"}
    >
      <SearchIcon class="h-6 w-6" />
      <div class="text-sm">Search</div>
    </a>
    <a
      href="/cart"
      class="p-2 hover:text-primary-500 hover:bg-primary-50 flex flex-col relative items-center cursor-pointer"
      class:text-primary-500={$page.url.pathname === "/cart"}
    >
      <ShoppingBagIcon class="h-6 w-6" />
      {#if $cart_store.length > 0}
        <div
          class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-0 end-0"
        >
          {#if $cart_store.reduce((a, b) => a + b.quantity, 0) > 9}
            9+
          {:else}
            {$cart_store.reduce((a, b) => a + b.quantity, 0)}
          {/if}
        </div>
      {/if}
      <div class="text-sm">Bag</div>
    </a>
    <a
      href="/"
      class:text-primary-500={$page.url.pathname === "/"}
      class="p-2 hover:text-primary-500 hover:bg-primary-50 flex flex-col items-center cursor-pointer"
    >
      <HouseIcon class="h-6 w-6" />
      <div class="text-sm">Home</div>
    </a>
    <a
      href="/wishlist"
      class:text-primary-500={$page.url.pathname === "wishlist"}
      class="p-2 hover:text-primary-500 hover:bg-primary-50 flex flex-col items-center cursor-pointer relative"
    >
      <HeartIcon class="h-6 w-6" />
      {#if $wishlist_store.length > 0}
      <div
        class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-0 end-0"
      >
        {#if $wishlist_store.length > 9}
          9+
        {:else}
          {$wishlist_store.length}
        {/if}
      </div>
    {/if}
      <div class="text-sm">Wishlist</div>
    </a>
    <button
      class:text-primary-500={$page.url.pathname === "/account"}
      on:click={() => {
        if (!$user_info_store) {
          $login_signup_modal_open = true;
        } else {
          goto("/account");
        }
      }}
      class="p-2 hover:text-primary-500 hover:bg-primary-50 flex flex-col items-center cursor-pointer"
    >
      {#if $user_info_store}
        <div
          class="rounded-full w-6 h-6 bg-gray-600 text-white text-xs flex justify-center items-center"
        >
          <div>
            {getAvatarName($user_info_store)}
          </div>
        </div>
      {:else}
        <UserIcon class="h-6 w-6" />
      {/if}
      <div class="text-sm">
        {#if $user_info_store}
          Account
        {:else}
          Log in
        {/if}
      </div>
    </button>
  </div>
</div>
