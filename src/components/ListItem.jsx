import React, { useState } from "react";

const ListItem = ({ item, deleteItem, modalOn }) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const onClick = (e) => {
    if (e.target.name === "delete-btn") {
      deleteItem(item.itemId);
    } else {
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
    <div className="card thing-card" onClick={onClick}>
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
