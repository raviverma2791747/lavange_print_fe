<script>
  //@ts-nocheck
  import { formatDate } from "date-fns";
  import { DATE_FORMAT, ORDER_STATUS } from "../helper/constants";
  import { formatCurrency, getByValue } from "../helper/utils";
  import OrderStatusPill from "./OrderStatusPill.svelte";

  export let order;
</script>

<a
  href={`/order/${order._id}`}
  class="block border border-gray-200 rounded-lg shadow-md"
>
  <div
    class="border-b border-gray-200 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4"
  >
    <div>
      <div class="font-semibold">Order Placed</div>
      <div>{formatDate(order.createdAt, DATE_FORMAT)}</div>
    </div>
    <div>
      <div class="font-semibold">Status</div>
      <OrderStatusPill status={order.status} />
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
      <div
        class="uppercase text-primary-500"
        on:click={(e) => {
          e.stopImmediatePropagation();
          e.preventDefault();
          navigator.clipboard.writeText(order._id);
        }}
      >
        {order._id}
      </div>
    </div>
  </div>
  <div class="p-4 flex gap-4">
    <div class="text-primary-500 underline">View</div>
  </div>
</a>
