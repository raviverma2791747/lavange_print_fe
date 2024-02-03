<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { httpClient } from "../../helper/httpClient";
  import { formatCurrency, formatDate } from "../../helper/utils";
  import { fetchUserOrder } from "../../helper/endpoints";
  import {
  header_title_store,
    login_signup_modal_open,
    token_store,
    user_info_store,
  } from "../../helper/store";
  import { goto } from "$app/navigation";
  import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../helper/constants";
  import CopyIcon from "../../components/svg/CopyIcon.svelte";
  import { order_cache } from "../../helper/cache_store";
  let orders = [];

  const initOrders = async () => {
    //loading = true;
    const response = await httpClient(fetchUserOrder, {
      method: "GET",
      token: $token_store,
    });
    if (response.status === 200) {
      orders = response.data.orders ?? [];
    }
   // loading = false;
  };

  // onMount(async () => {
  //   await initOrders();
  // });

  $: {
    if (!$user_info_store) {
      //login_signup_modal_open.set(true);
    } else {
      initOrders();
    }
  }

  $ : {
    $header_title_store = "Order";
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 lg:px-0 py-2">
  <h1 class="hidden md:block font-semibold text-3xl text-center mb-4">
    Orders
  </h1>
  <div class="flex gap-4 flex-col">
    {#each orders as order}
      <a
        href={`/order/${order._id}`}
        class="block border border-gray-200 rounded-lg"
      >
        <div
          class="border-b border-gray-200 grid md:grid-cols-4 gap-4 p-4 "
        >
          <div>
            <div class="font-semibold">Order Placed</div>
            <div>{formatDate(order.createdAt, DATE_FORMAT)}</div>
          </div>
          <div>
            <div class="font-semibold">Total</div>
            <div>
              {formatCurrency(
                order.items.reduce((a, b) => a + b.quantity * b.price, 0)
              )}
            </div>
          </div>
          <div>
            <div class="font-semibold">Ship To</div>
            <div>{order.address.fullName}</div>
          </div>
          <div>
            <div class="font-semibold">Order #</div>
            <div class="uppercase text-purple-500"  on:click={(e) =>{
              e.stopImmediatePropagation();
              e.preventDefault();
              navigator.clipboard.writeText(order._id);
            }} >{order._id} </div>
          </div>
        </div>
        <div >
          
        </div>
      </a>
    {/each}
  </div>
</div>
