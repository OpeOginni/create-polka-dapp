import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PolkadotWalletsContextProvider } from "@polkadot-onboard/react";
import walletAggregator from "./providers/walletProviderAggregator.jsx";
import Header from "./components/Header.jsx";

const rootElement = document.getElementById("root");

if (rootElement)
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
        <Header />
        <App />
      </PolkadotWalletsContextProvider>
    </React.StrictMode>
  );
