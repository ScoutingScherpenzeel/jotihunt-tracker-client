import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from './components/ui/toaster.tsx';
import Routes from './Routes.tsx';
import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import proj4 from 'proj4';

// Define projection for RD coordinates
proj4.defs(
  'RD',
  '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs',
);

const authStore = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AuthProvider store={authStore}>
      <Routes />
    </AuthProvider>
    <Toaster />
  </>,
);
