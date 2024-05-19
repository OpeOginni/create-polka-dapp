import { memo } from "react";
import { useWallets } from "@polkadot-onboard/react";
import Wallet from "./Wallet";
import "../../styles/connectWallet.css";

const Wallets = () => {
  const { wallets } = useWallets();

  console.log(wallets);
  if (!Array.isArray(wallets)) {
    return null;
  }

  return (
    <div className="wallets">
      {wallets.map((wallet) => (
        <Wallet key={wallet.metadata.title} wallet={wallet} />
      ))}
    </div>
  );
};

const MemoWallets = memo(Wallets);

export default MemoWallets;
