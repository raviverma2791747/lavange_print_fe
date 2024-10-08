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
  export let disabled = false;
  let quantity = item.quantity;
  let price;
  const MAX_QUANTITY = 100;
  const MIN_QUANTITY = 1;

  const handleDeleteCart = async (item_id) => {
    disabled = true;
    dispatcher("deleteCart", item_id);
    const response = await httpClient(deleteUserCart, {
      method: "POST",

      payload: {
        itemId: item_id,
      },
    });
    dispatcher("updateCart");
    disabled = false;
  };

  const handleAddToCart = async (qty) => {
    disabled = true;
    dispatcher("addToCart", qty);
    const data = await httpClient(addUserCart, {
      method: "POST",

      payload: {
        productId: item.product._id,
        variantId: item.variant ?? undefined,
        quantity: qty,
      },
    });

    if (data.status === 200) {
    } else {
      quantity = item.quantity;
    }
    dispatcher("updateCart");
    disabled = false;
  };

  const handleRemoveFromCart = async (qty) => {
    disabled = true;
    dispatcher("removeFromCart", qty);
    const data = await httpClient(removeUserCart, {
      method: "POST",

      payload: {
        productId: item.product._id,
        variantId: item.variant ?? undefined,
        quantity: qty,
      },
    });

    if (data.status === 200) {
    } else {
      quantity = item.quantity;
    }
    dispatcher("updateCart");
    disabled = false;
  };
</script>

<a
  class="w-full p-2 flex gap-2 cursor-pointer hover:bg-primary-50 rounded-lg"
  class:pointer-events-none={disabled}
  href={`/product/${item.product.slug}`}
>
  <div class="w-1/6">
    {#if item.product.assets.length}
      <img
        class="aspect-square object-cover rounded-lg"
        src={item.product.assets[0].url}
        alt={item.product.title}
      />
    {:else}
      <div class="aspect-square bg-gray-300 rounded-lg"></div>
    {/if}
  </div>
  <div class="grow">
    <h1 class="font-semibold">{item.product.title}</h1>

    {#if !item.isOutOfStock}
      <div class="flex gap-2 flex-wrap">
        {#if item.variant && item.product.variants && item.product.variants.find((v) => v._id === item.variant)}
          {#each Object.entries(item.product.variants.find((v) => v._id === item.variant).attributes) as [key, attribute]}
            <div
              class="border border-primary-500 text-primary-500 bg-primary-200 px-2 rounded-xl text-sm"
            >
              {attribute.name}
            </div>
          {/each}
        {/if}
      </div>
      <p>
        <span class="font-semibold">Price</span>
        {#if item.variant}
          {#if item.product.variants && item.product.variants.find((v) => v._id === item.variant)}
            {formatCurrency(
              item.variant
                ? item.product.variants.find((v) => v._id === item.variant)
                    .price
                : item.product.price
            )}
            <span class="text-sm line-through">
              {formatCurrency(
                item.variant
                  ? item.product.variants.find((v) => v._id === item.variant)
                      .compareAtPrice
                  : item.product.compareAtPrice
              )}
            </span>
          {:else}{/if}
        {:else}
          {formatCurrency(item.product.price)}
          <span class="text-sm line-through">
            {formatCurrency(item.product.compareAtPrice)}
          </span>
        {/if}
      </p>
      <div>
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
                on:click={(e) => {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }}
                on:change={(e) => {
                  if (quantity < MIN_QUANTITY) {
                    quantity = MIN_QUANTITY;
                  }
                  if (quantity > MAX_QUANTITY) {
                    quantity = MAX_QUANTITY;
                  }
                  const diff = quantity - item.quantity;
                  if (diff > 0) {
                    handleAddToCart(diff);
                  } else if (diff < 0) {
                    handleRemoveFromCart(-diff);
                  }
                }}
              />
            </div>
            <div
              class="flex items-center -gap-y-px divide-x divide-gray-200 border-s border-gray-200"
            >
              <button
                disabled={disabled || quantity === MAX_QUANTITY}
                on:click={(e) => {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  if (quantity < MAX_QUANTITY) {
                    quantity++;
                    handleAddToCart(quantity - item.quantity);
                  }
                }}
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
                disabled={disabled || quantity === MIN_QUANTITY}
                on:click={(e) => {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  if (quantity > MIN_QUANTITY) {
                    quantity--;
                    handleRemoveFromCart(item.quantity - quantity);
                  }
                }}
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
        {#if item.product.status === STATUS.ACTIVE}
          {#if !item.isOutOfStock}
            {#if item.variant && item.product.variants.find((v) => v._id === item.variant)}
              <span class="font-semibold">Total Price</span>
              {formatCurrency(
                (item.variant
                  ? item.product.variants.find((v) => v._id === item.variant)
                      .price
                  : item.product.price) * quantity
              )}
            {:else}
              <span class="font-semibold">Total Price</span>
              {formatCurrency(item.product.price * quantity)}
            {/if}
          {:else}
            <p class="text-red-500">Unavailable</p>
          {/if}
        {:else}
          <p class="text-red-500">Unavailable</p>
        {/if}
      </p>
    {:else}
      <p class="text-red-500">Unavailable</p>
    {/if}
  </div>
  <div>
    <button
      {disabled}
      class="hover:text-red-500"
      on:click={(e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        console.log(item);
        handleDeleteCart(item._id);
      }}
    >
      <TrashIcon />
    </button>
  </div>
</a>
