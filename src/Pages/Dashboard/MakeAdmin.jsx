import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button, notification, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import Title from "../../Shared/Title";
import MakeAdminModal from "../../Components/MakeAdminModal";
import {
  useAddAdminMutation,
  useDeleteAdminMutation,
  useGetAdminQuery,
} from "../../redux/api/slices/adminApi";

const SalonCategoryList = () => {
  const [addAdmin] = useAddAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const { data: admins, isFetching } = useGetAdminQuery({});
  // console.log(admins);
  const [openAddModel, setOpenAddModel] = useState(false);

  const [page, setPage] = useState(
    new URLSearchParams(window.location.search).get("page") || 1
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteAdmin(id).unwrap();
        if (res.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "_id",
      key: "_id",
      width: 150,
      render: (_, record, index) => {
        return <p>{index + 1}</p>;
      },
    },
    {
      title: "Admin Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Admin Email",
      dataIndex: "email",
      key: "email",
      render: (email) => {
        return <p>{email ? email : "----------"}</p>;
      },
    },
    {
      title: "Contact No",
      dataIndex: "contact",
      key: "contact",
      render: (contact) => {
        return <p>{contact ? contact : "----------"}</p>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      textAlign: "center",
      render: (_, record) => (
        <button
          onClick={() => handleDelete(record?._id)}
          style={{
            cursor: "pointer",
            border: "none",
            outline: "none",
            background: "white",
            color: "#808080",
          }}
        >
          <FaRegTrashAlt size={20} />
        </button>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  // add new admin
  const handleMakeAdmin = async (values) => {
    const makeAdminData = {
      ...values,
      role: "ADMIN",
    };

    try {
      const res = await addAdmin(makeAdminData).unwrap();
      if (res.success) {
        notification.success({
          message: res.message,
          duration: 2,
        });
        setOpenAddModel(false);
      }
    } catch (error) {
      notification.error({
        message:
          (error.data && error.data.message) ||
          "Something went wrong while adding disclaimer!!!",
        duration: 2,
      });
    }
  };
  return (
    <div>
      <div
        style={{
          padding: "20px",
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
            <Title>Make Admin</Title>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              onClick={() => setOpenAddModel(true)}
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
              Create admin profile
            </Button>
          </div>
        </div>
        <div>
          <Table
            pagination={false}
            loading={isFetching}
            columns={columns}
            style={{}}
            dataSource={admins}
            // pagination={{
            //   pageSize: 10,
            //   defaultCurrent: parseInt(page),
            //   onChange: handlePageChange,
            //   total: 85,
            //   showTotal: (total, range) =>
            //     `Showing ${range[0]}-${range[1]} out of ${total}`,
            //   defaultPageSize: 20,
            //   //   defaultCurrent: 1,
            //   style: {
            //     marginBottom: 20,
            //     marginLeft: 20,
            //     marginRight: 20,
            //     width: "100%",
            //     display: "flex",
            //     // gap: 10,
            //     // justifyContent: "space-between",
            //   },
            // }}
          />
        </div>
      </div>
      <MakeAdminModal
        handleMakeAdmin={handleMakeAdmin}
        openAddModel={openAddModel}
        setOpenAddModel={setOpenAddModel}
      />
    </div>
  );
};

export default SalonCategoryList;
