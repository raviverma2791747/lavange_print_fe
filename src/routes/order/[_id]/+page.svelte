<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { httpClient } from "../../../helper/httpClient";
  import {
    formatCurrency,
    formatDate,
    getByValue,
  } from "../../../helper/utils";
  import { page } from "$app/stores";
  import {
    header_title_store,
    loading_store,
    user_info_store,
  } from "../../../helper/store";
  import { getUserOrder } from "../../../helper/endpoints";
  import {
    DATE_FORMAT,
    DATE_TIME_FORMAT,
    ORDER_STATUS,
    PAYMENT_MODE,
    PAYMENT_STATUS,
  } from "../../../helper/constants";
  import { order_cache } from "../../../helper/cache_store";

  let loading = true;
  let order = {};

  const initOrder = async (order_id) => {
    //loading_store.set(true);
    loading = true;
    if ($order_cache.get(order_id)) {
      order = $order_cache.get(order_id);
    } else {
      const response = await httpClient(`${getUserOrder}/${order_id}`, {
        method: "GET",
      });
      if (response.status === 200) {
        order = response.data.order;
        $order_cache.set(order_id, order);
      }
    }
    loading = false;
    //loading_store.set(false);
  };

  $: {
    if (!$user_info_store) {
    } else {
      initOrder($page.params._id);
    }
  }

  $: {
    $header_title_store = "Order";
  }
</script>

