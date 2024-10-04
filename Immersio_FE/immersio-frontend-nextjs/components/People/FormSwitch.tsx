import { Form, Switch } from 'antd';
import React from 'react';

interface IFormSwitchProps {
	name: string;
	defaultChecked: boolean;
	label: string;
	onChange: (checked: boolean) => void;
}

const FormSwitch = (props: IFormSwitchProps) => {
	const { defaultChecked, label, name, onChange } = props;
	return (
		<Form.Item
			label={label}
			initialValue={defaultChecked}
			className="tw-inline-flex tw-items-center tw-w-1/3 !tw-mb-2 switch-role"
			name={name}
		>
			<Switch className="tw-mr-4" checked={defaultChecked} onChange={onChange} />
		</Form.Item>
	);
};

export default FormSwitch;
