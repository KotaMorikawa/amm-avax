import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

if (process.env.TEST_ACCOUNT_PRIVATE_KEY === undefined) {
	console.log("Private key is missing");
}

const config: HardhatUserConfig = {
	solidity: "0.8.17",
	networks: {
		fuji: {
			url: "https://api.avax-test.network/ext/bc/C/rpc",
			chainId: 43113,
			accounts:
				process.env.TEST_ACCOUNT_PRIVATE_KEY !== undefined
					? [process.env.TEST_ACCOUNT_PRIVATE_KEY]
					: [],
		},
	},
};

export default config;
