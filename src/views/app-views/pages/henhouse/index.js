import React, { Component } from "react";
import {
  Card,
  Table,
  Tag,
  Tooltip,
  message,
  Button,
  Select,
  Modal,
  Form,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "./UserView";
import AvatarStatus from "components/shared-components/AvatarStatus";
import data from "assets/data/henhouse-list.data.json";
import { Input } from "antd";
export class UserList extends Component {
  state = {
    datas: data,
    dataProfileVisible: false,
    selectedData: null,
    modalData: null,
    modalVisible: false,
    detailVisible: false,
  };

  delete = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Hen House?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        // Proceed with deletion
        this.setState({
          users: this.state.users.filter((item) => item.id !== userId),
        });
        message.success({ content: `Deleted farmj ${userId}`, duration: 2 });
      },
      onCancel: () => {
        message.info("Deletion cancelled.");
      },
    });
  };

  showDataProfile = (dataInfo) => {
    this.setState({
      dataProfileVisible: true,
      selectedData: dataInfo,
    });
  };

  showDetail = () => {
    this.setState({
      detailVisible: true,
    });
  };

  closeUserProfile = () => {
    this.setState({
      userProfileVisible: false,
      selectedData: null,
    });
  };

  showModal = (dataInfo) => {
    this.setState({
      modalVisible: true,
      modalData: dataInfo, // Sets the data to edit
    });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      detailVisible: false,
      modalUserData: null,
    });
  };

  handleFormSubmit = (values) => {
    // Handle form submission here (edit user, add user, etc.)
    console.log("Form Values:", values);
    this.setState({
      modalVisible: false,
      modalData: null,
    });
    message.success("User details updated!");
  };

  render() {
    const { Search } = Input;
    const { Option } = Select;
    const {
      datas,
      modalVisible,
      modalData,
      userProfileVisible,
      selectedData,
      detailVisible,
    } = this.state;
    const tableColumns = [
      {
        title: "Hen House",
        dataIndex: "henhouse",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Population",
        dataIndex: "population",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Status",
        dataIndex: "henhouseStatus",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Farm",
        dataIndex: "farm",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Farm Status",
        dataIndex: "farmStatus",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Last update",
        dataIndex: "lastUpdated",
        render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>,
        sorter: (a, b) =>
          dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
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
                onClick={() => {
                  this.showModal(elm);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="View">
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                onClick={() => {
                  this.showDetail(elm);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.delete(elm.id);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    const detailedData = [
      {
        id: 1,
        henHouse: "HenHouse 1",
        province: "Central Java",
        address: "123 Green Acres, Semarang",
        statusFarm: "Active",
        status: "onFarm",
      },
    ];
    const detailTableColumns = [
      {
        title: "Hen House",
        dataIndex: "henHouse",
      },
      {
        title: "Province",
        dataIndex: "province",
      },
      {
        title: "Address",
        dataIndex: "address",
      },
      {
        title: "Farm Status",
        dataIndex: "statusFarm",
      },
      {
        title: "Status",
        dataIndex: "status",
      },
    ];

    return (
      <div bodyStyle={{ padding: "0px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            alignContent: "space-between",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              gridColumn: "span 3 / span 3",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            <Search
              placeholder="Search by Name"
              onSearch={(value) => console.log(value)}
              enterButton
            />

            <Select
              showSearch
              placeholder="Search by Farm"
              optionFilterProp="children"
              onChange={(value) => console.log(value)} // Trigger search on selection
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: "100%" }} // Adjust width as needed
            >
              <Select.Option value="name1">Name 1</Select.Option>
              <Select.Option value="name2">Name 2</Select.Option>
              <Select.Option value="name3">Name 3</Select.Option>
            </Select>
            <Select
              showSearch
              placeholder="Search by Status"
              optionFilterProp="children"
              onChange={(value) => console.log(value)} // Trigger search on selection
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: "100%" }} // Adjust width as needed
            >
              <Select.Option value="name1">Name 1</Select.Option>
              <Select.Option value="name2">Name 2</Select.Option>
              <Select.Option value="name3">Name 3</Select.Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={
              <PlusOutlined
                style={{
                  color: "white",
                  strokeWidth: "80", // --> higher value === more thickness the filled area
                  stroke: "white",
                }}
              />
            }
            onClick={() => this.showModal(null)}
            style={{ fontWeight: "bold", justifySelf: "end" }} // Open the modal for adding a new user
          >
            Add Hen House
          </Button>
        </div>

        <div className="table-responsive my-4 border rounded-lg">
          <Table columns={tableColumns} dataSource={datas} rowKey="id" />
        </div>

        <Modal
          title={modalData ? "Edit Hen House" : "New Hen House"}
          visible={modalVisible}
          onCancel={this.handleModalCancel}
          footer={null}
        >
          <Form
            initialValues={modalData}
            onFinish={this.handleFormSubmit}
            layout="vertical"
          >
            {/* Name Input */}
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the user's name" },
              ]}
            >
              <Input placeholder="Enter user's name" />
            </Form.Item>

            {/* Farm Selection */}
            <Form.Item
              label="Farm"
              name="farm"
              rules={[{ required: true, message: "Please select a farm" }]}
            >
              <Select placeholder="Select a farm">
                <Select.Option value="Green Acres">Green Acres</Select.Option>
                <Select.Option value="Sunny Fields">Sunny Fields</Select.Option>
                <Select.Option value="Red Barn Farms">
                  Red Barn Farms
                </Select.Option>
                <Select.Option value="Golden Field">Golden Field</Select.Option>
              </Select>
            </Form.Item>

            {/* Submit Button */}
            <Button type="primary" htmlType="submit" block>
              {modalData ? "Save Changes" : "Create User"}
            </Button>
          </Form>
        </Modal>

        <Modal
          title={"Detail Hen House"}
          visible={detailVisible}
          onCancel={this.handleModalCancel}
          footer={null}
        >
          <Table
            columns={detailTableColumns}
            dataSource={detailedData}
            rowKey="id"
          />
        </Modal>
        <UserView
          data={selectedData}
          visible={userProfileVisible}
          close={() => {
            this.closeUserProfile();
          }}
        />
      </div>
    );
  }
}

export default UserList;
