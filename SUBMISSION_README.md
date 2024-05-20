```markdown
# Polkadot Prodigy Hackathon

## Project Title - Create-Polka-Dapp

### Description

Create-Polka-Dapp is an easy-to-use frontend scaffolding CLI that helps developers building on the Polkadot ecosystem quickly spin up a starter frontend. It assists frontend developers by providing all the tools they need to make their Polkadot apps work and connect to users' Polkadot wallets.

**Why did I make this CLI**

When exploring blockchain ecosystems, I noticed that non-EVM blockchains have different wallet systems that web3 developers are not entirely familiar with. Often, the issue for frontend developers is getting that initial draft of a site. Tutorials are typically used, but they are usually outdated or don't work after a while.

This is why I decided to build a CLI tool. First, I created a Polkadot dapp myself and made it look good, then used this as a template for other developers. For this CLI, I focused on the Connect Wallet/Account system and helpful hooks for frontend developers.

The best part about this CLI is that the configurations are not completely abstracted from the developer. They can make changes to suit their needs, while the CLI offers the initial setup, making it easy to get started and reducing development time by hours or even days.

The main features implemented during this hackathon are:

- Created a TypeScript CLI package to help developers locally clone a template Polkadot dapp frontend.
- Developed a simple and easy-to-use Connect Wallet/Account UI for all templates.
- Created hooks using `zustand` allowing developers to access a user's connected wallet throughout the app, aiding with signing and sending transactions.
- Released templates for React using JavaScript and TypeScript with the [`paritytech/polkadot-onboard`](https://github.com/paritytech/polkadot-onboard) library for connecting to Polkadot Extension wallets and WalletConnect.

### Open Source Contribution

Create-Polka-Dapp is an open-source project. The community is encouraged to contribute to its development at any time. Whether it's adding new features, improving existing functionality, or creating new templates, your contributions are welcome. By working together, we can make this tool even more powerful and useful for Polkadot developers.

### Future Plans

In the future, I plan to create more intuitive tutorials on how to use the library for connecting wallets. I also aim to publish more template types, making it possible to easily build Polkadot dApps in multiple frontend frameworks.
```
