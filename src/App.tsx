import React from 'react';
import './App.css';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Layout from './pages/layout';
import Dashboard from './pages/dashboard';
import Best30Page from './pages/b30Page';
import LoginPage from './pages/loginPage';
import { arcanaAuthProvider, AuthResponse, getIdByUsername } from './auth';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: blue[400],
            contrastText: '#ffffff'
          }
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path='/b30' element={<RequireAuth><Best30Page /></RequireAuth>} />
            <Route path='/login' element={<LoginPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export interface AuthContextType {
  user: string;
  id: string;
  token: string;
  password: string;  // 因为改名还要输密码也太蠢了  // 但是把密码存本地更蠢
  signin: (user: string, password: string, callback: Function) => void;
  signout: (callback: VoidFunction) => void;
}

export let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);
  let [id, setId] = React.useState<any>(null);
  let [token, setToken] = React.useState<any>(null);
  let [password, setPassword] = React.useState<any>(null);

  let signin = (user: string, password: string, callback: Function) => {
    return arcanaAuthProvider.signin(user, password, (isAuthed: boolean, authResp: AuthResponse) => {
      if (isAuthed) {
        setUser(user);
        setToken(authResp.token);
      } else {
        callback(authResp)
      }
      getIdByUsername(user, (gotId: number) => {
        setId(gotId)
      })
      callback(authResp);
    });
  };

  let signout = (callback: VoidFunction) => {
    return arcanaAuthProvider.signout(() => {
      setUser(null);
      setId(null);
      setToken(null);
      setPassword(null);
      callback();
    });
  };

  let value = { user, id, token, password, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default App;
