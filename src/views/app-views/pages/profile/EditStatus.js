import { Button, Select } from "antd";
import React, { useState, useEffect } from "react";

const EditStatus = ({ keyName, value, handleValue, name, options }) => {
  const [editOn, setEditOn] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [valueDisplay, setValueDisplay] = useState(name);
  const { Option } = Select;

  // Synchronize state with props
  useEffect(() => {
    setCurrentValue(value);
    setValueDisplay(name);
  }, [value, name]);

  const toggleEdit = () => {
    setEditOn(!editOn);
  };

  const handleSelectChange = (value) => {
    setCurrentValue(value);
    const selectedOption = options.find((option) => option.id === value);
    setValueDisplay(selectedOption ? selectedOption.name : "");
  };

  const saveChanges = () => {
    handleValue(keyName, currentValue); // Pass the updated value and key to the parent
    setEditOn(false);
  };

  return editOn ? (
    <>
      <Select
        value={currentValue}
        onChange={handleSelectChange}
        style={{ margin: "0 24px 0 -8px", width: "200px" }}
        autoFocus
      >
        {options &&
          options.map((option) => (
            <Option key={option.id} value={option.id}>
              {option.name}
            </Option>
          ))}
      </Select>
      <Button type="primary" onClick={saveChanges} style={{ marginRight: 8 }}>
        Save
      </Button>
      <Button onClick={toggleEdit}>Cancel</Button>
    </>
  ) : (
    <>
      <div>{valueDisplay}</div>
      <Button onClick={toggleEdit}>Edit</Button>
    </>
  );
};

export default EditStatus;
