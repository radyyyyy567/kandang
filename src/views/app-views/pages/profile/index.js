import React, { useState, useEffect } from "react";
import { Card, Row, Col, Avatar, Button, Spin, Table, message } from "antd";
import { GlobalOutlined, MailOutlined, HomeOutlined, PhoneOutlined } from "@ant-design/icons";
import { fetchMe, updateMe } from "api/me";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import EditUser from "./EditUser";
import EditStatus from "./EditStatus";
import EditPassword from "./EditPassword";
import { fetchDatas as fetchPosition } from "api/position";
import { fetchDatas as fetchDivision } from "api/division";
import { getUserDetails } from "api/user";
import { triggerFocus } from "antd/es/input/Input";

const ProfileInfo = ({ avatarSize, userInfo }) => (
  <Card>
    <Row justify="center">
      <Col sm={24} md={23}>
        <div className="d-md-flex">
          <div
            className="rounded p-2 bg-white shadow-sm mx-auto"
            style={{ marginTop: "-3.5rem", maxWidth: `${avatarSize + 16}px` }}
          >
            <Avatar shape="square" size={avatarSize} src="/img/avatars/thumb-15.jpg" />
          </div>
          <div className="ml-md-4 w-100">
            <Flex alignItems="center" mobileFlex={false} className="mb-3 text-md-left text-center">
              <h2 className="mb-0 mt-md-0 mt-2">{userInfo.name}</h2>
              <div className="ml-md-3 mt-3 mt-md-0">
                <Button size="small" type="primary">Follow</Button>
                <Button size="small" className="ml-2">Message</Button>
              </div>
            </Flex>
            <Row gutter="16">
              <Col sm={24} md={8}>
                <p className="text-muted text-md-left text-center">
                  It is a long established fact that a reader will be distracted.
                </p>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Row className="mb-2">
                  <Col xs={12} md={9}>
                    <MailOutlined className="text-primary font-size-md" />
                    <span className="text-muted ml-2">Email:</span>
                  </Col>
                  <Col xs={12} md={15}>
                    <span className="font-weight-semibold">{userInfo.email}</span>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={9}>
                    <PhoneOutlined className="text-primary font-size-md" />
                    <span className="text-muted ml-2">Phone:</span>
                  </Col>
                  <Col xs={12} md={15}>
                    <span className="font-weight-semibold">{userInfo.phone}</span>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Row className="mb-2">
                  <Col xs={12} md={9}>
                    <HomeOutlined className="text-primary font-size-md" />
                    <span className="text-muted ml-2">Address:</span>
                  </Col>
                  <Col xs={12} md={15}>
                    <span className="font-weight-semibold">{userInfo.address}</span>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={9}>
                    <GlobalOutlined className="text-primary font-size-md" />
                    <span className="text-muted ml-2">Website:</span>
                  </Col>
                  <Col xs={12} md={15}>
                    <span className="font-weight-semibold">{userInfo.website}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    </Row>
  </Card>
);

const EditProfile = ({ userTable, statusTable, loading, onSavePassword, closePassword }) => (
  <Card title="Edit Profile">
    <Spin spinning={loading}>
      <Table
        columns={[
          { title: "", dataIndex: "key", width: "30%" },
          { title: "", dataIndex: "value" },
        ]}
		style={{marginBottom: "24px"}}
		className="small"
        dataSource={userTable}
        rowKey="key"
        pagination={false}
        showHeader={false}
      />
      <Button disabled={closePassword} danger onClick={onSavePassword} style={{ marginBottom: "24px" }}>
        Change Password
      </Button>
      <Table
        columns={[
          { title: "", dataIndex: "key", width: "30%" },
          { title: "", dataIndex: "value" },
        ]}
		className="small"
        dataSource={statusTable}
        rowKey="key"
        pagination={false}
        showHeader={false}
      />
    </Spin>
  </Card>
);

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [positionData, setPositionData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [password, setPassword] = useState("");
  const [closePassword, setClosePassword] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [user, positions, divisions] = await Promise.all([fetchMe(), fetchPosition(), fetchDivision()]);
      setUserInfo(user);
	  console.log(user)
      setPositionData(positions);
      setDivisionData(divisions);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserValue = async ( key, value) => {
   

    if (!key) {
      console.error("Key is required to update the object");
      return;
    }
    const dataChange = {
      type: userInfo.type,
      username: userInfo.username,
      name: userInfo.name,
      mail: userInfo.mail,
      id_position: userInfo.position.id,
      id_division: userInfo.division.id,
    };

    // Create a shallow copy of the data object and update the key
    const updatedData = { ...dataChange, [key]: value };

    try {
      // Call the API to update user details
      const response = await updateMe(updatedData);

      // Show success message
      message.success("User updated successfully!");
      console.log("User updated successfully:", response);
      await fetchUserData();
      // Additional actions, e.g., update the UI
    } catch (error) {
      // Show error message
      message.error(`Failed to update user: ${error.message}`);
      console.error("Error while updating user:", error.message);
    }
  };

  const handleChangeInputPassword = (e) => {
	setPassword(e.target.value)
	console.log(password)
	setClosePassword(false)
  }

  const handleSavePasswordChange = () => {
    updateUserValue("password", password);
	setClosePassword(true)
  };

  const handleClosePassword = () =>
  {
	setClosePassword(true)
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const userTable = [
    {
      key: "Name",
      value: <EditUser keyName="name" value={userInfo.name} handleValue={updateUserValue} />
    },
    {
      key: "Email",
      value: <EditUser keyName="email" value={userInfo.mail} handleValue={updateUserValue} />,
    },
    {
      key: "Username",
      value: <EditUser keyName="username" value={userInfo.username} handleValue={updateUserValue} />,
    },
    {
      key: "Password",
      value: (
        <EditPassword
          keyName="password"
          handleInputChange={handleChangeInputPassword}
          closePasswordSave={handleClosePassword}
        />
      ),
    },
  ];

  const statusTable = [
    {
      key: "Position",
      value: (
        <EditStatus
          keyName="id_position"
          value={userInfo.position?.id}
          name={userInfo.position?.name}
          handleValue={updateUserValue}
          
          options={positionData}
        />
      ),
    },
    {
      key: "Division",
      value: (
        <EditStatus
          keyName="id_division"
          value={userInfo.division?.id}
          name={userInfo.division?.name}
          handleValue={updateUserValue}
          
          options={divisionData}
        />
      ),
    },
    {
      key: "Role",
      value: <div>{userInfo.type}</div>,
    },
  ];

  return (
    <>
      <PageHeaderAlt background="/img/others/img-12.jpg" cssClass="bg-primary" overlap>
        <div className="container text-center">
          <div className="py-5 my-md-5"></div>
        </div>
      </PageHeaderAlt>
      <div className="container my-4">
        <ProfileInfo avatarSize={150} userInfo={userInfo} />
        <EditProfile
          userTable={userTable}
          statusTable={statusTable}
          loading={loading}
          onSavePassword={handleSavePasswordChange}
		  closePassword={closePassword}
        />
      </div>
    </>
  );
};

export default Profile;
