<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";
  import LoginSpinner from "../../../components/LoginSpinner.svelte";
  import BarricadeIcon from "../../../components/svg/BarricadeIcon.svelte";
  import {
    authenticating_store,
    header_title_store,
    login_signup_modal_open,
    user_info_store,
  } from "../../../helper/store";

  $: {
    $header_title_store = "Personal Info";
  }

  $: {
    if (!$user_info_store && !$authenticating_store) {
      goto("/");
    }
  }
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 mt-4">
    <Breadcrumb
      routes={[
        {
          name: "Account",
          path: "/account",
        },
        {
          name: "Personal Info",
          path: "/account/personal-info",
        },
      ]}
    />
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
{:else if !$user_info_store && $authenticating_store}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 mt-4 min-h-[calc(100vh-64px)] flex"
  >
    <div class="flex items-center justify-center grow">
      <div class="flex flex-col items-center">
        <LoginSpinner />
        <div>Please wait while we log you in...</div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="bg-white max-w-5xl mx-auto px-4 5xl:px-0 pt-4 min-h-[calc(100vh-64px)] flex"
  >
    <div class="flex items-center justify-center grow">
      <div class="flex flex-col items-center">
        <BarricadeIcon class="h-16 w-16" />
        <div class="mb-4">Please login to view your account details</div>
        <button
          class="w-full sm:w-fit hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
          on:click={() => {
            goto("/");
            $login_signup_modal_open = true;
          }}>Continue to Login</button
        >
      </div>
    </div>
  </div>
{/if}
