import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: "/admin/users",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["User"],
    }),
    getUserProfile: build.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["User"],
    }),

    // updateUserStatus: build.mutation({
    //   query: (args) => {
    //     return {
    //       url: `/users/update-status/${args.id}`,
    //       method: "PATCH",
    //       body: args.data,
    //     };
    //   },
    //   invalidatesTags: ["User"],
    // }),
    updateUserProfile: build.mutation({
      query: (data) => {
        return {
          url: `/user`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
    updateUserProfileImage: build.mutation({
      query: (data) => {
        return {
          url: `/user`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileImageMutation,
  useUpdateUserProfileMutation,
} = userApi;
