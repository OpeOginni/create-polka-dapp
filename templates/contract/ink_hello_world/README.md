# ink! Contract Deployment Guide

This guide walks you through the process of building, deploying, and interacting with an ink! smart contract on a Substrate-based blockchain.

## Prerequisites

Before you begin, ensure you have the following installed:

1. Rust and Cargo (https://www.rust-lang.org/tools/install)
2. cargo-contract CLI (https://github.com/paritytech/cargo-contract)
3. substrate-contracts-node (https://github.com/paritytech/substrate-contracts-node)

## Step 1: Build the Contract

1. Navigate to your contract's directory.
2. Run the following command to build your contract:

   ```
   cargo contract build --release
   ```

   This will generate three files in the `target/ink` directory:

   - `your_contract.wasm`: The WebAssembly binary of your contract.
   - `your_contract.json`: The metadata file describing your contract's interface.
   - `your_contract.contract`: A combination of the above two files.

## Step 2: Start a Substrate Node

1. Open a new terminal window.
2. Start the Substrate node:

   ```
   substrate-contracts-node --dev
   ```

   This will start a local Substrate node with the contracts pallet enabled.

## Step 3: Deploy the Contract

1. Go to https://contracts-ui.substrate.io/
2. Connect to your local node by selecting "Local Node" in the top-left dropdown.
3. Click "Add New Contract" in the sidebar.
4. Click "Upload New Contract Code".
5. Choose an instantiation account (e.g., ALICE).
6. Give your contract a name.
7. Drag and drop your `your_contract.contract` file into the upload area.
8. Click "Next" and follow the prompts to upload and instantiate your contract.

## Step 4: Interact with the Contract

1. After instantiation, you'll be taken to the contract's interaction page.
2. Here, you can call your contract's functions:
   - Use "read" calls for view functions that don't modify state.
   - Use "execute" calls for functions that modify the contract's state.

## Additional Notes

- Always use the `--release` flag when building contracts for production to optimize the WASM output.
- Keep track of your contract's address after deployment for future interactions.
- Ensure you have enough funds in your account for deployment and interaction costs.

## Troubleshooting

- If you encounter issues, check the Substrate node's console output for any error messages.
- Ensure your contract compiles without errors before attempting to deploy.
- Verify that you're connected to the correct node in the Contracts UI.

For more detailed information, refer to the official ink! documentation at https://use.ink/

## Interacting with the Contract from the Frontend

To interact with this contract from your frontend:

1. After deploying your contract, you'll need to export the contract's ABI (Application Binary Interface).
2. In your frontend project, create a new file (e.g., `contractABI.json`) and paste the exported ABI into this file.
3. Import this ABI in your frontend code where you want to interact with the contract.
4. Use the ABI along with the contract's address to create a contract instance and call its functions.

Refer to the commented example in your frontend's `App.tsx` (or similar main component file) for a basic structure of how to interact with a contract.

Scaffolded with [CREATE-POLKA-DAPP](https://www.npmjs.com/package/create-polka-dapp)
