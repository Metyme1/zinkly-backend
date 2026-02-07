import { Modal } from "antd";
import React from "react";
import { imageUrl } from "../redux/api/baseApi";

const MusicianModal = ({ open, setOpen, modalData }) => {
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        centered
        footer={false}
        width={550}
      >
        <div className="p-6">
          <div className="flex justify-center items-center flex-col py-5 gap-4">
            <img
              className="w-56 h-32 rounded-lg"
              // src={`${imageUrl}/${modalData?.profile}`}

              src={
                modalData?.profile ===
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  ? modalData?.profile
                  : `${imageUrl}/${modalData?.profile}`
              }
              alt=""
            />
            <p className="text-nowrap  font-semibold text-xl">
              Musician Information
            </p>
          </div>

          <div className="flex   justify-center items-center w-full  mx-auto gap-3">
            <div className="w-full">
              <div className=" w-full flex">
                <p className="w-1/2 text-sm font-semibold mb-1">Name</p>
                <p className=" w-1/2 text-sm text-end">{modalData?.name}</p>
              </div>

              <div className=" w-full flex  my-2">
                <p className="w-1/2 text-sm font-semibold mb-1">Email</p>
                <p className="text-nowrap  w-1/2 text-sm text-end ">
                  {modalData?.email}
                </p>
              </div>

              <div className=" w-full flex ">
                <p className="text-nowrap w-1/2 text-sm font-semibold mb-1">
                  Address
                </p>
                <p className="text-nowrap  w-1/2 text-sm text-end">
                  {modalData?.location}
                </p>
              </div>

              <div className=" w-full flex my-2 ">
                <p className="text-nowrap w-1/2 text-sm font-semibold mb-1">
                  Contact No
                </p>
                <p className="text-nowrap  w-1/2 text-sm text-end">
                  {modalData?.contact}
                </p>
              </div>

              <div className=" w-full flex my-2 ">
                <p className="text-nowrap w-1/2 text-sm font-semibold mb-1">
                  Genre
                </p>
                <p className="text-nowrap  w-1/2 text-sm text-end">
                  {modalData?.lesson?.genre}
                </p>
              </div>
              <div className=" w-full flex my-2 ">
                <p className="text-nowrap w-1/2 text-sm font-semibold mb-1">
                  Bio
                </p>
                <p className="text-nowrap  w-1/2 text-sm text-end">
                  {modalData?.lesson?.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    //  dfsd
  );
};

export default MusicianModal;
