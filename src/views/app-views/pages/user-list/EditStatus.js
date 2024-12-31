import { Button, Select } from "antd";
import React, { useState } from "react";


const EditStatus = ({ keyName, value, handleValue, name, id, options }) => {
 
  const [editOn, setEditOn] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [valueDisplay, setValueDisplay] = useState(name);
  const { Option } = Select;
  const toggleEdit = () => {
    setEditOn(!editOn);
    setCurrentValue(value);
    setValueDisplay(name)
  };


  const handleSelectChange = (value) => {
    setCurrentValue(value);
    const selectedOption = options.find((option) => option.id === value);
    setValueDisplay(selectedOption.name)
  };

  const saveChanges = () => {
    handleValue(id, keyName, currentValue); // Pass the updated value and key to the parent
    setEditOn(false)
  };

  return editOn ? (
    <>
      <Select
        value={currentValue}  
        onChange={handleSelectChange}
        style={{ margin: "0 24px 0 -8px", width: "200px" }}
        autoFocus
      >
        {options && options.map((option) => (
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
