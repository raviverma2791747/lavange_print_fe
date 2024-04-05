import { writable } from "svelte/store";

export const login_signup_modal_open = writable(false);
export const loading_store = writable(false);
export const user_info_store = writable(null);
export const token_store = writable(null);
export const wishlist_store = writable([]);
export const cart_store = writable([]);
export const homeConfig_store = writable(null);
export const searchFilters_store = writable({
  categories: [],
  collections: [],
  sizes: [],
});
export const header_title_store = writable("");
export const network_error = writable(false);
export const notification_store = writable([]);
export const policy_store = writable({
  privacy_policy: null,
  terms_and_conditions: null,
  shipping_and_return_policy: null,
});
