import { useSnackbar } from "./snackbar";
export default function Toast() {
  const { enqueueSnackbar } = useSnackbar();
  const Toast = (message, configuration = {}) => {
    enqueueSnackbar(message, configuration);
  };

  const ToastError = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      
    });
  };
  window.Toast = Toast;
  window.ToastError = ToastError;
  return <></>;
}
