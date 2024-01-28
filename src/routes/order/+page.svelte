<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { httpClient } from "../../helper/httpClient";
  import { formatCurrency } from "../../helper/utils";
  import { fetchUserOrder } from "../../helper/endpoints";
  import { login_signup_modal_open, token_store , user_info_store } from "../../helper/store";
  import { goto } from "$app/navigation";
  let orders = [];

  const initOrders = async () => {
    const response = await httpClient(fetchUserOrder,{
      method: "GET",
      token: $token_store,
    });
    if (response.status === 200) {
      orders = response.data.orders ?? [];
    }
  };

  // onMount(async () => {
  //   await initOrders();
  // });

  $ : {
    if(!$user_info_store){
      //login_signup_modal_open.set(true);
    } else {
      initOrders();
    }
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 lg:px-0">
  <h1 class="hidden md:block  font-semibold text-3xl text-center mb-4">Orders</h1>
  <div>
    {#each orders as order}
      <div class="border border-gray-200 rounded-lg">
        <div class="border-b border-gray-200 flex gap-4 p-4 bg-gray-100">
          <div>
            <div class="font-semibold">Order Placed</div>
            <div>{order.createdAt}</div>
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
            <div class="uppercase">{order._id}</div>
          </div>
        </div>
        <div>
          {#each order.items as item}
            {item.price}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
