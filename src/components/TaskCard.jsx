import React, { useState } from "react";

const TaskCard = ({
  provided,
  snapshot,
  item,
  deleteItem,
  category,
  modalOn,
}) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const onClick = (e) => {
    if (e.target.name === "delete-btn") {
      //   console.log(item);
      deleteItem(item.id, category);
    } else {
      console.log("onClick runs");
      modalOn(item);
    }
  };

  const onMouseOver = () => {
    setShowDeleteBtn(true);
  };

  const onMouseOut = () => {
    setShowDeleteBtn(false);
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
      {item.content}
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
      )}
    </div>
  );
};

export default TaskCard;
