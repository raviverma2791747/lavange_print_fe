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
    user_info_store,
    wishlist_store,
    cart_store,
    header_title_store,
  } from "../helper/store";
  import SearchIcon from "./svg/SearchIcon.svelte";
  import SliderIcon from "./svg/SliderIcon.svelte";
  import { page } from "$app/stores";
  import ChevronLeft from "./svg/ChevronLeft.svelte";
  import { PUBLIC_BRAND_NAME } from "$env/static/public";
  import ShoppingBagIcon from "./svg/ShoppingBagIcon.svelte";
  import { getAvatarName } from "../helper/utils";
  import { httpClient } from "../helper/httpClient";
  import { userLogout } from "../helper/endpoints";

  let hidden = false;
  let innnerWidth;
  let search_input;

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

  const logout = async () => {
    const response = await httpClient(userLogout, {
      method: "POST",
    });

    if (response.status === 200) {
      user_info_store.set(null);
      wishlist_store.set([]);
      cart_store.set([]);
    }
  };
</script>

<svelte:window bind:innerWidth={innnerWidth} />

<header class="border-b border-gray-200 sticky top-0 bg-white z-50 h-16">
  <div
    class:hidden
    class="max-w-7xl mx-auto flex items-center py-2 px-4 7xl:px-0 gap-4"
  >
    <div class="hidden md:block">
      <a class="flex-none text-xl font-semibold" href="/">
        {PUBLIC_BRAND_NAME}</a
      >
    </div>
    <div class="grow">
      <div class="lg:w-4/12 mx-auto relative">
        <input
          bind:this={search_input}
          type="text"
          placeholder="Search"
          value={$page.url.searchParams.get("q")}
          class="w-full py-3 pe-10 px-4 block border border-gray-200 rounded-full text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
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
      <button class="text-gray-600 hover:text-primary-500">
        <SliderIcon />
      </button>
    </div>
    <div class="hidden md:flex gap-4 items-center">
      <Dropdown
        class="inline-flex"
        triggerClass="hover:text-primary-500 text-gray-600 relative py-2"
      >
        <svelte:fragment slot="trigger">
          <ShoppingBagIcon />
          {#if $cart_store.length > 0}
            <div
              class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-4"
            >
              {#if $cart_store.reduce((a, b) => a + b.quantity, 0) > 9}
                9+
              {:else}
                {$cart_store.reduce((a, b) => a + b.quantity, 0)}
              {/if}
            </div>
          {/if}
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
                href={`/product/${cart_item.product.slug}`}
              >
                <div class="w-16">
                  {#if cart_item.product.assets.length}
                    <img
                      class="aspect-square object-cover rounded-lg"
                      src={cart_item.product.assets[0].url}
                      alt={cart_item.product.title}
                    />
                  {:else}
                    <div class="aspect-square bg-gray-300 rounded-lg"></div>
                  {/if}
                </div>
                <div class="grow">
                  <h1 class="font-semibold">{cart_item.product.title}</h1>
                  <div class="flex gap-2 flex-wrap">
                    {#if cart_item.variant && cart_item.product.variants && cart_item.product.variants.find((v) => v._id === cart_item.variant)}
                      {#each Object.entries(cart_item.product.variants.find((v) => v._id === cart_item.variant).attributes).map( (a) => {
                          return cart_item.product.variantOptions
                            .find((v) => v.name === a[0])
                            .options.find((o) => o.value === a[1]).displayName;
                        } ) as attribute}
                        <div
                          class="border border-primary-500 text-primary-500 bg-primary-200 px-2 rounded-lg"
                        >
                          {attribute}
                        </div>
                      {/each}
                    {/if}
                  </div>
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
        triggerClass="hover:text-primary-500 text-gray-600 relative py-2"
      >
        <svelte:fragment slot="trigger">
          <HeartIcon />
          {#if $wishlist_store.length > 0}
            <div
              class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-4"
            >
              {#if $wishlist_store.length > 9}
                9+
              {:else}
                {$wishlist_store.length}
              {/if}
            </div>
          {/if}
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
                href={`/product/${product.slug}`}
              >
                <div class="w-16">
                  {#if product.assets.length}
                    <img
                      class="aspect-square object-cover rounded-lg"
                      src={product.assets[0].url}
                      alt={product.title}
                    />
                  {:else}
                    <div class="aspect-square bg-gray-300 rounded-lg"></div>
                  {/if}
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
        triggerClass="text-gray-600 flex gap-2 py-2 px-3 border border-gray-200 rounded-full hover:shadow"
      >
        <svelte:fragment slot="trigger">
          <MenuIcon />

          {#if $user_info_store}
            <div
              class="rounded-full w-6 h-6 bg-gray-600 text-white text-xs flex justify-center items-center"
            >
              <div>
                {getAvatarName($user_info_store)}
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
              on:click={logout}
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
