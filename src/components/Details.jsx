import React, { useState } from "react";
import DetailItem from "./DetailItem";
// import { Draggable, Droppable } from "react-beautiful-dnd";

const Details = ({ selectedItem, addDetail, deleteDetail, editDetail }) => {
  const [inputValue, setInputValue] = useState("");

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEditDetail = (detail) => {
    console.log(detail, selectedItem);
    editDetail(detail, selectedItem);
  };

  const handleDeleteDetail = (detailId) => {
    deleteDetail(detailId, selectedItem);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addDetail(inputValue, selectedItem);
    setInputValue("");
  };

  let checkList;
  if (selectedItem.details[0]) {
    // console.log(selectedItem.details);
    checkList = (
      // <Droppable droppableId={selectedItem.itemId}>
      //   {(provided) => (
      <ul
      // {...provided.droppableProps} ref={provided.innerRef}
      >
        {selectedItem.details.map((detail, idx) => (
          // <Draggable
          //   key={detail.detailId}
          //   draggableId={detail.detailId.toString()}
          //   index={idx}
          // >
          //   {(provided) => (
          <DetailItem
            // provided={provided}
            detail={detail}
            key={detail.detailId}
            deleteDetail={handleDeleteDetail}
            editDetail={handleEditDetail}
          />
        ))}
        {/* // </Draggable> */}
        {/* // } */}
        {/* {provided.placeholder} */}
      </ul>
      // )}
      // </Droppable>
    );
  }

  return (
    <div name="details" className="card details-card">
      <h2>{selectedItem.content}</h2>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          value={inputValue}
          name="detail"
          placeholder="What's one detail?"
        />
        <button>Add Detail</button>
      </form>
      {checkList}
    </div>
  );
};

export default Details;
