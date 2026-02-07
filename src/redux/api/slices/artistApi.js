import { baseApi } from "../baseApi";

export const artistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getArtist: build.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: "/admin/artists",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Artist"],
    }),

    // updateUserStatus: build.mutation({
    //   query: (args) => {
    //     return {
    //       url: `/users/update-status/${args.id}`,
    //       method: "PATCH",
    //       body: args.data,
    //     };
    //   },
    //   invalidatesTags: ["Artist"],
    // }),
  }),
});

export const { useGetArtistQuery } = artistApi;
