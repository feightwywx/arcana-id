import * as React from 'react';

import { AlertColor, FormControl } from '@mui/material';
import {
  ChangeInfoResponse,
  GetCloudSaveResponse,
  UploadCloudSaveResponse,
  UserBaseResponse,
  doChangeUserInfo,
  getCloudSave,
  getUserBase,
  uploadCloudSave
} from '../auth';
import MultiAlert, { MultiAlertState } from '../multiAlert'

import { AuthContext } from '../App'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import getErrorInfo from '../errorInfo'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [userBase, setUserBase]: [UserBaseResponse, Function] = React.useState({
    success: false
  });
  const [recentDifficultyText, setRecentDifficultyText] = React.useState('');

  React.useEffect(() => {  // 仪表板初始化钩子
    if (auth.id && auth.id !== 'null') {
      getUserBase(auth.id, (gotUserBase: UserBaseResponse) => {
        console.log(gotUserBase);
        let getUserBasePromise = new Promise<void>((resolve, reject) => {
          setUserBase(gotUserBase);
          resolve();
        })
        getUserBasePromise.then(
          () => { setFadeState(true); }
        )
      });
    }
  }, [auth.id]);

  React.useEffect(() => {  // userBase处理钩子
    if (userBase.value?.recent_score) {
      switch (userBase.value.recent_score.difficulty) {
        case 0: {
          setRecentDifficultyText('PST');
          break;
        }
        case 1: {
          setRecentDifficultyText('PRS');
          break;
        }
        case 2: {
          setRecentDifficultyText('FTR');
          break;
        }
        case 3: {
          setRecentDifficultyText('BYD');
          break;
        }
      }
    }
  }, [userBase])

  const [snackState, setSnackState] = React.useState({
    open: false,
    severity: 'success' as AlertColor,
    message: ''
  } as MultiAlertState)

  const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackState({
      ...snackState,
      open: false,
    });
  };

  const [inputState, setInputState] = React.useState({
    'new-user-name': '',
    'old-password': '',
    'old-password-username': '',
    'new-password': '',
    'repeat-password': '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setInputState({ ...inputState, [id]: value });
  }

  const [nameDialogOpen, setNameDialogOpen] = React.useState(false);

  const handleClickOpenNameDialog = () => {
    setNameDialogOpen(true);
  };

  const handleNameDialogClose = () => {
    let new_username = inputState['new-user-name']
    let password = inputState['old-password-username']
    doChangeUserInfo(
      auth.token, auth.user, new_username, password, password, (changeResp: ChangeInfoResponse) => {
        if (changeResp.success) {
          setSnackState({
            open: true,
            severity: 'success',
            message: '修改成功，正在跳转至登录页'
          })
          setTimeout(() => {
            auth.signout(() => { navigate("/login") });
          }, 3000)
          setNameDialogOpen(false);
        } else {
          setSnackState({
            open: true,
            severity: 'error',
            message: getErrorInfo(changeResp.error_code)
          })
        }
      }
    )
  };

  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);

  const handleClickOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    let old_password = inputState['old-password'];
    let new_password = inputState['new-password'];
    doChangeUserInfo(
      auth.token, auth.user, auth.user, old_password, new_password, (changeResp: ChangeInfoResponse) => {
        if (changeResp.success) {
          setSnackState({
            open: true,
            severity: 'success',
            message: '修改成功，正在跳转至登录页'
          })
          setTimeout(() => {
            auth.signout(() => { navigate("/login") });
          }, 3000)
          setPasswordDialogOpen(false);
        } else {
          setSnackState({
            open: true,
            severity: 'error',
            message: getErrorInfo(changeResp.error_code)
          })
        }
      })
  };

  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [uploadDialogData, setUploadDialogData] = React.useState({
    success: false
  } as GetCloudSaveResponse)

  const handleOpenUploadDialog = () => {
    getCloudSave(auth.token, (data: GetCloudSaveResponse) => {
      setUploadDialogData(data);
      if (!data.success) {
        setSnackState({
          open: true,
          severity: 'error',
          message: getErrorInfo(data.error_code)
        })
      }
      setUploadDialogOpen(true);
    })
  }

  const handleUploadDialogClose = () => {
    uploadCloudSave(auth.token, (data: UploadCloudSaveResponse) => {
      if (data.success) {
        setSnackState({
          open: true,
          severity: 'success',
          message: '上传成功'
        })
        setUploadDialogOpen(false);
      } else {
        setSnackState({
          open: true,
          severity: 'error',
          message: getErrorInfo(data.error_code)
        })
      }
    })
  };

  const [fadeState, setFadeState] = React.useState(false);

  return (
    <Box>
      {!fadeState && (<Box sx={{ display: 'flex' }} justifyContent="center">
        <CircularProgress disableShrink sx={{ mt: 4 }} />
      </Box>)}
      <Fade in={fadeState}>
        <Container maxWidth='md'>
          <Stack spacing={{ xs: 2, md: 4 }} sx={{ mb: 4 }}>
            <Paper
              sx={{ mt: { xs: 2, md: 4 }, p: { xs: 2, md: 4 } }}
            >
              <Toolbar disableGutters sx={{ ml: 1, mb: 2 }}>
                <Typography variant='h5'>{userBase.value?.name}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" onClick={handleClickOpenNameDialog} sx={{ display: { xs: 'none', sm: 'flex' } }}>修改用户名</Button>
                <IconButton aria-label="edit" onClick={handleClickOpenNameDialog} color="primary" sx={{ display: { xs: 'flex', sm: 'none' } }}>
                  <EditIcon />
                </IconButton>
              </Toolbar>
              <Grid container spacing={1} sx={{ m: 0 }}>
                <Grid item xs={6} sm={4} md={2}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle2' sx={{ ml: 0 }}>Potential</Typography>
                    <Typography sx={{ ml: 4 }}>{userBase.value ? userBase.value.rating / 100 : ''}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle2' sx={{ ml: 0 }}>好友码</Typography>
                    <Typography sx={{ ml: 4 }}>{userBase.value?.user_code}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
            {userBase.value?.recent_score && <Paper
              sx={{ mt: 4, p: { xs: 2, md: 4 } }}
            >
              <Stack>
                <Typography variant='h5'>最近游玩</Typography>
                <Stack direction='row' spacing={'0.25em'} sx={{ mt: 1, mb: 0.5 }}>
                  <Typography variant='h6'>{userBase.value?.recent_score.song_id}</Typography>
                  <Typography variant='h6'>{recentDifficultyText}</Typography>
                </Stack>
                <Grid container rowSpacing={1} sx={{ m: 0 }}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>时间</Typography>
                      <Typography sx={{ ml: 4 }}>{
                        userBase.value ? (new Date(userBase.value.recent_score.time_played)).toLocaleString() : ''
                      }</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={5} md={2}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>得分</Typography>
                      <Typography sx={{ ml: 4 }}>{userBase.value?.recent_score.score}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={7} md={2}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>单曲定数</Typography>
                      <Typography sx={{ ml: 4 }}>{userBase.value ? userBase.value.recent_score.rating / 100 : ''}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={5} md={2}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>Pure</Typography>
                      <Typography sx={{ ml: 4 }}>
                        {userBase.value?.recent_score.perfect_count}(+{userBase.value?.recent_score.shiny_perfect_count})
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>Far</Typography>
                      <Typography sx={{ ml: 4 }}>{userBase.value?.recent_score.near_count}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={3} md={2}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>Lost</Typography>
                      <Typography sx={{ ml: 4 }}>{userBase.value?.recent_score.miss_count}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>}
            <Paper
              sx={{ mt: { xs: 2, md: 4 }, p: { xs: 2, md: 4 } }}
            >
              <Typography variant='h5'>账号设置</Typography>
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>修改密码</Typography>
                <Grid container rowSpacing={1} sx={{ m: 0 }}>
                  <Grid item xs={12} sm={10}>
                    <Typography>修改您Arcana ID的密码。</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button fullWidth variant="outlined" onClick={handleClickOpenPasswordDialog}>修改</Button>
                  </Grid>
                </Grid>
                <Typography variant='subtitle2' sx={{ ml: 0, pt: { xs: 2 } }}>成绩上传</Typography>
                <Grid container rowSpacing={1} sx={{ m: 0 }}>
                  <Grid item xs={12} sm={10}>
                    <Typography>将您云存档中的成绩上传到排行榜。</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button fullWidth variant="outlined" onClick={handleOpenUploadDialog}>上传</Button>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Stack>
          <Dialog open={nameDialogOpen} onClose={() => { setNameDialogOpen(false); }} fullWidth>
            <DialogTitle>修改用户名</DialogTitle>
            <DialogContent>
              <DialogContentText>
                请输入您的新用户名。
              </DialogContentText>
              <TextField
                autoFocus
                margin="normal"
                id="new-user-name"
                label="新用户名"
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                value={inputState['new-user-name']}
              />
              <TextField
                margin="normal"
                id="old-password-username"
                label="密码"
                fullWidth
                variant="outlined"
                type="password"
                autoComplete="current-password"
                onChange={handleInputChange}
                value={inputState['old-password-username']}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setNameDialogOpen(false); }}>取消</Button>
              <Button onClick={handleNameDialogClose} disabled={
                inputState['new-user-name'] === '' || inputState['old-password-username'] === ''
              }>确定</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={passwordDialogOpen} onClose={() => { setPasswordDialogOpen(false); }} fullWidth>
            <DialogTitle>修改密码</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <TextField
                  autoFocus
                  margin="normal"
                  id="old-password"
                  label="旧密码"
                  fullWidth
                  variant="outlined"
                  type="password"
                  autoComplete="current-password"
                  onChange={handleInputChange}
                  value={inputState['old-password']}
                />
                <TextField
                  margin="normal"
                  id="new-password"
                  label="新密码"
                  fullWidth
                  variant="outlined"
                  type="password"
                  onChange={handleInputChange}
                  value={inputState['new-password']}
                  autoComplete="new-password"
                />
                <TextField
                  margin="normal"
                  id="repeat-password"
                  label="重复密码"
                  fullWidth
                  variant="outlined"
                  type="password"
                  onChange={handleInputChange}
                  value={inputState['repeat-password']}
                  autoComplete="new-password"
                  error={
                    inputState['new-password'] !== inputState['repeat-password'] &&
                    inputState['new-password'] !== '' &&
                    inputState['repeat-password'] !== ''
                  }
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setPasswordDialogOpen(false); }}>取消</Button>
              <Button onClick={handlePasswordDialogClose} disabled={
                (
                  inputState['new-password'] !== inputState['repeat-password'] &&
                  inputState['new-password'] !== '' &&
                  inputState['repeat-password'] !== '') ||
                (
                  inputState['new-password'] === '' ||
                  inputState['old-password'] === '' ||
                  inputState['repeat-password'] === ''
                )
              }>确定</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={uploadDialogOpen} onClose={() => { setUploadDialogOpen(false); }} fullWidth>
            <DialogTitle>成绩上传</DialogTitle>
            <DialogContent>
              <Typography>请确认您的云存档信息：</Typography>
              <Grid container rowSpacing={1} sx={{ mb: 2, mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle2' sx={{ ml: 0 }}>上传时间</Typography>
                    <Typography sx={{ ml: 4 }}>{
                      uploadDialogData.save ? (new Date(uploadDialogData.save.created_at)).toLocaleString() : <em>暂无存档</em>
                    }</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle2' sx={{ ml: 0 }}>设备名称</Typography>
                    <Typography sx={{ ml: 4 }}>{
                      uploadDialogData.save ? uploadDialogData.save.device_model_name : <em>暂无存档</em>
                    }</Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Typography>将会用您云存档中的更高成绩刷新排行榜和潜力值。<b>该操作无法撤销。</b></Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setUploadDialogOpen(false); }}>取消</Button>
              <Button onClick={handleUploadDialogClose} disabled={uploadDialogData.save === undefined}>确定</Button>
            </DialogActions>
          </Dialog>
          <MultiAlert state={snackState} closeHandler={handleSnackClose}></MultiAlert>
        </Container>
      </Fade>
    </Box>
  );
}