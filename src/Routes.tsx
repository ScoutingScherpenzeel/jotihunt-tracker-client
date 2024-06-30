import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import App from "./App";
import Login from "./Login";

export default function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
