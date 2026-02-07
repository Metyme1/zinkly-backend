import { Modal } from "antd";
import React from "react";
import { FaCircle } from "react-icons/fa";

const TransactionModal = ({ open, setOpen, modalData }) => {
  // console.log(modalData);
  return (
    <div>
      <Modal
        centered
        footer={false}
        open={open}
        onCancel={() => setOpen(false)}
        width={500}
      >
        <div className="py-3 px-8">
          <h1 className=" font-semibold text-xl text-center py-3">
            Transaction Details
          </h1>
          <div className="p-6 flex flex-col justify-start gap-2 pt-8">
            <div className="flex justify-between items-center">
              <p className="text-[#000000] text-sm whitespace-nowrap">
                Transaction ID:
              </p>
              <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">
                {modalData?.transactionId}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#000000] text-sm whitespace-nowrap">
                Client Name:
              </p>
              <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">
                {modalData?.user?.name}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#000000] text-sm whitespace-nowrap">
                Musician Name
              </p>
              <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">
                {modalData?.artist?.name}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#000000] text-sm whitespace-nowrap">Date</p>
              <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">
                {modalData?.booking_date}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#000000] text-sm whitespace-nowrap">Time</p>
              <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">
                {modalData?.booking_time}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#000000] text-sm whitespace-nowrap">
                Lesson Type
              </p>
              <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">
                {modalData?.lesson_type ? modalData?.lesson_type : "Unknown"}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#000000] text-sm whitespace-nowrap">
                Duration
              </p>
              <p className="text-[#000000] text-sm font-medium whitespace-nowrap">
                {modalData?.duration ? modalData?.duration : "Not Specified"}
              </p>
            </div>

            <div
              className={`flex justify-start items-center gap-2 ${
                modalData?.status.toLowerCase() === "accepted"
                  ? "text-[#00B047]"
                  : modalData?.status.toLowerCase() === "complete"
                  ? "text-[#007BFF]"
                  : modalData?.status.toLowerCase() === "rejected"
                  ? "text-[#F27405]"
                  : modalData?.status.toLowerCase() === "pending"
                  ? "text-[#FFC107]"
                  : "text-[#666666]" // Default color for unknown statuses
              }`}
            >
              <FaCircle className="text-lg" />
              {modalData?.status}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionModal;
