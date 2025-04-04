import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, Button, Grid } from "@mui/material";
import { Form } from "../../commonComponent/Form";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Notification from "../../commonComponent/notification";
import { Card, Upload, Button as ButtonAnt } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Controls from "../../commonComponent/Controls";
import { api } from "../../polices/api/axiosConfig";

interface ItemState {
  title: string;
  speakerDescription: string;
}

const initialState: ItemState = {
  title: "",
  speakerDescription: "",
};
const AddAgent = ({ ...props }) => {
  const [viewMode, setViewMode] = useState(props.viewMode);
  const [selectedAgent, setSelectedAgent] = useState(props.selectedAgent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<any>();
  const [validFileFormat, setValidFileFormat] = useState(false);
  const [fileRequired, setFileRequired] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    setViewMode(props.viewMode);
    setSelectedAgent(props.selectedAgent);
    if (props.viewMode === "new") {
      formik.resetForm({
        values: initialState,
      });
    }
  }, [props.viewMode, props.selectedAgent]);

  const onCreateSuccess = () => {
    setNotify({
      isOpen: true,
      type: "success",
      message: "Agent is Successfully Added !",
    });
    setTimeout(() => {
      setIsSubmitting(false);
      window.location.reload();
    }, 2000);
  };

  const onCreateError = (response: any) => {
    setNotify({
      isOpen: true,
      type: "error",
      message: response,
    });
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  const onUpdateSuccess = () => {
    setNotify({
      isOpen: true,
      type: "success",
      message: "Agent is Successfully Updated !",
    });
    setTimeout(() => {
      setIsSubmitting(false);
      window.location.reload();
    }, 2000);
  };

  const onUpdateError = (response: any) => {
    setNotify({
      isOpen: true,
      type: "error",
      message: response.message,
    });
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
  });

  const formik = useFormik({
    initialValues: selectedAgent,
    onSubmit: (values) => {
      if (viewMode == "new") {
        if (fileList == null) {
          setFileRequired(true);
        } else {
          setFileRequired(false);
          setIsSubmitting(true);
          const formData = new FormData();
          formData.append("file", fileList);
          formData.append("title", values.title);
          formData.append("speakerDescription", values.speakerDescription);
          api
            .post("agents", formData)
            .then(() => onCreateSuccess())
            .catch((error) => onCreateError(error.response.data.message));
        }
      } else {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append(
          "file",
          fileList == null ? selectedAgent.speakerImage : fileList
        );
        formData.append("title", values.title);
        formData.append("speakerDescription", values.speakerDescription);
        api
          .put(`agents/${selectedAgent.id}`, formData)
          .then(() => onUpdateSuccess())
          .catch((error) => onUpdateError(error.response.data.message));
      }
    },
    validationSchema: validationSchema,
  });

  const validFile = () => {
    if (fileList == null) {
      setFileRequired(true);
    } else {
      setFileRequired(false);
    }
  };

  const beforeUpload = (file: any): any => {
    if (
      file.type === "image/jpg" ||
      file.type == "image/jpeg" ||
      file.type == "image/png"
    ) {
      setValidFileFormat(false);
      setFileRequired(false);
      setFileList(file);
    } else {
      setValidFileFormat(true);
    }
  };

  return (
    <div>
      <Card
        title={
          <h3
            style={{ marginRight: "87%", marginTop: "2%", marginBottom: "1%" }}
          >
            {viewMode == "new" ? <b>Add Agent</b> : <b>Modify Agent</b>}
          </h3>
        }
        extra={
          <a onClick={() => props.closeedit()}>
            <CancelOutlinedIcon fontSize="medium" className="close-btn" />
          </a>
        }
      >
        <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
          {viewMode != "new" && (
            <Avatar
              sx={{ width: 56, height: 56, marginBottom: 5 }}
              src={selectedAgent.speakerImage}
            ></Avatar>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controls.Input
                required
                id="title"
                label="Name"
                {...formik.getFieldProps("title")}
                error={
                  formik.touched.title && formik.errors.title
                    ? formik.errors.title
                    : ""
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controls.Input
                id="speakerDescription"
                label="Description"
                multiline
                {...formik.getFieldProps("speakerDescription")}
                error={
                  formik.touched.speakerDescription &&
                  formik.errors.speakerDescription
                    ? formik.errors.speakerDescription
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Upload
                listType="picture"
                onChange={(response: any) => beforeUpload(response.file)}
                beforeUpload={() => false}
              >
                <ButtonAnt icon={<UploadOutlined translate={undefined} />}>
                  Agent Profile Photo
                </ButtonAnt>
                <br />
                {validFileFormat ? (
                  <span className="text-danger">
                    Invalid file format, Only jpg, jpeg and png files are
                    allowed!
                  </span>
                ) : null}
                {fileRequired ? (
                  <span className="text-danger">
                    Agent Profile Photo is required
                  </span>
                ) : null}
              </Upload>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {viewMode == "new" ? (
              <div className="btn-form">
                {isSubmitting ? (
                  <Button
                    className="clicked-btn"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Sending...
                  </Button>
                ) : (
                  <Button
                    className="send-btn"
                    variant="contained"
                    type="submit"
                    onClick={validFile}
                  >
                    Send
                  </Button>
                )}
              </div>
            ) : (
              <div className="btn-form">
                {isSubmitting ? (
                  <Button
                    className="clicked-btn"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Updating...
                  </Button>
                ) : (
                  <Button
                    className="send-btn"
                    variant="contained"
                    type="submit"
                  >
                    Update
                  </Button>
                )}
              </div>
            )}
          </Grid>
        </Form>
      </Card>
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
};

export default AddAgent;
