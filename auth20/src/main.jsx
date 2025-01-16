import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

import Landing from "./Landing.jsx";
import App from "./App.jsx";
const clientId = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-wlxigrqv1qohn2qa.us.auth0.com"
      clientId={`${clientId}`}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Auth0Provider>
  </BrowserRouter>
);
