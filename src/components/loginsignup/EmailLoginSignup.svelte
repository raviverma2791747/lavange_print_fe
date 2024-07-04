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
  import {
    authenticating_store,
    login_signup_modal_open,
    user_info_store,
  } from "../../helper/store";
  import { page } from "$app/stores";
  import { PUBLIC_HCAPTCHA_SITE_KEY } from "$env/static/public";
  import CheckFillIcon from "../../components/svg/CheckFillIcon.svelte";
  import { DatePicker } from "bits-ui";
  import ChevronRight from "../svg/ChevronRight.svelte";
  import ChevronLeft from "../svg/ChevronLeft.svelte";
  import CalendarIcon from "../svg/CalendarIcon.svelte";
  import { CalendarDate, today } from "@internationalized/date";

  let loading = false;
  const STATE = {
    SIGNUP: "SIGNUP",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    LOGIN: "LOGIN",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
  };

  let captchaId;
  let state = STATE.LOGIN;

  let user = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    dob: today("IST"),
  };

  const validateLogin = () => {
    if (!user.email || !user.password) {
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!user.email || !user.password || !user.firstName || !user.lastName) {
      return false;
    }
    return true;
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

      payload:{
        ...user,
        username: user.email,
        dob: user.dob?.toString(),
      },
    });
    if (response.status === 200) {
      state = STATE.SIGNUP_SUCCESS;
    }
    loading = false;
  };

  const initUserInfo = async () => {
    authenticating_store.set(true);
    const response = await httpClient(getUserInfo, {});

    if (response.status === 200) {
      user_info_store.set(response.data.user);
    } else {
    }
    authenticating_store.set(false);
  };

  const login = async () => {
    loading = true;
    const response = await httpClient(userLogin, {
      method: "POST",

      payload: {
        username: user.email,
        password: user.password,
        captcha_response: user.captcha_response,
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

  const renderCaptcha = () => {
    captchaId = window.hcaptcha.render("h-captcha", {
      sitekey: PUBLIC_HCAPTCHA_SITE_KEY,
      size: "normal",
      theme: "light",
      callback: (response) => {
        user.captcha_response = response;
      },
    });
  };

  $: {
    if (user && state === STATE.SIGNUP && validateSignup()) {
      console.log("signup");
      renderCaptcha();
    }

    if (user && state === STATE.LOGIN && validateLogin()) {
      console.log("login");
      renderCaptcha();
    }
  }
</script>

{#if state === STATE.SIGNUP}
  <div class="mb-4">
    <input
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="First name"
      name="firstName"
      bind:value={user.firstName}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <input
      type="text"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Last name"
      bind:value={user.lastName}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <input
      type="email"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Email"
      bind:value={user.email}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <!-- <input
      type="date"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Date of birth"
      disabled={loading}
    /> -->

    <DatePicker.Root
      weekdayFormat="short"
      bind:value={user.dob}
      onValueChange={(e) => {
        console.log(e);
      }}
      disabled={loading}
      fixedWeeks={true}
    >
      <div class="flex w-full  flex-col gap-1.5">
        <DatePicker.Label class="block select-none text-sm font-medium"
          >Date of birth</DatePicker.Label
        >
        <DatePicker.Input
          let:segments
          class="flex h-input w-full  rounded-lg select-none items-center rounded-input border border-border-input bg-background px-2 py-3 text-sm tracking-[0.01em] text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
        >
          {#each segments as { part, value }}
            <div class="inline-block select-none">
              {#if part === "literal"}
                <DatePicker.Segment {part} class="p-1 text-muted-foreground">
                  {value}
                </DatePicker.Segment>
              {:else}
                <DatePicker.Segment
                  {part}
                  class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0 aria-[valuetext=Empty]:text-muted-foreground"
                >
                  {value}
                </DatePicker.Segment>
              {/if}
            </div>
          {/each}
          <DatePicker.Trigger
            class="ml-auto inline-flex size-8 items-center justify-center rounded-[5px] text-foreground/60 transition-all hover:bg-muted active:bg-dark-10"
          >
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.Input>
        <DatePicker.Content
          sideOffset={6}
          transitionConfig={{ duration: 150, y: -8 }}
          class="z-50 "
        >
          <DatePicker.Calendar
            class="rounded-[15px] border border-dark-10  p-[22px] shadow-popover bg-white"
            let:months
            let:weekdays
          >
            <DatePicker.Header class="flex items-center justify-between">
              <DatePicker.PrevButton
                class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt transition-all hover:bg-muted active:scale-98"
              >
                <ChevronLeft />
              </DatePicker.PrevButton>
              <DatePicker.Heading class="text-[15px] font-medium" />
              <DatePicker.NextButton
                class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt transition-all hover:bg-muted active:scale-98"
              >
                <ChevronRight />
              </DatePicker.NextButton>
            </DatePicker.Header>
            <div
              class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              {#each months as month}
                <DatePicker.Grid
                  class="w-full border-collapse select-none space-y-1"
                >
                  <DatePicker.GridHead>
                    <DatePicker.GridRow
                      class="mb-1 flex w-full justify-between"
                    >
                      {#each weekdays as day}
                        <DatePicker.HeadCell
                          class="w-10 rounded-md text-xs !font-normal text-muted-foreground"
                        >
                          <div>{day.slice(0, 2)}</div>
                        </DatePicker.HeadCell>
                      {/each}
                    </DatePicker.GridRow>
                  </DatePicker.GridHead>
                  <DatePicker.GridBody>
                    {#each month.weeks as weekDates}
                      <DatePicker.GridRow class="flex w-full">
                        {#each weekDates as date}
                          <DatePicker.Cell
                            {date}
                            class="relative size-10 !p-0 text-center text-sm"
                          >
                            <DatePicker.Day
                              {date}
                              month={month.value}
                              class="group relative inline-flex size-10 items-center justify-center whitespace-nowrap rounded-9px border border-transparent bg-transparent p-0 text-sm font-normal text-foreground transition-all hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-primary-500 data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-white data-[unavailable]:text-muted-foreground data-[unavailable]:line-through rounded-lg"
                            >
                              <div
                                class="absolute top-[5px] hidden size-1 rounded-full bg-foreground transition-all group-data-[today]:block group-data-[selected]:bg-background"
                              />
                              {date.day}
                            </DatePicker.Day>
                          </DatePicker.Cell>
                        {/each}
                      </DatePicker.GridRow>
                    {/each}
                  </DatePicker.GridBody>
                </DatePicker.Grid>
              {/each}
            </div>
          </DatePicker.Calendar>
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  </div>

  <div class="mb-4">
    <input
      type="password"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Password"
      bind:value={user.password}
      disabled={loading}
    />
  </div>

  <div
    id="h-captcha"
    class="h-captcha mb-4"
    data-sitekey={PUBLIC_HCAPTCHA_SITE_KEY}
  ></div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={signup}
  >
    Sign Up
  </button>

  <div class="mb-4">
    <button
      class="text-sm text-primary-500 underline cursor-pointer"
      on:click={() => {
        state = STATE.LOGIN;
      }}>Already have an account?</button
    >
  </div>
{:else if state === STATE.LOGIN}
  <div class="mb-4">
    <input
      type="email"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Email"
      name="email"
      bind:value={user.email}
      disabled={loading}
    />
  </div>

  <div class="mb-4">
    <input
      type="password"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Password"
      disabled={loading}
      bind:value={user.password}
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

  <div
    id="h-captcha"
    class="h-captcha mb-4"
    data-sitekey={PUBLIC_HCAPTCHA_SITE_KEY}
  ></div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={login}
  >
    Login
  </button>

  <div class="mb-4">
    <button
      class="text-sm text-primary-500 underline cursor-pointer"
      on:click={() => {
        state = STATE.SIGNUP;
      }}>Dont' have an account?</button
    >
  </div>
{:else if state === STATE.SIGNUP_SUCCESS}
  <div class="flex justify-center mb-4">
    <CheckFillIcon class="w-24 h-24 text-green-400" />
  </div>

  <div class="mb-4 text-center font-semibold">
    Congratulations! Your account has been created successfully.
  </div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={() => {
      state = STATE.LOGIN;
    }}
  >
    Login
  </button>
{:else if state === STATE.FORGOT_PASSWORD}
  <div class="mb-4">
    <input
      type="email"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      placeholder="Email"
      name="email"
      bind:value={user.email}
      disabled={loading}
    />
  </div>

  <button
    class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
    disabled={loading}
    on:click={resetPassword}
  >
    Send Password Reset Link
  </button>

  <div class="mb-4">
    <button
      class="text-sm text-primary-500 underline cursor-pointer"
      on:click={() => {
        state = STATE.LOGIN;
      }}>Remember password?</button
    >
  </div>
{:else}
  <div class="mb-4">
    <input
      type="email"
      class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
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
