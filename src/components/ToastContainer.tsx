import { Alert, Snackbar, type SnackbarCloseReason } from "@mui/material";
import { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastContainerProps {
  errorType: ToastType;
  message: string;
  open?: boolean;
  onClose?: () => void;
}

const ToastContainer = ({
  errorType,
  message,
  open,
  onClose,
}: ToastContainerProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpen(false);
    onClose?.();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={errorType}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastContainer;
