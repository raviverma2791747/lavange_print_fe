<script>
  //@ts-nocheck
  import CheckFillIcon from "../../../../components/svg/CheckFillIcon.svelte";
  import { page } from "$app/stores";
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 pt-4 flex justify-center items-center h-[calc(100vh-80px)]"
>
  <div class="flex flex-col items-center gap-4">
    <div>
      <CheckFillIcon class="w-24 h-24 text-green-400" />
    </div>

    <div class="text-3xl font-semibold">Thank you for ordering!</div>
    <div class="text-lg">Your order has been placed successfully.</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        href={`/order/${$page.params._id}`}
        class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span>View Orders</span>
      </a>
      <a
        href="/search"
        class="grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span>Continue Shopping</span>
      </a>
    </div>
  </div>
</div>
