import * as React from 'react';

import MultiAlert, { MultiAlertState } from '../multiAlert'

import { AuthContext } from '../App'
import { AuthResponse } from '../auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
  let navigate = useNavigate();
  let auth = React.useContext(AuthContext)

  const [snackState, setSnackState] = React.useState({
    open: false,
    severity: 'success',
    message: ''
  } as MultiAlertState)

  const [fadeState, setFadeState] = React.useState(true);

  const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackState({
      ...snackState,
      open: false,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let username = data.get('username')
    let password = data.get('password')

    if ((!(typeof username === 'string') || !(typeof password === 'string')) ||
        username === '' || password === '') {
      setSnackState({
        open: true,
        severity: 'warning',
        message: '请填写用户名和密码！'
      })
    } else {
      auth.signin(username, password, (authResp: AuthResponse) => {
        if (authResp.success) {
          setFadeState(false);
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 50)
        } else {
          setSnackState({
            open: true,
            severity: 'error',
            message: '遇到了未知错误(' + authResp.error_code + ')'
          })
        }
      });
    }
  };

  return (
    <Container maxWidth='sm'>
      <Fade in={fadeState}>
        <Paper
          sx={{ mt: 4, p: { xs: 2, md: 4 } }}
        >
          <Typography variant='h5'>登录</Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Arcana ID"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              size='large'
            >
              登录
            </Button>
          </Box>
        </Paper>
      </Fade>
      <MultiAlert state={snackState} closeHandler={handleSnackClose}></MultiAlert>
    </Container>
  );
}