"use client";

import { useContract } from "@/hooks/useContract";
import { useState } from "react";
import Details from "./Details";
import Faucet from "./Faucet";
import Provide from "./Provide";
import { useWallet } from "@/hooks/useWallet";
import Swap from "./Swap";
import Withdraw from "./Withdraw";

const Container = () => {
	const [activeTab, setActiveTab] = useState<string>("Swap");
	const [updateDetailsFlag, setUpdateDetailsFlag] = useState<number>(0);
	const { currentAccount, connectWallet } = useWallet();
	const { usdc: token0, joe: token1, amm } = useContract(currentAccount);

	const changeTab = (tab: string) => {
		setActiveTab(tab);
	};

	const updateDetails = () => {
		setUpdateDetailsFlag((updateDetailsFlag + 1) % 2);
	};

	return (
		<div className="flex mt-10">
			<div className="m-auto">
				<div className="flex justify-between select-none bg-gray-900">
					<div
						className={`p-3 ${activeTab === "Swap" ? "bg-gray-500" : ""}`}
						onClick={() => changeTab("Swap")}
					>
						Swap
					</div>
					<div
						className={`p-3 ${activeTab === "Provide" ? "bg-gray-500" : ""}`}
						onClick={() => changeTab("Provide")}
					>
						Provide
					</div>
					<div
						className={`p-3 ${activeTab === "Withdraw" ? "bg-gray-500" : ""}`}
						onClick={() => changeTab("Withdraw")}
					>
						Withdraw
					</div>
					<div
						className={`p-3 ${activeTab === "Faucet" ? "bg-gray-500" : ""}`}
						onClick={() => changeTab("Faucet")}
					>
						Faucet
					</div>
				</div>

				{activeTab === "Swap" && (
					<Swap
						token0={token0}
						token1={token1}
						amm={amm}
						currentAccount={currentAccount}
						updateDetails={updateDetails}
					/>
				)}
				{activeTab === "Provide" && (
					<Provide
						token0={token0}
						token1={token1}
						amm={amm}
						currentAccount={currentAccount}
						updateDetails={updateDetails}
					/>
				)}
				{activeTab === "Withdraw" && (
					<Withdraw
						token0={token0}
						token1={token1}
						amm={amm}
						currentAccount={currentAccount}
						updateDetails={updateDetails}
					/>
				)}
				{activeTab === "Faucet" && (
					<Faucet
						token0={token0}
						token1={token1}
						currentAccount={currentAccount}
						updateDetails={updateDetails}
					/>
				)}
			</div>
			<Details
				token0={token0}
				token1={token1}
				amm={amm}
				currentAccount={currentAccount}
				updateDetailsFlag={updateDetailsFlag}
			/>
		</div>
	);
};

export default Container;
