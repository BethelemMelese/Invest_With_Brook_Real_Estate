import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, Button, Grid } from "@mui/material";
import { Form } from "../../commonComponent/Form";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Notification from "../../commonComponent/notification";
import { Card, Upload, Button as ButtonAnt } from "antd";
import Controls from "../../commonComponent/Controls";
import { api } from "../../polices/api/axiosConfig";

interface ItemState {
  headerTitle: string;
  subTitle: string;
  heroUrl: string;
}

const initialState: ItemState = {
  headerTitle: "",
  subTitle: "",
  heroUrl: "",
};
const AddHeroSection = ({ ...props }) => {
  const [viewMode, setViewMode] = useState(props.viewMode);
  const [selectedHeroSection, setSelectedHeroSection] = useState(
    props.selectedHeroSection
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    setViewMode(props.viewMode);
    setSelectedHeroSection(props.selectedHeroSection);
    if (props.viewMode === "new") {
      formik.resetForm({
        values: initialState,
      });
    }
  }, [props.viewMode, props.selectedHeroSection]);

  const onCreateSuccess = () => {
    setNotify({
      isOpen: true,
      type: "success",
      message: "Hero Section is Successfully Added!",
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
      message: "Hero Section is Successfully Updated!",
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
    headerTitle: Yup.string().required("Header Title is required"),
    subTitle: Yup.string().required("Sub Header Title is required"),
    heroUrl: Yup.string().required("Url Link is required"),
  });

  const formik = useFormik({
    initialValues: selectedHeroSection,
    onSubmit: (values) => {
      if (viewMode == "new") {
        setIsSubmitting(true);
        api
          .post("heroSections", values)
          .then(() => onCreateSuccess())
          .catch((error) => onCreateError(error.response.data.message));
      } else {
        setIsSubmitting(true);
        api
          .put(`heroSections/${selectedHeroSection.id}`, values)
          .then(() => onUpdateSuccess())
          .catch((error) => onUpdateError(error.response.data.message));
      }
    },
    validationSchema: validationSchema,
  });


  return (
    <div>
      <Card
        title={
          <h3
            style={{ marginRight: "87%", marginTop: "2%", marginBottom: "1%" }}
          >
            {viewMode == "new" ? (
              <b>Add Hero Section</b>
            ) : (
              <b>Modify Hero Section</b>
            )}
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
              src={selectedHeroSection.heroImage}
            ></Avatar>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controls.Input
                required
                id="headerTitle"
                label="Header Title"
                multiline
                {...formik.getFieldProps("headerTitle")}
                error={
                  formik.touched.headerTitle && formik.errors.headerTitle
                    ? formik.errors.headerTitle
                    : ""
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controls.Input
                id="subTitle"
                label="Sub Header Title"
                multiline
                {...formik.getFieldProps("subTitle")}
                error={
                  formik.touched.subTitle && formik.errors.subTitle
                    ? formik.errors.subTitle
                    : ""
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Controls.Input
                id="heroUrl"
                label="Url Link"
                multiline
                {...formik.getFieldProps("heroUrl")}
                error={
                  formik.touched.heroUrl && formik.errors.heroUrl
                    ? formik.errors.heroUrl
                    : ""
                }
              />
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

export default AddHeroSection;
