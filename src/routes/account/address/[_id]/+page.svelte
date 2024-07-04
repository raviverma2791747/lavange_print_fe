<script>
  //@ts-nocheck
  import state_list from "../../../../helper/state_list";
  import { httpClient } from "../../../../helper/httpClient";
  import { page } from "$app/stores";
  import {
    getUserAddress,
    getUserInfo,
    updateUserAddress,
  } from "../../../../helper/endpoints";
  import {
    authenticating_store,
    login_signup_modal_open,
    user_info_store,
  } from "../../../../helper/store";
  import { ADDRESS_TYPE } from "../../../../helper/constants";
  import { goto } from "$app/navigation";
  import BreadcrumbShimmer from "../../../../components/BreadcrumbShimmer.svelte";
  import Breadcrumb from "../../../../components/Breadcrumb.svelte";
  import LoginSpinner from "../../../../components/LoginSpinner.svelte";
  import BarricadeIcon from "../../../../components/svg/BarricadeIcon.svelte";

  let loading = false;
  let enable_save = false;
  let address = {
    fullName: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: state_list[0],
    pincode: "",
    country: "India",
    type: ADDRESS_TYPE.HOME,
  };

  const initAddress = async (address_id) => {
    loading = true;
    const response = await httpClient(`${getUserAddress}/${address_id}`, {
      method: "GET",
    });
    if (response.status === 200) {
      address = response.data.address;
      loading = false;
    }
  };

  const initUserInfo = async () => {
    authenticating_store.set(true);
    const response = await httpClient(getUserInfo);

    if (response.status === 200) {
      $user_info_store = response.data.user;
    } else {
      // token.set(null);
      $user_info_store = null;
    }
    authenticating_store.set(false);
  };

  const validate = (address) => {
    if (
      !address.fullName ||
      !address.mobile ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.pincode ||
      !address.country ||
      !(
        address.type === ADDRESS_TYPE.HOME ||
        address.type === ADDRESS_TYPE.OFFICE
      )
    ) {
      return false;
    }

    // if (address.mobile.length != 10) {
    //   return false;
    // }

    // if (address.pincode.length != 6) {
    //   return false;
    // }
    return true;
  };

  const handleSave = async () => {
    loading = true;
    if (!validate()) {
      loading = false;
      return;
    }

    const response = await httpClient(updateUserAddress, {
      method: "POST",
      payload: address,
    });

    if (response.status === 200) {
      await initUserInfo();
      goto("/account/address");
    }

    loading = false;
  };

  $: {
    enable_save = validate(address);
  }

  $: {
    if ($page.params._id !== "create" && $user_info_store) {
      initAddress($page.params._id);
    } else if (!$user_info_store && !$authenticating_store) {
      goto("/");
    } else {
      loading = false;
    }
  }
</script>

{#if $user_info_store}
  <div class="bg-white max-w-xl mx-auto px-4 xl:px-0 mb-24 pt-4">
    {#if loading}
      <BreadcrumbShimmer count={3} />
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
          {
            name:
              $page.params._id === "create" ? "New Address" : "Edit Address",
            path:
              $page.params._id === "create"
                ? "/account/address/create"
                : `/account/address/${$page.params._id}`,
          },
        ]}
      />
    {/if}

    <!-- <h1 class="font-semibold text-3xl text-center mb-4">Add a new address</h1> -->
    <div class="mb-4">
      <label for="country" class="block text-sm font-semibold mb-2"
        >Country</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}
        <input
          name="country"
          type="text"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.country}
          placeholder="Country"
          disabled={true}
        />
      {/if}
    </div>
    <div class="mb-4">
      <label for="fullName" class="block text-sm font-semibold mb-2"
        >Full name (First and Last name)</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}
        <input
          name="fullName"
          type="text"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.fullName}
          placeholder="Full name (First and Last name)"
        />
      {/if}
    </div>
    <div class="mb-4">
      <label for="fullName" class="block text-sm font-semibold mb-2"
        >Mobile Number</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}
        <input
          name="mobile"
          type="number"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.mobile}
          placeholder="Mobile Number"
        />{/if}
    </div>
    <div class="mb-4">
      <label for="type" class="block text-sm font-semibold mb-2"> Type </label>
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}
        <select
          name="type"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.type}
        >
          {#each Object.entries(ADDRESS_TYPE) as [key, value]}
            <option {value}>{key}</option>
          {/each}
        </select>
      {/if}
    </div>
    <div class="mb-4">
      <label for="pincode" class="block text-sm font-semibold mb-2"
        >Pincode</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}<input
          name="pincode"
          type="number"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.pincode}
          placeholder="Pincode"
        />{/if}
    </div>
    <div class="mb-4">
      <label for="fullName" class="block text-sm font-semibold mb-2"
        >Flat, House no., Building, Company, Apartment</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}<input
          name="addressLine1"
          type="text"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.addressLine1}
          placeholder="Flat, House no., Building, Company, Apartment"
        />{/if}
    </div>
    <div class="mb-4">
      <label for="fullName" class="block text-sm font-semibold mb-2"
        >Area, Street, Sector, Village</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}<input
          name="addressLine2"
          type="text"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.addressLine2}
          placeholder="Area, Street, Sector, Village"
        />{/if}
    </div>
    <div class="mb-4">
      <label for="fullName" class="block text-sm font-semibold mb-2"
        >Landmark</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}<input
          name="landmark"
          type="text"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.landmark}
          placeholder="Landmark"
        />{/if}
    </div>
    <div class="mb-4">
      <label for="city" class="block text-sm font-semibold mb-2"
        >Town/City</label
      >
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}<input
          name="city"
          type="text"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.city}
          placeholder="Town/City"
        />{/if}
    </div>
    <div class="mb-4">
      <label for="state" class="block text-sm font-semibold mb-2">
        State
      </label>
      {#if loading}
        <div class="w-full bg-gray-200 animate-pulse rounded-lg p-2">
          &nbsp;
        </div>
      {:else}<select
          name="state"
          class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
          bind:value={address.state}
        >
          {#each state_list as state}
            <option value={state}>{state}</option>
          {/each}
        </select>{/if}
    </div>
    <button
      disabled={!enable_save}
      class="w-full bg-primary-500 text-white py-3 px-4 block border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      on:click={handleSave}>Save</button
    >
  </div>
{:else if !$user_info_store && $authenticating_store}
  <div class="bg-white max-w-xl mx-auto px-4 xl:px-0 mb-24 pt-4 min-h-[calc(100vh-64px)] flex">
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
