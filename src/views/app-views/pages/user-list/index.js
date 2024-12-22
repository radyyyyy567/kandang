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
} from "antd";

import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import userData from "assets/data/user-list.data.json";
import Search from "antd/es/input/Search";
import UserView from "./UserView";
import { fetchUsers, createUserInCompany, getUserDetails } from "api/user";

export class UserList extends Component {
  state = {
    users: userData,
    filteredUsers: userData, // Data filtered based on search criteria
    searchName: "",
    searchPosition: "",
    searchDivision: "",
    detailVisible: false,
    selectedUser: null,
    modalVisible: false,
    modalUserData: null, // To store user data for modal form
  };

  componentDidMount() {
    this.loadUsers(); // Call the method to fetch users on component mount
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
      onOk: () => {
        this.setState({
          users: this.state.users.filter((item) => item.id !== userId),
          filteredUsers: this.state.filteredUsers.filter((item) => item.id !== userId),
        });
        message.success({ content: `Deleted user ${userId}`, duration: 2 });
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

  showModal = (userInfo) => {
    this.setState({ modalVisible: true, modalUserData: userInfo });
  };

  handleModalCancel = () => {
    this.setState({ modalVisible: false, detailVisible: false, modalUserData: null });
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

  handleUpdateFormSubmit = (values) => {
    const { confpassword, ...filteredValues } = values;
    console.log(values)
    // createUserInCompany(filteredValues)
    //   .then(() => {
    //     this.setState({ modalVisible: false, modalUserData: null });
    //     message.success("User details updated!");
    //     this.loadUsers();
    //   })
    //   .catch((error) => {
    //     console.error("Error creating/updating user:", error);
    //     message.error("Failed to update user details.");
    //   });
  };

  render() {
    const { Option } = Select;

    const {
      filteredUsers,
      modalVisible,
      modalUserData,
      userProfileVisible,
      detailVisible,
      userDetails,
      searchName,
      searchPosition,
      searchDivision,
    } = this.state;

    const tableColumns = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
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
                onClick={() => this.showModal(elm)}
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
            onChange={(value) => this.handleSelectChange("searchPosition", value)}
            style={{ width: "100%" }}
          >
            <Option value="Admin">Admin</Option>
            <Option value="Employee">Employee</Option>
          </Select>
          <Select
            showSearch
            placeholder="Search by Division"
            value={searchDivision}
            onChange={(value) => this.handleSelectChange("searchDivision", value)}
            style={{ width: "100%" }}
          >
            <Option value="Division 1">Division 1</Option>
            <Option value="Division 2">Division 2</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => this.showModal(null)}
            style={{ fontWeight: "bold" }}
          >
            Add User
          </Button>
        </div>

        {/* Table */}
        <div className="table-responsive my-4 border rounded-lg">
          <Table columns={tableColumns} dataSource={filteredUsers} rowKey="id" />
        </div>

        {/* User Profile Modal */}
        <Modal
          title={modalUserData ? "Edit User" : "New User"}
          visible={modalVisible}
          onCancel={this.handleModalCancel}
          footer={null}
        >
          <Form
            initialValues={modalUserData}
            onFinish={modalUserData ?  this.handleUpdateFormSubmit : this.handleCreateFormSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the user's name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter the user's username" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter the user's password" }]}
            >
              <Input type="password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confpassword"
              rules={[{ required: true, message: "Please confirm the user's password" }]}
            >
              <Input type="password" />
            </Form.Item>
            <Form.Item
              label="Position"
              name="id_position"
              rules={[{ required: true, message: "Please select the user's position!" }]}
            >
              <Select>
                <Option value="1">Admin</Option>
                <Option value="2">Employee</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Division"
              name="id_division"
              rules={[{ required: true, message: "Please select the user's division!" }]}
            >
              <Select>
                <Option value="1">Division 1</Option>
                <Option value="2">Division 2</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Email"
              name="mail"
              rules={[
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {modalUserData ? "Save Changes" : "Add User"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* User Details Modal */}
        <Modal
          title={"Detail User"}
          visible={detailVisible}
          onCancel={this.handleModalCancel}
          footer={null}
          width="80%"
        >
          <Table
          className="small"
            columns={[{ title: "", dataIndex: "key" }, { title: "", dataIndex: "value" }]}
            rowClassName={(record, index) => (index % 2 === 0 ? "row-even" : "row-odd")}
            dataSource={userDetails}
            rowKey="key"
          
            rowHoverable={false}
            pagination={false}
            showHeader={false}
            borderColor={"#000"}
          />
        </Modal>

        {/* User Profile Viewer */}
        <UserView
          data={this.state.selectedUser}
          visible={userProfileVisible}
          close={this.closeUserProfile}
        />
      </div>
    );
  }
}

export default UserList;
