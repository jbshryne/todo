import React, { useState } from "react";
import ModalInput from "./ModalInput";

const DetailItem = ({ detail, deleteDetail, editDetail, provided }) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [isChecked, setIsChecked] = useState(detail.isChecked);

  const onClick = (e) => {
    if (e.target.name === "delete-btn") {
      deleteDetail(detail.detailId);
    }
  };

  const toggleChecked = (e) => {
    // e.stopPropagation();
    setIsChecked(!isChecked);
    editDetail({ ...detail, isChecked: !isChecked });
  };

  const onMouseOver = () => {
    setShowDeleteBtn(true);
  };

  const onMouseOut = () => {
    setShowDeleteBtn(false);
  };

  const handleEditDetail = (e) => {
    console.log(e);
    editDetail({ ...detail, text: e });
  };

  return (
    <li
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      // ref={provided.innerRef}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{ position: "relative", display: "flex" }}
    >
      <label style={{ display: "flex", width: "fit-content" }}>
        <input
          type="checkbox"
          name="checkbox"
          defaultChecked={isChecked}
          onClick={toggleChecked}
          style={{ width: "fit-content" }}
        ></input>
      </label>
      <ModalInput
        name="detail"
        value={detail.text}
        setValue={handleEditDetail}
      />
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
