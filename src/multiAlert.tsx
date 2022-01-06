import * as React from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface MultiAlertState {
  open: boolean,
  severity: AlertColor,
  message: string
}

export default function MultiAlert({state, closeHandler, ...props}: {state: MultiAlertState, closeHandler: any}) {
  return (
    <Snackbar
    open={state.open}
    autoHideDuration={3000}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    onClose={closeHandler}>
      <Alert onClose={closeHandler} severity={state.severity} sx={{ mt: 4, width: '100%' }}>
        {state.message}
      </Alert>
    </Snackbar>
  )
}