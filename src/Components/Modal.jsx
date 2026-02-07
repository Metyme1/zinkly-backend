import React from "react";
import { Modal as AntModal } from "antd";

const Modal = ({ title, open, setOpen, body, width }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <AntModal
      title={<p className="text-[24px] font-medium -mt-2">{title}</p>}
      footer={false}
      open={open}
      onCancel={handleClose}
      styles={{
        body: {
          padding: 0,
          margin: 0,
        },
      }}
      width={width || 500}
    >
      {body}
    </AntModal>
  );
};

export default Modal;
