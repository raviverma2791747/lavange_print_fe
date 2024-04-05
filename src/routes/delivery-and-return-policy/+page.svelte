<script>
    //@ts-nocheck
    import { httpClient } from "../../helper/httpClient";
    import { formatCurrency, formatDate } from "../../helper/utils";
    import { fetchPolicyConfig } from "../../helper/endpoints";
    import { policy_store } from "../../helper/store";
    import { onMount } from "svelte";
    import Breadcrumb from "../../components/Breadcrumb.svelte";
    import BreadcrumbShimmer from "../../components/BreadcrumbShimmer.svelte";
    import { DATE_FORMAT } from "../../helper/constants";
  
    let loading = true;
  
    const initPolicy = async () => {
      loading = true;
  
      if ($policy_store.shipping_and_return_policy) {
        loading = false;
        return;
      }
  
      const response = await httpClient(fetchPolicyConfig, {
        method: "GET",
      });
  
      if (response.status === 200) {
        const policies = response.data.policies;
        const privacy_policy = policies.find((policy) => {
          return policy.name === "privacy-policy";
        });
        const terms_and_conditions = policies.find((policy) => {
          return policy.name === "terms-and-conditions";
        });
        const shipping_and_return_policy = policies.find((policy) => {
          return policy.name === "shipping-and-return-policy";
        });
        $policy_store.privacy_policy = privacy_policy ?? null;
        $policy_store.terms_and_conditions = terms_and_conditions ?? null;
        $policy_store.shipping_and_return_policy =
          shipping_and_return_policy ?? null;
      }
      loading = false;
    };
  
    onMount(async () => {
      await initPolicy();
    });
  </script>
  
  <div
    class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 py-4 min-h-[calc(100vh-64px)] flex flex-col"
  >
    {#if loading}
      <BreadcrumbShimmer count={2} />
    {:else if $policy_store.shipping_and_return_policy}
      <Breadcrumb
        routes={[
          {
            name: "Home",
            path: "/",
          },
          {
            name: "Delivery and Return Policy",
            path: `/delivery-and-return-policy`,
          },
        ]}
      />
      <div class="font-semibold mb-4">
        Last Updated {formatDate(
          $policy_store.shipping_and_return_policy.updatedAt,
          DATE_FORMAT
        )}
      </div>
      <div class="dynamic-html">
        {@html $policy_store.shipping_and_return_policy.description}
      </div>
    {/if}
  </div>
  