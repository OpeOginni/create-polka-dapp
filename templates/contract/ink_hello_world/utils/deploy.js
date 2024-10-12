import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { CodePromise } from "@polkadot/api-contract";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import config from "./contract.config.js";

dotenv.config();

const deploy = async (networkName, contractName, initArgs = []) => {
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

  const keyring = new Keyring({
    type: "sr25519",
    ss58Format: api.runtimeChain.registry.chainSS58,
  });
  const deployer = keyring.addFromUri(process.env.DEPLOYER_SEED_PHRASE, {
    name: "deployer",
  });

  const contractMetadataPath = path.join(
    process.cwd(),
    "target",
    "ink",
    `${contractName}.json`
  );
  const contractWasmPath = path.join(
    process.cwd(),
    "target",
    "ink",
    `${contractName}.wasm`
  );

  if (
    !fs.existsSync(contractMetadataPath) ||
    !fs.existsSync(contractWasmPath)
  ) {
    console.error(`Error: Contract files for '${contractName}' not found.`);
    console.error(
      "Make sure you've built the contract using 'cargo contract build --release'"
    );
    console.error("or check if the contract name is correct.");
    process.exit(1);
  }

  const contractMetadata = JSON.parse(
    fs.readFileSync(path.join(contractMetadataPath), "utf8")
  );

  const contractWasm = fs.readFileSync(path.join(contractWasmPath));

  const code = new CodePromise(api, contractMetadata, contractWasm);

  // maximum gas to be consumed for the instantiation. if limit is too small the instantiation will fail.
  const gasLimit = 100000n * 1000000n;

  // used to derive contract address,
  // use null to prevent duplicate contracts
  const salt = new Uint8Array();

  const storageDepositLimit = network.storageDepositLimit
    ? BigInt(network.storageDepositLimit)
    : null;

  const tx = code.tx.new({ gasLimit, storageDepositLimit }, ...initArgs);

  const unsub = await tx.signAndSend(deployer, async (result) => {
    if (result.status.isInBlock || result.status.isFinalized) {
      console.log(
        `Network: ${networkName}`,
        `Contract: ${contractName}`,
        `Deployed at: ${result.contract.address.toString()}`
      );
      unsub();
    }
  });
};

const networkArg = process.argv[2]?.replace("--network=", "");
const contractArg = process.argv[3]?.replace("--contract=", "");

const initArgs = process.argv.slice(4).map((arg) => {
  if (arg.startsWith("--")) {
    const [key, value] = arg.slice(2).split("=");
    return { [key]: value };
  }
  return arg;
});

deploy(networkArg, contractArg, initArgs);
