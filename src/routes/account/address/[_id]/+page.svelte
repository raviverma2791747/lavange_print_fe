<script>
  //@ts-nocheck
  import state_list from "../../../../helper/state_list";
  import { httpClient } from "../../../../helper/httpClient";
  import { page } from "$app/stores";
  import {
    getUserAddress,
    updateUserAddress,
  } from "../../../../helper/endpoints";
  import { token_store } from "../../../../helper/store";

  let loading = false;
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
    type: "home",
  };

  const initAddress = async (address_id) => {
    const response = await httpClient(`${getUserAddress}/${address_id}`, {
      method: "GET",
      token: $token_store,
    });
    if (response.status === 200) {
      address = response.data.address;
    }
  };

  const validate = () => {
    if (
      !address.fullName ||
      !address.mobile ||
      !address.addressLine1 ||
      !address.city ||
      !address.state ||
      !address.pincode ||
      !address.country ||
      !address.type
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
    if (!validate()) {
      console.log(address);
      return;
    }

    const response = await httpClient(updateUserAddress, {
      method: "POST",
      token: $token_store,
      payload: address,
    });

    if (response.status === 200) {
      goto("/account/address");
    }
  };

  $: {
    if ($page.params._id !== "create") {
      initAddress($page.params._id);
    }
  }
</script>

<div class="bg-white max-w-xl mx-auto px-4 xl:px-0 mb-24 pt-4">
  {#if loading}{:else}
    <div class="mb-4 flex">
      {#if loading}
        <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
          &nbsp;
        </div>
        /
        <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
          &nbsp;
        </div>
        /
        <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
          &nbsp;
        </div>
      {:else}
        <div>
          <a class="hover:text-primary-500" href="/account">Account</a> /
          <a class="hover:text-primary-500" href="/account/address">Address</a>
          /
          {#if $page.params._id === "create"}
            <a class="hover:text-primary-500" href="/account/address/create"
              >New Address</a
            >
          {:else}
            <a
              class="hover:text-primary-500"
              href="/account/address/{address._id}">Edit Address</a
            >
          {/if}
        </div>
      {/if}
    </div>
  {/if}
  <!-- <h1 class="font-semibold text-3xl text-center mb-4">Add a new address</h1> -->
  <div class="mb-4">
    <label for="country" class="block text-sm font-semibold mb-2">Country</label
    >
    <input
      name="country"
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.country}
      placeholder="Country"
      disabled={true}
    />
  </div>
  <div class="mb-4">
    <label for="fullName" class="block text-sm font-semibold mb-2"
      >Full name (First and Last name)</label
    >
    <input
      name="fullName"
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.fullName}
      placeholder="Full name (First and Last name)"
    />
  </div>
  <div class="mb-4">
    <label for="fullName" class="block text-sm font-semibold mb-2"
      >Mobile Number</label
    >
    <input
      name="mobile"
      type="number"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.mobile}
      placeholder="Mobile Number"
    />
  </div>
  <div class="mb-4">
    <label for="type" class="block text-sm font-semibold mb-2"> Type </label>
    <select
      name="type"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.type}
    >
      <option value="home">Home</option>
      <option value="work">Work</option>
      <option value="other">Other</option>
    </select>
  </div>
  <div class="mb-4">
    <label for="pincode" class="block text-sm font-semibold mb-2">Pincode</label
    >
    <input
      name="pincode"
      type="number"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.pincode}
      placeholder="Pincode"
    />
  </div>
  <div class="mb-4">
    <label for="fullName" class="block text-sm font-semibold mb-2"
      >Flat, House no., Building, Company, Apartment</label
    >
    <input
      name="addressLine1"
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.addressLine1}
      placeholder="Flat, House no., Building, Company, Apartment"
    />
  </div>
  <div class="mb-4">
    <label for="fullName" class="block text-sm font-semibold mb-2"
      >Area, Street, Sector, Village</label
    >
    <input
      name="addressLine2"
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.addressLine2}
      placeholder="Area, Street, Sector, Village"
    />
  </div>
  <div class="mb-4">
    <label for="fullName" class="block text-sm font-semibold mb-2"
      >Landmark</label
    >
    <input
      name="landmark"
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.landmark}
      placeholder="Landmark"
    />
  </div>
  <div class="mb-4">
    <label for="city" class="block text-sm font-semibold mb-2">Town/City</label>
    <input
      name="city"
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.city}
      placeholder="Town/City"
    />
  </div>
  <div class="mb-4">
    <label for="state" class="block text-sm font-semibold mb-2"> State </label>
    <select
      name="state"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      bind:value={address.state}
    >
      {#each state_list as state}
        <option value={state}>{state}</option>
      {/each}
    </select>
  </div>
  <button
    class="w-full bg-primary-500 text-white py-3 px-4 block border-gray-200 rounded-lg text-sm outline-primary-500 disabled:opacity-50 disabled:pointer-events-none"
    on:click={handleSave}>Save</button
  >
</div>
