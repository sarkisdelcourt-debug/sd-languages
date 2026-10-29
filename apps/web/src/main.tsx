import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource/atkinson-hyperlegible/latin-400.css";
import "@fontsource/atkinson-hyperlegible/latin-700.css";
import "@fontsource/atkinson-hyperlegible/latin-ext-400.css";
import "@fontsource/atkinson-hyperlegible/latin-ext-700.css";
import "./styles.css";
import "./lessons-design.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  const base = import.meta.env.BASE_URL;
  window.addEventListener("load", () => navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(console.error));
}
