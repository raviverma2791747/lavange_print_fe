<script>
  //@ts-nocheck
  import { user_info_store } from "../../helper/store";
  import UserIcon from "../../components/svg/UserIcon.svelte";
  import AddressIcon from "../../components/svg/AddressIcon.svelte";
  import ShieldIcon from "../../components/svg/ShieldIcon.svelte";
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0">
    <h1 class="font-semibold text-xl md:text-3xl text-center mb-4">Account</h1>
    <div class="grid md:grid-cols-4 gap-4">
      <a
        href="/account/personal-info"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="flex flex-col items-center">
          <div class="hidden md:block">
            <UserIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Personal Info</div>
        </div>
      </a>
      <a
        href="/account/address"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="flex flex-col items-center">
          <div class="hidden md:block">
            <AddressIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Address</div>
        </div>
      </a>
      <a
        href="/account/login-and-security"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="flex flex-col items-center">
          <div class="hidden md:block">
            <ShieldIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Login & Security</div>
        </div>
      </a>
      <a
        href="/order"
        class="text-gray-800 flex items-center justify-center p-2 md:aspect-[4/3] border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="flex flex-col items-center">
          <div class="hidden md:block">
            <ShieldIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold md:text-xl">Orders</div>
        </div>
      </a>
    </div>
  </div>
{:else}
  <h1>Please login</h1>
{/if}
