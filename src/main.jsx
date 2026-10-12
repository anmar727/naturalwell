import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./views/App.js";
import "./styles.css";

var el = document.getElementById("root");
var dataEl = document.getElementById("nw-data");
var data = null;
try { data = dataEl ? JSON.parse(dataEl.textContent) : null; } catch (e) { data = null; }
var url = window.location.pathname + window.location.search;
var app = React.createElement(App, { url: url, data: data });

if (data && el.hasChildNodes()) hydrateRoot(el, app);
else createRoot(el).render(app);
