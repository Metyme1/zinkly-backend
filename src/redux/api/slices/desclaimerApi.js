import { baseApi } from "../baseApi";

export const declaimerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDeclaimer: build.query({
      query: () => ({
        url: "/rule/disclaimer",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Disclaimer"],
    }),
    addDisclaimer: build.mutation({
      query: (data) => ({
        url: "/rule/disclaimer",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Disclaimer"],
    }),
    updateDisclaimer: build.mutation({
      query: (data) => {
        return {
          url: `/rule/disclaimer`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Disclaimer"],
    }),
  }),
});

export const {
  useGetDeclaimerQuery,
  useAddDisclaimerMutation,
  useUpdateDisclaimerMutation,
} = declaimerApi;
