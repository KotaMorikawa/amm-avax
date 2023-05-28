"use client";

import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { TokenType } from "@/hooks/useContract";
import { validAmount } from "@/utils/validAmount";
import InputNumberBox from "./InputNumberBox";

type Props = {
	token0: TokenType | undefined;
	token1: TokenType | undefined;
	currentAccount: string | undefined;
	updateDetails: () => void;
};

const Faucet = ({ token0, token1, currentAccount, updateDetails }: Props) => {
	const [amountOfFunds, setAmountOfFunds] = useState("");
	const [currentTokenIndex, setCurrentTokenIndex] = useState(0);

	const [tokens, setTokens] = useState<TokenType[]>([]);

	useEffect(() => {
		if (!token0 || !token1) return;
		setTokens([token0, token1]);
	}, [token0, token1]);

	const onChangeToken = () => {
		setCurrentTokenIndex((currentTokenIndex + 1) % tokens.length);
	};

	const onChangeAmountOfFunds = (amount: string) => {
		setAmountOfFunds(amount);
	};

	const onClickFund = async () => {
		if (!currentAccount) {
			alert("connect Wallet!");
			return;
		}
		if (tokens.length === 0) return;
		if (!validAmount(amountOfFunds)) {
			alert("Amount should be a valid number");
			return;
		}
		try {
			const contract = tokens[currentTokenIndex].contract;
			const amountInWei = ethers.utils.parseEther(amountOfFunds);

			const txn = await contract.faucet(currentAccount, amountInWei);
			await txn.wait();
			updateDetails();
			alert("Success");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="mx-auto w-72 bg-gray-900 rounded-b-lg">
			<div className="flex justify-center items-center p-2">
				<div
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => onChangeToken()}
				>
					Change
				</div>
			</div>
			<InputNumberBox
				leftHeader={`Amount of ${
					tokens[currentTokenIndex]
						? tokens[currentTokenIndex].symbol
						: "some token"
				}`}
				right={
					tokens[currentTokenIndex] ? tokens[currentTokenIndex].symbol : ""
				}
				value={amountOfFunds}
				onChange={(e) => onChangeAmountOfFunds(e.target.value)}
			/>
			<div className="flex justify-center items-center p-2">
				<div
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => onClickFund()}
				>
					Fund
				</div>
			</div>
		</div>
	);
};

export default Faucet;
