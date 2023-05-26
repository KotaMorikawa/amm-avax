import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { MdSwapVert } from "react-icons/md";

import { AmmType, TokenType } from "@/hooks/useContract";
import { validAmount } from "@/utils/validAmount";
import InputNumberBox from "./InputNumberBox";

type Props = {
	token0: TokenType | undefined;
	token1: TokenType | undefined;
	amm: AmmType | undefined;
	currentAccount: string | undefined;
	updateDetails: () => void;
};

const Swap = ({
	token0,
	token1,
	amm,
	currentAccount,
	updateDetails,
}: Props) => {
	const [tokenIn, setTokenIn] = useState<TokenType>();
	const [tokenOut, setTokenOut] = useState<TokenType>();

	const [amountIn, setAmountIn] = useState("");
	const [amountOut, setAmountOut] = useState("");

	useEffect(() => {
		setTokenIn(token0);
		setTokenOut(token1);
	}, [token0, token1]);

	const rev = () => {
		const inCopy = tokenIn;
		setTokenIn(tokenOut);
		setTokenOut(inCopy);

		getSwapEstimateOut(amountIn);
	};

	const getSwapEstimateOut = async (amount: string) => {
		if (!amm || !tokenIn) return;
		if (!validAmount(amount)) return;
		try {
			const amountInWei = ethers.utils.parseEther(amount);
			// const amountOutInWei = await amm.contract.getWithdrawEstimate
		} catch (error) {
			alert(error);
		}
	};
};

export default Swap;
