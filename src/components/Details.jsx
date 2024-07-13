import React, { useState } from "react";
import DetailItem from "./DetailItem";
// import { Draggable, Droppable } from "react-beautiful-dnd";

const Details = ({ selectedSubject, addDetail, deleteDetail, editDetail }) => {
  const [inputValue, setInputValue] = useState("");

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEditDetail = (detail) => {
    // console.log(detail, selectedSubject);
    editDetail(detail, selectedSubject);
  };

  const handleDeleteDetail = (detailId) => {
    deleteDetail(detailId, selectedSubject);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addDetail(inputValue, selectedSubject);
    setInputValue("");
  };

  let checkList;

  // console.log(selectedSubject);

  if (selectedSubject.details[0]) {
    // console.log(selectedSubject.details);
    checkList = (
      // <Droppable droppableId={selectedSubject.itemId}>
      //   {(provided) => (
      <ul
      // {...provided.droppableProps} ref={provided.innerRef}
      >
        {selectedSubject.details?.map((detail, detailIdx) => (
          // <Draggable
          //   key={detail.detailId}
          //   draggableId={detail.detailId.toString()}
          //   index={detailIdx}
          // >
          //   {(provided) => (
          <DetailItem
            // provided={provided}
            detail={detail}
            key={detailIdx}
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
      <h2>{selectedSubject.content}</h2>
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
