import "./App.css";
import ReactLogo from "./components/logos/react";
import ViteLogo from "./components/logos/vite";
import JavaScriptLogo from "./components/logos/javascript";
import useConnectedWalletStore from "./zustand/useConnectWalletStore";
import { useEffect, useState } from "react";
function App() {
  const { connectedWallet, api, connectedAccount } = useConnectedWalletStore();

  const [balance, setBalance] = useState(0);
  const [chainToken, setChainToken] = useState("");
  const [chain, setChain] = useState("");

  useEffect(() => {
    async function getChainData() {
      if (!api) return;
      const [chain, nodeName] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
      ]);
      setChain(`${chain} - ${nodeName}`);

      if (connectedAccount?.address) {
        const chainToken = await api.registry.chainTokens[0];
        api.query.system.account(connectedAccount?.address, (res) => {
          setBalance(res.data.free.toHuman());
          setChainToken(chainToken);
        });
      }
    }
    getChainData();
  }, [api, connectedAccount]);

  async function signTransaction() {
    try {
      if (api && connectedAccount?.address && connectedWallet.signer) {
        const signer = connectedWallet.signer;

        await api.tx.system
          .remark("Hello World")
          .signAndSend(connectedAccount.address, { signer }, () => {
            // do something with result
          });
      }
    } catch (err) {
      alert("Error signing transaction");
      console.log(err);
    }
  }
  return (
    <main className="page-body">
      <div className="logos-container">
        <JavaScriptLogo className="logo" />

        <h1>+</h1>

        <ReactLogo className="logo" />

        <h1>+</h1>

        <ViteLogo className="logo" />

        <h1>+</h1>

        <img src="/images/polkadot-logo.svg" alt="Polkadot" className="logo" />
      </div>

      {connectedWallet?.isConnected ? (
        <div className="sample-transaction">
          {connectedAccount?.address && (
            <>
              <p className="balance-label">
                Balance: {balance} {chainToken}
              </p>

              <button
                type="button"
                onClick={() => {
                  signTransaction();
                }}
              >
                Sign Transaction
              </button>
            </>
          )}

          <p className="chain-label">{chain}</p>
        </div>
      ) : (
        <div>
          <h4>Conntect your Wallet</h4>
        </div>
      )}

      <p className="instructions">
        Make Changes to <code>/src/App.jsx</code>
      </p>
    </main>
  );
}

export default App;
