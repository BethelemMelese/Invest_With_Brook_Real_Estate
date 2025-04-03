import { useEffect, useState } from "react";
import { Card, Dropdown, GetProp, Menu, Table, TableProps } from "antd";
import { Button } from "@mui/material";
import { DownOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import exportPDF from "../../service/importPdf";
import { PDF } from "../..//service/model/pdf";
import axios from "axios";
import { appUrl } from "../../appurl";
import Notification from "../../commonComponent/notification";
import { api } from "../../polices/api/axiosConfig";

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

const AdminPanel = ({ ...props }) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
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
      title: "Name",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: true,
    },
    {
      title: "City",
      dataIndex: "city",
      sorter: true,
    },
    {
      title: "Profession",
      dataIndex: "profession",
      sorter: true,
    },
    {
      title: "Attendee Type",
      dataIndex: "attendeeType",
      sorter: true,
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
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  //for get all data
  const onFetchAdmin = () => {
    api
      .get(`users/getAllUser`)
      .then((res) => {
        setLoading(false);
        setDataSource(res.data);
      })
      .catch((error: any) => {
        setLoading(false);
        onViewError(error.response.data.message);
      });
  };

  //to fetch data using useEffect , when everytime thise page is load
  useEffect(() => {
    setLoading(true);
    onFetchAdmin();
  }, []);

  //notification for success and error action
  const onViewError = (response: any) => {
    setNotify({
      isOpen: true,
      type: "error",
      message: response,
    });
  };

  const exportAll = () => {
    const visibleColumn = [
      {
        name: "Name",
        key: "fullName",
      },
      {
        name: "Email",
        key: "email",
      },
      {
        name: "Phone",
        key: "phone",
      },
      {
        name: "Country",
        key: "country",
      },
      {
        name: "City",
        key: "city",
      },
      {
        name: "Profession",
        key: "profession",
      },
      {
        name: "Attendee Type",
        key: "attendeeType",
      },
    ];
    const pdfConfig: PDF = {
      fileName: "Grand Habesha Business Event",
      size: "A3",
      title: "List of Participant",
      orientation: "landscape",
      unit: "pt",
    };
    exportPDF({
      items: dataSource,
      visibleColumn: visibleColumn,
      pdfConfig: pdfConfig,
    });
  };

  const execl = dataSource;
  const Execlheaders = [
    {
      label: "label",
      key: "fulllabel",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Phone",
      key: "phone",
    },
    {
      label: "Country",
      key: "country",
    },
    {
      label: "City",
      key: "city",
    },
    {
      label: "Profession",
      key: "profession",
    },
    {
      label: "Attendee Type",
      key: "attendeeType",
    },
  ];

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <a onClick={exportAll}>PDF</a>,
        },
        {
          key: "2",
          label: (
            <CSVLink
              filename="Grand Habesha Business Event"
              title="List of Participant"
              data={execl}
              headers={Execlheaders}
            >
              Excel
            </CSVLink>
          ),
        },
      ]}
    />
  );
  return (
    <div className="app_container">
      <Card
        title={<h2>List of Participant</h2>}
        extra={
          <Dropdown
            overlay={menu}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Button size="small" variant="contained">
              <div className="font-medium">Export</div>
              <DownOutlined
                translate={undefined}
                style={{ marginLeft: "2px" }}
              />
            </Button>
          </Dropdown>
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
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default AdminPanel;
