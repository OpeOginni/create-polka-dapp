import React, { useState, useCallback, useMemo } from "react";
import { useWallets } from "@polkadot-onboard/react";
import useConnectedWalletStore from "../zustand/useConnectWalletStore";
import { Wallet, LogOut, ChevronDown, X } from "lucide-react";
import type { BaseWallet } from "@polkadot-onboard/core";

const WalletModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  wallets: BaseWallet[];
  onSelectWallet: (wallet: BaseWallet) => Promise<void>;
  isConnecting: boolean;
  connectingWallet: string | null;
}> = ({
  isOpen,
  onClose,
  wallets,
  onSelectWallet,
  isConnecting,
  connectingWallet,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Select a Wallet</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isConnecting}
          >
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.metadata.title}
              type="button"
              onClick={() => onSelectWallet(wallet)}
              className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-100 transition duration-200 relative"
              disabled={isConnecting}
            >
              {wallet.metadata.iconUrl && (
                <img
                  src={wallet.metadata.iconUrl}
                  alt={`${wallet.metadata.title} icon`}
                  className="w-12 h-12 mb-2"
                />
              )}
              <span className="text-sm font-medium text-gray-800">
                {wallet.metadata.title}
              </span>
              {isConnecting && connectingWallet === wallet.metadata.title && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const {
    connectedWallet,
    connectedAccount,
    disconnectWallet,
    disconnectAccount,
    accounts,
    connectAccount,
    connectWallet,
  } = useConnectedWalletStore();
  const { wallets } = useWallets();

  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [showAccounts, setShowAccounts] = useState<boolean>(false);

  const toggleWalletModal = useCallback(
    () => setShowWalletModal((prev) => !prev),
    []
  );
  const toggleAccounts = useCallback(
    () => setShowAccounts((prev) => !prev),
    []
  );

  const handleConnectWallet = useCallback(
    async (wallet: BaseWallet) => {
      setIsConnecting(true);
      setConnectingWallet(wallet.metadata.title);
      try {
        await connectWallet(wallet);
        const walletAccounts = await wallet.getAccounts();
        if (walletAccounts && walletAccounts.length > 0) {
          await connectAccount(walletAccounts[0]);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      } finally {
        setIsConnecting(false);
        setConnectingWallet(null);
        setShowWalletModal(false);
      }
    },
    [connectWallet, connectAccount]
  );

  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    disconnectAccount();
    setShowAccounts(false);
  }, [disconnectWallet, disconnectAccount]);

  const truncatedAddress = useMemo(
    () =>
      connectedAccount?.address
        ? `${connectedAccount.address.slice(
            0,
            6
          )}...${connectedAccount.address.slice(-4)}`
        : "",
    [connectedAccount]
  );

  return (
    <header className="bg-purple-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">create-polka-dapp</h1>
      <div className="relative">
        {connectedWallet?.isConnected && connectedAccount ? (
          <div className="flex items-center space-x-2">
            {connectedWallet?.metadata?.iconUrl && (
              <img
                src={connectedWallet.metadata.iconUrl}
                alt="wallet icon"
                className="w-5 h-5 rounded-full"
              />
            )}
            <div className="relative">
              <button
                type="button"
                onClick={toggleAccounts}
                className="bg-purple-700 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <span>{truncatedAddress}</span>
                <ChevronDown size={16} />
              </button>
              {showAccounts && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1 max-h-60 overflow-auto" role="menu">
                    {accounts.map((account) => (
                      <button
                        type="button"
                        key={account.address}
                        onClick={() => {
                          connectAccount(account);
                          setShowAccounts(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          connectedAccount.address === account.address
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <div className="font-medium">
                          {account.name || "Unnamed Account"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {account.address}
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleWalletModal}
            className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-300"
          >
            <Wallet size={16} />
            <span>Connect Wallet</span>
          </button>
        )}

        <WalletModal
          isOpen={showWalletModal}
          onClose={() => !isConnecting && setShowWalletModal(false)}
          wallets={wallets}
          onSelectWallet={handleConnectWallet}
          isConnecting={isConnecting}
          connectingWallet={connectingWallet}
        />
      </div>
    </header>
  );
};

export default Header;
