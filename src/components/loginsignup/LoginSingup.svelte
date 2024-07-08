<script>
  //@ts-nocheck
  import { httpClient } from "../../helper/httpClient";
  import {
    loading_store,
    login_signup_modal_open,
    user_info_store,
  } from "../../helper/store";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import EnvelopeIcon from "../svg/EnvelopeIcon.svelte";
  import GoogleSocialIcon from "../svg/GoogleSocialIcon.svelte";
  import FacebookSocialIcon from "../svg/FacebookSocialIcon.svelte";
  import MobileIcon from "../svg/MobileIcon.svelte";
  import EmailLoginSignup from "./EmailLoginSignup.svelte";
  import { PUBLIC_API_URI } from "$env/static/public";
  import { browser } from "$app/environment";
  import * as jwt from "jsonwebtoken-esm";
  import { userLoginFacebook, userLoginGoogle } from "../../helper/endpoints";
  import { page } from "$app/stores";
  import { Dialog, Separator } from "bits-ui";
  import { fade } from "svelte/transition";

  const AUTH_MODE = {
    // PHONE: "PHONE",
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
    FACEBOOK: "FACEBOOK",
  };
  let selected_auth_mode = AUTH_MODE.EMAIL;
  let phone = "";

  const getURL = () => {
    return $page.url.href;
  };
</script>

<Dialog.Root
  bind:open={$login_signup_modal_open}
  preventScroll={true}
  closeOnOutsideClick={false}
>
  <Dialog.Portal>
    <Dialog.Overlay
      transition={fade}
      transitionConfig={{ duration: 150 }}
      class="fixed inset-0 z-50 bg-black/80"
    />
    <Dialog.Content
      class="bg-white fixed left-[50%] top-[50%] z-[150] w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
    >
      <Dialog.Title
        class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
        >Please Login To Continue</Dialog.Title
      >
      <Separator.Root class="-mx-5 mb-4 mt-2 block h-px bg-gray-200" />
      <Dialog.Description class="">
        {#if Object.keys(AUTH_MODE).length}
          {#if AUTH_MODE.PHONE === selected_auth_mode && selected_auth_mode}
            <div class="mb-4">
              <input
                type="number"
                class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Phone Number"
                bind:value={phone}
              />
            </div>

            <button
              class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Continue
            </button>
            {#if Object.keys(AUTH_MODE).length > 1}
              <div class="text-center mb-4">or</div>
            {/if}
          {:else if AUTH_MODE.EMAIL === selected_auth_mode && selected_auth_mode}
            <EmailLoginSignup />
            {#if Object.keys(AUTH_MODE).length > 1}
              <div class="text-center mb-4">or</div>
            {/if}
          {/if}
          <div class="flex flex-col gap-4">
            {#if AUTH_MODE.GOOGLE}
              <a
                class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:pointer-events-none"
                href={`${PUBLIC_API_URI}${userLoginGoogle}?redirect_uri=${getURL()}`}
              >
                <GoogleSocialIcon />
                Continue with Google
              </a>
            {/if}

            {#if AUTH_MODE.FACEBOOK}
              <a
                class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:pointer-events-none"
                href={`${PUBLIC_API_URI}${userLoginFacebook}?redirect_uri=${getURL()}`}
              >
                <FacebookSocialIcon />
                Continue with Facebook
              </a>
            {/if}

            {#if AUTH_MODE.EMAIL}
              <button
                class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:pointer-events-none"
                on:click={() => {
                  selected_auth_mode = AUTH_MODE.EMAIL;
                }}
                class:hidden={AUTH_MODE.EMAIL === selected_auth_mode}
              >
                <EnvelopeIcon />
                Continue with Email
              </button>
            {/if}

            {#if AUTH_MODE.PHONE}
              <button
                class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:pointer-events-none"
                on:click={() => {
                  selected_auth_mode = AUTH_MODE.PHONE;
                }}
                class:hidden={AUTH_MODE.PHONE === selected_auth_mode}
              >
                <MobileIcon />
                Continue with Phone
              </button>
            {/if}
          </div>
        {:else}
          <p class="text-center font-semibold">
            Sorry No Authentication Mode Available
          </p>
        {/if}
      </Dialog.Description>

      <Dialog.Close
        class="absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
      >
        <CloseIcon />
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
