import React, { Component } from "react";
import {
  Card,
  Table,
  Tag,
  Tooltip,
  message,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
} from "antd";

import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Search from "antd/es/input/Search";

import {
  fetchUsers,
  createUserInCompany,
  getUserDetails,
  updateUserById,
  deleteUserById,
} from "api/user";
import EditUser from "./EditUser";
import { fetchDatas as fetchPosition } from "api/position";
import { fetchDatas as fetchDivision } from "api/division";
import EditStatus from "./EditStatus";
import EditPassword from "./EditPassword";

export class UserList extends Component {
  state = {
    userIdChange: "",
    passwordChange: "",
    passwordSave: true,
    searchName: "",
    searchPosition: "",
    searchDivision: "",
    detailVisible: false,
    selectedUser: null,
    modalVisible: false,
    modalUserData: null, // To store user data for modal form
    updateData: null,
    popupLoad: false,
    optionPosition: null,
    optionDivision: null,
  };

  componentDidMount() {
    this.loadUsers(); // Call the method to fetch users on component mount
    this.loadPositions();
    this.loadDivisions();
  }

  // Method to fetch users and set state
  loadUsers = async () => {
    try {
      console.log("Fetching users...");
      const usersData = await fetchUsers();
      this.setState({ users: usersData, filteredUsers: usersData });
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users.");
    }
  };

  loadPositions = async () => {
    try {
      console.log("Fetching poisitions...");
      const dataPosition = await fetchPosition();
      this.setState({ optionPosition: dataPosition });
      return dataPosition;
    } catch (error) {
      console.error("Error fetching positions:", error);
      message.error("Failed to load positions.");
    }
  };

  loadDivisions = async () => {
    try {
      console.log("Fetching divisions...");
      const dataDivision = await fetchDivision();
      this.setState({ optionDivision: dataDivision });
      return dataDivision;
    } catch (error) {
      console.error("Error fetching divisions:", error);
      message.error("Failed to load divisions.");
    }
  };

  handleSearch = () => {
    const { users, searchName, searchPosition, searchDivision } = this.state;

    const filteredUsers = users.filter((user) => {
      const matchesName = user.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesPosition = searchPosition
        ? user.position?.name?.toLowerCase() === searchPosition.toLowerCase()
        : true;
      const matchesDivision = searchDivision
        ? user.division?.name?.toLowerCase() === searchDivision.toLowerCase()
        : true;

      return matchesName && matchesPosition && matchesDivision;
    });

    this.setState({ filteredUsers });
  };

  loadUsers = async () => {
    try {
      console.log("Fetching users...");
      const usersData = await fetchUsers();
      this.setState({ users: usersData, filteredUsers: usersData });
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users.");
    }
  };

  updateUserValue = async (id, key, value) => {
    this.setState({ popupLoad: true });
    let data;
    try {
      data = await getUserDetails(id);
    } catch (error) {
      message.error("User not Found");
    }

    if (!key) {
      console.error("Key is required to update the object");
      return;
    }
    const dataChange = {
      role: data.role,
      username: data.username,
      name: data.name,
      mail: data.mail,
      id_position: data.position.id,
      id_division: data.division.id,
    };

    // Create a shallow copy of the data object and update the key
    const updatedData = { ...dataChange, [key]: value };

    try {
      // Call the API to update user details
      const response = await updateUserById(id, updatedData);

      // Show success message
      message.success("User updated successfully!");
      console.log("User updated successfully:", response);
      this.loadUsers();
      // Additional actions, e.g., update the UI
    } catch (error) {
      // Show error message
      message.error(`Failed to update user: ${error.message}`);
      console.error("Error while updating user:", error.message);
    }

    this.setState({ popupLoad: false });
    // Example: Set the updated data back to the state or use it as needed
    this.setState({ update: updatedData });
  };

  closePasswordSave = () => [
    this.setState({passwordSave: true})
  ]

  handleSavePasswordChange = () => {
    this.updateUserValue(this.state.userIdChange, "password", this.password);
    this.setState({ passwordSave: true });
  };

