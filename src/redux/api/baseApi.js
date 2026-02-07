import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://148.230.84.69:5000/api/v1",
    prepareHeaders: (header) => {
      const token = localStorage.getItem("token");
      if (token) {
        header.set("Authorization", `Bearer ${token}`);
      }
    },
  }),
  tagTypes: [
    "Faq",
    "User",
    "Privacy-Policy",
    "Category",
    "Disclaimer",
    "Terms",
    "Artist",
    "Transaction",
    "Stats",
  ],
  endpoints: () => ({}),
});

export const imageUrl = "http://148.230.84.69:5000/";
