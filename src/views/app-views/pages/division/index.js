import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button, Select, Modal, Form, Spin } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { Input } from "antd";
import { createData, deleteDataById, fetchDatas, getDataDetails, updateDataById } from "api/division";
import EditData from "./EditData";
export class UserList extends Component {
  state = {
    datas: null,
    dataProfileVisible: false,
    selectedData: null,
    modalData: null,
    modalVisible: false,
    modalDetailVisible: false,
    tableDetail: null,
    modalUpdateVisible: false,
    popupLoad: false
  };

  componentDidMount() {
    this.loadDatas(); // Call the method to fetch datas on component mount
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

  deleteData = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this data?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        // Proceed with deletion
        try {
          await deleteDataById(id)
          this.loadDatas()
        message.success({ content: `Deleted data succes`, duration: 2 });  
        } catch (error) {
          message.error("Failed to delete data")
        }
        
      },
      onCancel: () => {
        message.info("Deletion cancelled.");
      },
    });
  };

  showDetail = async (id) => {
    try {

      const data = await getDataDetails(id)

      const tableDetail = [{
        key: "Name",
        value: data.name
      }]  

      this.setState({ modalDetailVisible: true, tableDetail})
    } catch (error) {
      message.error("Failed to load detail")
    }
    
  }

  updateDataValue = async (id, key, value) => {
    this.setState({ popupLoad: true });
    let data;
    try {
      data = await getDataDetails(id);
    } catch (error) {
      message.error("Data not Found");
    }

    if (!key) {
      console.error("Key is required to update the object");
      return;
    }
    const dataChange = {
      name: data.name
    };

    // Create a shallow copy of the data object and update the key
    const updatedData = { ...dataChange, [key]: value };

    try {
      // Call the API to update user details
      const response = await updateDataById(id, updatedData);

      // Show success message
      message.success("Data updated successfully!");
      console.log("Data updated successfully:", response);
      this.loadDatas();
      // Additional actions, e.g., update the UI
    } catch (error) {
      // Show error message
      message.error(`Failed to update position: ${error.message}`);
      console.error("Error while updating position:", error.message);
    }

    this.setState({ popupLoad: false });
    // Example: Set the updated data back to the state or use it as needed
    this.setState({ update: updatedData });
  };
  
  showUpdateData = async (id) => {
    try {
      const detail = await getDataDetails(id);

      // Prepare table detail
      const tableDetail = [{
        key: "Name",
        value: <EditData 
                keyName={"name"}
                value={detail.name}
                handleValue={this.updateDataValue}
                id={id}
        />,
    }];
  
      // Update state with fetched data
      this.setState({
        modalUpdateVisible: true,
        tableDetail: tableDetail,
       // Loading complete
      });
    } catch (error) {

      // Log the error (optional, for debugging)
      console.error("Error fetching details:", error);
  
      // Show error message
      message.error("Failed to load details. Please try again.");
    }
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
      modalDetailVisible: false,
      modalUpdateVisible: false,
      modalUserData: null,
    });
  };

  handleCreateSubmit = async (values) => {
    console.log("meow")
    await createData(values)
      .then(() => {
        this.setState({ modalVisible: false, modalData: null });
        this.loadDatas();
        message.success("Data created!");
      })
      .catch((error) => {
        console.error("Error creating position:", error);
        message.error("Failed to create new position.");
      });
    this.setState({
      modalVisible: false,
      modalData: null,
    });
    
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
      modalDetailVisible,
      tableDetail,
      popupLoad,
      modalUpdateVisible
    } = this.state;
    const tableColumns = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name), 
        defaultSortOrder: "ascend",
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
                  this.showUpdateData(elm.id);
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
                  this.showDetail(elm.id);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteData(elm.id);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
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
          title={"New Division"}
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
          title={"Edit Division"}
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
              dataSource={tableDetail}
              rowKey="key"
              rowHoverable={false}
              pagination={false}
              showHeader={false}
              borderColor={"#000"}
            />
          </Spin>
        </Modal>

        <Modal
          title={"Detail Division"}
          visible={modalDetailVisible}
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
            dataSource={tableDetail}
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
