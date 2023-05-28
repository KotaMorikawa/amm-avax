"use client";

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
			const amountOutInWei = await amm.contract.getSwapEstimateOut(
				tokenIn.contract.address,
				amountInWei
			);
			const amountOutInEther = ethers.utils.formatEther(amountOutInWei);
			setAmountOut(amountOutInEther);
		} catch (error) {
			alert(error);
		}
	};

	const getSwapEstimateIn = async (amount: string) => {
		if (!amm || tokenOut) return;
		if (!validAmount(amount)) return;
		if (amm) {
			try {
				const amountOutInWei = ethers.utils.parseEther(amount);
				const amountInWei = await amm.contract.getSwapEstimateIn(
					tokenOut.contract.address,
					amountOutInWei
				);
				const amountInInEther = ethers.utils.formatEther(amountInWei);
				setAmountIn(amountInInEther);
			} catch (error) {
				alert(error);
			}
		}
	};

	const onChangeIn = (amount: string) => {
		setAmountIn(amount);
		getSwapEstimateOut(amount);
	};

	const onChangeOut = (amount: string) => {
		setAmountOut(amount);
		getSwapEstimateIn(amount);
	};

	const onClickSwap = async () => {
		if (!currentAccount) {
			alert("Connected to wallet");
			return;
		}
		if (!amm || !tokenIn || !tokenOut) return;
		if (!validAmount(amountIn)) {
			alert("Amount should be a valid number");
			return;
		}
		try {
			const amountInWei = ethers.utils.parseEther(amountIn);
			const txnIn = await tokenIn.contract.approve(
				amm.contract.address,
				amountInWei
			);
			await txnIn.wait();

			const txn = await amm.contract.swap(
				tokenIn.contract.address,
				tokenOut.contract.address,
				amountInWei
			);
			await txn.wait();
			setAmountIn("");
			setAmountOut("");
			updateDetails();
			alert("Success!");
		} catch (error) {
			alert(error);
		}
	};

	return (
		<div className="mx-auto bg-gray-900 rounded-b-lg p-5">
			<InputNumberBox
				leftHeader="From"
				right={tokenIn ? tokenIn.symbol : ""}
				value={amountIn}
				onChange={(e) => onChangeIn(e.target.value)}
			/>
			<div className="w-10 text-center mx-auto my-3" onClick={() => rev()}>
				<MdSwapVert className="text-red-600" />
			</div>
			<InputNumberBox
				leftHeader="To"
				right={tokenOut ? tokenOut.symbol : ""}
				value={amountOut}
				onChange={(e) => onChangeOut(e.target.value)}
			/>
			<div className="flex justify-center items-center p-2">
				<div
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => onClickSwap()}
				>
					Swap
				</div>
			</div>
		</div>
	);
};

export default Swap;
