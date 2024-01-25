<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";
  import { httpClient } from "../../helper/httpClient";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import { updateUserAddress } from "../../helper/endpoints";
  import { token_store } from "../../helper/store";
  const dispatch = createEventDispatcher();

  export let address;
  let confirm_remove_open = false;

  const handleRemoveAddress = async () => {
    address.status = "archive";
    const response = await httpClient(updateUserAddress, {
      token: $token_store,
      method: "POST",
      payload: address,
    });
    if (response.status === 200) {
      confirm_remove_open = false;
      dispatch("remove");
    }
  };
</script>

<div
  class="text-gray-800 border-2 border-gray-200 rounded-lg p-4 aspect-square text-sm hover:shadow flex flex-col"
>
  <div class="grow">
    <div class="font-semibold">{address.fullName}</div>
    <div>{address.mobile}</div>
    <div>{address.type}</div>
    <div>{address.addressLine1}</div>
    <div>{address.addressLine2}</div>
    <div>{address.landmark}</div>
    <div>{address.city}, {address.state}, {address.pincode}</div>
    <div>{address.country}</div>
  </div>
  <div class="flex gap-4">
    <a href={`address/${address._id}`} class="block text-purple-500">Edit</a>
    <button
      class="text-purple-500"
      on:click={() => (confirm_remove_open = true)}>Remove</button
    >
  </div>
</div>

{#if confirm_remove_open}
  <div
    class="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center"
  >
    <div class="bg-white rounded-lg shadow-lg w-[500px]">
      <div
        class="relative p-4 font-semibold text-lg text-center border-b border-gray-200"
      >
        <button
          class="absolute top-4 left-4 rounded-full hover:text-purple-600 hover:bg-purple-50"
          on:click={() => {
            confirm_remove_open = false;
          }}
        >
          <CloseIcon />
        </button>

        <div>Confirm Deletion</div>
      </div>

      <div class="p-4">
        <div class="mb-4">
          <div class="font-semibold">{address.fullName}</div>
          <div>{address.mobile}</div>
          <div>{address.type}</div>
          <div>{address.addressLine1}</div>
          <div>{address.addressLine2}</div>
          <div>{address.landmark}</div>
          <div>{address.city}, {address.state}, {address.pincode}</div>
          <div>{address.country}</div>
        </div>

        <div class="flex gap-4">
          <button
            class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-600 text-purple-600 disabled:opacity-50 disabled:pointer-events-none"
            on:click={() => {
              confirm_remove_open = false;
            }}>No</button
          >
          <button
            class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
            on:click={handleRemoveAddress}>Yes</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
