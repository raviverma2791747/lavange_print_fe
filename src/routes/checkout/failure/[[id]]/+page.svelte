<script>
  //@ts-nocheck
  import CloseFillIcon from "../../../../components/svg/CloseFillIcon.svelte";
  import { page } from "$app/stores";
  import error_img from "$lib/assets/images/order_failure.png";

  const id = $page.params.id;
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 pt-4 flex justify-center items-center h-[calc(100vh-80px)]"
>
  <div class="flex flex-col items-center gap-2">
    <div class="w-1/2 lg:w-2/3">
      <!-- <CloseFillIcon class="w-24 h-24 text-red-400" /> -->
      <img class="h-auto max-w-full" src={error_img} alt="Error Image" />
    </div>

    <!-- <div class="text-3xl font-semibold">Sorry for the inconvenience!</div> -->
    <div class="text-center">
      <div class="text-lg">
        Something went wrong. We couldn't process your order.<br/> Please try again after some time.
      </div>
      <div class="text-sm italic">
        If your bank account is debited, the refund will be processed in 5-7
        working days.
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#if id}
        <a
          href={`/order/${id}`}
          class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>View Order</span>
        </a>
      {:else}
        <a
          href={`/order`}
          class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>View Orders</span>
        </a>
      {/if}
      <a
        href="/checkout"
        class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span>Try Again</span>
      </a>
    </div>
  </div>
</div>
