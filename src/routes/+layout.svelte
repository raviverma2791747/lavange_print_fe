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

  const initUserInfo = async () => {
    const response = await httpClient(getUserInfo, {
     
    });

    if (response.status === 200) {
      user_info_store.set(response.data.user);
      // login_signup_modal_open.set(false);
    } else {
   
    }
  };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist, {
     
    });

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    } else {
      wishlist_store.set([]);
    }
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart, {
 
    });

    if (response.status === 200) {
      cart_store.set([...response.data.cart]);
    } else {
      cart_store.set([]);
    }
  };

  user_info_store.subscribe(async (user) => {
    if (user) {
      initWishlist();
      initCart();
    }
  });

  onMount(async () => {
    await initUserInfo();
  });
</script>

<MetaTags
  title="Brand Print"
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
  {#if $network_error}
    <NetworkError />
  {:else}
    <slot />
  {/if}
</div>
<Footer />
<BottomNavbar />
<LoginSingup open={$login_signup_modal_open} />

{#if $loading_store}
  <Loading />
{/if}
