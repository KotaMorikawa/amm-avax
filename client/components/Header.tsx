"use client";

import { useWallet } from "@/hooks/useWallet";
import Image from "next/image";

const Header = () => {
	const { currentAccount, connectWallet } = useWallet();
	return (
		<div className="h-16 flex items-center justify-between px-4 text-white">
			<div className="flex items-center">
				<Image src="/bird.png" alt="Picture of icon" width={40} height={30} />
				<div className="text-2xl font-bold ml-2">Miniswap</div>
			</div>
			{currentAccount === undefined ? (
				<div
					className="rounded-lg bg-red-500 text-white py-2 px-4 cursor-pointer"
					onClick={connectWallet}
				>
					Connect to wallet
				</div>
			) : (
				<div className="rounded-lg bg-gray-700 text-white py-2 px-4">
					Connected to {currentAccount}
				</div>
			)}
		</div>
	);
};

export default Header;
