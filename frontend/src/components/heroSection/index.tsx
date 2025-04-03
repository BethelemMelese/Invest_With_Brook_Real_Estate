import { useEffect, useState } from "react";
import Notification from "../../commonComponent/notification";
import { Card, GetProp, Modal, Space, Table, TableProps } from "antd";
import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import AddHeroSection from "./create";
import { EditOutlined } from "@mui/icons-material";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { api } from "../../polices/api/axiosConfig";

const { confirm } = Modal;

interface ItemState {
  title: string;
  herosectionRole: string;
}

const initialState: ItemState = {
  title: "",
  herosectionRole: "",
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

const HeroSection = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("view");
  const [selectedHeroSection, setSelectedHeroSection] = useState<any>();
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
      title: "Hero Image",
      dataIndex: "",
      render: (record: any) => {
        return (
          <>
            {record.heroImage != undefined ? (
              <Avatar src={record.heroImage} variant="rounded"></Avatar>
            ) : (
              <Avatar />
            )}
          </>
        );
      },
    },
    {
      title: "Header Title",
      dataIndex: "headerTitle",
      sorter: true,
    },
    {
      title: "Sub Header Title",
      dataIndex: "subTitle",
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
                  setSelectedHeroSection(record);
                  setViewMode("edit");
                }}
                aria-label="edit"
                color="primary"
              >
                <EditOutlined />
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
      .get(`heroSections`)
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
      title: "Do you want to delete these hero section?",
      icon: <ExclamationCircleFilled />,
      content: "You are unable to undo the deletion of this.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        api
          .delete(`heroSections/${value}`)
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
        <Card title={<h2>Manage Hero Section</h2>} className="main-content">
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
        <AddHeroSection
          //@ts-ignore
          selectedHeroSection={initialState}
          viewMode={viewMode}
          closeedit={() => setViewMode("view")}
        />
      )}

      {viewMode == "edit" && (
        <AddHeroSection
          //@ts-ignore
          selectedHeroSection={selectedHeroSection}
          viewMode={viewMode}
          closeedit={() => setViewMode("view")}
        />
      )}
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default HeroSection;
