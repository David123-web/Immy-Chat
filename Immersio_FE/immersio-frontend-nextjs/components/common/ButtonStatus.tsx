import { Button } from 'antd';
import React from 'react';

interface IButtonStatus {
	activate: boolean;
	nameActivate: string;
	nameDeactivate: string;
}

const ButtonStatus = (props: IButtonStatus) => {
	const { activate, nameActivate, nameDeactivate } = props;
	return (
		<Button
			className={`${
				activate ? 'bg-theme-4' : 'bg-theme-6'
			}  color-theme-1 !tw-border-none tw-rounded-lg`}
		>
			{activate ? nameActivate : nameDeactivate}
		</Button>
	);
};

export default ButtonStatus;
