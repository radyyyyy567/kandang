import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "./UserView";
import AvatarStatus from "components/shared-components/AvatarStatus";
import data from "assets/data/division-list.data.json";
import { Input } from "antd";
export class UserList extends Component {
  state = {
    datas: data,
    userProfileVisible: false,
    selectedUser: null,
  };

  // deleteUser = (userId) => {
  //   this.setState({
  //     users: this.state.users.filter((item) => item.id !== userId),
  //   });
  //   message.success({ content: `Deleted user ${userId}`, duration: 2 });
  // };

  // showUserProfile = (userInfo) => {
  //   this.setState({
  //     userProfileVisible: true,
  //     selectedUser: userInfo,
  //   });
  // };

  // closeUserProfile = () => {
  //   this.setState({
  //     userProfileVisible: false,
  //     selectedUser: null,
  //   });
  // };

  render() {
    const { datas, userProfileVisible, selectedUser } = this.state;
    const { Search } = Input;
    const tableColumns = [
      
      {
        title: "Name",
        dataIndex: "name",
        sorter: {
          compare: (a, b) => a.role.length - b.role.length,
        },
      },
      {
        title: "Category",
        dataIndex: "category",
        render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>,
        sorter: (a, b) =>
          dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
      },
      {
        title: "Serial Number",
        dataIndex: "serialNumber",
        render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>,
        sorter: (a, b) =>
          dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
      },
      {
        title: "last Update",
        dataIndex: "lastUpdate",
        render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>,
        sorter: (a, b) =>
          dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
      },
      {
        title: "Farm",
        dataIndex: "farm",
        render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>,
        sorter: (a, b) =>
          dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
      },
      {
        title: "Hen House",
        dataIndex: "henHouse",
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
                  this.showUserProfile(elm);
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
                  this.showUserProfile(elm);
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
    return (
      <div bodyStyle={{ padding: "0px" }}>
        <div
          style={{
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

        </div>

        <div className="table-responsive my-4 border rounded-lg">
          <Table columns={tableColumns} dataSource={datas} rowKey="id" />
        </div>
        <UserView
          data={selectedUser}
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
