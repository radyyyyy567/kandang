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
import data from "assets/data/farm-list.data.json";
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
      title: "Are you sure you want to delete this farm?",
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
        title: "Farm",
        dataIndex: "farm",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Province",
        dataIndex: "province",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Address",
        dataIndex: "address",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Coordinate",
        dataIndex: "coordinate",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Farm",
        dataIndex: "farmstatus",
        sorter: (a, b) => a.role.localeCompare(b.role), // Alphabetic sorting for positions
      },
      {
        title: "Last online",
        dataIndex: "lastOnline",
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
        status: "onFarm",
        user: "Anderson",
        henHouse: "HenHouse 1",
        product: "Milk",
      },
      {
        id: 2,
        status: "Harvest",
        user: "Matthew",
        henHouse: "HenHouse 2",
        product: "Meat Chicken",
      },
    ];
    const detailTableColumns = [
      {
        title: "Status",
        dataIndex: "status",
      },
      {
        title: "Farmer",
        dataIndex: "user",
      },
      {
        title: "Hen House",
        dataIndex: "henHouse",
      },
      {
        title: "Product",
        dataIndex: "product",
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
              placeholder="Search by Province"
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
            Add Farm
          </Button>
        </div>

        <div className="table-responsive my-4 border rounded-lg">
          <Table columns={tableColumns} dataSource={datas} rowKey="id" />
        </div>

        <Modal
          title={modalData ? "Edit Farm Details" : "New Farm Details"}
          visible={modalVisible}
          onCancel={this.handleModalCancel}
          footer={null}
        >
          <Form
            initialValues={modalData}
            onFinish={this.handleFormSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Province"
              name="province"
              rules={[{ required: true, message: "Please select a province" }]}
            >
              <Select placeholder="Select Province">
                <Select.Option value="province1">Province 1</Select.Option>
                <Select.Option value="province2">Province 2</Select.Option>
                <Select.Option value="province3">Province 3</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Farmer"
              name="farmer"
              rules={[{ required: true, message: "Please select a farmer" }]}
            >
              <Select placeholder="Select Farmer">
                <Select.Option value="farmer1">Farmer 1</Select.Option>
                <Select.Option value="farmer2">Farmer 2</Select.Option>
                <Select.Option value="farmer3">Farmer 3</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Farm Status"
              name="farmStatus"
              rules={[
                { required: true, message: "Please select a farm status" },
              ]}
            >
              <Select placeholder="Select Farm Status">
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
              </Select>
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              {modalData ? "Save Changes" : "Create Farm"}
            </Button>
          </Form>
        </Modal>

        <Modal
          title={"Detail Farm"}
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
