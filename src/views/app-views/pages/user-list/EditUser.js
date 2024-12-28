import { Button, Input } from "antd";
import React, { useState } from "react";

const EditUser = ({ keyName, value, handleValue }) => {
  const [editOn, setEditOn] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const toggleEdit = () => {
    setEditOn(!editOn);
  };

  const handleInputChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const saveChanges = () => {
    handleValue(keyName, currentValue); // Pass the updated value and key to the parent
    setEditOn(false); // Exit edit mode
  };

  return editOn ? (
    <>
      <Input
        value={currentValue}
        onChange={handleInputChange}
        style={{ margin: "0 24px 0 -8px", paddingLeft: "8px", paddingRight: "8px" }}
        autoFocus
      />
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

export default EditUser;
