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
    authenticating_store,
    header_title_store,
    loading_store,
    login_signup_modal_open,
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
  import BreadcrumbShimmer from "../../../components/BreadcrumbShimmer.svelte";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";
  import { goto } from "$app/navigation";
  import OrderStatusPill from "../../../components/OrderStatusPill.svelte";
  import PaymentStatusPill from "../../../components/PaymentStatusPill.svelte";
  import LoginSpinner from "../../../components/LoginSpinner.svelte";
  import BarricadeIcon from "../../../components/svg/BarricadeIcon.svelte";

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
    if (!$user_info_store && !$authenticating_store) {
      goto("/");
    } else if (!$user_info_store && $authenticating_store) {
    } else {
      initOrder($page.params._id);
    }
  }

  $: {
    $header_title_store = "Order";
  }
</script>

<!-- svelte-ignore missing-declaration -->

{#if $user_info_store}
  <div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-2">
    {#if loading}
      <BreadcrumbShimmer count={2} />
    {:else}
      <Breadcrumb
        routes={[
          {
            name: "Order",
            path: "/order",
          },
          {
            name: "Details",
            path: `/order/${order._id}`,
          },
        ]}
      />
    {/if}
    {#if loading}
      <div class="flex gap-4 mb-4 flex-wrap">
        <div>
          <div class="font-semibold">Order Status</div>
          <div
            class="bg-gray-200 animate-pulse capitalize px-2 py-1 inline-flex border border-gray-400 rounded-full w-24"
          >
            &nbsp;
          </div>
        </div>
        <div>
          <div class="font-semibold">Order Placed</div>
          <div class="bg-gray-200 animate-pulse rounded-lg">&nbsp;</div>
        </div>
        <div>
          <div class="font-semibold">Order#</div>
          <div class="bg-gray-200 animate-pulse uppercase rounded-lg">
            &nbsp;
          </div>
        </div>
      </div>

      <div
        class="mb-4 grid md:grid-cols-3 border p-4 gap-4 border-gray-200 rounded-lg"
      >
        <div>
          <div class="font-semibold">Shipping Address</div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-full">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-3/4">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-3/4">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-3/4">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-1/2">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-32">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-32">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-32">
            &nbsp;
          </div>
          <div class="bg-gray-200 animate-pulse mb-2 rounded-lg w-32">
            &nbsp;
          </div>
        </div>

        <div>
          <div class="mb-4">
            <div class="font-semibold">Payment Status</div>
            <div
              class=" bg-gray-200 animate-pulse capitalize px-2 py-1 inline-flex border border-gray-300 text-sm rounded-full w-24"
            >
              &nbsp;
            </div>
          </div>
          <div class="mb-4">
            <div class="font-semibold">Payment Mode</div>
            <div
              class="bg-gray-200 animate-pulse capitalize px-2 py-1 inline-flex border border-gray-300 text-sm rounded-full w-24"
            >
              &nbsp;
            </div>
          </div>
          <!-- <div class="mb-4">
        <div class="font-semibold">Payment Gateway</div>
        <div class="uppercase">{order.paymentGateway}</div>
      </div> -->
        </div>

        <div>
          <div class="font-semibold">Total</div>
          <div class="bg-gray-200 animate-pulse rounded-lg w-24">&nbsp;</div>
          <div class="font-semibold">Discount</div>
          <div class="bg-gray-200 animate-pulse rounded-lg w-24">&nbsp;</div>
        </div>

        <div>
          <div class="font-semibold">Tracking</div>
          <div class="italic text-sm bg-gray-200 animate-pulse rounded-lg">
            &nbsp;
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="font-semibold mb-2">Timeline</div>
        <ol class="relative border-s border-gray-300 mb-4">
          {#each Array(2) as item}
            <li class="ms-4">
              <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white"
              ></div>
              <time
                class="bg-gray-200 animate-pulse mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 rounded-lg w-24 inline-block"
                >&nbsp;</time
              >
              <h3
                class=" bg-gray-200 animate-pulse text-lg font-semibold text-gray-900 capitalize rounded-lg w-24 mb-2"
              >
                &nbsp;
              </h3>
              <p
                class=" bg-gray-200 animate-pulse text-base font-normal text-gray-500 rounded-lg w-48"
              >
                &nbsp;
              </p>
            </li>
          {/each}
        </ol>
      </div>
      <div class="mb-4">
        <div class="font-semibold mb-2">Items</div>
        <div class="grid gap-2">
          {#each Array(3) as item}
            <a
              class="w-full p-2 flex gap-2 cursor-pointer rounded-lg border border-gray-200"
            >
              <div class="w-24">
                <div class="aspect-square bg-gray-300 rounded-lg"></div>
              </div>
              <div class="grow">
                <h1
                  class="font-semibold bg-gray-200 animate-pulse rounded-lg mb-2 w-48"
                >
                  &nbsp;
                </h1>

                <div class="flex gap-2 flex-wrap mb-2">
                  {#each Array(3) as attribute}
                    <div
                      class="border border-gray-500 px-2 rounded-lg bg-gray-200 animate-pulse rounded-lg w-24"
                    >
                      &nbsp;
                    </div>
                  {/each}
                </div>

                <p class="bg-gray-200 animate-pulse rounded-lg mb-2 w-24">
                  &nbsp;
                </p>
                <p class="mb-2">
                  <span class="font-semibold">Quantity</span>
                  <span
                    class="inline-block bg-gray-200 animate-pulse rounded-lg w-24"
                    >&nbsp;</span
                  >
                </p>
                <p>
                  <span class="font-semibold">Total Price</span>
                  <span
                    class="inline-block bg-gray-200 animate-pulse rounded-lg w-24"
                    >&nbsp;</span
                  >
                </p>
              </div>
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
    {:else}
      <div class="flex gap-4 mb-4 flex-wrap">
        <div>
          <div class="font-semibold">Order Status</div>
          <OrderStatusPill status={order.status} />
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
            <PaymentStatusPill paymentStatus={order.paymentStatus} />
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
              Once your order is dispatched your will be able to view the
              tracking details
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
    {/if}
  </div>
{:else if !$user_info_store && $authenticating_store}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 mt-4 min-h-[calc(100vh-64px)] flex"
  >
    <div class="flex items-center justify-center grow">
      <div class="flex flex-col items-center">
        <LoginSpinner />
        <div>Please wait while we log you in...</div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 pt-4 min-h-[calc(100vh-64px)] flex"
  >
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
  </div>
{/if}
