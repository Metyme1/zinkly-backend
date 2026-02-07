import { baseApi } from "../baseApi";

export const termsConditionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTerms: build.query({
      query: () => ({
        url: "/rule/terms-and-conditions",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Terms"],
    }),
    addTerms: build.mutation({
      query: (data) => ({
        url: "/rule/terms-and-conditions",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Terms"],
    }),
    updateTerms: build.mutation({
      query: (data) => {
        return {
          url: `/rule/terms-and-conditions`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Terms"],
    }),
  }),
});

export const { useGetTermsQuery, useAddTermsMutation, useUpdateTermsMutation } =
  termsConditionApi;
