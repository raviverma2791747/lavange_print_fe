<script>
  //@ts-nocheck
  import { httpClient } from "../../../helper/httpClient";
  import { updateUserPassword } from "../../../helper/endpoints";
  import { header_title_store, user_info_store } from "../../../helper/store";
  import BreadcrumbShimmer from "../../../components/BreadcrumbShimmer.svelte";
  import Breadcrumb from "../../../components/Breadcrumb.svelte";

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
</script>

{#if $user_info_store}
  <div class="bg-white max-w-3xl mx-auto px-4 3xl:px-0 mt-4">
    {#if loading}{:else}
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
    {/if}
    <!-- <h1 class="hidden md:block font-semibold text-3xl text-center mb-4">Login & Security</h1> -->
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
          class="w-full py-3 px-4 block border-gray-200 rounded-lg text-sm outline-primary-500 border disabled:opacity-50 disabled:pointer-events-none"
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
          class="w-full py-3 px-4 block border-gray-200 rounded-lg text-sm outline-primary-500 border disabled:opacity-50 disabled:pointer-events-none"
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
{:else}
  <h1>Please login</h1>
{/if}
