<script>
  //@ts-nocheck
  import { header_title_store, user_info_store } from "../../../helper/store";

  let loading = false;
  $: {
    $header_title_store = "Personal Info";
  }
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 mt-4">

    {#if loading}{:else}
    <div class="mb-4 flex">
      {#if loading}
        <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
          &nbsp;
        </div>
        /
        <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
          &nbsp;
        </div>
        /
        <div class="inline-block bg-gray-200 animate-pulse rounded-lg w-12">
          &nbsp;
        </div>
      {:else}
        <div>
          <a class="hover:text-primary-500" href="/account">Account</a> / 
          <a class="hover:text-primary-500" href="/account/personal-info">Personal Info</a>
        </div>
      {/if}
    </div>
  {/if}
    <!-- <h1 class="hidden font-semibold md:text-3xl text-center mb-4">
      Personal Info
    </h1> -->
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
