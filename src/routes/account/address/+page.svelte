<script>
  //@ts-nocheck
  import Address from "../../../components/account/Address.svelte";
  import PlusIcon from "../../../components/svg/PlusIcon.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { getUserInfo } from "../../../helper/endpoints";
  import {
    header_title_store,
    token_store,
    user_info_store,
  } from "../../../helper/store";

  const initUserInfo = async () => {
    const response = await httpClient(getUserInfo);

    if (response.status === 200) {
      user_info_store.set(response.data.user);
    } else {
      token.set(null);
      token_store.set(null);
    }
  };

  $: {
    $header_title_store = "Address";
  }
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 py-2">
    <h1 class="hidden md:block font-semibold text-3xl text-center mb-4">
      Address
    </h1>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <a
        href="/account/address/create"
        class="text-gray-800 border-2 border-dashed border-gray-200 rounded-lg flex justify-center items-center aspect-square"
      >
        <div class="flex flex-col justify-center items-center">
          <PlusIcon class="h-8 w-8" />
          <div>Add Address</div>
        </div>
      </a>
      {#each $user_info_store.addresses as address}
        <Address {address} on:remove={initUserInfo} />
      {/each}
    </div>
  </div>
{:else}
  <h1>Please login</h1>
{/if}
