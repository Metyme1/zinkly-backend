import React, { useCallback, useState } from "react";
import { Input, Table } from "antd";
import { GoArrowUpRight } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import Title from "../../Shared/Title";
import { RiDeleteBin6Line } from "react-icons/ri";
import MusicianModal from "../../Components/MusicianModal";
import { useGetArtistQuery } from "../../redux/api/slices/artistApi";
import { imageUrl } from "../../redux/api/baseApi";
import _ from "lodash";

const Musician = () => {
  const [page, setPage] = useState(
    new URLSearchParams(window.location.search).get("page") || 1
  );
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  //redux hooks
  const { data: artists, isFetching } = useGetArtistQuery([
    { name: "page", value: page },
    { name: "search", value: search },
  ]);
  const [modalData, SetModalData] = useState(null);
  // console.log(artists);
  const handleDelete = (id) => {
    Swal.fire({
      title: id,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Backend api not provided",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

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
      title: "Musician Name",
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
              src={
                record?.profile ===
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  ? record?.profile
                  : `${imageUrl}/${record?.profile}`
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
              {record?.name}
            </p>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Contact Number",
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
      render: (_, record) => (
        <div className=" flex items-center gap-2 ">
          <button
            onClick={() => {
              setOpen(true), SetModalData(record);
            }}
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
            }}
          >
            <GoArrowUpRight className="text-xl font-semibold text-[#2461CB]" />
          </button>

          <button onClick={() => handleDelete(record?._id)}>
            <RiDeleteBin6Line className="text-xl font-semibold text-red-500" />
          </button>
        </div>
      ),
    },
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
      <div className=" flex  items-center justify-between my-3">
        <Title className="">Musician</Title>
        <Input
          onChange={handleSearch}
          placeholder="Search Something...."
          prefix={<IoSearchOutline className="text-2xl text-gray-400" />}
          style={{ width: "400px", height: "45px" }}
        />
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <div>
          <Table
            loading={isFetching}
            columns={columns}
            dataSource={artists?.data}
            pagination={{
              pageSize: 10,
              defaultCurrent: parseInt(page),
              onChange: handlePageChange,
              total: artists?.meta?.total,
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} out of ${total}`,
              defaultPageSize: 20,
              // defaultCurrent: 1,
            }}
          />
        </div>
      </div>
      <MusicianModal open={open} setOpen={setOpen} modalData={modalData} />
    </div>
  );
};

export default Musician;
