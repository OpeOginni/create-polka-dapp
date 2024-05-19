import ConnectWalletButton from "./connect-wallet-components/ConnectWalletButton";
import "../App.css";
import useConnectedWalletStore from "../zustand/useConnectWalletStore";
import ConnectedAccount from "./connect-wallet-components/ConnectedAccount";
import ConnectAccountButton from "./connect-wallet-components/ConnectAccountButton";

export default function Header() {
  const { connectedWallet, connectedAccount } = useConnectedWalletStore();

  return (
    <header className="header">
      <h2>create-polka-dapp</h2>
      <div>
        {connectedWallet?.isConnected ? (
          connectedAccount ? (
            <ConnectedAccount />
          ) : (
            <ConnectAccountButton />
          )
        ) : (
          <ConnectWalletButton />
        )}
      </div>
    </header>
  );
}
