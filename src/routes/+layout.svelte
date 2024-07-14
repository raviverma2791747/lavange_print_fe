<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import "../app.css";
  import Footer from "../components/Footer.svelte";
  import Header from "../components/Header.svelte";
  import BottomNavbar from "../components/BottomNavbar.svelte";
  import Banner from "../components/Banner.svelte";
  import LoginSingup from "../components/loginsignup/LoginSingup.svelte";
  import { httpClient } from "../helper/httpClient";
  import {
    cart_store,
    login_signup_modal_open,
    user_info_store,
    wishlist_store,
    loading_store,
    network_error,
    authenticating_store,
    appliedFilters_store,
  } from "../helper/store";
  import {
    getUserInfo,
    getUserWishlist,
    getUserCart,
  } from "../helper/endpoints";
  import Loading from "../components/Loading.svelte";
  import { MetaTags } from "svelte-meta-tags";
  import NetworkError from "../components/NetworkError.svelte";
  import Cookies from "js-cookie";
  import { PUBLIC_BRAND_NAME } from "$env/static/public";
  import { page } from "$app/stores";
  import { STATUS } from "../helper/constants";
  import { processCart } from "../helper/utils";

  const initUserInfo = async () => {
    authenticating_store.set(true);
    const response = await httpClient(getUserInfo, {});

    if (response.status === 200) {
      user_info_store.set(response.data.user);
    } else {
    }
    authenticating_store.set(false);
  };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist, {});

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    } else {
      wishlist_store.set([]);
    }
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart, {});

    if (response.status === 200) {
      const cart = processCart(response.data.cart);
      cart_store.set([...cart]);
    } else {
      cart_store.set([]);
    }
  };

  const initFilters = async () => {
    const collections =
      $page.url.searchParams.get("collections")?.split(",") ?? [];
    const categories =
      $page.url.searchParams.get("categories")?.split(",") ?? [];
    const sort = $page.url.searchParams.get("sort") ?? "createdAt";
    const order = $page.url.searchParams.get("order") ?? "desc";
    const q = $page.url.searchParams.get("q") ?? "";

    $appliedFilters_store = {
      ...$appliedFilters_store,
      collections: collections,
      categories: categories,
      sort: sort,
      order: order,
      q: q,
    };
  };

  user_info_store.subscribe(async (user) => {
    if (user) {
      initWishlist();
      initCart();
    }
  });

  onMount(async () => {
    //await initFilters();
    await initUserInfo();
  });
</script>

<MetaTags
  title={PUBLIC_BRAND_NAME}
  titleTemplate="%s"
  description="Brand Print - Home of your next print."
  canonical="https://www.print.lavange.in"
  openGraph={{
    url: "https://www.print.lavange.in",
    title: "Brand Print",
    description: "Brand Print - Home of your next print.",
    images: [
      {
        url: "https://www.print.lavange.in/og_img.png",
        width: 1200,
        height: 630,
        alt: "Og Image Alt",
      },
    ],
    siteName: "SiteName",
  }}
  twitter={{
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
    title: "Brand Print",
    description: "Brand Print - Home of your next print.",
    image: "https://www.print.lavange.in/og_img.png",
    imageAlt: "Twitter image alt",
  }}
/>

<div class="min-h-screen">
  <Header />
  {#if $network_error && $page.url.pathname !== "/career" && $page.url.pathname !== "/about"}
    <NetworkError />
  {:else}
    <slot />
  {/if}
</div>
<BottomNavbar />
<Footer />

<LoginSingup open={$login_signup_modal_open} />

{#if $loading_store}
  <Loading />
{/if}
