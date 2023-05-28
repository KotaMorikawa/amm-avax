import Container from "@/components/Container";
import Header from "@/components/Header";

import { NextPage } from "next";

const Home: NextPage = () => {
	return (
		<div className="h-screen bg-gradient-to-b from-gray-800 to-blue-400">
			<Header />
			<Container />
		</div>
	);
};

export default Home;
