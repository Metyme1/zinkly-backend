import { Modal } from "antd";
import React from "react";
import { imageUrl } from "../redux/api/baseApi";

const UserDetailsModal = ({ open, setOpen, modalData }) => {
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        centered
        footer={false}
        width={500}
      >
        <div className="p-6">
          <div className="flex justify-center items-center flex-col py-5 gap-4">
            <img
              className="w-40 h-28 rounded-lg"
              src={`${imageUrl}/${modalData?.profile}`}
              alt=""
            />
            <p className="text-lg font-semibold">User Information </p>
          </div>
          <div className="flex  justify-center items-center gap-3 w-full">
            <div className="w-full">
              <div className=" w-full flex justify-between   ">
                <p className="w-1/2 text-sm font-semibold mb-1">Name:</p>
                <p className=" w-1/2 text-nowrap text-sm text-start ">
                  {modalData?.name}
                </p>
              </div>

              <div className=" w-full flex my-2">
                <p className="w-1/2 text-sm font-semibold mb-1">Email:</p>
                <p className=" w-1/2 text-nowrap text-sm text-start">
                  {modalData?.email}
                </p>
              </div>

              <div className=" w-full flex ">
                <p className="w-1/2 text-sm font-semibold mb-1">Address:</p>
                <p className=" w-1/2 text-nowrap text-sm text-start">
                  {modalData?.location}
                </p>
              </div>
              <div className=" w-full flex my-2 ">
                <p className="w-1/2 text-sm font-semibold mb-1">Contact No:</p>
                <p className=" w-1/2 text-nowrap text-sm text-start">
                  {modalData?.contact}
                </p>
              </div>
            </div>

            <div> </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDetailsModal;
