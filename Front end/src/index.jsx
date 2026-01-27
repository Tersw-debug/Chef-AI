import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from 'react-router-dom';

// 1. Fixed the path (added the dot)
import { AuthProvider  } from './context/authContext.jsx'; 

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);