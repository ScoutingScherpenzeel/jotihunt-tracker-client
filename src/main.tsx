import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/toaster.tsx";
import Routes from "./Routes.tsx";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";

const authStore = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <AuthProvider store={authStore}>
      <Routes />
    </AuthProvider>
    <Toaster />
  </>
);
