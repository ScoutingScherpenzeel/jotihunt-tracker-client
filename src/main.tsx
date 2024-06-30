import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/toaster.tsx";
import Routes from "./Routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Routes />
    <Toaster />
  </>
);
