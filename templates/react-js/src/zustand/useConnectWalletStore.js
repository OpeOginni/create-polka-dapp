import { create } from "zustand";
import { ApiPromise, WsProvider } from "@polkadot/api";

const useConnectedWalletStore = create()((set) => ({
  connectedWallet: null,
  isWalletConnected: false,
  connectWallet: async (wallet) => {
    try {
      await wallet.connect();

      const accounts = await wallet.getAccounts();
      const WS_PROVIDER = import.meta.env.VITE_WS_PROVIDER;
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
  connectAccount: async (account) => {
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
