import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./app/app.jsx";

import { ThemeProvider } from "../src/context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>,
);
