<script>
  //@ts-nocheck
  import { httpClient } from "../../../helper/httpClient";
  import { updateUserPassword } from "../../../helper/endpoints";
  import {
    authenticating_store,
    header_title_store,
    login_signup_modal_open,
    user_info_store,
  } from "../../../helper/store";
  import BreadcrumbShimmer from "../../../components/BreadcrumbShimmer.svelte";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";
  import LoginSpinner from "../../../components/LoginSpinner.svelte";
  import BarricadeIcon from "../../../components/svg/BarricadeIcon.svelte";
  import { goto } from "$app/navigation";

  let edit_password = false;
  let current_password = "";
  let new_password = "";
  let confirm_password = "";
  let loading = false;

  const handleSave = async () => {
    const response = await httpClient(updateUserPassword, {
      method: "POST",
      payload: {
        password: new_password,
        confirmPassword: confirm_password,
      },
    });

    if (response.status === 200) {
      edit_password = false;
      if (!edit_password) {
        current_password = "";
        new_password = "";
        confirm_password = "";
      }
    }
  };

  $: {
    $header_title_store = "Login & Security";
  }

  $: {
    if (!$user_info_store && !$authenticating_store) {
      goto("/");
    }
  }
</script>

{#if $user_info_store}
  <div class="bg-white max-w-3xl mx-auto px-4 3xl:px-0 mt-4">
    <div class="mb-4 flex">
      {#if loading}
        <BreadcrumbShimmer count={2} />
      {:else}
        <Breadcrumb
          routes={[
            {
              name: "Account",
              path: "/account",
            },
            {
              name: "Login & Security",
              path: "/account/login-and-security",
            },
          ]}
        />
      {/if}
    </div>

    <div class="mb-4 flex justify-between">
      <div class="font-semibold">Password</div>
      <button
        on:click={() => {
          edit_password = !edit_password;

          if (!edit_password) {
            current_password = "";
            new_password = "";
            confirm_password = "";
          }
        }}
        class="text-primary-500 underline cursor-pointer"
      >
        {edit_password ? "Cancel" : "Update"}
      </button>
    </div>

    {#if edit_password}
      <!-- <div class="mb-4">
        <label for="current_password" class="block text-sm font-semibold mb-2"
          >Current Password</label
        >
        <input
          name="current_password"
          type="password"
          class="w-full py-3 px-4 block border-gray-200 rounded-lg text-sm outline-primary-500 border disabled:opacity-50 disabled:pointer-events-none"
          bind:value={current_password}
          placeholder="Current Password"
        />
      </div> -->
      <div class="mb-4">
        <label for="new_password" class="block text-sm font-semibold mb-2"
          >New Password</label
        >
        <input
          name="new_password"
          type="password"
          class="w-full py-3 px-4 block border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 border disabled:opacity-50 disabled:pointer-events-none"
          bind:value={new_password}
          placeholder="New Password"
        />
      </div>
      <div class="mb-4">
        <label for="confirm_password" class="block text-sm font-semibold mb-2"
          >Confirm Password</label
        >
        <input
          name="confirm_password"
          type="password"
          class="w-full py-3 px-4 block border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 border disabled:opacity-50 disabled:pointer-events-none"
          bind:value={confirm_password}
          placeholder="Confirm Password"
        />
      </div>
      <button
        class="w-full bg-primary-500 text-white py-3 px-4 block border-gray-200 rounded-lg text-sm outline-primary-500 border disabled:opacity-50 disabled:pointer-events-none"
        on:click={handleSave}>Update password</button
      >
    {/if}
  </div>
{:else if !$user_info_store && $authenticating_store}
  <div
    class="bg-white max-w-3xl mx-auto px-4 3xl:px-0 mt-4 min-h-[calc(100vh-64px)] flex"
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
