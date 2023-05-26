import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { AmmType, TokenType } from "@/hooks/useContract";
import { formatWithoutPrecision } from "@/utils/format";

type Props = {
	token0: TokenType | undefined;
	token1: TokenType | undefined;
	amm: AmmType | undefined;
	currentAccount: string | undefined;
	updateDetailsFlag: number;
};

const Details = ({
	token0,
	token1,
	amm,
	currentAccount,
	updateDetailsFlag,
}: Props) => {
	const [amountOfUserTokens, setAmountOfUserTokens] = useState<string[]>([]);
	const [amountOfPoolTokens, setAmountOfPoolTokens] = useState<string[]>([]);
	const [tokens, setTokens] = useState<TokenType[]>([]);

	const [userShare, setUserShare] = useState("");
	const [totalShare, setTotalShare] = useState("");

	const DISPLAY_CHAR_LIMIT = 7;

	useEffect(() => {
		if (!token0 || !token1) return;
		setTokens([token0, token1]);
	}, [token0, token1]);

	const getAmountOfUserTokens = useCallback(async () => {
		if (!currentAccount) return;
		try {
			setAmountOfUserTokens([]);
			for (let i = 0; i < tokens.length; i++) {
				const amountInWei = tokens[i].contract.balanceOf(currentAccount);
				const amountInEther = ethers.utils.formatEther(amountInWei);
				setAmountOfUserTokens((prevState) => [...prevState, amountInEther]);
			}
		} catch (error) {
			console.log(error);
		}
	}, [currentAccount, tokens]);

	const getAmountOfPoolTokens = useCallback(async () => {
		if (!amm) return;
		try {
			setAmountOfPoolTokens([]);
			for (let i = 0; i < tokens.length; i++) {
				const amountInWei = await amm.contract.totalAmount(
					tokens[i].contract.address
				);
				const amountInEther = ethers.utils.formatEther(amountInWei);
				setAmountOfPoolTokens((prevState) => [...prevState, amountInEther]);
			}
		} catch (error) {
			console.log(error);
		}
	}, [amm, tokens]);

	const getShare = useCallback(async () => {
		if (!amm || !currentAccount) return;
		try {
			let share = await amm.contract.share(currentAccount);
			let shareWithoutPrecision = formatWithoutPrecision(
				share,
				amm.sharePrecision
			);
			setUserShare(shareWithoutPrecision);

			share = await amm.contract.totalShare();
			shareWithoutPrecision = formatWithoutPrecision(share, amm.sharePrecision);
			setTotalShare(shareWithoutPrecision);
		} catch (error) {
			console.log("could not fetch details", error);
		}
	}, [amm, currentAccount]);

	useEffect(() => {
		getAmountOfUserTokens();
	}, [getAmountOfUserTokens, updateDetailsFlag]);

	useEffect(() => {
		getAmountOfPoolTokens();
	}, [getAmountOfPoolTokens, updateDetailsFlag]);

	useEffect(() => {
		getShare();
	}, [getShare, updateDetailsFlag]);

	return (
		<div className="m-auto p-4 w-96 bg-gray-900 rounded-r-lg flex justify-center">
			<div className="w-11/12">
				<div className="text-white text-xl font-semibold mb-4">
					Your Details
				</div>
				{amountOfUserTokens.map((amount, index) => {
					return (
						<div key={index} className="flex mb-2">
							<div className="w-1/2 text-white font-semibold">
								{tokens[index] === undefined
									? "loading..."
									: tokens[index].symbol}
								:
							</div>
							<div className="w-1/2 text-white font-bold">
								{amount.substring(0, DISPLAY_CHAR_LIMIT)}
							</div>
						</div>
					);
				})}
				<div className="flex mb-2">
					<div className="w-1/2 text-white font-semibold">Share:</div>
					<div className="w-1/2 text-white font-bold">
						{userShare.substring(0, DISPLAY_CHAR_LIMIT)}
					</div>
				</div>
				<div className="text-white text-xl font-semibold mt-6 mb-4">
					Pool Details
				</div>
				{amountOfPoolTokens.map((amount, index) => {
					return (
						<div key={index} className="flex mb-2">
							<div className="w-1/2 text-white font-semibold">
								Total{" "}
								{tokens[index] === undefined
									? "loading..."
									: tokens[index].symbol}
								:
							</div>
							<div className="w-1/2 text-white font-bold">
								{amount.substring(0, DISPLAY_CHAR_LIMIT)}
							</div>
						</div>
					);
				})}
				<div className="flex">
					<div className="w-1/2 text-white font-semibold">Total Share:</div>
					<div className="w-1/2 text-white font-bold">
						{totalShare.substring(0, DISPLAY_CHAR_LIMIT)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Details;
