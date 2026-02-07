import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import loginImg from "../../assets/Login.png";
import { useResetPasswordMutation } from "../../redux/api/slices/authApi";

const UpdatePassword = () => {
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      return notification.error({
        message: "Confirm password did'nt match!!!",
        duration: 2,
      });
    }

    const resetPasswordInfo = { newPassword, confirmPassword };
    try {
      const res = await resetPassword(resetPasswordInfo).unwrap();
      if (res.success) {
        notification.success({
          message: res.message,
          duration: 2,
        });

        navigate("/login");
      }
    } catch (error) {
      notification.error({
        message:
          (error.data && error.data.message) ||
          "Something went wrong while reset password!!!",
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
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        style={{
          width: "630px",
          background: "white",
          borderRadius: "12px",
          padding: "90px 57px",
        }}
        onFinish={onFinish}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "black",
            marginBottom: "13px",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Set a new password
        </h1>
        <p
          style={{
            color: "#6A6D7C",
            fontSize: "14px",
            fontWeight: 400,
            margin: "0 auto 0 auto",
          }}
        >
          Create a new password. Ensure it differs from previous ones for
          security
        </p>

        <div style={{ margin: "45px 0 20px 0" }}>
          <label
            style={{ display: "block", color: "#6A6D7C", marginBottom: "5px" }}
            htmlFor=""
          >
            New Password
          </label>
          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: " Password must be at least 8 characters",
                min: 8,
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input.Password
              type="password"
              placeholder="Enter New password"
              style={{
                border: "1px solid #E0E4EC",
                height: "52px",
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <label
            style={{ display: "block", color: "#6A6D7C", marginBottom: "5px" }}
            htmlFor="email"
          >
            Confirm Password
          </label>
          <Form.Item
            style={{ marginBottom: 0 }}
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Confirm Password must be at least 8 characters",
                min: 8,
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter Confirm password"
              style={{
                border: "1px solid #E0E4EC",
                height: "52px",
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              border: "none",
              height: "51px",
              background: "#1B4998",
              color: "white",
              borderRadius: "8px",
              outline: "none",
              marginTop: "",
            }}
          >
            UPDATE
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePassword;
