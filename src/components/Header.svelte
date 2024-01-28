<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import Dropdown from "./Dropdown.svelte";
  import ShoppingCartIcon from "./svg/ShoppingCartIcon.svelte";
  import MenuIcon from "./svg/MenuIcon.svelte";
  import UserIcon from "./svg/UserIcon.svelte";
  import HeartIcon from "./svg/HeartIcon.svelte";
  import {
    login_signup_modal_open,
    token_store,
    user_info_store,
    wishlist_store,
    cart_store,
    header_title_store,
  } from "../helper/store";
  import SearchIcon from "./svg/SearchIcon.svelte";
  import SliderIcon from "./svg/SliderIcon.svelte";
  import { page } from "$app/stores";
  import ChevronLeft from "./svg/ChevronLeft.svelte";

  let hidden = false;
  let innnerWidth;

  $: {
    if (innnerWidth < 768) {
      if ($page.url.pathname === "/search" || $page.url.pathname === "/") {
        hidden = false;
      } else {
        hidden = true;
      }
    } else {
      hidden = false;
    }
  }
</script>

<svelte:window bind:innerWidth={innnerWidth} />

<header class="border-b border-gray-200 sticky top-0 bg-white z-50">
  <div
    class:hidden={hidden}
    class="max-w-7xl mx-auto flex items-center py-2 px-4 7xl:px-0 gap-4"
  >
    <div class="hidden md:block">
      <a class="flex-none text-xl font-semibold" href="/"> Brand</a>
    </div>
    <div class="grow">
      <div class="lg:w-4/12 mx-auto relative">
        <input
          type="text"
          placeholder="Search"
          class="w-full py-3 pe-10 px-4 block border border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          on:keypress={(e) => {
            if (e.key === "Enter") {
              if (e.target.value) {
                goto(`/search?q=${e.target.value}`);
              } else {
                goto("/search");
              }
            }
          }}
        />
        <div
          class="absolute right-0 top-0 bottom-0 text-gray-400 flex items-center pe-2"
        >
          <SearchIcon />
        </div>
      </div>
    </div>
    <div class="md:hidden">
      <button class="text-gray-600 hover:text-purple-500">
        <SliderIcon />
      </button>
    </div>
    <div class="hidden md:flex gap-4">
      <Dropdown
        class="inline-flex"
        triggerClass="hover:text-purple-500 text-gray-600"
      >
        <svelte:fragment slot="trigger">
          <ShoppingCartIcon />
        </svelte:fragment>
        <div
          slot="menu"
          class="min-w-[20rem] bg-white shadow-md rounded-lg py-2 mt-2"
        >
          {#if !$user_info_store}
            <p class="px-4 py-2">Please sign in to view your cart</p>
          {:else if $cart_store.length === 0}
            <p class="px-4 py-2 text-center">Your cart is empty</p>
          {:else}
            {#each $cart_store.slice(0, 3) as cart_item}
              <a
                class="w-full p-2 flex gap-2 cursor-pointer hover:bg-gray-200"
                href={`/product/${cart_item.product._id}`}
              >
                <div class="w-16">
                  <img
                    class="aspect-square object-cover rounded-lg"
                    src={cart_item.product.assets[0].url}
                    alt={cart_item.product.title}
                  />
                </div>
                <div class="grow">
                  <h1 class="font-semibold">{cart_item.product.title}</h1>
                  <p>Quantity {cart_item.quantity}</p>
                </div>
              </a>
            {/each}
            <a
              href="/cart"
              class="block w-full p-2 cursor-pointer hover:bg-gray-200 text-center underline"
            >
              View All
            </a>
          {/if}
        </div>
      </Dropdown>
      <Dropdown
        class="inline-flex"
        triggerClass="hover:text-purple-500 text-gray-600"
      >
        <svelte:fragment slot="trigger">
          <HeartIcon />
        </svelte:fragment>
        <div
          slot="menu"
          class="min-w-[20rem] bg-white shadow-md rounded-lg py-2 mt-2"
        >
          {#if !$user_info_store}
            <p class="px-4 py-2">Please sign in to view your wishlist</p>
          {:else if $wishlist_store.length === 0}
            <p class="px-4 py-2 text-center">Your wishlist is empty</p>
          {:else}
            {#each $wishlist_store.slice(0, 3) as product}
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
            <a
              href="/wishlist"
              class="block w-full p-2 cursor-pointer hover:bg-gray-200 text-center underline"
            >
              View All
            </a>
          {/if}
        </div>
      </Dropdown>
      <Dropdown
        class="inline-flex"
        triggerClass="text-gray-600 flex gap-2 p-3 border border-gray-200 rounded-full hover:shadow"
      >
        <svelte:fragment slot="trigger">
          <MenuIcon />

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
            <UserIcon />
          {/if}
        </svelte:fragment>
        <div
          slot="menu"
          class="min-w-[10rem] bg-white shadow-md rounded-lg py-2 mt-2"
        >
          {#if $user_info_store}
            <button
              class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              on:click={() => {
                goto("/account");
              }}
            >
              Account
            </button>
            <button
              class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              on:click={() => {
                goto("/order");
              }}
            >
              Orders
            </button>
            <button
              class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              on:click={() => {
                token_store.set(null);
                user_info_store.set(null);
                wishlist_store.set([]);
                cart_store.set([]);
                localStorage.removeItem("token");
              }}
            >
              Logout
            </button>
          {:else}
            <button
              class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              on:click={() => {
                login_signup_modal_open.set(true);
              }}
            >
              Sign up
            </button>
            <button
              data-hs-overlay="#hs-slide-up-animation-modal"
              class="flex items-center w-full gap-x-3.5 py-2 px-3 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              on:click={() => {
                login_signup_modal_open.set(true);
              }}
            >
              Login
            </button>
          {/if}
        </div>
      </Dropdown>
    </div>
  </div>

  <div
    class:hidden={!hidden}
    class="max-w-7xl mx-auto px-4 py-[15.2px] 7xl:px-0 flex items-center"
  >
    <button>
      <ChevronLeft class="text-gray-600 w-8 h-8" />
    </button>
    <div class="grow text-xl font-semibold text-center">
      {$header_title_store}
    </div>
  </div>
</header>
