import { Button, Input } from "antd";
import React, { useState } from "react";

const EditPassword = ({ keyName, handleInputChange, closePasswordSave }) => {
  const [editOn, setEditOn] = useState(false);

  const toggleEdit = () => {
    setEditOn(!editOn);
    closePasswordSave();
  };

  return editOn ? (
    <>
      <Input
        type="password"
        defaultValue={"password"}
        onChange={handleInputChange}
        style={{
          margin: "0 24px 0 -8px",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
        autoFocus
      />
      <Button onClick={toggleEdit}>Cancel</Button>
    </>
  ) : (
    <>
      <div>{"******"}</div>
      <Button onClick={toggleEdit}>Edit</Button>
    </>
  );
};

export default EditPassword;
