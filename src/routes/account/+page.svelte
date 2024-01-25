<script>
  //@ts-nocheck
  import { user_info_store } from "../../helper/store";
  import UserIcon from "../../components/svg/UserIcon.svelte";
  import AddressIcon from "../../components/svg/AddressIcon.svelte";
  import ShieldIcon from "../../components/svg/ShieldIcon.svelte";
</script>

{#if $user_info_store}
  <div class="bg-white max-w-5xl mx-auto px-4 5xl:px-0">
    <h1 class="font-semibold text-3xl text-center mb-4">Account</h1>
    <div class="grid lg:grid-cols-4 gap-4">
      <a
        href="/account/personal-info"
        class="text-gray-800 flex items-center justify-center aspect-[4/3] border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="flex flex-col items-center">
          <div>
            <UserIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold text-xl">Personal Info</div>
        </div>
      </a>
      <a
        href="/account/address"
        class="text-gray-800 flex items-center justify-center aspect-[4/3] border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="flex flex-col items-center">
          <div>
            <AddressIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold text-xl">Address</div>
        </div>
      </a>
      <a
        href="/account/login-and-security"
        class="text-gray-800 flex items-center justify-center aspect-[4/3] border border-gray-200 rounded-lg hover:shadow"
      >
        <div class="flex flex-col items-center">
          <div>
            <ShieldIcon class="h-10 w-10" />
          </div>
          <div class="font-semibold text-xl">Login & Security</div>
        </div>
      </a>
    </div>
  </div>
{:else}
  <h1>Please login</h1>
{/if}
