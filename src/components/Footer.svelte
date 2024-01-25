<script>
  import EnvelopeIcon from "./svg/EnvelopeIcon.svelte";
  import PhoneIcon from "./svg/PhoneIcon.svelte";
  import LinkedinIcon from './svg/LinkedinIcon.svelte';
  import TwitterIcon from './svg/TwitterIcon.svelte';
  import InstagramIcon from './svg/InstagramIcon.svelte';

</script>
<footer class="border-t border-gray-200 bg-gray-100 hidden lg:block">
  <div class="max-w-7xl mx-auto py-4 divide-y flex flex-col gap-2 px-4 lg:px-0">
    <div class="grid lg:grid-cols-4">
      <div class="">
        <h2 class="font-semibold text-xl mb-4">Our Company</h2>
        <ul
          class="marker:text-purple-600 list-disc ps-5 space-y-2 text-gray-600"
        >
          <li><a>About us</a></li>
          <li><a>Careers</a></li>
          <li><a>Blog</a></li>
        </ul>
      </div>
      <div class="">
        <h2 class="font-semibold text-xl mb-4">Support</h2>
        <ul
          class="marker:text-purple-600 list-disc ps-5 space-y-2 text-gray-600"
        >
          <li><a>Help</a></li>
          <li><a>MyAccount</a></li>
          <li><a>Track Order</a></li>
        </ul>
      </div>
      <div class="">
        <h2 class="font-semibold text-xl mb-4">Important Links</h2>
        <ul
          class="marker:text-purple-600 list-disc ps-5 space-y-2 text-gray-600"
        >
          <li><a>Privacy Policy</a></li>
          <li><a>Delivery & Return Policy</a></li>
          <li><a>Terms & conditions</a></li>
        </ul>
      </div>
      <div class="ps-5 space-y-2 ">
           <div class="flex gap-2 text-gray-600">
             <PhoneIcon/>
             <div>+91-0123456789</div>
           </div>
           <div class="flex gap-2 text-gray-600">
            <EnvelopeIcon/>
            <div>care@gmail.com</div>
          </div>
          <h2 class="font-semibold text-xl mb-4">Follow us</h2>
          <div class="flex gap-2">
            <a><InstagramIcon/></a>
            <a><TwitterIcon/></a>
            <a><LinkedinIcon/></a>
          </div>
      </div>
    </div>
    <div class="text-center text-gray-600">
        ©2023 Lavange Pvt. Ltd.. All Rights Reserved.
    </div>
  </div>
</footer>
