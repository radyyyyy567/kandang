import { Button, Select } from "antd";
import React, { useState } from "react";

const { Option } = Select;

const EditStatus = ({ keyName, value, handleValue, id }) => {
  const [editOn, setEditOn] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const toggleEdit = () => {
    setEditOn(!editOn);
  };

  

  const handleSelectChange = (value) => {
    setCurrentValue(value);
  };

  const saveChanges = () => {
    handleValue(id, keyName, currentValue); // Pass the updated value and key to the parent
    toggleEdit(); // Exit edit mode
  };

  return editOn ? (
    <>
      <Select
        value={currentValue}
        onChange={handleSelectChange}
        style={{ margin: "0 24px 0 -8px", width: "200px" }}
        autoFocus
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
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
      <div>{currentValue}</div>
      <Button onClick={toggleEdit}>Edit</Button>
    </>
  );
};

export default EditStatus;
