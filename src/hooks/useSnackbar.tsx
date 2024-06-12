import { useState } from "react";
import { SnackbarProps, Snackbar } from "@mui/material";

interface SnackbarState extends SnackbarProps {
  message: string;
  open: boolean;
}

export const useSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    message: "",
    open: false,
    autoHideDuration: 6000,
    onClose: () => setSnackbarState((prev) => ({ ...prev, open: false })),
  });

  const showSnackbar = (
    inMessage: string,
    severity: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setSnackbarState({
      ...snackbarState,
      message: inMessage,
      open: true,
      ContentProps: {
        "aria-describedby": "message-id",
      },
    });
  };

  return {
    showSnackbar,
    snackbarProps: snackbarState,
  };
};
