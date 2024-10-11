import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import config from "./contract.config.js";

dotenv.config();

export const interact = async (
  networkName,
  contractName,
  contractAddress,
  functionName,
  ...args
) => {
  if (!networkName) {
    console.error(
      "Error: Network name is required. Use --network=<network_name>"
    );
    process.exit(1);
  }

  if (!contractName) {
    console.error(
      "Error: Contract name is required. Use --contract=<contract_name>"
    );
    process.exit(1);
  }

  const network =
    config.networks[networkName] || config.networks[config.defaultNetwork];

  if (!network) {
    console.error(
      `Error: Network '${networkName}' not found in contract.config.js`
    );
    process.exit(1);
  }

  const provider = new WsProvider(network.url);
  const api = await ApiPromise.create({ provider });

  const keyring = new Keyring({ type: "sr25519" });
  const deployer = keyring.addFromUri(process.env.DEPLOYER_SEED);

  const contractMetadata = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "..", "target", "ink", `${contractName}.json`),
      "utf8"
    )
  );

  const contract = new ContractPromise(api, contractMetadata, contractAddress);

  // Call the function
  if (contract.query[functionName]) {
    // Read-only function
    const { result, output } = await contract.query[functionName](
      deployer.address,
      {},
      ...args
    );
    console.log(`Result: ${output.toHuman()}`);
  } else if (contract.tx[functionName]) {
    // State-changing function
    const tx = await contract.tx[functionName]({}, ...args);
    await tx.signAndSend(deployer, (result) => {
      if (result.status.isInBlock || result.status.isFinalized) {
        console.log(`Transaction included in block ${result.status.asInBlock}`);
      }
    });
  } else {
    console.error(`Function ${functionName} not found on contract`);
  }
};

// Parse command line arguments
// ...

interact(
  networkName,
  contractName,
  contractAddress,
  functionName,
  ...functionArgs
);
