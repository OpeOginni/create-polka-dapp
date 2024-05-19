// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { memo, useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import type { BaseWallet, Account } from "@polkadot-onboard/core";
import useConnectedWalletStore from "../../zustand/useConnectWalletStore";

const Wallet = ({ wallet }: { wallet: BaseWallet }) => {
  const { disconnectWallet, connectWallet } = useConnectedWalletStore();

  const connectWalletHandler = async (event: React.MouseEvent) => {
    console.log("wallet clicked!");

    connectWallet(wallet);
  };

  return (
    <div className="wallet-option">
      {wallet?.metadata?.iconUrl && (
        <img
          width={25}
          height={25}
          src={wallet.metadata.iconUrl}
          alt="wallet icon"
        />
      )}
      <div>{`${wallet.metadata.title}`}</div>

      <button type="button" onClick={connectWalletHandler}>
        Connect Wallet
      </button>
    </div>
  );
};

export default memo(Wallet);
