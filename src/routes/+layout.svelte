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
    token_store,
    user_info_store,
    wishlist_store,
    loading_store,
  } from "../helper/store";
  import {
    getUserInfo,
    getUserWishlist,
    getUserCart,
  } from "../helper/endpoints";
  import Loading from "../components/Loading.svelte";

  const initUserInfo = async () => {
    const response = await httpClient(getUserInfo, {
      token: $token_store,
    });

    if (response.status === 200) {
      user_info_store.set(response.data.user);
      // login_signup_modal_open.set(false);
    } else {
      token_store.set(null);
    }
  };

  const initWishlist = async () => {
    const response = await httpClient(getUserWishlist, {
      token: $token_store,
    });

    if (response.status === 200) {
      wishlist_store.set([...response.data.wishList]);
    } else {
      wishlist_store.set([]);
    }
  };

  const initCart = async () => {
    const response = await httpClient(getUserCart, {
      token: $token_store,
    });

    if (response.status === 200) {
      cart_store.set([...response.data.cart]);
    } else {
      cart_store.set([]);
    }
  };

  token_store.subscribe(async (token) => {
    if (token) {
      initUserInfo();
      initWishlist();
      initCart();
    }
  });

  onMount(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      token_store.set(token);
    }
  });
</script>

<div class="min-h-screen">
  <Header />
  <slot />
</div>
<Footer />
<BottomNavbar />
<LoginSingup open={$login_signup_modal_open} />

{#if $loading_store}
  <Loading />
{/if}
