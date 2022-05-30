import * as React from 'react';

import { Outlet, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import { AuthContext } from '../App'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Layout() {

  const pages = [
    { 'name': '首页', 'link': '/' },
    { 'name': '成绩查询', 'link': '/b30' }
  ];
  let auth = React.useContext(AuthContext)
  let navigate = useNavigate();
  let path = useLocation().pathname
  let isLoginPage = path === '/login';
  // console.log(path)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Slide in>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              {auth.user && <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} component={RouterLink} to={page.link} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Arcana ID
            </Typography>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              Arcana ID
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  component={RouterLink}
                  to={page.link}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} />
            {auth.user && (
              <div>
                <Button
                  size="large"
                  startIcon={<AccountCircle />}
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  {auth.user}
                </Button>
                <Button
                  size="large"
                  startIcon={<AccountCircle />}
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                >
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={() => {
                    setAnchorEl(null);
                    auth.signout(() => navigate("/login"));
                  }}>退出登录</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
      <Container>
        <Outlet />
        <Container maxWidth={isLoginPage ? 'sm' : 'md'} sx={{mt: isLoginPage ? 3 : 0, mb: 4, textAlign: 'center'}}>
          <Link href='https://beian.miit.gov.cn/'>黔ICP备2022001114号-1</Link>
        </Container>
      </Container>
    </Box>
  );
}