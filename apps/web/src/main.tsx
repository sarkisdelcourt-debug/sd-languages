import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  const base = import.meta.env.BASE_URL;
  window.addEventListener("load", () => navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(console.error));
}
