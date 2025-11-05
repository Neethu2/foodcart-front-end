import { Button, Input, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import * as Yup from "yup";
import ToastContainer, { type ToastType } from "../components/ToastContainer";
import { loginUser } from "../api/auth";
import { Navigate, useNavigate } from "react-router-dom";

interface ToastState {
  show: boolean;
  type: ToastType;
  message: string;
}
const SigninFormik = () => {
  const [type, setType] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "info",
    message: "",
  });
  const navigate = useNavigate();
  interface SigninFormInitialValues {
    email: string;
    password: string;
  }
  const initialValues: SigninFormInitialValues = { email: "", password: "" };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(21, "Password must be at most 21 chars")
      .required("Required"),
  });
  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const handleSubmit = async (
    values: SigninFormInitialValues,
    actions: any
  ) => {
    try {
      const data = await loginUser(values);
      localStorage.setItem("token", JSON.stringify(data.authToken));
      showToast("success", "Login Successful");
      actions.resetForm();
      navigate("/dashboard/home");
    } catch (e) {
      showToast("error", "Login failed");
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, isSubmitting, errors, touched, getFieldProps }) => {
          return (
            <Form>
              <Field
                as={TextField}
                label="Email"
                type="email"
                variant="outlined"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
                {...getFieldProps("email")}
              />
              <div className="password-field">
                <Field
                  as={TextField}
                  type="password"
                  label="Password"
                  variant="outlined"
                  error={touched.password && errors.password ? true : false}
                  helperText={touched.password && errors.password}
                  {...getFieldProps("password")}
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
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SigninFormik;
