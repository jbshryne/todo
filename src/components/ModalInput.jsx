import React, { useState } from "react";

const ModalInput = (value) => {
  const [inputValue, setInputValue] = useState(value);

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <input type="text" defaultValue={inputValue} onChange={onChange}></input>
  );
};

export default ModalInput;
