import { useContract } from "@/hooks/useContract";
import { useState } from "react";
import Details from "./Details";
import Faucet from "./Faucet";
import Provide from "./Provide";

type Props = {
	currentAccount: string | undefined;
};

const Container = ({ currentAccount }: Props) => {
	const [activeTab, setActiveTab] = useState<string>("Swap");
	const [updateDetailsFlag, setUpdateDetailsFlag] = useState<number>(0);
	const { usdc: token0, joe: token1, amm } = useContract(currentAccount);

	const changeTab = (tab: string) => {
		setActiveTab(tab);
	};

	const updateDetails = () => {
		setUpdateDetailsFlag((updateDetailsFlag + 1) % 2);
	};

	return (
		<div className="flex">
			<div className="m-auto">
				<div className="flex justify-between select-none bg-gray-900 rounded-tl-2xl rounded-tr-2xl">
					<div
						className={`tabStyle ${activeTab === "Swap" ? "activeTab" : ""}`}
						onClick={() => changeTab("Swap")}
					>
						Swap
					</div>
					<div
						className={`tabStyle ${activeTab === "Provide" ? "activeTab" : ""}`}
						onClick={() => changeTab("Provide")}
					>
						Provide
					</div>
					<div
						className={`tabStyle ${
							activeTab === "Withdraw" ? "activeTab" : ""
						}`}
						onClick={() => changeTab("Withdraw")}
					>
						Withdraw
					</div>
					<div
						className={`tabStyle ${activeTab === "Faucet" ? "activeTab" : ""}`}
						onClick={() => changeTab("Faucet")}
					>
						Faucet
					</div>
				</div>

				{activeTab === "Swap" && <div>swap</div>}
				{activeTab === "Provide" && (
					<Provide
						token0={token0}
						token1={token1}
						amm={amm}
						currentAccount={currentAccount}
						updateDetails={updateDetails}
					/>
				)}
				{activeTab === "Withdraw" && <div>withdraw</div>}
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
