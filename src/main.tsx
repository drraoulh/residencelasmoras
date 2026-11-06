import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/Auth";
import { PropertiesProvider } from "./context/Properties";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <PropertiesProvider>
        <App />
      </PropertiesProvider>
    </AuthProvider>
  </StrictMode>,
);
