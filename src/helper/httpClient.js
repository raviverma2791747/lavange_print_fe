//@ts-nocheck
import { PUBLIC_API_URI } from "$env/static/public";

export const httpClient = async (
  endpoint,
  config = {
    method: "GET",
  }
) => {
  let url = `${PUBLIC_API_URI}${endpoint}`;
  let options = {
    method: config.method,
  };

  let headers = new Headers();

  if (config.token) {
    headers.append("Authorization", `Bearer ${config.token}`);
  }

  if (config.payload) {
    headers.append("Content-Type", "application/json");
    options.body = JSON.stringify(config.payload);
  }

  if (config.queryParams) {
    url += `?${new URLSearchParams(config.queryParams).toString()}`;
  }

  options.headers = headers;

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};
