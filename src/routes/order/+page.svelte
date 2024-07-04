<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { httpClient } from "../../helper/httpClient";
  import { formatCurrency, formatDate } from "../../helper/utils";
  import { fetchUserOrder } from "../../helper/endpoints";
  import {
    authenticating_store,
    header_title_store,
    login_signup_modal_open,
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
  import { Pagination } from "bits-ui";
  import ChevronRight from "../../components/svg/ChevronRight.svelte";
  import ChevronLeft from "../../components/svg/ChevronLeft.svelte";
  import LoginSpinner from "../../components/LoginSpinner.svelte";
  import BarricadeIcon from "../../components/svg/BarricadeIcon.svelte";
  let orders = [];
  let loading = true;

  let applied_filters = {
    sort: "createdAt",
    order: "desc",
    order_status: "all",
  };

  const initOrders = async () => {
    loading = true;
    const response = await httpClient(fetchUserOrder, {
      method: "GET",
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
    if (!$user_info_store && !$authenticating_store) {
      goto("/");
    } else {
      initOrders();
    }
  }

  $: {
    $header_title_store = "Order";
  }
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 mb-4 mt-4 min-h-[calc(100vh-64px)] flex flex-col"
>
  {#if $user_info_store}
    {#if loading}
      <BreadcrumbShimmer count={1} />
      <div class="flex gap-4 flex-col">
        {#each { length: 5 } as item}
          <OrderCardShimmer />
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
      <div>
        <!-- <select
          class="cursor-pointer outline-primary-500 block w-fit border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none"
          on:change={(e) => {
            let v = e.target.value.split("-");
            let s = v[0];
            let d = v[1];
            applied_filters = {
              ...applied_filters,
              sort: s,
              order: d,
            };
          }}
        >
          <option value="title-asc"></option>
          <option value="createdAt-desc">Newest</option>
          <option selected value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select> -->
      </div>

      {#if orders.length > 0}
        <div class="flex gap-4 flex-col">
          {#each orders as order}
            <OrderCard {order} />
          {/each}
        </div>
        <!-- <Pagination.Root count={100} perPage={10} let:pages let:range>
          <div class="my-8 flex items-center">
            <Pagination.PrevButton
              class="mr-[25px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
            >
              <ChevronLeft />
            </Pagination.PrevButton>
            <div class="flex items-center gap-2.5">
              {#each pages as page (page.key)}
                {#if page.type === "ellipsis"}
                  <div class="text-[15px] font-medium text-foreground-alt">
                    ...
                  </div>
                {:else}
                  <Pagination.Page
                    {page}
                    class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-[selected]:bg-foreground data-[selected]:text-background"
                  >
                    {page.value}
                  </Pagination.Page>
                {/if}
              {/each}
            </div>
            <Pagination.NextButton
              class="ml-[29px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
            >
              <ChevronRight />
            </Pagination.NextButton>
          </div>
          <p class="text-center text-[13px] text-muted-foreground">
            Showing {range.start} - {range.end}
          </p>
        </Pagination.Root> -->
      {:else}
        <div class=" grow flex items-center justify-center">
          <p class="text-xl font-semibold">No orders found!</p>
        </div>
      {/if}
    {/if}
  {:else if !$user_info_store && $authenticating_store}
    <div class="flex items-center justify-center grow">
      <div class="flex flex-col items-center">
        <LoginSpinner />
        <div>Please wait while we log you in...</div>
      </div>
    </div>
  {:else}
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
  {/if}
</div>
