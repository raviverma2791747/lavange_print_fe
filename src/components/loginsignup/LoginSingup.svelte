<script>
  //@ts-nocheck
  import {
    httpClient,

  } from "../../helper/httpClient";
  import {
    login_signup_modal_open,
    token_store,
    user_info_store,
  } from "../../helper/store";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import EnvelopeIcon from "../svg/EnvelopeIcon.svelte";
  import GoogleSocialIcon from "../svg/GoogleSocialIcon.svelte";
  import MobileIcon from "../svg/MobileIcon.svelte";
  import EmailLoginSignup from "./EmailLoginSignup.svelte";
  import { PUBLIC_GOOGLE_CLIENT_ID } from "$env/static/public";
  import { browser } from "$app/environment";
  import * as jwt from "jsonwebtoken-esm";
  import { userLoginGoogle } from "../../helper/endpoints";
  //import {OAuth2Client} from 'google-auth-library';
  //import { GOOGLE_CLIENT_SECRET } from "$env/static/pivate";

  // const googleAuth = new OAuth2Client(
  //   PUBLIC_GOOGLE_CLIENT_ID,
  //   //GOOGLE_CLIENT_SECRET
  // );

  //var auth2;

  // function start() {
  //   console.log("starting")
  //   gapi.load("auth2", function () {
  //     auth2 = gapi.auth2.init({
  //       client_id: PUBLIC_GOOGLE_CLIENT_ID,
  //     });
  //   });
  // }

  export let open = false;

  const AUTH_MODE = {
    PHONE: "PHONE",
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
  };
  let selected_auth_mode = AUTH_MODE.EMAIL;
  let phone = "";

  if (browser) {
    const googleLoginCallback = async (response) => {
      // handle JWT token inside response...
      // https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions#handle_credential_response
      console.log(response);

      const response_ = await httpClient(userLoginGoogle, {
        method: "POST",
        payload: {
          token: response.credential,
        },
      });

      if (response_.status === 200) {
        token_store.set(response_.data.token);
        localStorage.setItem("token", response_.data.token);
        // user_info.set({
        //   userId: decodedToken.payload.userId,
        //   username: decodedToken.payload.username,
        //   firstName: decodedToken.payload.firstName,
        //   lastName: decodedToken.payload.lastName,
        // });
        // localStorage.setItem(
        //   "user_info",
        //   JSON.stringify({
        //     userId: decodedToken.payload.userId,
        //     username: decodedToken.payload.username,
        //     firstName: decodedToken.payload.firstName,
        //     lastName: decodedToken.payload.lastName,
        //   })
        // );

        login_signup_modal_open.set(false);
      }
    };

    // https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
    window.google.accounts.id.initialize({
      client_id: PUBLIC_GOOGLE_CLIENT_ID,
      ux_mode: "popup",
      callback: googleLoginCallback,
    });
  }

  const createFakeGoogleWrapper = () => {
    if (browser) {
      const googleLoginWrapper = document.createElement("div");
      // Or you can simple hide it in CSS rule for custom-google-button
      googleLoginWrapper.style.display = "none";
      googleLoginWrapper.classList.add("custom-google-button");

      // Add the wrapper to body
      document.body.appendChild(googleLoginWrapper);

      // Use GSI javascript api to render the button inside our wrapper
      // You can ignore the properties because this button will not appear
      window.google.accounts.id.renderButton(googleLoginWrapper, {
        type: "icon",
        width: "200",
      });

      const googleLoginWrapperButton =
        googleLoginWrapper.querySelector("div[role=button]");

      return {
        click: () => {
          googleLoginWrapperButton.click();
        },
      };
    }
  };

  // Now we have a wrapper to click
  const googleButtonWrapper = createFakeGoogleWrapper();

  const handleGoogleLogin = async () => {
    //console.log(auth2)
    //auth2.grantOfflineAccess().then(signInCallback);
    googleButtonWrapper.click();
  };
</script>

{#if open}
  <div
    class="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center"
  >
    <div class="bg-white rounded-lg shadow-lg w-[500px]">
      <div
        class="relative p-4 font-semibold text-lg text-center border-b border-gray-200"
      >
        <button
          class="absolute top-4 left-4 rounded-full hover:text-purple-600 hover:bg-purple-50"
          on:click={() => {
            login_signup_modal_open.set(false);
          }}
        >
          <CloseIcon />
        </button>

        <div>Log in or Signup</div>
      </div>

      <div class="p-4">
        {#if AUTH_MODE.PHONE === selected_auth_mode}
          <div class="mb-4">
            <input
              type="number"
              class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Phone Number"
              bind:value={phone}
            />
          </div>

          <button
            class="mb-4 w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Continue
          </button>
        {:else if AUTH_MODE.EMAIL === selected_auth_mode}
          <EmailLoginSignup />
        {/if}

        <div class="text-center mbn-4">or</div>

        <div class="flex flex-col gap-4">
          <button
            class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:pointer-events-none"
            on:click={handleGoogleLogin}
          >
            <GoogleSocialIcon />
            Continue with Google
          </button>

          <button
            class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:pointer-events-none"
            on:click={() => {
              selected_auth_mode = AUTH_MODE.EMAIL;
            }}
            class:hidden={AUTH_MODE.EMAIL === selected_auth_mode}
          >
            <EnvelopeIcon />
            Continue with Email
          </button>

          <button
            class="w-full hover:scale-105 transition duration-100 ease-in-out py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:pointer-events-none"
            on:click={() => {
              selected_auth_mode = AUTH_MODE.PHONE;
            }}
            class:hidden={AUTH_MODE.PHONE === selected_auth_mode}
          >
            <MobileIcon />
            Continue with Phone
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
</style>
