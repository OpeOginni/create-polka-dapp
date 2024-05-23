import { create } from "zustand";
import type { Account, BaseWallet } from "@polkadot-onboard/core";
import { ApiPromise, WsProvider } from "@polkadot/api";

interface ConnectedWalletState {
  connectedWallet: BaseWallet | null;
  isWalletConnected: boolean;
  connectWallet: (wallet: BaseWallet) => void;
  disconnectWallet: () => void;
  connectedAccount: Account | null;
  connectAccount: (account: Account) => void;
  disconnectAccount: () => void;
  accounts: Account[];
  api: ApiPromise | null;
}

const useConnectedWalletStore = create<ConnectedWalletState>()((set) => ({
  connectedWallet: null,
  isWalletConnected: false,
  connectWallet: async (wallet: BaseWallet) => {
    try {
      await wallet.connect();

      const accounts = await wallet.getAccounts();
      // const WS_PROVIDER = import.meta.env.VITE_WS_PROVIDER;
      const WS_PROVIDER = "wss://westend-rpc.polkadot.io";
      const provider = new WsProvider(WS_PROVIDER);
      const api = await ApiPromise.create({ provider });

      set({
        connectedWallet: wallet,
        accounts,
        isWalletConnected: true,
        api,
      });
    } catch (error) {
      console.log(error);
    }
  },
  disconnectWallet: () => {
    set({
      connectedWallet: null,
      accounts: [],
      isWalletConnected: false,
      connectedAccount: null,
      api: null,
    });
  },
  connectedAccount: null,
  connectAccount: async (account: Account) => {
    try {
      set({ connectedAccount: account });
    } catch (error) {
      console.log(error);
    }
  },
  disconnectAccount: () => {
    set({ connectedAccount: null });
  },
  accounts: [],
  api: null,
}));

export default useConnectedWalletStore;
