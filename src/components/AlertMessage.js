import { Snackbar, Alert } from '@mui/material';

export default function AlertMessage(props) {
  const { openAlert, setOpenAlert, alertMessage, severity } = props;

  return (
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={5000} onClose={() => setOpenAlert(false)}>
      <Alert variant='filled' severity={severity}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );
}