import React, { useState } from "react";

const ListItem = ({ item, deleteItem, modalOn, provided, category }) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const onClick = (e) => {
    if (e.target.name === "delete-btn") {
      deleteItem(item.itemId, category);
    } else {
      console.log("onClick runs");
      modalOn(item.itemId);
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
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <li
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        style={{ position: "relative" }}
      >
        {item.theThing}{" "}
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
    </div>
  );
};

export default ListItem;
