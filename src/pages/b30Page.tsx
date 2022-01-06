import * as React from 'react';

import { GetUserScoresResponse, ScoreType, getUserScores } from '../auth';

import { AuthContext } from '../App'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function ScorePaperIter(array: Array<ScoreType>) {
  return array.map((item, index) => {
    return (<Grid item xs={12} sm={6} sx={{ p: 1 }} key={index}>
      <Paper sx={{ mt: 0, p: 3 }}>
        <Stack>
          <Stack direction='row' spacing={'0.25em'} sx={{ mb: 0.5 }}>
            <Typography variant='h6'>#{index + 1}</Typography>
            <Typography variant='h6'>{item.song_id}</Typography>
            <Typography variant='h6'>{(() => {
              switch (item.difficulty) {
                case 0: {
                  return 'PST'
                }
                case 1: {
                  return 'PRS'
                }
                case 2: {
                  return 'FTR'
                }
                case 3:
                default: {
                  return 'BYD'
                }
              }
            })()}</Typography>
          </Stack>
          <Grid container rowSpacing={1} sx={{ m: 0 }}>
            <Grid item xs={12} md={7}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>时间</Typography>
                <Typography sx={{ ml: 4 }}>{
                  (new Date(item.time_played / 1)).toLocaleString()
                }</Typography>
              </Stack>
            </Grid>
            <Grid item xs={7} md={5} display={{ xs: 'none', md: 'flex' }}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>单曲定数</Typography>
                <Typography sx={{ ml: 4 }}>{(item.rating / 100).toString().substring(0, 8)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={5} md={3}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>得分</Typography>
                <Typography sx={{ ml: 4 }}>{item.score}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={7} md={5} display={{ xs: 'flex', md: 'none' }}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>单曲定数</Typography>
                <Typography sx={{ ml: 4 }}>{(item.rating / 100).toString().substring(0, 8)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={5} md={4}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>Pure</Typography>
                <Typography sx={{ ml: 4 }}>
                  {item.perfect_count}(+{item.shiny_perfect_count})
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={4} md={3}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>Far</Typography>
                <Typography sx={{ ml: 4 }}>{item.near_count}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={3} md={2}>
              <Stack spacing={1}>
                <Typography variant='subtitle2' sx={{ ml: 0 }}>Lost</Typography>
                <Typography sx={{ ml: 4 }}>{item.miss_count}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Grid>)
  })
}

export default function Best30Page() {
  const auth = React.useContext(AuthContext);

  const [userScores, setUserScores]: [GetUserScoresResponse, Function] = React.useState({
    success: false
  });

  React.useEffect(() => {  // 查分面板初始化钩子
    if (auth.id && auth.id !== 'null') {
      getUserScores(auth.id, (data: GetUserScoresResponse) => {

        let getUserBasePromise = new Promise<void>((resolve, reject) => {
          setUserScores(data);
          resolve();
        })
        getUserBasePromise.then(() => {
          setFadeState(true);
        })

        return () => {
          setUserScores({ success: false });
        }
      });
    }
  }, [auth.id]);

  const [fadeState, setFadeState] = React.useState(false);

  return (
    <Box>
      {!fadeState && (<Box sx={{ display: 'flex' }} justifyContent="center">
        <CircularProgress disableShrink sx={{mt: 4}} />
      </Box>)}
      <Fade in={fadeState}>
        <Container maxWidth='md'>
          <Stack spacing={{ xs: 1, md: 2 }} sx={{ mt: 4, mb: 4 }}>
            <Typography variant='h5'>成绩查询</Typography>
            <Box sx={{ p: 1 }}>
              <Paper
                sx={{ p: { xs: 3, md: 4 } }}
              >
                <Typography variant='h6'>潜力值详情</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>Potential</Typography>
                      <Typography>{userScores.value?.rating.toString().substring(0, 8)}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>b30</Typography>
                      <Typography>{(() => {
                        let b30 = userScores.value?.b30_rating;
                        if (b30) {
                          return (b30 / 30).toString().substring(0, 8);
                        }
                      })()}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <Typography variant='subtitle2' sx={{ ml: 0 }}>r10</Typography>
                      <Typography>{(() => {
                        let r10 = userScores.value?.r10_rating;
                        if (r10) {
                          return (r10 / 10).toString().substring(0, 8);
                        }
                      })()}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
            <Typography variant='h5'>Best30</Typography>
            <Grid container columnSpacing={1}>
              {userScores.value ? ScorePaperIter(userScores.value.b30) : null}
            </Grid>
            <Typography variant='h5'>Recent10</Typography>
            <Grid container columnSpacing={1}>
              {userScores.value ? ScorePaperIter(userScores.value.r10) : null}
            </Grid>
          </Stack>
        </Container>
      </Fade>
    </Box>
  );
}