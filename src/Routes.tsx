import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';

export default function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<AuthOutlet fallbackPath="/login" />}>
          <Route path="/" element={<App />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
