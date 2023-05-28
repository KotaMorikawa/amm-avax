import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";

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

const Provide = ({
	token0,
	token1,
	amm,
	currentAccount,
	updateDetails,
}: Props) => {
	const [amountOfToken0, setAmountOfToken0] = useState("");
	const [amountOfToken1, setAmountOfToken1] = useState("");
	const [activePool, setActivePool] = useState(true);

	const checkLiquidity = useCallback(async () => {
		if (!amm) return;
		try {
			const totalShare = await amm.contract.totalShare();
			if (totalShare.eq(BigNumber.from(0))) {
				setActivePool(false);
			} else {
				setActivePool(true);
			}
		} catch (error) {
			alert(error);
		}
	}, [amm]);

	useEffect(() => {
		checkLiquidity();
	}, [checkLiquidity]);

	const getProvideEstimate = async (
		token: TokenType,
		amount: string,
		setPairTokenAmount: (amount: string) => void
	) => {
		if (!amm || !token0 || !token1) return;
		if (!activePool) return;
		if (!validAmount(amount)) return;
		try {
			const amountInWei = ethers.utils.parseEther(amount);
			const pairAmountInWei = await amm.contract.getEquivalentToken(
				token.contract.address,
				amountInWei
			);
			const pairAmountInEther = ethers.utils.formatEther(pairAmountInWei);
			setPairTokenAmount(pairAmountInEther);
		} catch (error) {
			alert(error);
		}
	};

	const onChangeAmount = (
		amount: string,
		token: TokenType | undefined,
		setAmount: (amount: string) => void,
		setPairTokenAmount: (amount: string) => void
	) => {
		if (!token) return;
		setAmount(amount);
		getProvideEstimate(token, amount, setPairTokenAmount);
	};

	const onClickProvide = async () => {
		if (!currentAccount) {
			alert("connect Wallet");
			return;
		}
		if (!amm || !token0 || !token1) return;
		if (!validAmount(amountOfToken0) || !validAmount(amountOfToken1)) {
			alert("Amount should be a valid number");
			return;
		}
		try {
			const amountToken0InWei = ethers.utils.parseEther(amountOfToken0);
			const amountToken1InWei = ethers.utils.parseEther(amountOfToken1);

			const txn0 = await token0.contract.approve(
				amm.contract.address,
				amountOfToken0
			);
			const txn1 = await token1.contract.approve(
				amm.contract.address,
				amountOfToken1
			);

			await txn0.wait();
			await txn1.wait();

			const txn = await amm.contract.provide(
				token0.contract.address,
				amountToken0InWei,
				token1.contract.address,
				amountToken1InWei
			);
			await txn.wait();
			setAmountOfToken0("");
			setAmountOfToken1("");
			checkLiquidity();
			updateDetails();
			alert("Success");
		} catch (error) {
			alert(error);
		}
	};

	return (
		<div className="mx-auto bg-gray-900 rounded-b-lg p-5">
			<InputNumberBox
				leftHeader={`Amount of ${token0 ? token0.symbol : "some token"}`}
				right={token0 ? token0.symbol : ""}
				value={amountOfToken0}
				onChange={(e) =>
					onChangeAmount(
						e.target.value,
						token0,
						setAmountOfToken0,
						setAmountOfToken1
					)
				}
			/>
			<div className="w-10 text-center mx-auto my-3">
				<MdAdd className="text-red-600" />
			</div>
			<InputNumberBox
				leftHeader={`Amount of ${token1 ? token1.symbol : "some token"}`}
				right={token1 ? token1.symbol : ""}
				value={amountOfToken1}
				onChange={(e) =>
					onChangeAmount(
						e.target.value,
						token1,
						setAmountOfToken1,
						setAmountOfToken0
					)
				}
			/>
			{!activePool && (
				<div className="text-white text-sm mx-4 mt-2">
					Message: Empty pool. Set the initial conversion rate.
				</div>
			)}
			<div className="flex justify-center items-center p-2">
				<div
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => onClickProvide()}
				>
					Provide
				</div>
			</div>
		</div>
	);
};

export default Provide;
