import { Button, Form, Input, Modal, Select } from "antd";
import React from "react";
const MakeAdminModal = ({ openAddModel, setOpenAddModel, handleMakeAdmin }) => {
  const [form] = Form.useForm();
  return (
    <div>
      <Modal
        centered
        open={openAddModel}
        onCancel={() => {
          // null;
          setOpenAddModel(false);
        }}
        width={500}
        footer={false}
      >
        <div className="p-6 ">
          <h1
            className="font-semibold text-[#2461CB] text-[20px]"
            style={{ marginBottom: "12px" }}
          >
            {`Add Admin`}
          </h1>
          <Form form={form} onFinish={handleMakeAdmin}>
            <div>
              <p className="text-[#6D6D6D] py-1">Name</p>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input a name",
                  },
                ]}
              >
                <Input
                  className="w-[100%] border outline-none px-3 py-[10px]"
                  type="text"
                />
              </Form.Item>
            </div>

            <div>
              <p className="text-[#6D6D6D] py-1">Email </p>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input a email",
                  },
                ]}
              >
                <Input
                  className="w-[100%] border outline-none px-3 py-[10px]"
                  type="text"
                />
              </Form.Item>
            </div>

            <div>
              <p className="text-[#6D6D6D] py-1">Password </p>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input a Password",
                  },
                ]}
              >
                <Input.Password
                  className="w-[100%] border outline-none px-3 py-[10px]"
                  type="text"
                />
              </Form.Item>
            </div>

            <Form.Item className="text-center mt-6">
              <Button
                htmlType="submit"
                style={{
                  backgroundColor: "#2461CB",
                  width: "100%",
                  height: "45px",
                  color: "white",
                }}
                className="bg-[] px-6 py-3 w-full text-[#FEFEFE] rounded-md"
              >
                create Admin
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default MakeAdminModal;
