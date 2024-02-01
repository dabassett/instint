import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "@fontsource/raleway/100.css";
import "@fontsource/raleway/200.css";
import "@fontsource/raleway/300.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";
import "@fontsource/raleway/800.css";
import "@fontsource/raleway/900.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
