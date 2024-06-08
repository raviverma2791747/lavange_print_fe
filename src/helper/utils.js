//@ts-nocheck
import { format } from "date-fns";

export const formatDate = (date, format_string) => {
  return format(date, format_string);
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function formatPercentage(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "percent",
  }).format(amount);
}

export const getByValue = (obj, val) => {
  return Object.keys(obj).find((key) => obj[key] === val);
};

export const getAvatarName = (obj) => {
  let avatar_name = "  ";
  if (obj.hasOwnProperty("firstName") && obj.firstName) {
    avatar_name = "" + obj.firstName.charAt(0);
  }

  if (obj.hasOwnProperty("lastName") && obj.lastName) {
    avatar_name += obj.lastName.charAt(0);
  }

  return avatar_name;
};