  handleInputPasswordChange = (e) => {
    
    this.setState({ password: e.target.value, passwordSave: false });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.handleSearch);
  };

  handleSelectChange = (name, value) => {
    this.setState({ [name]: value }, this.handleSearch);
  };

  deleteUser = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteUserById(userId); // Call the delete API with userId
          await this.loadUsers(); // Reload the user list
          message.success({ content: `Deleted user ${userId}`, duration: 2 });
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error({
            content: "Failed to delete user. Please try again.",
            duration: 2,
          });
        }
      },
      onCancel: () => {
        message.info("Deletion cancelled.");
      },
    });
  };

  showDetail = async (userId) => {
    try {
      this.setState({ detailVisible: true });
      const userData = await getUserDetails(userId);

      const userDetails = [
        {
          key: "Name",
          value: userData.name,
        },
        {
          key: "Username",
          value: userData.username,
        },
        {
          key: "Role",
          value: userData.role,
        },
        {
          key: "Mail",
          value: userData.mail,
        },
        {
          key: "Company",
          value: userData.company.name,
        },
        {
          key: "Division",
          value: userData.division.name,
        },
        {
          key: "Position",
          value: userData.position.name,
        },
      ];
      this.setState({ userDetails });
    } catch (error) {
      console.error("Error fetching user details:", error);
      message.error("Failed to load user details.");
    }
  };

  closeUserProfile = () => {
    this.setState({ selectedUser: null });
  };

  showCreateModal = () => {
    this.setState({ modalCreateVisible: true });
  };

  showUpdateModal = async (id) => {
    try {
      const userInfo = await getUserDetails(id);
      const position = await this.loadPositions();
      const division = await this.loadDivisions();
      
      const userTable = [
        {
          key: "Name",
          value: (
            <EditUser
              keyName="name"
              value={userInfo.name}
              handleValue={this.updateUserValue}
              id={id}
            />
          ),
        },
        {
          key: "Email",
          value: (
            <EditUser
              keyName="Email"
              value={userInfo.mail}
              handleValue={this.updateUserValue}
              id={id}
            />
          ),
        },
        {
          key: "Username",
          value: (
            <EditUser
              keyName="Username"
              value={userInfo.username}
              handleValue={this.updateUserValue}
              id={id}
            />
          ),
        },
        {
          key: "Password",
          value: (
            <EditPassword
              keyName="password"
              handleInputChange={this.handleInputPasswordChange}
              closePasswordSave={this.closePasswordSave}
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
              value={userInfo.position.id}
              name={userInfo.position.name}
              handleValue={this.updateUserValue}
              id={id}
              options={position}
            />
          ),
        },
        {
          key: "Division",
          value: (
            <>
              <EditStatus
                keyName="id_division"
                value={userInfo.division.id}
                name={userInfo.division.name}
                handleValue={this.updateUserValue}
                id={id}
                option={division}
              />
            </>
          ),
        },
        {
          key: "Role",
          value: (
            <>
              <div>{userInfo.role}</div>
            </>
          ),
        },
      ];

      this.setState({
        modalUpdateVisible: true,
        userTable,
        statusTable,
        userIdChange: id,
      });
    } catch (error) {
      console.error("Error fetching detail user:", error);
      message.error("Failed to load detail user.");
    }
  };

  handleModalCancel = () => {
    this.setState({
      modalCreateVisible: false,
      modalUpdateVisible: false,
      detailVisible: false,
      modalUserData: null,
    });
  };

  handleCreateFormSubmit = (values) => {
    const { confpassword, ...filteredValues } = values;
    createUserInCompany(filteredValues)
      .then(() => {
        this.setState({ modalVisible: false, modalUserData: null });
        message.success("User details updated!");
        this.loadUsers();
      })
      .catch((error) => {
        console.error("Error creating/updating user:", error);
        message.error("Failed to update user details.");
      });
  };

  

  render() {
    const { Option } = Select;

    const {
      filteredUsers,
      modalCreateVisible,
      modalUpdateVisible,
      modalUserData,
      userProfileVisible,
      detailVisible,
      userDetails,
      userTable,
      statusTable,
      userEdit,
      searchName,
      searchPosition,
      searchDivision,
      popupLoad,
      passwordSave,
      optionDivision,
      optionPosition,
    } = this.state;

    const tableColumns = [
      {
        title: "ID",
        dataIndex: "id",
        hidden: true, // Control visibility here
      },
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        defaultSortOrder: "ascend",
      },
      {
        title: "Username",
        dataIndex: "username",
        sorter: (a, b) => a.username.length - b.username.length,
      },
      {
        title: "Position",
        dataIndex: "position",
        render: (text, record) => record.position?.name,
        sorter: (a, b) => a.position?.name.localeCompare(b.position?.name),
      },
      {
        title: "Division",
        dataIndex: "division",
        render: (text, record) => record.division?.name,
        sorter: (a, b) => a.division?.name.localeCompare(b.division?.name),
      },
      {
        title: "Action",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right d-flex justify-content-end">
            <Tooltip title="Edit">
              <Button
                style={{ backgroundColor: "green", color: "white" }}
                className="mr-2"
                icon={<EditOutlined />}
                onClick={() => this.showUpdateModal(elm.id)}
                size="small"
              />
            </Tooltip>
            <Tooltip title="View">
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                onClick={() => this.showDetail(elm.id)}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => this.deleteUser(elm.id)}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];

    return (
      <div style={{ padding: "0px" }}>
        {/* Search Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <Search
            placeholder="Search by Name"
            value={searchName}
            name="searchName"
            onChange={this.handleInputChange}
            enterButton
          />
          <Select
            showSearch
            placeholder="Search by Position"
            value={searchPosition}
            onChange={(value) =>
              this.handleSelectChange("searchPosition", value)
            }
            style={{ width: "100%" }}
          >
            <Option value="">Search by Position</Option>
            {optionPosition &&
              optionPosition.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
          </Select>
          <Select
            showSearch
            placeholder="Search by Division"
            value={searchDivision}
            onChange={(value) =>
              this.handleSelectChange("searchDivision", value)
            }
            style={{ width: "100%" }}
          >
            <Option value="">Search by Division</Option>
            {optionDivision &&
              optionDivision.map((option) => (
                <Option keyid={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => this.showCreateModal(null)}
            style={{ fontWeight: "bold" }}
          >
            Add User
          </Button>
        </div>

        {/* Table */}
        <div className="table-responsive my-4 border rounded-lg">
          <Table
            columns={tableColumns}
            dataSource={filteredUsers}
            rowKey="id"
          />
        </div>

        {/* User Profile Modal */}
        <Modal
          title={"New User"}
          visible={modalCreateVisible}
          onCancel={this.handleModalCancel}
          footer={null}
          destroyOnClose
        >
          <Form onFinish={this.handleCreateFormSubmit} layout="vertical">
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the user's name" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please enter the user's username" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter the user's password" },
              ]}
            >
              <Input type="password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confpassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm the user's password",
                },
              ]}
            >
              <Input type="password" />
            </Form.Item>
            <Form.Item
              label="Position"
              name="id_position"
              rules={[
                {
                  required: true,
                  message: "Please select the user's position!",
                },
              ]}
            >
              <Select>
                {optionPosition &&
                  optionPosition.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Division"
              name="id_division"
              rules={[
                {
                  required: true,
                  message: "Please select the user's division!",
                },
              ]}
            >
              <Select>
                {optionDivision &&
                  optionDivision.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Email"
              name="mail"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {"Add User"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={"Edit User"}
          visible={modalUpdateVisible}
          width="80%"
          onCancel={this.handleModalCancel}
          footer={null}
          destroyOnClose
        >
          <Spin spinning={popupLoad}>
            <Table
              className="small"
              style={{ marginBottom: "24px" }}
              columns={[
                { title: "", dataIndex: "key", width: "30%" },
                { title: "", dataIndex: "value" },
              ]}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "row-even" : "row-odd"
              }
              dataSource={userTable}
              rowKey="key"
              rowHoverable={false}
              pagination={false}
              showHeader={false}
              borderColor={"#000"}
            />
            <Button
              danger
              disabled={passwordSave}
              style={{ marginBottom: "24px" }}
              onClick={this.handleSavePasswordChange}
            >
              Change Password
            </Button>

            <Table
              className="small"
              style={{ marginBottom: "24px" }}
              columns={[
                { title: "", dataIndex: "key", width: "30%" },
                { title: "", dataIndex: "value" },
              ]}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "row-even" : "row-odd"
              }
              dataSource={statusTable}
              rowKey="key"
              rowHoverable={false}
              pagination={false}
              showHeader={false}
              borderColor={"#000"}
            />
          </Spin>
        </Modal>

        {/* User Details Modal */}
        <Modal
          title={"Detail User"}
          visible={detailVisible}
          onCancel={this.handleModalCancel}
          footer={null}
          destroyOnClose
          width="80%"
        >
          <Table
            className="small"
            columns={[
              { title: "", dataIndex: "key" },
              { title: "", dataIndex: "value" },
            ]}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "row-even" : "row-odd"
            }
            dataSource={userDetails}
            rowKey="key"
            rowHoverable={false}
            pagination={false}
            showHeader={false}
            borderColor={"#000"}
          />
        </Modal>
      </div>
    );
  }
}

export default UserList;
