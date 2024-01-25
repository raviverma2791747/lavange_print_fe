<script>
  //@ts-nocheck
  import { user_info_store } from "../../../helper/store";
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0">
    <h1 class="font-semibold text-3xl text-center mb-4">Personal Info</h1>
    <div class="mb-4">
      <div class="font-semibold">First Name</div>
      <div>
        {$user_info_store.firstName}
      </div>
    </div>
    <div class="mb-4">
      <div class="font-semibold">Last Name</div>
      <div>
        {$user_info_store.lastName}
      </div>
    </div>
    <div class="mb-4">
      <div class="font-semibold">Email</div>
      <div>
        {$user_info_store.email}
      </div>
    </div>
  </div>
{:else}
  <h1>Please login</h1>
{/if}
