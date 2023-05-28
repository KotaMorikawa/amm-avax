import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { AmmType, TokenType } from "@/hooks/useContract";
import { formatWithoutPrecision, formatWithPrecision } from "@/utils/format";
import { validAmount } from "@/utils/validAmount";
import InputNumberBox from "./InputNumberBox";

type Props = {
	token0: TokenType | undefined;
	token1: TokenType | undefined;
	amm: AmmType | undefined;
	currentAccount: string | undefined;
	updateDetails: () => void;
};

const Withdraw = ({
	token0,
	token1,
	amm,
	currentAccount,
	updateDetails,
}: Props) => {
	const [amountOfToken0, setAmountOfToken0] = useState("");
	const [amountOfToken1, setAmountOfToken1] = useState("");
	const [amountOfShare, setAmountOfShare] = useState("");
	const [amountOfMaxShare, setAmountOfMaxShare] = useState<string>();

	const getMaxShare = useCallback(async () => {
		if (!amm || !currentAccount) return;
		try {
			const shareWithPrecision = await amm.contract.share(currentAccount);
			const shareWithoutPrecision = formatWithoutPrecision(
				shareWithPrecision,
				amm.sharePrecision
			);
			setAmountOfMaxShare(shareWithoutPrecision);
		} catch (error) {
			alert(error);
		}
	}, [amm, currentAccount]);

	useEffect(() => {
		getMaxShare();
	}, [getMaxShare]);

	const leftLessThanRightAsBigNumber = (
		left: string,
		right: string
	): boolean => {
		return BigNumber.from(left).lt(BigNumber.from(right));
	};

	const getEstimate = async (
		token: TokenType | undefined,
		amountOfShare: string,
		setAmount: (amount: string) => void
	) => {
		if (!amm || !token || !amountOfMaxShare) return;
		if (!validAmount(amountOfShare)) return;
		if (leftLessThanRightAsBigNumber(amountOfMaxShare, amountOfShare)) {
			alert("Amount should be less than your max share");
			return;
		}
		try {
			const shareWithPrecision = formatWithPrecision(
				amountOfShare,
				amm.sharePrecision
			);
			const estimateInWei = await amm.contract.getWithdrawEstimate(
				token.contract.address,
				shareWithPrecision
			);
			const estimateInEther = ethers.utils.formatEther(estimateInWei);
			setAmount(estimateInEther);
		} catch (error) {
			alert(error);
		}
	};

	const onClickMax = async () => {
		if (!amountOfMaxShare) return;
		setAmountOfShare(amountOfMaxShare);
		getEstimate(token0, amountOfMaxShare, setAmountOfToken0);
		getEstimate(token1, amountOfMaxShare, setAmountOfToken1);
	};

	const onChangeAmountOfShare = async (amount: string) => {
		setAmountOfShare(amount);
		getEstimate(token0, amount, setAmountOfToken0);
		getEstimate(token1, amount, setAmountOfToken1);
	};

	const onClickWithdraw = async () => {
		if (!currentAccount) {
			alert("connect wallet");
			return;
		}
		if (!amm || !amountOfMaxShare) return;
		if (!validAmount(amountOfShare)) {
			alert("Amount should be a valid number");
			return;
		}
		if (leftLessThanRightAsBigNumber(amountOfMaxShare, amountOfShare)) {
			alert("Amount should be less than your max share");
			return;
		}
		try {
			const txn = await amm.contract.withdraw(
				formatWithPrecision(amountOfShare, amm.sharePrecision)
			);
			await txn.wait();
			setAmountOfToken0("");
			setAmountOfToken1("");
			setAmountOfShare("");
			updateDetails();
			alert("Success!");
		} catch (error) {
			alert(error);
		}
	};

	return (
		<div className="mx-auto w-72 bg-gray-900 rounded-b-lg">
			<div className="flex justify-center items-center p-2">
				<div
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => onClickMax()}
				>
					Max
				</div>
			</div>
			<InputNumberBox
				leftHeader="Amount of share:"
				right=""
				value={amountOfShare}
				onChange={(e) => onChangeAmountOfShare(e.target.value)}
			/>
			{token0 && token1 && (
				<div className="estimate">
					<div>
						<p>
							Amount of {token0.symbol}: {amountOfToken0}
						</p>
						<p>
							Amount of {token1.symbol}: {amountOfToken1}
						</p>
					</div>
				</div>
			)}
			<div className="flex justify-center items-center p-2">
				<div
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => onClickWithdraw()}
				>
					Withdraw
				</div>
			</div>
		</div>
	);
};

export default Withdraw;
