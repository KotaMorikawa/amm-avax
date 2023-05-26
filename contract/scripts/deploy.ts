import { ethers } from "hardhat";

async function deploy() {
	const [deployer] = await ethers.getSigners();

	const USDCToken = await ethers.getContractFactory("USDCToken");
	const usdc = await USDCToken.deploy();
	await usdc.deployed();

	const JOEToken = await ethers.getContractFactory("JOEToken");
	const joe = await JOEToken.deploy();
	await joe.deployed();

	const AMM = await ethers.getContractFactory("AMM");
	const amm = await AMM.deploy(usdc.address, joe.address);
	await amm.deployed();

	console.log("usdc address:", usdc.address);
	console.log("joe address:", joe.address);
	console.log("amm address:", amm.address);
	console.log("account address that deploy contract:", deployer.address);
}

deploy()
	.then(() => process.exit(0))
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});
