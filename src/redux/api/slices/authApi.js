import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: build.mutation({
      query: (data) => {
        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: data,
        };
      },
    }),
    changePassword: build.mutation({
      query: (data) => {
        return {
          url: "/auth/change-password",
          method: "POST",
          body: data,
        };
      },
    }),
    verifyOtp: build.mutation({
      query: (data) => {
        return {
          url: "/auth/verify-email",
          method: "POST",
          body: data,
        };
      },
    }),
    resendOtp: build.mutation({
      query: (data) => {
        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: data,
        };
      },
    }),
    resetPassword: build.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: data,
          headers: {
            Authorization: `${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
} = authApi;
