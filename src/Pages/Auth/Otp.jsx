import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import loginImg from "../../assets/Login.png";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../../redux/api/slices/authApi";
import { storeToken } from "../../lib/tokenManagement";

const Otp = () => {
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const email = JSON.parse(localStorage.getItem("email"));

  const handleVerifyOtp = async () => {
    const otpVerifyInfo = {
      email: email,
      oneTimeCode: Number(otp),
    };

    try {
      const res = await verifyOtp(otpVerifyInfo).unwrap();
      // console.log(res);
      if (res.success) {
        Swal.fire({
          title: "Password Reset",
          text: "Your password has been successfully reset. click confirm to set a new password",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Confirm",
          confirmButtonColor: "#F27405",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/update-password");
            storeToken(res.data);
          }
        });
      }
    } catch (error) {
      notification.error({
        message:
          (error.data && error.data.message) ||
          "Something went wrong while otp send!!!",
        duration: 2,
      });
    }
  };

  //resent otp
  const handleResendOtp = async () => {
    const resendOtpInfo = {
      email: email,
    };

    try {
      const res = await resendOtp(resendOtpInfo).unwrap();
      if (res.success) {
        notification.success({
          message: res.message,
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message:
          (error.data && error.data.message) ||
          "Something went wrong while resend otp!!!",
        duration: 2,
      });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundImage: `url(${loginImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "630px",
          background: "white",
          borderRadius: "12px",
          padding: "90px 57px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "#6A6D7C",
            marginBottom: "13px",
            textAlign: "center",
          }}
        >
          Check your email
        </h1>
        <p
          className="max-w-[40ch]"
          style={{ width: "", color: "#B8B8B8", margin: "0 auto 0 auto" }}
        >
          We sent a reset link to{" "}
          <span style={{ color: "#545454" }}> {email} </span>
          enter 6 digit code that mentioned in the email
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            inputStyle={{
              height: "44px",
              width: "44px",
              borderRadius: "8px",
              marginRight: "16px",
              fontSize: "20px",
              border: "1px solid #A9A9A9",
              color: "#2B2A2A",
              outline: "none",
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>
        <Button
          onClick={handleVerifyOtp}
          block
          htmlType="submit"
          style={{
            height: "52px",
            fontWeight: "400px",
            fontSize: "18px",
            color: "white",
            background: "#1B4998",
            marginTop: "30px",
            border: "none",
            outline: "none",
            marginBottom: "20px",
          }}
        >
          Verify
        </Button>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Didn’t receive code?
          <p
            onClick={handleResendOtp}
            style={{
              color: "#1B4998",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Resend{" "}
          </p>
        </p>
      </div>
    </div>
  );
};

export default Otp;
