import { baseApi } from "../baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdmin: build.query({
      query: () => ({
        url: "/admin/get-admin",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Admin"],
    }),
    addAdmin: build.mutation({
      query: (data) => ({
        url: "/admin/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteAdmin: build.mutation({
      query: (id) => {
        return {
          url: `/admin/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const { useGetAdminQuery, useAddAdminMutation, useDeleteAdminMutation } =
  adminApi;
