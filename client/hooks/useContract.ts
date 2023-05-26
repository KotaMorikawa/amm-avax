import { BigNumber, Contract, ethers } from "ethers";
import { useEffect, useState } from "react";

import { USDCToken as UsdcContractType } from "@/typechain-types";
import { JOEToken as JoeContractType } from "@/typechain-types";
import { AMM as AmmContractType } from "@/typechain-types";
import AmmArtifact from "@/utils/AMM.json";
import { getEthereum } from "@/utils/ethereum";
import UsdcArtifact from "@/utils/USDCToken.json";
import JoeArtifact from "@/utils/JOEToken.json";

export const UsdcAddress = "0x19F6b0Ff76CAB83E812d127Db4f78f972857fA1d";
export const JoeAddress = "0x43466B8757c77620191F80935649E3fa8ffCFc4A";
export const AmmAddress = "0x5BeF990c7aea20F28f7CC4fdC42A5f6A4Ee0e2d5";

export type TokenType = {
	symbol: string;
	contract: UsdcContractType | JoeContractType;
};

export type AmmType = {
	sharePrecision: BigNumber;
	contract: AmmContractType;
};

type ReturnUseContract = {
	usdc: TokenType | undefined;
	joe: TokenType | undefined;
	amm: AmmType | undefined;
};

export const useContract = (
	currentAccount: string | undefined
): ReturnUseContract => {
	const [usdc, setUsdc] = useState<TokenType>();
	const [joe, setJoe] = useState<TokenType>();
	const [amm, setAmm] = useState<AmmType>();
	const ethereum = getEthereum();

	const getContract = (
		contractAddress: string,
		abi: ethers.ContractInterface,
		storeContract: (_: ethers.Contract) => void
	) => {
		if (!ethereum) {
			console.log("Ethereum object does'nt exist!");
			return;
		}
		if (!currentAccount) {
			console.log("currentAccont does'nt exist");
			return;
		}
		try {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const Contract = new ethers.Contract(contractAddress, abi, signer);
			storeContract(Contract);
		} catch (error) {
			console.log(error);
		}
	};

	const generateUsdc = async (contract: UsdcContractType) => {
		try {
			const symbol = await contract.symbol();
			setUsdc({ symbol: symbol, contract: contract } as TokenType);
		} catch (error) {
			console.log(error);
		}
	};

	const generateJoe = async (contract: JoeContractType) => {
		try {
			const symbol = await contract.symbol();
			setJoe({ symbol: symbol, contract: contract } as TokenType);
		} catch (error) {
			console.log(error);
		}
	};

	const generateAmm = async (contract: AmmContractType) => {
		try {
			const precision = await contract.PRECISION();
			setAmm({ sharePrecision: precision, contract: contract } as AmmType);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getContract(UsdcAddress, UsdcArtifact.abi, (Contract: ethers.Contract) => {
			generateUsdc(Contract as UsdcContractType);
		});

		getContract(JoeAddress, JoeArtifact.abi, (Contract: ethers.Contract) => {
			generateJoe(Contract as JoeContractType);
		});

		getContract(AmmAddress, AmmArtifact.abi, (Contract: ethers.Contract) => {
			generateAmm(Contract as AmmContractType);
		});
	}, [ethereum, currentAccount]);

	return {
		usdc,
		joe,
		amm,
	};
};
