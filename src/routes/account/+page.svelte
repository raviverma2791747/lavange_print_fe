<script>
  //@ts-nocheck
  import UserIcon from "../../components/svg/UserIcon.svelte";
  import AddressIcon from "../../components/svg/AddressIcon.svelte";
  import ShieldIcon from "../../components/svg/ShieldIcon.svelte";
  import {
    user_info_store,
    wishlist_store,
    cart_store,
    header_title_store,
    authenticating_store,
    login_signup_modal_open,
  } from "../../../src/helper/store";
  import { order_cache } from "../../helper/cache_store";
  import PowerIcon from "../../components/svg/PowerIcon.svelte";
  import PackageIcon from "../../components/svg/PackageIcon.svelte";
  import ChevronRight from "../../components/svg/ChevronRight.svelte";
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";
  import { httpClient } from "../../helper/httpClient";
  import { userLogout } from "../../helper/endpoints";
  import HeartIcon from "../../components/svg/HeartIcon.svelte";
  import ShoppingBagIcon from "../../components/svg/ShoppingBagIcon.svelte";
  import { goto } from "$app/navigation";
  import ChatsIcon from "../../components/svg/ChatsIcon.svelte";
  import LoginSpinner from "../../components/LoginSpinner.svelte";
  import BarricadeIcon from "../../components/svg/BarricadeIcon.svelte";

  let loading = false;
  $: {
    $header_title_store = "Account";
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

  $: {
    if (!$user_info_store && !$authenticating_store) {
      goto("/");
    }
  }
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 pt-4">
    {#if loading}
      <BreadcrumbShimmer count={1} />
    {:else}
      <Breadcrumb
        routes={[
          {
            name: "Account",
            path: "/account",
          },
        ]}
      />
    {/if}
    <!-- <h1 class="hidden md:block  font-semibold text-xl md:text-3xl text-center mb-4">Account</h1> -->
    <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      <a
        href="/account/personal-info"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <UserIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Personal Info</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </a>
      <a
        href="/account/address"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <AddressIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Address</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </a>
      <a
        href="/account/login-and-security"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <ShieldIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Login & Security</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </a>
      <a
        href="/order"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <PackageIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Orders</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </a>
      <a
        href="/cart"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <ShoppingBagIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Cart</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </a>
      <a
        href="/wishlist"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <HeartIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Wishlist</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </a>
      <a
        href="/help"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <ChatsIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Help & Support</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </a>
      <button
        on:click={logout}
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] hover:text-primary-500 hover:bg-primary-50 border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="w-full flex justify-between md:flex-col md:items-center">
          <div class="hidden md:block">
            <PowerIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Logout</div>
          <div class="md:hidden">
            <ChevronRight />
          </div>
        </div>
      </button>
    </div>
  </div>
{:else if !$user_info_store && $authenticating_store}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 pt-4 min-h-[calc(100vh-64px)] flex"
  >
    <div class="flex items-center justify-center grow">
      <div class="flex flex-col items-center">
        <LoginSpinner />
        <div>Please wait while we log you in...</div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 pt-4 min-h-[calc(100vh-64px)] flex"
  >
    <div class="flex items-center justify-center grow">
      <div class="flex flex-col items-center">
        <BarricadeIcon class="h-16 w-16" />
        <div class="mb-4">Please login to view your account details</div>
        <button
          class="w-full sm:w-fit hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
          on:click={() => {
            goto("/");
            $login_signup_modal_open = true;
          }}>Continue to Login</button
        >
      </div>
    </div>
  </div>
{/if}
