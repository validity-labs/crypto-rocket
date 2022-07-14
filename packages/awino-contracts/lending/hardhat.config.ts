import * as dotenv from "dotenv";
import { TASK_COMPILE, TASK_NODE } from "hardhat/builtin-tasks/task-names";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_NODE_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: process.env.MNEMONIC
        ? { mnemonic: process.env.MNEMONIC }
        : [process.env.PRIVATE_KEY!].filter(Boolean),
    },
    cronosTestnet: {
      url: process.env.CRO_NODE_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    cronosMainnet: {
      url: "https://evm.cronos.org",
      accounts:
        process.env.CRONOS_MAINNET_PRIVATE_KEY !== undefined
          ? [process.env.CRONOS_MAINNET_PRIVATE_KEY]
          : [],
    },
    bsc: {
      url: "https://bsc-dataseed1.ninicoin.io",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      // uncomment fork mainnet
      //   forking: {
      //     url: "http://142.132.156.5:8546",
      //     blockNumber: 14650598,
      //   },
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
