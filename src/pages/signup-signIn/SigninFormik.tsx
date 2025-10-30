import { Button, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import * as Yup from "yup";
import { loginUser } from "../../api/auth";
import ToastContainer from "../../components/ToastContainer";
import { useNavigate, Link } from "react-router-dom";

const SigninFormik = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });
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
  const handleSubmit = async (
    values: SigninFormInitialValues,
    actions: any
  ) => {
    try {
      const data = await loginUser(values);
      console.log(data);
      setToast({
        open: true,
        type: "success",
        message: "Logged In successfully",
      });

      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard/home");
      }, 1500); // Wait 1.5 seconds to show the success message
      localStorage.setItem("token", JSON.stringify(data.authToken));
    } catch (error) {
      setToast({
        open: true,
        type: "error",
        message: "Login failed",
      });
    }
    actions.resetForm();
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, errors, touched, getFieldProps }) => {
          return (
            <Form className="signin-form">
              <div className="d-flex flex-column align-items-center justify-content-center gap-3">
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
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    variant="outlined"
                    error={touched.password && errors.password ? true : false}
                    helperText={touched.password && errors.password}
                    {...getFieldProps("password")}
                  />
                  {showPassword ? (
                    <VisibilityOffIcon
                      className="eye-toggle"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <VisibilityIcon
                      className="eye-toggle"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                <small>
                  Don't have an account? <Link to="/">Register</Link>
                </small>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
      <ToastContainer
        errorType={toast.type}
        message={toast.message}
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
};

export default SigninFormik;
