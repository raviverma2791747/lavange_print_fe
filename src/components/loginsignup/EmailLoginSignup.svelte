<script>
  //@ts-nocheck
  import { httpClient } from "../../helper/httpClient";
  import {
    getUserInfo,
    userExist,
    userLogin,
    userPasswordResetLink,
    userRegister,
  } from "../../helper/endpoints";
  import { login_signup_modal_open, user_info_store } from "../../helper/store";
  import { page } from "$app/stores";

  let loading = false;
  const STATE = {
    SIGNUP: "SIGNUP",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    LOGIN: "LOGIN",
    CHECK_USER_EXIST: "CHECK_USER_EXIST",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
  };

  let state = STATE.CHECK_USER_EXIST;

  let user = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
  };

  const checkUserExist = async () => {
    if (user.email) {
      loading = true;
      const response = await httpClient(userExist, {
        method: "POST",

        payload: { username: user.email },
      });
      let user_exists = response.status === 200 ? true : false;
      if (!user_exists) {
        state = STATE.SIGNUP;
        user.username = user.email;
      } else {
        state = STATE.LOGIN;
      }
      loading = false;
    }
  };

  const signup = async () => {
    loading = true;
    const response = await httpClient(userRegister, {
      method: "POST",

      payload: user,
    });
    if (response.status === 200) {
      state = STATE.SIGNUP_SUCCESS;
    }
    loading = false;
  };

  const initUserInfo = async () => {
    const response = await httpClient(getUserInfo, {});

    if (response.status === 200) {
      user_info_store.set(response.data.user);
    } else {
    }
  };

  const login = async () => {
    loading = true;
    const response = await httpClient(userLogin, {
      method: "POST",

      payload: {
        username: user.email,
        password: user.password,
      },
    });

    if (response.status === 200) {
      login_signup_modal_open.set(false);
      await initUserInfo();
    }
    loading = false;
  };

  const resetPassword = async () => {
    loading = true;
    console.log($page.url);
    const response = await httpClient(userPasswordResetLink, {
      method: "POST",

      payload: {
        email: user.email,
        url: `${$page.url.origin}/account/password/reset`,
      },
    });

    if (response.status === 200) {
      login_signup_modal_open.set(false);
    }

    loading = false;
  };
</script>

{#if state === STATE.SIGNUP}
  <div class="mb-4">
    <input
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="First name"
      name="firstName"
      bind:value={user.firstName}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <input
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Last name"
      bind:value={user.lastName}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <input
      type="date"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Date of birth"
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <input
      type="password"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Password"
      bind:value={user.password}
      disabled={loading}
    />
  </div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={signup}
  >
    Sign Up
  </button>
{:else if state === STATE.LOGIN}
  <div class="mb-4">
    <input
      type="password"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Password"
      disabled={loading}
      bind:value={user.password}
    />
  </div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={login}
  >
    Login
  </button>
{:else if state === STATE.SIGNUP_SUCCESS}
  <div class="mb-4">Success</div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={() => {
      state = STATE.CHECK_USER_EXIST;
    }}
  >
    Login
  </button>
{:else if state === STATE.FORGOT_PASSWORD}
  <div class="mb-4">
    <input
      type="email"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Email"
      name="email"
      bind:value={user.email}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <button
      class="text-sm text-primary-500 underline cursor-pointer"
      on:click={() => {
        state = STATE.CHECK_USER_EXIST;
      }}>Login</button
    >
  </div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={resetPassword}
  >
    Send Reset Link
  </button>
{:else}
  <div class="mb-4">
    <input
      type="email"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Email"
      name="email"
      bind:value={user.email}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <button
      class="text-sm text-primary-500 underline cursor-pointer"
      on:click={() => {
        state = STATE.FORGOT_PASSWORD;
      }}>Forgot password?</button
    >
  </div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={checkUserExist}
  >
    Continue
  </button>
{/if}
