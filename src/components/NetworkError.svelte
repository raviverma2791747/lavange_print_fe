<script>
    //@ts-nocheck

    const handleReload = async () => {
        location.reload();
    }
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 flex justify-center items-center h-[calc(100vh-64px)]"
>
  <div class="text-center">
    <h1 class="text-2xl font-semibold mb-2">Some error occured!</h1>

    <p class="mb-4">Refresh or try again after sometime!</p>

    <button
    type="button"
    class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
    on:click={handleReload}
  >

    <span>Refresh</span>
  </button>
  </div>
</div>
