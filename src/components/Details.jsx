import React, { useState } from "react";
import DetailItem from "./DetailItem";

const Details = ({ selectedItem, addDetail, deleteDetail, editDetail }) => {

  const [inputValue, setInputValue] = useState("");

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEditDetail = (detail) => {
    editDetail(detail, selectedItem)
  }

  const handleDeleteDetail = (detailId) => {
    deleteDetail(detailId, selectedItem)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    addDetail(inputValue, selectedItem);
    setInputValue("");
  };

  let checkList;
  if (selectedItem.details[0]) {
    checkList = (
      <ul>
        {selectedItem.details.map((detail) => (
          <DetailItem
            detail={detail}
            key={detail.detailId}
            deleteDetail={handleDeleteDetail}
            editDetail={handleEditDetail}
          />
        ))}
      </ul>
    );
  }

  return (
    <div name="details" className="card details-card">
      <h2>{selectedItem.theThing}</h2>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          value={inputValue}
          name="theThing"
          placeholder="What's one detail?"
        />
        <button>Add Detail</button>
      </form>
      {checkList}
    </div>
  );
};

export default Details;
