//@ts-nocheck
import { writable } from "svelte/store";

export const product_cache = writable(new Map());
export const collection_cache = writable(new Map());
export const order_cache = writable(new Map());


