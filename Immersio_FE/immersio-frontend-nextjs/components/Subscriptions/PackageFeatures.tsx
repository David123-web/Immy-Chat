type PackageFeaturesProps = {
	isSelected: boolean;
	text: string;
	onClick: () => void;
};
const PackageFeatures = (props: PackageFeaturesProps) => {
	const { isSelected, text, onClick } = props;
	return (
		<div
			onClick={onClick}
			className={`tw-px-4 tw-py-2 tw-border tw-border-solid tw-rounded-3xl tw-cursor-pointer tw-text-xs tw-inline-block ${
				isSelected ? 'bg-theme-4 tw-text-white' : ''
			}`}
		>
			{text}
		</div>
	);
};

export default PackageFeatures;
