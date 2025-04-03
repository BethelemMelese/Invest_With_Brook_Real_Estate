import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, Button, Grid } from "@mui/material";
import { Form } from "../../commonComponent/Form";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Notification from "../../commonComponent/notification";
import { Card, Upload, Button as ButtonAnt } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { appUrl } from "../../appurl";
import axios from "axios";
import Controls from "../../commonComponent/Controls";
import { api } from "../../polices/api/axiosConfig";

interface ItemState {
  title: string;
  speakerRole: string;
  speakerDescription: string;
}

const initialState: ItemState = {
  title: "",
  speakerRole: "",
  speakerDescription: "",
};
const AddSpeaker = ({ ...props }) => {
  const [viewMode, setViewMode] = useState(props.viewMode);
  const [selectedSpeaker, setSelectedSpeaker] = useState(props.selectedSpeaker);
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
    setSelectedSpeaker(props.selectedSpeaker);
    if (props.viewMode === "new") {
      formik.resetForm({
        values: initialState,
      });
    }
  }, [props.viewMode, props.selectedSpeaker]);

  const onCreateSuccess = () => {
    setNotify({
      isOpen: true,
      type: "success",
      message: "Speaker is Successfully Added !",
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
      message: "Speaker is Successfully Updated !",
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
    speakerRole: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: selectedSpeaker,
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
          formData.append("speakerRole", values.speakerRole);
          formData.append("speakerDescription", values.speakerDescription);
          api
            .post("speakers", formData)
            .then(() => onCreateSuccess())
            .catch((error) => onCreateError(error.response.data.message));
        }
      } else {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append(
          "file",
          fileList == null ? selectedSpeaker.speakerImage : fileList
        );
        formData.append("title", values.title);
        formData.append("speakerRole", values.speakerRole);
        formData.append("speakerDescription", values.speakerDescription);
        api
          .put(`speakers/${selectedSpeaker.id}`, formData)
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
            {viewMode == "new" ? <b>Add Speaker</b> : <b>Modify Speaker</b>}
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
              src={selectedSpeaker.speakerImage}
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
                id="speakerRole"
                label="Role"
                {...formik.getFieldProps("speakerRole")}
                error={
                  formik.touched.speakerRole && formik.errors.speakerRole
                    ? formik.errors.speakerRole
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
                  Speaker Profile Photo
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
                    Speaker Profile Photo is required
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

export default AddSpeaker;
