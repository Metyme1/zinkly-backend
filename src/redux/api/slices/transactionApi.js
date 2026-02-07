import { baseApi } from "../baseApi";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransaction: build.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: "/admin/transactions",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Transaction"],
    }),

    // deleteTransaction: build.mutation({
    //   query: (args) => {
    //     return {
    //       url: `/admin/transactions/${args.id}`,
    //       method: "PATCH",
    //       body: args.data,
    //     };
    //   },
    //   invalidatesTags: ["Artist"],
    // }),
  }),
});

export const { useGetTransactionQuery } = transactionApi;
