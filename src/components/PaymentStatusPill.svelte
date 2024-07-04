<script>
  //@ts-nocheck
  import { PAYMENT_STATUS } from "../helper/constants";
  import { getByValue } from "../helper/utils";

  export let paymentStatus;
</script>

<div
  class="capitalize px-2 py-1 text-sm inline-flex border rounded-full"
  class:text-yellow-500={paymentStatus === PAYMENT_STATUS.PENDING}
  class:bg-yellow-100={paymentStatus === PAYMENT_STATUS.PENDING}
  class:border-yellow-500={paymentStatus === PAYMENT_STATUS.PENDING}
  class:text-green-500={paymentStatus === PAYMENT_STATUS.SUCCESS}
  class:bg-green-100={paymentStatus === PAYMENT_STATUS.SUCCESS}
  class:border-green-500={paymentStatus === PAYMENT_STATUS.SUCCESS}
  class:text-red-500={paymentStatus === PAYMENT_STATUS.FAILED ||
    paymentStatus === PAYMENT_STATUS.REFUNDED}
  class:bg-red-100={paymentStatus === PAYMENT_STATUS.FAILED ||
    paymentStatus === PAYMENT_STATUS.REFUNDED}
  class:border-red-500={paymentStatus === PAYMENT_STATUS.FAILED ||
    paymentStatus === PAYMENT_STATUS.REFUNDED}
>
  {getByValue(PAYMENT_STATUS, paymentStatus)}
</div>
