import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";

import { USDCToken as UsdcContractType } from "@/typechain-types";
import { JOEToken as JoeContractType } from "@/typechain-types";
import { AMM as AmmContractType } from "@/typechain-types";
import AmmArtifact from "@/utils/AMM.json";
import { getEthereum } from "@/utils/ethereum";
import UsdcArtifact from "@/utils/USDCToken.json";
import JoeArtifact from "@/utils/JOEToken.json";

export const UsdcAddress = "0xAd3Ba372bCC2D6F0F08FE4d54186a4dd1D7Ce3DC";
export const JoeAddress = "0x0Bb7E58E57114483B3453bf5031E45c23Fa1287B";
export const AmmAddress = "0x4f96749E9D8FC504A8D1402e5d6E1E9c4F38b433";

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
			const provider = new ethers.providers.Web3Provider(ethereum as any);
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
