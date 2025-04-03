import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";

export const CommonOps = (
  initialFieldValues: any,
  validateOnChange = false,
  validate: any
) => {
  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    // const fieldValue = { [name]: value };
    setValues({
      ...values,
      [name]: value,
      // ...fieldValue,
    });
    // if (validateOnChange) validate(fieldValue);
    if (validateOnChange) validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialFieldValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
};

const useStyles = makeStyles<any>()((theme:any) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));

export const Form = ({ ...props }) => {
  const { classes, cx } = useStyles({ props });
  const { children, ...other } = props;
  return (
    <form className={cx(classes.root)} autoComplete="off" {...other}>
      {props.children}
    </form>
  );
};
