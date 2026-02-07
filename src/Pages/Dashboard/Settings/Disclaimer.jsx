import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import Title from "../../../Shared/Title";
import {
  useAddDisclaimerMutation,
  useGetDeclaimerQuery,
  useUpdateDisclaimerMutation,
} from "../../../redux/api/slices/desclaimerApi";
import { notification } from "antd";

const Disclaimer = () => {
  //redux hooks
  const [addDisclaimer] = useAddDisclaimerMutation();
  const { data: disclaimer, isFetching } = useGetDeclaimerQuery({});
  const [updateDisclaimer] = useUpdateDisclaimerMutation();

  // console.log(disclaimer);
  const editor = useRef(null);

  const [content, setContent] = useState("");

  useEffect(() => {
    if (disclaimer?.content) {
      setContent(disclaimer.content);
    }
  }, [disclaimer]);

  const config = {
    readonly: false,
    placeholder: "Start typings...",
    style: {
      height: 400,
    },
  };

  //add disclaimer section
  const handleSubmit = async () => {
    const disclaimerData = {
      content,
    };

    try {
      const res = await addDisclaimer(disclaimerData).unwrap();

      if (res.success) {
        notification.success({
          message: res.message,
          duration: 2,
        });
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

  //update disclaimer section
  const handleUpdateDisclaimer = async () => {
    const disclaimerData = {
      content,
    };

    try {
      const res = await updateDisclaimer(disclaimerData).unwrap();

      if (res.success) {
        notification.success({
          message: res.message,
          duration: 2,
        });
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
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "16px 0",
        }}
      >
        <div>
          <Title className="">Disclaimer</Title>
        </div>
        <div></div>
      </div>
      <div>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
          onChange={(newContent) => {}}
        />
      </div>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {disclaimer?.content ? (
          <button
            onClick={() => handleUpdateDisclaimer()}
            style={{
              height: 44,
              width: 150,
              backgroundColor: "#2461CB",
              color: "white",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Update Changes
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              height: 44,
              width: 150,
              backgroundColor: "#2461CB",
              color: "white",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Save Changes
          </button>
        )}
      </div>
    </>
  );
};

export default Disclaimer;