<!-- svelte-ignore missing-declaration -->
{#if !loading}
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-2">
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
            <a class="hover:text-primary-500" href="/order">Order</a> /
            <a class="hover:text-primary-500" href={`/order/${order._id}`}
              >Details</a
            >
          </div>
        {/if}
      </div>
    {/if}
    <!-- <h1 class="hidden md:block font-semibold text-3xl text-center mb-4">
      Order Details
    </h1> -->
    <!-- <div class="mb-4">
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
        <a class="hover:text-primary-500 font-semibold" href="/">Home</a> /
        <a class="hover:text-primary-500 font-semibold" href={`/order`}> Order</a>/ Details
      {/if}
    </div> -->
    <div class="flex gap-4 mb-4 flex-wrap">
      <div>
        <div class="font-semibold">Order Status</div>
        <div
          class="capitalize px-2 py-1 inline-flex border border-primary-500 rounded-full bg-primary-100 text-primary-500"
        >
          {getByValue(ORDER_STATUS, order.status)}
        </div>
      </div>
      <div>
        <div class="font-semibold">Order Placed</div>
        <div>{formatDate(order.createdAt, DATE_TIME_FORMAT)}</div>
      </div>
      <div>
        <div class="font-semibold">Order#</div>
        <div class="uppercase">{order._id}</div>
      </div>
    </div>

    <div
      class="mb-4 grid md:grid-cols-3 border p-4 gap-4 border-gray-200 rounded-lg"
    >
      <div>
        <div class="font-semibold">Shipping Address</div>
        <div>{order.address.fullName}</div>
        <div>{order.address.mobile}</div>
        <div>{order.address.addressLine1}</div>
        <div>{order.address.addressLine2}</div>
        <div>{order.address.landmark}</div>
        <div>{order.address.city}</div>
        <div>{order.address.state}</div>
        <div>{order.address.country}</div>
        <div>{order.address.pincode}</div>
      </div>

      <div>
        <div class="mb-4">
          <div class="font-semibold">Payment Status</div>
          <div
            class="capitalize px-2 py-1 inline-flex border border-primary-500 text-sm rounded-full bg-primary-100 text-primary-500"
          >
            {getByValue(PAYMENT_STATUS, order.paymentStatus)}
          </div>
        </div>
        <div class="mb-4">
          <div class="font-semibold">Payment Mode</div>
          <div
            class="capitalize px-2 py-1 inline-flex border border-primary-500 text-sm rounded-full bg-primary-100 text-primary-500"
          >
            {getByValue(PAYMENT_MODE, order.paymentMode)}
          </div>
        </div>
        <!-- <div class="mb-4">
          <div class="font-semibold">Payment Gateway</div>
          <div class="uppercase">{order.paymentGateway}</div>
        </div> -->
      </div>

      <div>
        <div class="font-semibold">Total</div>
        <div>
          {formatCurrency(order.total)}
        </div>
        <div class="font-semibold">Discount</div>
        <div>{formatCurrency(order.discount)}</div>
      </div>

      {#if order.shipping.trackingId && order.shipping.trackingUrl}
        <div>
          <div class="font-semibold">Tracking</div>
          <div>
            Tracking ID: <span class="italic">
              {order.shipping.trackingId}</span
            >
          </div>
          <div>
            <a
              href={order.shipping.trackingUrl}
              target="_blank"
              class="text-primary-500"
            >
              Track Your Order
            </a>
          </div>
        </div>
      {:else}
        <div>
          <div class="font-semibold">Tracking</div>
          <div class="italic text-sm">
            Once your order is dispatched your will be able to view the tracking
            details
          </div>
        </div>
      {/if}
    </div>

    <div class="mb-4">
      <div class="font-semibold mb-2">Timeline</div>
      <ol class="relative border-s border-primary-300 mb-4">
        {#each order.timeline as item}
          <li class="ms-4">
            <div
              class="absolute w-3 h-3 bg-primary-500 rounded-full mt-1.5 -start-1.5 border border-white"
            ></div>
            <time
              class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
              >{formatDate(item.updatedAt, DATE_TIME_FORMAT)}</time
            >
            <h3 class="text-lg font-semibold text-gray-900 capitalize">
              {getByValue(ORDER_STATUS, item.status)}
            </h3>
            <p class="text-base font-normal text-gray-500">
              {item.message}
            </p>
          </li>
        {/each}
      </ol>
    </div>
    <div class="mb-4">
      <div class="font-semibold mb-2">Items</div>
      <!-- <div class="flex flex-col gap-2">
        {#each order.items as item}
          <a
            href={`/product/${item.product.slug}`}
            class="border border-gray-200 p-2 rounded-lg"
          >
            <div class="font-semibold">
              {item.product.title}
            </div>
            {item.quantity}
            {formatCurrency(item.price)}
          </a>
        {/each}
      </div> -->
      <div class="grid gap-2">
        {#each order.items as item}
          <a
            class="w-full p-2 flex gap-2 cursor-pointer hover:bg-gray-200 rounded-lg border border-gray-200"
            href={`/product/${item.product.slug}`}
          >
            <div class="w-24">
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

              <div class="flex gap-2 flex-wrap">
                {#if item.variant && item.product.variants && item.product.variants.find((v) => v._id === item.variant)}
                  {#each Object.entries(item.product.variants.find((v) => v._id === item.variant).attributes).map( (a) => {
                      return item.product.variantOptions
                        .find((v) => v.name === a[0])
                        .options.find((o) => o.value === a[1]).displayName;
                    } ) as attribute}
                    <div
                      class="border border-primary-500 text-primary-500 bg-primary-200 px-2 rounded-lg"
                    >
                      {attribute}
                    </div>
                  {/each}
                {:else if item.variant && !item.product.variants}
                  <p class="text-red-500">Unavailable</p>
                {/if}
              </div>

              <p>
                {formatCurrency(item.price)}
              </p>
              <p>
                <span class="font-semibold">Quantity</span>
                {item.quantity}
              </p>
              <p>
                <span class="font-semibold">Total Price</span>
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
            <!-- <button
            class="hover:text-red-500"
            on:click={(e) => {
              e.stopImmediatePropagation();
              e.preventDefault();
              handleRemoveFromCart(item._id);
            }}
          >
            <TrashIcon />
          </button> -->
          </a>
        {/each}
      </div>
    </div>
    <!-- 
    <div class="">
      <button
        class="hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        Cancel
    </button>
    </div> -->
  </div>
{:else}{/if}
