import React, { useCallback, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Input, Select, Table } from "antd";
import Swal from "sweetalert2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoArrowUpRight } from "react-icons/go";
import Title from "../../Shared/Title";
import TransactionModal from "../../Components/TransactionModal";
import { useGetTransactionQuery } from "../../redux/api/slices/transactionApi";
import { imageUrl } from "../../redux/api/baseApi";
import _ from "lodash";

const OrderTransaction = () => {
  const [page, setPage] = useState(
    new URLSearchParams(window.location.search).get("page") || 1
  );
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { data: transactionData, isFetching } = useGetTransactionQuery([
    { name: "page", value: page },
    { name: "search", value: search },
    { name: "status", value: paymentStatus },
  ]);
  const [modalData, setModalData] = useState(null);
  const [open, setOpen] = useState(false);
  // console.log(transactionData);
  const columns = [
    {
      title: "S.No",
      dataIndex: "_id",
      key: "_id",
      render: (_, record, index) => {
        return <p>{index + 1}</p>;
      },
    },
    {
      title: "User Name",
      dataIndex: "user",
      key: "user",
      render: (_, record) => {
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
                height: 48,
                width: 48,
                borderRadius: 8,
                backgroundSize: "cover",
              }}
              src={`${imageUrl}/${record?.user?.profile}`}
              alt="ok"
            />
            <p
              style={{
                letterSpacing: 0.4,
                fontSize: "#666666",
                fontWeight: "400",
              }}
            >
              {record?.user?.name}
            </p>
          </div>
        );
      },
    },
    {
      title: "User Name",
      dataIndex: "artist",
      key: "artist",
      render: (_, record) => {
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
                height: 48,
                width: 48,
                borderRadius: 8,
                backgroundSize: "cover",
              }}
              // src={`${imageUrl}/${record?.artist?.profile}`}
              src={
                record?.artist?.profile ===
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  ? record?.profile
                  : `${imageUrl}/${record?.artist?.profile}`
              }
              alt="ok"
            />
            <p
              style={{
                letterSpacing: 0.4,
                fontSize: "#666666",
                fontWeight: "400",
              }}
            >
              {record?.artist?.name}
            </p>
          </div>
        );
      },
    },

    {
      title: " Booking Date",
      dataIndex: "booking_date",
      key: "booking_date",
    },
    {
      title: "Booking Time",
      dataIndex: "booking_time",
      key: "booking_time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        // Define colors for different statuses
        const getStatusStyles = (status) => {
          switch (status.toLowerCase()) {
            case "accepted":
              return { color: "#00B047", background: "#00B047" };
            case "complete":
              return { color: "#007BFF", background: "#007BFF" };
            case "rejected":
              return { color: "#F27405", background: "#F27405" };
            case "pending":
              return { color: "#FFC107", background: "#FFC107" };
            default:
              return { color: "#666666", background: "#666666" }; // Default style
          }
        };

        const { color, background } = getStatusStyles(status);

        return (
          <p
            style={{
              letterSpacing: 0.4,
              fontSize: 14, // Adjusted to proper value
              fontWeight: "400",
              display: "flex",
              alignItems: "center",
              dataIndex: "status",
              key: "status",
              gap: 4,
            }}
          >
            <span
              style={{
                height: 20,
                width: 20,
                borderRadius: 50,
                background: background,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></span>

            <span
              style={{
                color: color,
              }}
            >
              {status}
            </span>
          </p>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            onClick={() => {
              setOpen(true);
              setModalData(record);
            }}
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
              background: "white",
            }}
          >
            <GoArrowUpRight className="text-xl font-bold text-[#2461CB] " />
          </button>
        </div>
      ),
    },
  ];

  const handleChange = (value) => {
    setPaymentStatus(value);
  };

  const status = [
    { value: "", label: "All" },
    { value: "Accepted", label: "Accepted" },
    { value: "refunded", label: "Refunded" },
    { value: "Rejected", label: "Rejected" },
    { value: "Pending", label: "Pending" },
  ];

  const handlePageChange = (page) => {
    setPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  //debounce for search
  const debouncedSearch = useCallback(
    _.debounce((searchText) => {
      setSearch(searchText);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
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
            <Title className="">Transaction Details</Title>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Input
              onChange={handleSearch}
              placeholder="Search Something...."
              prefix={<IoSearchOutline className="text-2xl text-gray-400" />}
              style={{ width: "400px", height: "40px" }}
            />
            <Select
              defaultValue="Status"
              style={{ width: 120, height: "40px" }}
              onChange={handleChange}
              options={status}
            />
          </div>
        </div>
        <div>
          <Table
            loading={isFetching}
            columns={columns}
            dataSource={transactionData?.data}
            pagination={{
              pageSize: 10,
              defaultCurrent: parseInt(page),
              onChange: handlePageChange,
              total: transactionData?.meta?.total,
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} out of ${total}`,
              defaultPageSize: 20,
              // defaultCurrent: 1,
            }}
          />
        </div>
      </div>
      <TransactionModal modalData={modalData} open={open} setOpen={setOpen} />
    </div>
  );
};

export default OrderTransaction;
