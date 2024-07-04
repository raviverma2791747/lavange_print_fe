<script>
  //@ts-nocheck
  import Breadcrumb from "../../components/Breadcrumb.svelte";
  import { Accordion } from "bits-ui";
  import { slide } from "svelte/transition";
  import CaretDownIcon from "../../components/svg/CaretDownIcon.svelte";
  import { httpClient } from "../../helper/httpClient";
  import { getHelpConfig } from "../../helper/endpoints";
  import { help_store } from "../../helper/store";
  import {
    PUBLIC_COMPANY_TIMINGS,
    PUBLIC_COMPAY_ADDRESS,
    PUBLIC_SOCIAL_EMAIL,
    PUBLIC_SOCIAL_MOBILE,
  } from "$env/static/public";

  let loading = true;
  let helpConfig = {
    topics: [],
  };

  const initHelpConfig = async () => {
    loading = true;

    if ($help_store) {
      helpConfig = $help_store;
    } else {
      const response = await httpClient(getHelpConfig);

      if (response.status === 200) {
        helpConfig = response.data.helpConfig;
        $help_store = helpConfig;
      }
    }

    loading = false;
  };

  $: {
    initHelpConfig();
  }
</script>

<div class="bg-white max-w-7xl mx-auto px-4 7xl:px-0 mb-4 mt-4">
  <!-- {#if loading}
    <BreadcrumbShimmer count={1} />
    <div class="flex gap-4 flex-col">
      {#each { length: 5 } as item}
        <OrderCardShimmer />
      {/each}
    </div>
  {:else} -->
  <Breadcrumb
    routes={[
      {
        name: "Help",
        path: "/help",
      },
    ]}
  />
  <!-- {/if} -->

  <div class="grid lg:grid-cols-3 gap-4 mb-4">
    <div class="text-center">
      <h2 class="font-semibold text-xl mb-2">Call us Queries</h2>
      <p>
        Helpdesk: {PUBLIC_SOCIAL_MOBILE}
        <br />
        {PUBLIC_COMPANY_TIMINGS}
      </p>
    </div>
    <div class="text-center">
      <h2 class="font-semibold text-xl mb-2">E-Mail Us</h2>
      <p>
        Sales enquiries and customer support: {PUBLIC_SOCIAL_EMAIL}
      </p>
    </div>
    <div class="text-center">
      <h2 class="font-semibold text-xl mb-2">Postal Address</h2>
      <p>
        {PUBLIC_COMPAY_ADDRESS}
      </p>
    </div>
  </div>
  <div>
    <h2 class="font-semibold text-3xl mb-4 text-center">FAQ</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {#each helpConfig.topics as topic}
        <div>
          <h3 class="text-xl font-semibold mb-4 text-center">{topic.title}</h3>
          <Accordion.Root class="w-full">
            {#each topic.faqs as item, i}
              <Accordion.Item
                value="${i}"
                class="group border-b border-dark-10 px-1.5"
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    class="font-semibold flex w-full flex-1 items-center justify-between py-5 text-[15px]  transition-all [&[data-state=open]>span>svg]:rotate-180 "
                  >
                    {item.question}
                    <span
                      class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
                    >
                      <CaretDownIcon
                        class="size-[18px] transition-all duration-200"
                      />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content
                  transition={slide}
                  transitionConfig={{ duration: 200 }}
                  class="pb-[25px]  tracking-[-0.01em]"
                >
                  {@html item.answer}
                </Accordion.Content>
              </Accordion.Item>
            {/each}
          </Accordion.Root>
        </div>
      {/each}
    </div>
  </div>
</div>
