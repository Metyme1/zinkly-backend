import React, { useEffect, useState } from "react";
import { Button, Form, Input, notification, Slider, Table } from "antd";
import { CiEdit } from "react-icons/ci";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileImageMutation,
  useUpdateUserProfileMutation,
} from "../../redux/api/slices/userApi";
import { useChangePasswordMutation } from "../../redux/api/slices/authApi";
import { imageUrl } from "../../redux/api/baseApi";

const AdminProfile = () => {
  const { data: user } = useGetUserProfileQuery({});
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [updateUserProfileImage] = useUpdateUserProfileImageMutation();
  const [isEdit, setIsEdit] = useState(true);
  const [form] = Form.useForm();

  // console.log(user);

  //for default profile data
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        contact: user.contact,
        location: user.location,
      });
    }
  }, [user]);
  //change profile image function
  const onImageChange = async (event) => {
    const image = event.target.files[0];

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        try {
          const res = await updateUserProfileImage(formData).unwrap();
          // console.log(res);
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
              "Something went wrong while updating profile image!!!",
            duration: 2,
          });
        }
      } catch (error) {}
    }
  };

  //for changing user password
  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return notification.error({
        message: "Confirm password did'nt match!!!",
        duration: 2,
      });
    }

    try {
      const res = await changePassword(values).unwrap();
      // console.log(res);
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
          "Something went wrong while changing password!!!",
        duration: 2,
      });
    }
  };

  //for updaing use profile
  const handleUpdateProfile = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        formData.append(key, values[key]);
      }
    }

    try {
      const res = await updateUserProfile(formData).unwrap();
      // console.log(res);
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
          "Something went wrong while updating profile!!!",
        duration: 2,
      });
    }
  };
  return (
    <div className="mt-5">
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "16px 0",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
          ></div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                position: "relative",
              }}
            >
              <img
                src={`${imageUrl}/${user?.profile}`}
                alt=""
                style={{
                  height: 114,
                  width: 119,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.35)",
                }}
              />
              <label
                htmlFor="imageUpload"
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: -10,
                  backgroundColor: "white",
                  width: 35,
                  height: 35,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <CiEdit size={25} color="#929394" />
              </label>
            </div>
            <p
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: "#333333",
              }}
            >
              {user ? user.name : "Anonymous"}
            </p>
          </div>
          <input
            id="imageUpload"
            type="file"
            src=""
            onChange={onImageChange}
            style={{ display: "none" }}
            alt=""
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 35,
              marginBottom: 35,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 33,
              }}
            >
              <p
                onClick={() => setIsEdit(true)}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: isEdit ? "#2461CB" : "#818181",
                  cursor: "pointer",
                  borderBottom: isEdit ? "3px solid #2461CB" : "none",
                  padding: "6px 0px",
                }}
              >
                Edit Profile
              </p>
              <p
                onClick={() => setIsEdit(false)}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: isEdit ? "#818181" : "#2461CB",
                  cursor: "pointer",
                  borderBottom: isEdit ? "none" : "3px solid #2461CB",
                  padding: "6px 0px",
                }}
              >
                Change Password
              </p>
            </div>
          </div>
          {isEdit ? (
            <div>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#2461CB",
                  textAlign: "center",
                }}
              >
                Edit Your Profile
              </p>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile} // Handle form submit
                initialValues={user}
              >
                <div
                  style={{
                    marginTop: 25,
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    gap: 25,
                  }}
                >
                  <Form.Item
                    label="User Name"
                    name="name"
                    rules={[
                      {
                        message: "Please input your user name!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Admin Marie"
                      style={{
                        padding: "10px",
                        color: "#818181",
                        fontSize: 14,
                        fontWeight: 400,
                        margin: "8px 0px",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ message: "Please input your email!" }]}
                  >
                    <Input
                      placeholder="Camille@gmail.com"
                      style={{
                        padding: "10px",
                        color: "#818181",
                        fontSize: 14,
                        fontWeight: 400,
                        margin: "8px 0px",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Contact No"
                    name="contact"
                    rules={[
                      {
                        message: "Please input your contact no!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="+99007007007"
                      style={{
                        padding: "10px",
                        color: "#818181",
                        fontSize: 14,
                        fontWeight: 400,
                        margin: "8px 0px",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Address"
                    name="location"
                    rules={[{ message: "Please input your address!" }]}
                  >
                    <Input
                      placeholder="79/A Joker Vila, Gotham City"
                      style={{
                        padding: "10px",
                        color: "#818181",
                        fontSize: 14,
                        fontWeight: 400,
                        margin: "8px 0px",
                      }}
                    />
                  </Form.Item>
                </div>

                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      height: 44,
                      width: 150,
                      borderRadius: "8px",
                      fontWeight: 500,
                      fontSize: 14,
                      backgroundColor: "#2461CB",
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                style={{ width: "543px", height: "fit-content" }}
                onFinish={handleChangePassword}
              >
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      margin: "0px 0px",
                      color: "#636363",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Current Password
                  </label>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please input your current password!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter Password"
                      type="password"
                      style={{
                        border: "1px solid #E0E4EC",
                        height: "52px",
                        background: "white",
                        borderRadius: "8px",
                        outline: "none",
                        margin: "8px 0px 0px 0px",
                      }}
                    />
                  </Form.Item>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      margin: "0px 0px",
                      color: "#636363",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                    htmlFor=""
                  >
                    New Password
                  </label>
                  <Form.Item
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please input your new Password!",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input.Password
                      placeholder="Enter Password"
                      type="password"
                      style={{
                        border: "1px solid #E0E4EC",
                        height: "52px",
                        background: "white",
                        borderRadius: "8px",
                        outline: "none",
                        margin: "8px 0px 0px 0px",
                      }}
                    />
                  </Form.Item>
                </div>

                <div style={{ marginBottom: "40px" }}>
                  <label
                    style={{
                      margin: "0px 0px",
                      color: "#636363",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                    htmlFor="email"
                  >
                    Re-Type Password
                  </label>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Re-type Password!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter Password"
                      type="password"
                      style={{
                        border: "1px solid #E0E4EC",
                        height: "52px",
                        background: "white",
                        borderRadius: "8px",
                        outline: "none",
                        margin: "8px 0px 0px 0px",
                      }}
                    />
                  </Form.Item>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        marginTop: 24,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        htmlType="submit"
                        style={{
                          height: 44,
                          width: 150,
                          backgroundColor: "#2461CB",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
