import { useState } from "react";

const ModalInput = ({ children, name, value, setValue, checklist, idx }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const handleSetValue = (e) => {
    if (e.target.value === "") {
      console.log("empty string");
      setCurrentValue(value);
      setIsEditing(false);
      return;
    }
    const duplicate = checklist?.find((item) => item.item === e.target.value);
    if (duplicate) {
      console.log("duplicate item");
      setCurrentValue(value);
      setIsEditing(false);
      return;
    }

    setValue(e.target.value, idx);
    setIsEditing(false);
  };

  const handleInputFocus = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleInputBlur = (e) => {
    handleSetValue(e);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSetValue(e);
    } else if (e.key === "Escape") {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          name={name}
          value={currentValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      ) : (
        <div
          name={name}
          onClick={handleInputFocus}
          style={{ cursor: "pointer", width: "fit-content" }}
        >
          {value || "Click to add"}
        </div>
      )}
      {children}
    </div>
  );
};

export default ModalInput;
