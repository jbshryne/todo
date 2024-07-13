import React, { useState } from "react";
import ModalInput from "./ModalInput";

const TaskCard = ({
  provided,
  snapshot,
  subject,
  deleteItem,
  category,
  modalOn,
  columnIdx,
  taskIdx,
  value,
  setValue,
  subjectId,
}) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const onClick = (e) => {
    if (e.target.name === "delete-btn") {
      deleteItem(subject._id, category);
    } else if (e.target.name === "task-name") console.log("task name clicked");
    else {
      modalOn(subject);
    }
  };

  const onMouseOver = () => {
    setShowDeleteBtn(true);
  };

  const onMouseOut = () => {
    setShowDeleteBtn(false);
  };

  const setTaskName = (value) => {
    setValue(value, subjectId);
  };

  return (
    <div
      className="card thing-card"
      onClick={onClick}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        userSelect: "none",
        padding: 16,
        // margin: "0 0 8px 0",
        minHeight: "40px",
        backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
        color: "white",
        ...provided.draggableProps.style,
      }}
    >
      <ModalInput name="task-name" value={value} setValue={setTaskName}>
        {showDeleteBtn ? (
          <button
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
        )}{" "}
      </ModalInput>
    </div>
  );
};

export default TaskCard;
