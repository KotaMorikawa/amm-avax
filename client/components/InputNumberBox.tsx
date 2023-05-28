import { ChangeEvent } from "react";

type Props = {
	leftHeader: string;
	right: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputNumberBox = ({ leftHeader, right, value, onChange }: Props) => {
	return (
		<div className="w-3/4 mx-auto p-4 rounded-lg border-2 border-gray-500">
			<div className="flex justify-between text-white">
				<div>
					<p className="text-sm">{leftHeader}</p>
					<input
						className="w-3/4 h-8 text-xs bg-gray-900 text-white placeholder-gray-400 border-0"
						type="number"
						value={value}
						onChange={(e) => onChange(e)}
						placeholder="Enter amount"
					/>
				</div>
				<div className="flex items-center justify-center text-lg font-bold">
					{right}
				</div>
			</div>
		</div>
	);
};

export default InputNumberBox;
