import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import App from './pages/App';
import Login from './pages/Login';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import Users from './pages/Users';
import Layout from './Layout';

export default function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<AuthOutlet fallbackPath="/login" />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
