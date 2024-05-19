import { memo } from "react";
import { useWallets } from "@polkadot-onboard/react";
import type { BaseWallet } from "@polkadot-onboard/core";
import Wallet from "./Wallet";
import React from "react";
import useConnectedWalletStore from "../../zustand/useConnectWalletStore";
import "../../styles/connectWallet.css";

const Wallets = () => {
  const { wallets } = useWallets();
  const { connectedAccount } = useConnectedWalletStore();

  console.log(wallets);
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

export default memo(Wallets);
