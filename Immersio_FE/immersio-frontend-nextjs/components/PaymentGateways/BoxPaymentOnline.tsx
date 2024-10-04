import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface IBoxPaymentOnlineProps {
	title: string;
	formId: string;
	children: React.ReactNode;
}

const BoxPaymentOnline = (props: IBoxPaymentOnlineProps) => {
	const { t } = useTranslation()
	const { title, formId, children } = props;
	return (
		<div id='box-payment-online' className="tw-max-w-lg tw-w-full tw-shadow-lg tw-rounded-md tw-border border-theme-6 tw-border-solid">
			<div className="tw-py-4 tw-px-5 tw-text-xl tw-font-bold">{title}</div>
			<div className="tw-py-12 tw-px-5 tw-border-y tw-border-x-0 border-theme-6 tw-border-solid">
				{children}
			</div>
			<div className="tw-py-4 tw-px-5 tw-flex tw-justify-center tw-items-center">
				<Button
					size="large"
					className="bg-theme-3 color-theme-7 tw-font-semibold hover:color-theme-7 hover:border-theme-3 hover:bg-theme-3 hover:tw-opacity-80"
					form={formId}
					htmlType='submit'
				>
					{t('dashboard.button.update')}
				</Button>
			</div>
		</div>
	);
};

export default BoxPaymentOnline;
