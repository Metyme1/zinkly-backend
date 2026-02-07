import { Button, Checkbox, Form, Input, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import loginImg from "../../assets/Login.png";
import { useLoginUserMutation } from "../../redux/api/slices/authApi";
import { storeToken } from "../../lib/tokenManagement";
const Login = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const onFinish = async (values) => {
    const loginUserInfo = {
      email: values.email,
      password: values.password,
      rememberMe: values.remember,
    };

    // login user
    try {
      const res = await loginUser(loginUserInfo).unwrap(); 
      console.log(res);
      if (res.success) {
        notification.success({
          message: res.message,
          duration: 2,
        });
        storeToken(res.data.token);
        navigate("/");
      }
    } catch (error) {
      // console.log(error, "from login user");

      notification.error({
        message:
          (error.data && error.data.message) ||
          "Something went wrong while logging!!!",
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
        position: "relative",
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
          position: "relative",
          zIndex: 9999,
        }}
        onFinish={onFinish}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "black",
            textAlign: "center",
            fontWeight: 500,
            marginBottom: "10px",
          }}
        >
          Login in to Account
        </h1>
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            {" "}
            Email{" "}
          </label>
          <Form.Item
            style={{ marginBottom: 0 }}
            name="email"
            id="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              type="email"
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

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{ display: "block", marginBottom: "5px" }}
            htmlFor="password"
          >
            Password
          </label>
          <Form.Item
            style={{ marginBottom: 0 }}
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter your password"
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ color: "#6A6D7C" }}>Remember me</Checkbox>
          </Form.Item>
          <a
            className="login-form-forgot"
            style={{ color: "#6A6D7C" }}
            href="/forgot-password"
          >
            Forgot password
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
            style={{
              height: "52px",
              fontWeight: "400px",
              fontSize: "18px",
              background: "#1B4998",
              marginTop: "56px",
            }}
          >
            {isLoading ? "Loading..." : " Sign In"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
