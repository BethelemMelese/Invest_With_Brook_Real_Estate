import axios from "axios";
import { useEffect, useState } from "react";
import { appUrl } from "../../appurl";
import Notification from "../../commonComponent/notification";
import { Card, GetProp, Modal, Space, Table, TableProps } from "antd";
import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import AddSpeaker from "./create";
import { EditOutlined } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { api } from "../../polices/api/axiosConfig";

const { confirm } = Modal;

interface ItemState {
  title: string;
  speakerRole: string;
}

const initialState: ItemState = {
  title: "",
  speakerRole: "",
};

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

interface DataType {
  name: string;
  gender: string;
  email: string;
  id: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const Speakers = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("view");
  const [selectedSpeaker, setSelectedSpeaker] = useState<any>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  //   identify the columns that has to display on the table
  const columns: any = [
    {
      title: "Profile",
      dataIndex: "",
      render: (record: any) => {
        return (
          <>
            {record.speakerImage != undefined ? (
              <Avatar src={record.speakerImage} variant="circular"></Avatar>
            ) : (
              <Avatar />
            )}
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "title",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "speakerRole",
      sorter: true,
    },
    {
      title: "Action",
      dataIndex: "",
      render: (record: any) => {
        return (
          <Space size="small">
            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  setSelectedSpeaker(record);
                  setViewMode("edit");
                }}
                aria-label="edit"
                color="primary"
              >
                <EditOutlined />
              </IconButton>
            </Tooltip>
            |
            <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  showConfirm(record.id);
                }}
                aria-label="delete"
                color="error"
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleTableChange: TableProps["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  //for get all data
  const onFetchAdmin = () => {
    api
      .get(`speakers`)
      .then((res) => {
        setLoading(false);
        setDataSource(res.data);
      })
      .catch((error: any) => {
        setLoading(false);
        onViewError(error.response.data.message);
      });
  };

  //notification for success and error action
  const onViewError = (response: any) => {
    setNotify({
      isOpen: true,
      type: "error",
      message: response,
    });
  };

  const onDeleteSuccess = (response: any) => {
    setNotify({
      isOpen: true,
      type: "success",
      message: response.message,
    });
    onFetchAdmin();
  };

  const onDeleteError = (response: any) => {
    setNotify({
      isOpen: true,
      message: response,
      type: "error",
    });
  };

  //   for delete the selected data using modal confirm dialog
  const showConfirm = (value: any) => {
    confirm({
      title: "Do you want to delete these speaker?",
      icon: <ExclamationCircleFilled />,
      content: "You are unable to undo the deletion of this.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        api
          .delete(`speakers/${value}`)
          .then((response) => {
            onDeleteSuccess(response.data);
          })
          .catch((error) => onDeleteError(error.response.data.message));
      },
      onCancel() {},
    });
  };

  //to fetch data using useEffect , when every time this page is load
  useEffect(() => {
    setLoading(true);
    onFetchAdmin();
  }, []);

  return (
    <div className="app_container">
      {viewMode == "view" && (
        <Card
          title={<h2>List of Speakers</h2>}
          extra={
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                setViewMode("new");
              }}
            >
              Add Speaker
            </Button>
          }
          className="main-content"
        >
          <div className="list_data">
            <Card>
              <Table
                className="table-list"
                size="small"
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={dataSource}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
              />
            </Card>
          </div>
        </Card>
      )}

      {viewMode == "new" && (
        <AddSpeaker
          //@ts-ignore
          selectedSpeaker={initialState}
          viewMode={viewMode}
          closeedit={() => setViewMode("view")}
        />
      )}

      {viewMode == "edit" && (
        <AddSpeaker
          //@ts-ignore
          selectedSpeaker={selectedSpeaker}
          viewMode={viewMode}
          closeedit={() => setViewMode("view")}
        />
      )}
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default Speakers;
