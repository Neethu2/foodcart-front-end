import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";
import { useState } from "react";

const Signin = () => {
  const [type, setType] = useState(false);
  const passwordMatch = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,21}$/;
  const onSubmit = (values: {}, actions: any) => {
    actions.resetForm();
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(21, "Password must be at most 21 characters")
      .matches(
        passwordMatch,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Required"),
  });

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit,
  });

  console.log(values);
  console.log(errors);

  return (
    <>
      <form className="signin-form" onSubmit={handleSubmit}>
        <TextField
          id="email"
          size="small"
          label="Email"
          className="mb-2"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email && touched.email ? true : false}
          helperText={errors.email && touched.email ? errors.email : ""}
        />
        <div className="password-field">
          <TextField
            id="password"
            size="small"
            label="Password"
            type={type ? "text" : "password"}
            className="mb-2"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password && touched.password ? true : false}
            helperText={
              errors.password && touched.password ? errors.password : ""
            }
          />
          {type ? (
            <VisibilityOffIcon
              className="eye-toggle"
              onClick={() => setType(false)}
            />
          ) : (
            <VisibilityIcon
              className="eye-toggle"
              onClick={() => setType(true)}
            />
          )}
        </div>

        <Button
          variant="contained"
          type="submit"
          className={`${isSubmitting ? "disabled-btn" : ""}`}
          disabled={isSubmitting}
        >
          Signin
        </Button>
      </form>
    </>
  );
};

export default Signin;
