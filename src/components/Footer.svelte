<script>
  import EnvelopeIcon from "./svg/EnvelopeIcon.svelte";
  import PhoneIcon from "./svg/PhoneIcon.svelte";
  import LinkedinIcon from "./svg/LinkedinIcon.svelte";
  import TwitterIcon from "./svg/TwitterIcon.svelte";
  import InstagramIcon from "./svg/InstagramIcon.svelte";
  import {
    PUBLIC_BRAND_NAME,
    PUBLIC_COMPANY_NAME,
    PUBLIC_SOCIAL_EMAIL,
    PUBLIC_SOCIAL_INSTAGRAM,
    PUBLIC_SOCIAL_LINKEDIN,
    PUBLIC_SOCIAL_MOBILE,
    PUBLIC_SOCIAL_TWITTER,
  } from "$env/static/public";
</script>

<footer class="border-t border-gray-200 bg-gray-100 hidden md:block">
  <div class="max-w-7xl mx-auto py-4 divide-y flex flex-col gap-2 px-4 lg:px-0">
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="">
        <h2 class="font-semibold text-xl mb-4">Our Company</h2>
        <ul
          class="marker:text-primary-600 list-disc ps-5 space-y-2 text-gray-600"
        >
          <li><a href="/about">About us</a></li>
          <li><a href="/career">Careers</a></li>
          <!-- <li><a href="/blog">Blog</a></li> -->
        </ul>
      </div>
      <div class="">
        <h2 class="font-semibold text-xl mb-4">Support</h2>
        <ul
          class="marker:text-primary-600 list-disc ps-5 space-y-2 text-gray-600"
        >
          <li><a>Help</a></li>
          <li><a>MyAccount</a></li>
          <li><a>Track Order</a></li>
        </ul>
      </div>
      <div class="">
        <h2 class="font-semibold text-xl mb-4">Important Links</h2>
        <ul
          class="marker:text-primary-600 list-disc ps-5 space-y-2 text-gray-600"
        >
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li>
            <a href="/delivery-and-return-policy">Delivery & Return Policy</a>
          </li>
          <li><a href="/terms-and-conditions">Terms & conditions</a></li>
        </ul>
      </div>
      <div class="ps-5 space-y-2">
        <div class="flex gap-2 text-gray-600">
          <PhoneIcon />
          <div>{PUBLIC_SOCIAL_MOBILE}</div>
        </div>
        <div class="flex gap-2 text-gray-600">
          <EnvelopeIcon />
          <div>{PUBLIC_SOCIAL_EMAIL}</div>
        </div>
        <h2 class="font-semibold text-xl mb-4">Follow us</h2>
        <div class="flex gap-2">
          <a href={PUBLIC_SOCIAL_INSTAGRAM} target="_blank"><InstagramIcon /></a
          >
          <a href={PUBLIC_SOCIAL_TWITTER} target="_blank"><TwitterIcon /></a>
          <a href={PUBLIC_SOCIAL_LINKEDIN} target="_blank"><LinkedinIcon /></a>
        </div>
      </div>
    </div>
    <div class="text-center text-gray-600">
      ©2024 {PUBLIC_BRAND_NAME}
      {#if PUBLIC_COMPANY_NAME}
        powered by {PUBLIC_COMPANY_NAME}
      {/if}. All Rights Reserved.
    </div>
  </div>
</footer>
