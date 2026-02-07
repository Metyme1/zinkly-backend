import React, { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaRegImage, FaRegTrashAlt } from "react-icons/fa";
import { Button, Form, Input, notification, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import Modal from "../../../Components/Modal";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "../../../redux/api/slices/categoryApi";
import { imageUrl } from "../../../redux/api/baseApi";
import AddCategory from "../../../Components/Form/AddCategoryForm";
import UpdateCategoryForm from "../../../Components/Form/UpdateCategoryForm";

const Category = () => {
  const [openModal, setOpenModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [addCategory] = useAddCategoryMutation();
  const { data: categories } = useGetCategoryQuery({});
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [updateId, setUpdateId] = useState(null);

  const [form] = Form.useForm();
  const [page, setPage] = useState(
    new URLSearchParams(window.location.search).get("page") || 1
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Show the success alert first
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(async () => {
          // Delete the category after the success alert
          try {
            await deleteCategory(id).unwrap();
            // Optionally handle any additional success logic here
          } catch (error) {
            // Handle errors here if needed
            console.error("Error deleting category:", error);
          }
        });
      }
    });
  };

  const handlePageChange = (page) => {
    setPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    window.history.pushState(null, "", `?${params.toString()}`);
  };
  //add category to backend
  const handleAddCategory = async (values) => {
    const categoryInfo = {
      categoryName: values.title,
      image: values.image.file,
    };

    const formData = new FormData();
    formData.append("categoryName", categoryInfo.categoryName);
    formData.append("image", categoryInfo.image);
    try {
      const res = await addCategory(formData).unwrap();

      if (res.success) {
        form.resetFields();
        setOpenModal(false);
        notification.success({
          message: res.message,
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message:
          (error.data && error.data.message) ||
          "Something went wrong while add category!!!",
        duration: 2,
      });
    }
  };
  //update category to backend
  const handleUpdateCategory = async (values) => {
    const categoryInfo = {
      categoryName: values.title,
      image: values.image.file,
    };

    const formData = new FormData();
    formData.append("categoryName", categoryInfo.categoryName);
    formData.append("image", categoryInfo.image);

    const updateData = {
      data: formData,
      id: updateId,
    };
    try {
      const res = await updateCategory(updateData).unwrap();

      if (res.success) {
        setUpdateModal(false);
        notification.success({
          message: res.message,
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message:
          (error.data && error.data.message) ||
          "Something went wrong while update category!!!",
        duration: 2,
      });
    }
  };

  ///colum
  const columns = [
    {
      title: "S.No",
      dataIndex: "_id",
      key: "_id",
      width: 100,
      render: (_, record, index) => {
        return <p>{index + 1}</p>;
      },
    },
    {
      title: "Category Image",
      dataIndex: "image",
      key: "image",
      width: 200,
      render: (img) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              style={{
                height: 45,
                width: 52,
                borderRadius: 8,
                backgroundSize: "cover",
              }}
              src={`${imageUrl}/${img}`}
              alt="category"
            />
          </div>
        );
      },
    },

    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      textAlign: "center",
      render: (_, record) => (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            onClick={() => {
              setUpdateModal(true);
              setUpdateId(record._id);
            }}
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
              color: "#2461CB",
              fontWeight: 800,
            }}
          >
            <CiEdit size={25} />
          </button>
          <button
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
              background: "white",
              color: "#808080",
            }}
            onClick={() => handleDelete(record?._id)}
          >
            <FaRegTrashAlt size={20} />
          </button>
        </p>
      ),
    },
  ];
  return (
    <div>
      <div
        style={{
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
          <div>
            <h3
              style={{
                color: "#2461CB",
                fontSize: 26,
                fontWeight: "600",
              }}
            >
              Categories
            </h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              onClick={() => setOpenModal(true)}
              style={{
                borderRadius: 8,
                background: "#2461CB",
                height: 40,
                color: "white",
                fontSize: 14,
                fontWeight: "400",
              }}
              icon={<PlusOutlined />}
            >
              Add Category
            </Button>
          </div>
        </div>
        <div>
          <Table
            columns={columns}
            style={{}}
            dataSource={categories}
            pagination={false}
            // pagination={{
            //   pageSize: 10,
            //   defaultCurrent: parseInt(page),
            //   onChange: handlePageChange,
            //   total: 85,
            //   showTotal: (total, range) =>
            //     `Showing ${range[0]}-${range[1]} out of ${total}`,
            // }}
          />
        </div>
      </div>

      <Modal
        title={"Add Category"}
        body={<AddCategory handleAddCategory={handleAddCategory} form={form} />}
        open={openModal}
        setOpen={setOpenModal}
        // width={500} 
        key={"category-modal"}
      />
      <Modal
        title={"Update Category"}
        body={
          <UpdateCategoryForm handleUpdateCategory={handleUpdateCategory} />
        }
        open={updateModal}
        setOpen={setUpdateModal}
        // width={500} 
        key={"category-modal-update"}
      />
    </div>
  );
};

export default Category;
