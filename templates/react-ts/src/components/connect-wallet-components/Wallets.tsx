import React from "react";
import { memo } from "react";
import { useWallets } from "@polkadot-onboard/react";
import type { BaseWallet } from "@polkadot-onboard/core";
import Wallet from "./Wallet";
import "../../styles/connectWallet.css";

const Wallets = () => {
  const { wallets } = useWallets();

  if (!Array.isArray(wallets)) {
    return null;
  }

  return (
    <div className="wallets">
      {wallets.map((wallet: BaseWallet) => (
        <Wallet key={wallet.metadata.title} wallet={wallet} />
      ))}
    </div>
  );
};

const MemoWallets = memo(Wallets);

export default MemoWallets;
