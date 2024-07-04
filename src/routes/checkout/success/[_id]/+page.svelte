<script>
  //@ts-nocheck
  import CheckFillIcon from "../../../../components/svg/CheckFillIcon.svelte";
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";

  let interval;

  onMount(() => {
    const count = 200,
      defaults = {
        origin: { y: 0.7 },
      };

    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    const launch = () => {
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    };

    interval = setInterval(() => {
      launch();
    }, 2000);
  });

  onDestroy(() => {
    clearTimeout(interval);
  });
</script>

<div
  class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 pt-4 flex justify-center items-center h-[calc(100vh-80px)]"
>
  <div class="flex flex-col items-center gap-4">
    <div>
      <CheckFillIcon class="w-24 h-24 text-green-400" />
    </div>

    <div class="text-3xl text-center font-semibold">Thank you for ordering!</div>
    <div class="text-lg text-center">Your order has been placed successfully.</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        href={`/order/${$page.params._id}`}
        class=" grow hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span>View Order</span>
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
