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
import { Input } from "antd";
import { fetchDatas } from "api/position";

export class UserList extends Component {
  state = {
    datas: null,
    dataProfileVisible: false,
    selectedData: null,
    modalData: null,
    modalVisible: false,
    detailVisible: false,
  };

  componentDidMount() {
    this.loadDatas()
  }

  loadDatas = async () => {
    try {
      console.log("Fetching data...");
      const data = await fetchDatas();
      console.log("hai", data)
      this.setState({ datas: data, filteredDatas: data });
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users.");
    }
  };

  delete = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Product?",
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
        title: "Product",
        dataIndex: "name",
        sorter: (a, b) => a.product.localeCompare(b.product), // Alphabetic sorting for products
      },
      {
        title: "Category",
        dataIndex: "category",
        sorter: (a, b) => a.category.localeCompare(b.category), // Alphabetic sorting for categories
      },
      {
        title: "Serial Number",
        dataIndex: "serialNumber",
        sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber), // Alphabetic sorting for serial numbers
      },
     
      {
        title: "Farm",
        dataIndex: "farm",
        sorter: (a, b) => a.farm.localeCompare(b.farm), // Alphabetic sorting for farms
      },
      {
        title: "Hen House",
        dataIndex: "henHouse",
        sorter: (a, b) => a.henHouse.localeCompare(b.henHouse), // Alphabetic sorting for hen houses
      },
      {
        title: "Last Update",
        dataIndex: "lastUpdate",
        render: (date) => <span>{dayjs(date).format("MM/DD/YYYY")}</span>, // Format date
        sorter: (a, b) => dayjs(a.lastUpdate).unix() - dayjs(b.lastUpdate).unix(), // Sort by date
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
        name: "Product 1",
        serialNumber: "SN001",
        category: "Poultry",
        farm: "Green Acres",
        henHouse: "HenHouse 1",
        lastUpdate: "12/14/2024", // You can use a date format here, or a UNIX timestamp if required
      },
     
    ];
    
    const detailTableColumns = [
      {
        title: "Product",
        dataIndex: "name",
      },
      {
        title: "Serial Number",
        dataIndex: "serialNumber",
      },
      {
        title: "Category",
        dataIndex: "category",
      },
      {
        title: "Farm",
        dataIndex: "farm",
      },
      {
        title: "Hen House",
        dataIndex: "henHouse",
      },
      {
        title: "Last Update",
        dataIndex: "lastUpdate",
        render: (text) => <span>{text}</span>, // Format date if needed
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
            Add Product
          </Button>
        </div>

        <div className="table-responsive my-4 border rounded-lg">
          <Table columns={tableColumns} dataSource={datas} rowKey="id" />
        </div>

        <Modal
  title={modalData ? "Edit Product" : "New Product"}
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
        { required: true, message: "Please enter the product's name" },
      ]}
    >
      <Input placeholder="Enter product's name" />
    </Form.Item>

    {/* Serial Number Selection */}
    <Form.Item
      label="Serial Number"
      name="serialNumber"
      rules={[
        { required: true, message: "Please select a serial number" },
      ]}
    >
      <Select placeholder="Select a serial number">
        <Select.Option value="SN001">SN001</Select.Option>
        <Select.Option value="SN002">SN002</Select.Option>
        <Select.Option value="SN003">SN003</Select.Option>
        <Select.Option value="SN004">SN004</Select.Option>
      </Select>
    </Form.Item>

    {/* Category Selection */}
    <Form.Item
      label="Category"
      name="category"
      rules={[{ required: true, message: "Please select a category" }]}
    >
      <Select placeholder="Select a category">
        <Select.Option value="Agriculture">Agriculture</Select.Option>
        <Select.Option value="Livestock">Livestock</Select.Option>
        <Select.Option value="Farm Equipment">Farm Equipment</Select.Option>
      </Select>
    </Form.Item>

    {/* Province Selection */}
    <Form.Item
      label="Province"
      name="province"
      rules={[{ required: true, message: "Please select a province" }]}
    >
      <Select placeholder="Select a province">
        <Select.Option value="Ontario">Ontario</Select.Option>
        <Select.Option value="Quebec">Quebec</Select.Option>
        <Select.Option value="British Columbia">British Columbia</Select.Option>
        <Select.Option value="Alberta">Alberta</Select.Option>
      </Select>
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
        <Select.Option value="Red Barn Farms">Red Barn Farms</Select.Option>
        <Select.Option value="Golden Field">Golden Field</Select.Option>
      </Select>
    </Form.Item>

    {/* Hen House Selection */}
    <Form.Item
      label="Hen House"
      name="henHouse"
      rules={[{ required: true, message: "Please select a hen house" }]}
    >
      <Select placeholder="Select a hen house">
        <Select.Option value="North Hen House">North Hen House</Select.Option>
        <Select.Option value="South Hen House">South Hen House</Select.Option>
        <Select.Option value="East Hen House">East Hen House</Select.Option>
        <Select.Option value="West Hen House">West Hen House</Select.Option>
      </Select>
    </Form.Item>

    {/* Submit Button */}
    <Button type="primary" htmlType="submit" block>
      {modalData ? "Save Changes" : "Create Product"}
    </Button>
  </Form>
</Modal>

        <Modal
          title={"Detail Product"}
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
