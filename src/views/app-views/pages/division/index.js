import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button, Select, Modal, Form } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AvatarStatus from "components/shared-components/AvatarStatus";

import { Input } from "antd";
import { createData, fetchDatas } from "api/division";
export class UserList extends Component {
  state = {
    datas: null,
    dataProfileVisible: false,
    selectedData: null,
    modalData: null,
    filteredDatas: null,
    detailVisible: false,
    modalVisible: false,
  };

  componentDidMount() {
    this.loadDatas(); // Call the method to fetch datas on component mount
  }

  delete = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this division?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        // Proceed with deletion
        this.setState({
          users: this.state.users.filter((item) => item.id !== userId),
        });
        message.success({ content: `Deleted division ${userId}`, duration: 2 });
      },
      onCancel: () => {
        message.info("Deletion cancelled.");
      },
    });
  };

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

  showDetail = () => {
    this.setState({
      detailVisible: true,
    });
  };

  showDataProfile = (dataInfo) => {
    this.setState({
      dataProfileVisible: true,
      selectedData: dataInfo,
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
      modalData: null,
      
    });
  };

  handleCreateSubmit = (values) => {
    console.log("meow")
    createData(values)
      .then(() => {
        this.setState({ modalVisible: false, modalData: null });
        this.loadDatas();
      })
      .catch((error) => {
        console.error("Error creating position:", error);
        message.error("Failed to create new position.");
      });
    this.setState({
      modalVisible: false,
      modalData: null,
    });
    message.success("Division created!");
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
      detailVisible
    } = this.state;
    const tableColumns = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.role.localeCompare(b.role), 
      },
      {
        title: "Last Updated",
        dataIndex: "updated_at",
        render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
        
      },
      {
        title: "Action",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right d-flex justify-content-start">
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
                  this.deleteUser(elm.id);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    const detailedData = [
      { id: 1, name: "Anderson",  username: "andy", role: "Admin"},
      { id: 1, name: "Matthew", username: "matt", role: "User"},
    ];
    const detailTableColumns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Username",
        dataIndex: "username",
      },
      {
        title: "Position",
        dataIndex: "role",
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
            <div style={{gridColumn: "span 3 / span 3",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px"
            }}>
            <Search
              placeholder="Search by Name"
              onSearch={(value) => console.log(value)}
              enterButton
            />
            
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
              Add Division
            </Button>
          </div>

        <div className="table-responsive my-4 border rounded-lg">
          <Table columns={tableColumns} dataSource={datas} rowKey="id" />
        </div>

        <Modal
          title={modalData ? "Edit Division" : "New Division"}
          visible={modalVisible}
          onCancel={this.handleModalCancel}
          destroyOnClose
          footer={null}
        >
          <Form
            initialValues={modalData}
            onFinish={this.handleCreateSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Division"
              name="name"
              rules={[
                { required: true, message: "Please enter the division's name" },
              ]}
            >
              <Input />
            </Form.Item>
            
            <Button type="primary" htmlType="submit" block>
              {modalData ? "Save Changes" : "Create Division"}
            </Button>
          </Form>
        </Modal>

        <Modal
          title={"Detail Position"}
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

      </div>
    );
  }
}

export default UserList;
