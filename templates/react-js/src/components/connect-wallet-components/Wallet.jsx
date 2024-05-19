import { memo } from "react";
import useConnectedWalletStore from "../../zustand/useConnectWalletStore";
import PropTypes from "prop-types";

const Wallet = ({ wallet }) => {
  const { connectWallet } = useConnectedWalletStore();

  const connectWalletHandler = async () => {
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

Wallet.propTypes = {
  wallet: PropTypes.shape({
    metadata: PropTypes.shape({
      iconUrl: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};

const MemoWallet = memo(Wallet);
export default MemoWallet;
