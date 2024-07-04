<script>
  //@ts-nocheck
  import { ORDER_STATUS } from "../helper/constants";
  import { getByValue } from "../helper/utils";

  export let status;
</script>

<div
  class="capitalize px-2 py-1 text-sm inline-flex border rounded-full"
  class:text-yellow-500={status === ORDER_STATUS.PENDING}
  class:bg-yellow-100={status === ORDER_STATUS.PENDING}
  class:border-yellow-500={status === ORDER_STATUS.PENDING}
  class:text-green-500={status === ORDER_STATUS.PLACED ||
    status === ORDER_STATUS.DELIVERED ||
    status === ORDER_STATUS.DISPATCHED ||
    status === ORDER_STATUS.PREPARED}
  class:bg-green-100={status === ORDER_STATUS.PLACED ||
    status === ORDER_STATUS.DELIVERED ||
    status === ORDER_STATUS.DISPATCHED ||
    status === ORDER_STATUS.PREPARED}
  class:border-green-500={status === ORDER_STATUS.PLACED ||
    status === ORDER_STATUS.DELIVERED ||
    status === ORDER_STATUS.DISPATCHED ||
    status === ORDER_STATUS.PREPARED}
  class:text-red-500={status === ORDER_STATUS.CANCELLED ||
    status === ORDER_STATUS.RETURNED}
  class:bg-red-100={status === ORDER_STATUS.CANCELLED ||
    status === ORDER_STATUS.RETURNED}
  class:border-red-500={status === ORDER_STATUS.CANCELLED ||
    status === ORDER_STATUS.RETURNED}
>
  {getByValue(ORDER_STATUS, status)}
</div>
