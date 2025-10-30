import { Button, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";
import { useState } from "react";
import { registerUser } from "../../api/auth";
import ToastContainer, {
  type ToastType,
} from "../../components/ToastContainer";
import { Link } from "react-router-dom";

interface ToastState {
  show: boolean;
  type: ToastType;
  message: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "info",
    message: "",
  });

  interface RegisterIntialValues {
    username: String;
    email: String;
    password: String;
  }

  const initialValues: RegisterIntialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email id is required"),
    password: Yup.string()
      .min(6, "Password must be atlease 6 characters")
      .max(21, "Password must be atleast 21 characters")
      .required("Password is required"),
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleSubmit = async (values: RegisterIntialValues) => {
    try {
      const data = await registerUser(values);
      console.log("Form submitted:", data);
      showToast("success", "User Registered Successfully");
    } catch (err) {
      console.error("Registration error:", err);
      showToast("error", "User Registration Failed. Please try again.");
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ getFieldProps, touched, errors }) => {
          return (
            <Form className="register-form">
              <div className="d-flex flex-column align-items-center justify-content-center gap-3">
                <Field
                  as={TextField}
                  label="Username"
                  type="text"
                  variant="outlined"
                  error={touched.username && errors.username}
                  helperText={touched.username && errors.username}
                  {...getFieldProps("username")}
                />
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
                  Already have an account? <Link to="/login">Sign In</Link>
                </small>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  // disabled={isSubmitting}
                >
                  Register
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
      {toast.show && (
        <ToastContainer
          errorType={toast.type}
          message={toast.message}
          open={toast.show}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default Register;
