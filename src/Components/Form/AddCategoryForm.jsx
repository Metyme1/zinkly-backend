import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import React, { useState } from "react";

const AddCategory = ({ form, handleAddCategory }) => {
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  const handleChange = (info) => {
    let fileList = [...info.fileList];

    // Keep only the last uploaded file (single image)
    fileList = fileList.slice(-1);
    setFileList(fileList);

    // Generate preview for the selected image
    if (fileList.length > 0 && fileList[0].originFileObj) {
      setImagePreview(URL.createObjectURL(fileList[0].originFileObj));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Form form={form} onFinish={handleAddCategory}>
      {/* Category Name Input */}
      <div>
        <p className="text-[#6D6D6D] py-1">Category Name</p>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input category name" }]}
        >
          <Input
            className="w-[100%] border outline-none px-3 py-[10px]"
            type="text"
            placeholder="Enter category name"
          />
        </Form.Item>
      </div>

      {/* Image Upload Section */}
      <div>
        <p className="text-[#6D6D6D] py-1">Category Image</p>
        <Form.Item
          rules={[{ required: true, message: "Please input category image" }]}
          style={{
            width: "100%",
          }}
          name="image"
        >
          <Upload
            style={{
              width: "100%",
              maxHeight: "100px",
            }}
            fileList={fileList} // Controlled file list
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleChange}
            accept="image/*" // Only allow image files
          >
            <Button
              icon={<UploadOutlined />}
              style={{
                width: "100%", // Make the button full width
                display: "block", // Ensure the button takes up full width
                height: "50px",
              }}
            >
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        {/* Preview the selected image */}
        {imagePreview && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={imagePreview}
              alt="Selected Category"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
      {/* Submit Button */}
      <div className="text-center mt-6">
        <button className="bg-[#2461CB] px-6 py-3 w-full text-[#FEFEFE] rounded-md">
          Confirm
        </button>
      </div>
    </Form>
  );
};

export default AddCategory;
