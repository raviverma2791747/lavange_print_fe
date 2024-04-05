<script>
  //@ts-nocheck
  import CloseFillIcon from "../../../../components/svg/CloseFillIcon.svelte";
  import { page } from "$app/stores";
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 pt-4 flex justify-center items-center h-[calc(100vh-80px)]"
>
  <div class="flex flex-col items-center gap-4">
    <div>
      <CloseFillIcon class="w-24 h-24 text-red-400" />
    </div>

    <div class="text-3xl font-semibold">Sorry for the inconvenience!</div>
    <div class="text-center">
      <div class="text-lg">
        Something went wrong. We couldn't process your order. Please try again.
      </div>
      <div class="text-sm italic">
        If your bank account is debited, the refund will be processed in 5-7
        working days.
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        href={`/order/${$page.params._id}`}
        class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span>View Order</span>
      </a>
      <a
        href="/checkout"
        class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span>Try Again</span>
      </a>
    </div>
  </div>
</div>
