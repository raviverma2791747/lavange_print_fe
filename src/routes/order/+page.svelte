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
  import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import OrderCard from "../../components/OrderCard.svelte";
  import OrderCardShimmer from "../../components/OrderCardShimmer.svelte";
  let orders = [];
  let loading = true;
  const initOrders = async () => {
    loading = true;
    const response = await httpClient(fetchUserOrder, {
      method: "GET",
      token: $token_store,
    });
    if (response.status === 200) {
      orders = response.data.orders ?? [];
      //sort orders by createdAt
      orders.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    loading = false;
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

  $: {
    $header_title_store = "Order";
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 mb-4 mt-4">
  {#if $user_info_store}
    {#if loading}
      <BreadcrumbShimmer count={1} />
      <div class="flex gap-4 flex-col">
        {#each {length: 5} as item}
        <OrderCardShimmer/>
        {/each}
        </div>
    {:else}
      <Breadcrumb
        routes={[
          {
            name: "Order",
            path: "/order",
          },
        ]}
      />
      <!-- <h1 class="hidden md:block font-semibold text-3xl text-center mb-4">
    Orders
  </h1> -->
      <div class="flex gap-4 flex-col">
        {#each orders as order}
          <OrderCard {order} />
        {/each}
      </div>
    {/if}
  {:else}
    Please Login
  {/if}
</div>
