import React, { useState } from "react";

const DetailItem = ({ detail, deleteDetail, editDetail, provided }) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [isChecked, setIsChecked] = useState(detail.isChecked);

  const onClick = (e) => {
    if (e.target.name === "delete-btn") {
      deleteDetail(detail.detailId);
    }
  };

  const toggleChecked = (e) => {
    // console.log("toggleChecked runs");
    // console.log(detail);
    setIsChecked(!isChecked);
    editDetail({ ...detail, isChecked: !detail.isChecked });
  };

  const onMouseOver = () => {
    setShowDeleteBtn(true);
  };

  const onMouseOut = () => {
    setShowDeleteBtn(false);
  };

  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{ position: "relative" }}
    >
      <label>
        <input
          type="checkbox"
          name="checkbox"
          checked={isChecked ? true : false}
          onChange={toggleChecked}
        ></input>
        {detail.text}
      </label>
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
