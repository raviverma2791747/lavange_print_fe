<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { userPasswordReset } from "../../../../../../helper/endpoints";
  import { httpClient } from "../../../../../../helper/httpClient";

  let new_password = "";
  let confirm_password = "";
  let message = "";
  let enable_save = false;

  const validate = (new_password, confirm_password) => {
    if (!new_password) {
      message = "Please enter new password";
      return false;
    }

    if (!confirm_password) {
      message = "Please enter confirm password";
      return false;
    }

    if (new_password !== confirm_password) {
      message = "Password does not match";
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    const id = $page.params.id;
    const token = $page.params.token;
    const response = await httpClient(`${userPasswordReset}/${id}/${token}`, {
      method: "POST",
      payload: {
        password: new_password,
        confirmPassword: confirm_password,
      },
    });

    if (response.status === 200) {
      goto("/");
    } else {
      message = response.messages[0];
    }
  };

  $: enable_save = validate(new_password, confirm_password);
</script>

<div class="bg-white max-w-3xl mx-auto px-4 3xl:px-0 mt-4">
  <h1 class="hidden md:block font-semibold text-2xl r mb-4">Reset Password</h1>

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

  <p class="text-sm text-red-500 mb-4">{message}</p>
  <button
    disabled={!enable_save}
    class="w-full bg-primary-500 text-white py-3 px-4 block border-gray-200 rounded-lg text-sm outline-primary-500 border disabled:opacity-50 disabled:pointer-events-none"
    on:click={handleSave}>Reset password</button
  >
</div>
