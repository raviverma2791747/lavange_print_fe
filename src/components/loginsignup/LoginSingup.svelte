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
  import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_API_URI } from "$env/static/public";
  import { browser } from "$app/environment";
  import * as jwt from "jsonwebtoken-esm";
  import { userLoginFacebook, userLoginGoogle } from "../../helper/endpoints";
  import { page } from "$app/stores";
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
    // PHONE: "PHONE",
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
    FACEBOOK: "FACEBOOK",
  };
  let selected_auth_mode = AUTH_MODE.EMAIL;
  let phone = "";

  if (browser) {
    const googleLoginCallback = async (response) => {
      // handle JWT token inside response...
      // https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions#handle_credential_response
      console.log(response);

      loading_store.set(true);

      const response_ = await httpClient(userLoginGoogle, {
        method: "POST",
        payload: {
          token: response.credential,
        },
      });

      if (response_.status === 200) {
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
        loading_store.set(false);
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

  const getURL = () => {
    return $page.url.href;
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
          class="absolute top-4 left-4 rounded-full hover:text-primary-600 hover:bg-primary-50"
          on:click={() => {
            login_signup_modal_open.set(false);
          }}
        >
          <CloseIcon />
        </button>

        <div>Please Login To Continue</div>
      </div>

      <div class="p-4">
        {#if Object.keys(AUTH_MODE).length}
          {#if AUTH_MODE.PHONE === selected_auth_mode && selected_auth_mode}
            <div class="mb-4">
              <input
                type="number"
                class="w-full py-3 px-4 block border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
      </div>
    </div>
  </div>
{/if}

<style>
</style>
