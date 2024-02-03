<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { formatCurrency, formatDate } from "../../../helper/utils";
  import { page } from "$app/stores";
  import { token_store, header_title_store } from "../../../helper/store";
  import { getUserOrder } from "../../../helper/endpoints";
  import { DATE_FORMAT } from "../../../helper/constants";
  import { order_cache } from "../../../helper/cache_store";

  let loading = true;
  let order = {};

  const initOrder = async (order_id) => {
    loading = true;
    if ($order_cache.get(order_id)) {
      order = $order_cache.get(order_id);
    } else {
      const response = await httpClient(`${getUserOrder}/${order_id}`, {
        method: "GET",
        token: $token_store,
      });
      if (response.status === 200) {
        order = response.data.order;
        $order_cache.set(order_id, order);
      }
    }
    loading = false;
  };

  $: {
    initOrder($page.params._id);
  }

  $: {
    $header_title_store = "Order";
  }
</script>

{#if !loading}
  <div class="bg-white max-w-7xl mx-auto px-4 lg:px-0 py-2">
    <h1 class="hidden md:block font-semibold text-3xl text-center mb-4">
      Order
    </h1>
    <div class="mb-4">
      <div class="font-semibold">Order Placed</div>
      <div>{formatDate(order.createdAt, DATE_FORMAT)}</div>
    </div>
    <div class="mb-4">
      <div class="font-semibold">Total</div>
      <div>
        {formatCurrency(
          order.items.reduce((a, b) => a + b.quantity * b.price, 0),
          0
        )}
      </div>
    </div>
    <div class="mb-4">
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
    <div class="mb-4">
      <div class="font-semibold mb-2">Items</div>
      <div class="flex flex-col gap-2">
        {#each order.items as item}
          <a
            href={`/product/${item.product._id}`}
            class="border border-gray-200 p-2 rounded-lg"
          >
            <div class="font-semibold">
              {item.product.title}
            </div>
            {item.quantity}
            {formatCurrency(item.price)}
          </a>
        {/each}
      </div>
    </div>
  </div>
{:else}
  ok
{/if}
