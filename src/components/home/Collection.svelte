<div class="mb-4 w-full">
    <h1 class="font-semibold text-3xl text-center mb-4">Explore Collections</h1>
    <div class="relative">
      <div
        class="flex gap-4 justify-center overflow-y-scroll no-scrollbar w-full"
      >
        <div
          class="rounded-lg bg-gray-500 h-32 w-32 flex-shrink-0"
        ></div>
        <div
          class="rounded-lg bg-gray-500 h-32 w-32 flex-shrink-0"
        ></div>
        <div
          class="rounded-lg bg-gray-500 h-32 w-32 flex-shrink-0"
        ></div>
        <div
          class="rounded-lg bg-gray-500 h-32 w-32 flex-shrink-0"
        ></div>
        
      </div>
      <button
        on:click={slideLeft}
        class="ml-2 absolute top-0 z-20 left-0 flex items-center h-full cursor-pointer"
      >
        <div class="bg-white rounded-full">
          <ChevronLeft class="h-8 w-8" />
        </div>
      </button>
      <button
        class="mr-2 absolute top-0 z-20 right-0 flex items-center h-full cursor-pointer"
      >
        <div on:click={slideRight} class="bg-white rounded-full">
          <ChevronRight class="h-8 w-8" />
        </div>
      </button>
    </div>
  </div>