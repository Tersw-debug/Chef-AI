// import { createElement } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const render = createRoot(document.getElementById("root"));
render.render(<App></App>);