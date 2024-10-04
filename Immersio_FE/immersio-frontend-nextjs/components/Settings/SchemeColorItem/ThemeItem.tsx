type ThemeItemProps = {
	colors: {
		linkColor: string;
		textColor: string;
		primaryColor: string;
		secondaryColor: string;
		accentColor: string;
		backgroundColor: string;
	};
	title: string;
	isSelected: boolean;
	onClick: () => void;
};

const ThemeItem = (props: ThemeItemProps) => {
	return (
		<div
			className={`${
				props.isSelected ? 'tw-bg-deactivateStatus' : ''
			} tw-p-4 tw-pl-0 tw-border tw-border-solid tw-rounded-sm tw-border-deactivateStatus tw-cursor-pointer`}
			onClick={props.onClick}
		>
			<div className="tw-w-full tw-text-center tw-text-gray tw-font-semibold tw-mb-4">{props.title}</div>
			<div className="tw-w-full tw-flex tw-gap-2 tw-text-xs">
				<div className="tw-w-2/5 tw-flex tw-flex-col tw-items-end">
					<div className="tw-h-7 tw-flex tw-items-center">Text Color</div>
					<div className="tw-h-7 tw-flex tw-items-center">Link Color</div>
					<div className="tw-h-7 tw-flex tw-items-center">Primary Color</div>
					<div className="tw-h-7 tw-flex tw-items-center">Secondary Color</div>
					<div className="tw-h-7 tw-flex tw-items-center">Accent Color</div>
					<div className="tw-h-7 tw-flex tw-items-center">Background Color</div>
				</div>
				<div className="tw-w-3/5 tw-flex tw-flex-col">
					<div
						style={{
							backgroundColor: props.colors.textColor,
						}}
						className={`tw-h-7 tw-flex tw-items-center tw-w-full tw-bg-[${props.colors.textColor}]`}
					></div>
					<div
						style={{
							backgroundColor: props.colors.linkColor,
						}}
						className={`tw-h-7 tw-flex tw-items-center tw-w-full tw-bg-[${props.colors.linkColor}]`}
					></div>
					<div
						style={{
							backgroundColor: props.colors.primaryColor,
						}}
						className={`tw-h-7 tw-flex tw-items-center tw-w-full tw-bg-[${props.colors.primaryColor}]`}
					></div>
					<div
						style={{
							backgroundColor: props.colors.secondaryColor,
						}}
						className={`tw-h-7 tw-flex tw-items-center tw-w-full tw-bg-[${props.colors.secondaryColor}]`}
					></div>
					<div
						style={{
							backgroundColor: props.colors.accentColor,
						}}
						className={`tw-h-7 tw-flex tw-items-center tw-w-full tw-bg-[${props.colors.accentColor}]`}
					></div>
					<div
						style={{
							backgroundColor: props.colors.backgroundColor,
						}}
						className={`tw-h-7 tw-flex tw-items-center tw-w-full tw-bg-[${props.colors.backgroundColor}]`}
					></div>
				</div>
				<div className="tw-w-1/5 tw-flex tw-flex-col tw-items-start">
					<div className="tw-h-7 tw-flex tw-items-center">{props.colors.textColor}</div>
					<div className="tw-h-7 tw-flex tw-items-center">{props.colors.linkColor}</div>
					<div className="tw-h-7 tw-flex tw-items-center">{props.colors.primaryColor}</div>
					<div className="tw-h-7 tw-flex tw-items-center">{props.colors.secondaryColor}</div>
					<div className="tw-h-7 tw-flex tw-items-center">{props.colors.accentColor}</div>
					<div className="tw-h-7 tw-flex tw-items-center">{props.colors.backgroundColor}</div>
				</div>
			</div>
		</div>
	);
};

export default ThemeItem;
