<script>
  //@ts-nocheck
  import TrashIcon from "../../components/svg/TrashIcon.svelte";
  import {
    addUserCart,
    deleteUserCart,
    getUserCart,
    removeUserCart,
  } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { cart_store, header_title_store } from "../../helper/store";
  import { formatCurrency } from "../../helper/utils";
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from "svelte";
  import throttle from "lodash/throttle";
  import { STATUS } from "../../helper/constants";

  const dispatcher = createEventDispatcher();

  export let item;
  export let disabled = true;
  let quantity = 1;
  let price;
  const MAX_QUANTITY = 100;
  const MIN_QUANTITY = 1;
</script>

<div
  class="w-full p-2 flex gap-2 cursor-pointer hover:bg-primary-50 rounded-lg"
  class:pointer-events-none={disabled}
>
  <div class="w-1/6">
    <div class="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
  </div>
  <div class="grow">
    <h1 class="font-semibold animate-pulse bg-gray-200 rounded-lg w-32 mb-2">&nbsp;</h1>

    <!-- <div class="flex gap-2 flex-wrap">
        {#if item.variant && item.product.variants && item.product.variants.find((v) => v._id === item.variant)}
          {#each Object.entries(item.product.variants.find((v) => v._id === item.variant).attributes).map( (a) => {
              return item.product.variantOptions
                .find((v) => v.name === a[0])
                .options.find((o) => o.value === a[1]).displayName;
            } ) as attribute}
            <div
              class="border border-primary-500 text-primary-500 bg-primary-200 px-2 rounded-xl text-sm"
            >
              {attribute}
            </div>
          {/each}
        {/if}
      </div> -->

    <p>
      <span class="font-semibold">Price</span>
       <span class="animate-pulse bg-gray-200 rounded-lg w-16 inline-block">&nbsp;</span>
    </p>
    <div class="mb-2">
      <span class="font-semibold">Quantity</span>

      <div class="bg-white border border-gray-200 rounded-lg w-36">
        <div class="w-full flex justify-between items-center gap-x-1">
          <div class="grow py-2 px-3">
            <input
              {disabled}
              class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              type="number"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              bind:value={quantity}
            />
          </div>
          <div
            class="flex items-center -gap-y-px divide-x divide-gray-200 border-s border-gray-200"
          >
            <button
              {disabled}
              type="button"
              class="w-10 h-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg
                class="flex-shrink-0 w-3.5 h-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M5 12h14" /><path d="M12 5v14" /></svg
              >
            </button>

            <button
              {disabled}
              type="button"
              class="w-10 h-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg
                class="flex-shrink-0 w-3.5 h-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"><path d="M5 12h14" /></svg
              >
            </button>
          </div>
        </div>
      </div>
    </div>
    <p>
      <span class="font-semibold">Total Price</span>
      <span class="animate-pulse bg-gray-200 rounded-lg w-16 inline-block">&nbsp;</span>
    </p>
  </div>
  <div>
    <button {disabled}>
      <TrashIcon />
    </button>
  </div>
</div>
