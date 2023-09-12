import React, { useState } from "react";

const DetailItem = ({ detail, deleteDetail }) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const onClick = (e) => {
    if (e.target.name === "delete-btn") {
      deleteDetail(detail.detailId);
    } 
  };

  const onMouseOver = () => {
    setShowDeleteBtn(true);
  };

  const onMouseOut = () => {
    setShowDeleteBtn(false);
  };

  return (
    <li
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{ position: "relative" }}
    >
      <input name={detail.detailId} type="checkbox"></input>
      <label htmlFor={detail.detailId}>{detail.text}</label>
      {showDeleteBtn ? (
        <button
          onClick={onClick}
          name="delete-btn"
          style={{
            position: "absolute",
            right: 0,
          }}
        >
          X
        </button>
      ) : (
        ""
      )}
    </li>
  );
};

export default DetailItem;
