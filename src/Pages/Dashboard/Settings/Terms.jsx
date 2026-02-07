import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import Title from "../../../Shared/Title";
import {
  useAddTermsMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
} from "../../../redux/api/slices/termsConditionApi";
import { notification } from "antd";

const Terms = () => {
  const { data: terms } = useGetTermsQuery({});
  const [addTerms] = useAddTermsMutation();
  const [updateTerms] = useUpdateTermsMutation();
  const editor = useRef(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (terms?.content) {
      setContent(terms.content);
    }
  }, [terms]);

  //add disclaimer section
  const handleSubmit = async () => {
    const termsData = {
      content,
    };

    try {
      const res = await addTerms(termsData).unwrap();

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

  // //update disclaimer section
  const handleUpdate = async () => {
    const termsData = {
      content,
    };

    try {
      const res = await updateTerms(termsData).unwrap();

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
  const config = {
    readonly: false,
    placeholder: "Start typings...",
    style: {
      height: 400,
    },
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
          <Title> Terms & Condition </Title>
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
        {terms ? (
          <button
            onClick={handleUpdate}
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

export default Terms;
