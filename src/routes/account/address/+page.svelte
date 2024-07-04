<script>
  //@ts-nocheck
  import Address from "../../../components/account/Address.svelte";
  import PlusIcon from "../../../components/svg/PlusIcon.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { getUserInfo } from "../../../helper/endpoints";
  import {
    authenticating_store,
    header_title_store,
    login_signup_modal_open,
    user_info_store,
  } from "../../../helper/store";
  import BreadcrumbShimmer from "../../../components/BreadcrumbShimmer.svelte";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";
  import { goto } from "$app/navigation";
  import LoginSpinner from "../../../components/LoginSpinner.svelte";
  import BarricadeIcon from "../../../components/svg/BarricadeIcon.svelte";

  let loading = false;
  const initUserInfo = async () => {
    authenticating_store.set(true);
    const response = await httpClient(getUserInfo);

    if (response.status === 200) {
      user_info_store.set(response.data.user);
    } else {
    }
    authenticating_store.set(false);
  };

  $: {
    $header_title_store = "Address";
  }

  $: {
    if (!$user_info_store && !$authenticating_store) {
      goto("/");
    }
  }
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 py-2">
    {#if loading}
      <BreadcrumbShimmer count={2} />
    {:else}
      <Breadcrumb
        routes={[
          {
            name: "Account",
            path: "/account",
          },
          {
            name: "Address",
            path: "/account/address",
          },
        ]}
      />
    {/if}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <a
        href="/account/address/create"
        class="text-gray-800 border-2 border-dashed border-gray-200 rounded-lg flex justify-center items-center aspect-[4/2] sm:aspect-square"
      >
        <div class="flex flex-col justify-center items-center">
          <PlusIcon class="h-8 w-8" />
          <div>Add Address</div>
        </div>
      </a>
      {#each $user_info_store.addresses as address}
        <div class="aspect-[4/2] sm:aspect-square">
          <Address {address} on:remove={initUserInfo} />
        </div>
      {/each}
    </div>
  </div>
{:else if !$user_info_store && $authenticating_store}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 py-2 min-h-[calc(100vh-64px)] flex"
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
