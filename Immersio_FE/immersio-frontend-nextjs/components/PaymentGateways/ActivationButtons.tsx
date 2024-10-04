import { FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { overrideTailwindClasses } from 'tailwind-override';

interface IActivationButtonsProps {
	name?: string;
	formInstance?: FormInstance<any>;
	isActivate: boolean;
	onClick: () => void;
	className?: string;
}

const ActivationButtons = (props: IActivationButtonsProps) => {
	const { t } = useTranslation()
	const { formInstance, name, isActivate, onClick, className = '' } = props;

	useEffect(() => {
		if (name && formInstance) {
			formInstance.setFieldValue(name, isActivate);
		}
	}, [isActivate]);

	return (
		<div className={overrideTailwindClasses(`tw-flex tw-flex-col tw-mb-4 tw-w-full ${className}`)}>
			<div className="tw-h-8 tw-w-full tw-flex tw-justify-center">
				<div
					className={`tw-w-full ${
						isActivate ? 'bg-theme-3 border-theme-3 color-theme-7' : 'color-theme-6 color-theme-1'
					}  
					tw-border tw-border-solid tw-rounded-tl-md tw-rounded-bl-md tw-font-semibold tw-transition-all 
					tw-duration-200 tw-flex tw-justify-center tw-items-center tw-cursor-pointer hover:border-theme-3`}
					onClick={onClick}
				>
					{t('dashboard.button.activate')}
				</div>
				<div
					className={`tw-w-full ${
						isActivate ? 'color-theme-6 color-theme-1' : 'bg-theme-3 border-theme-3 color-theme-7'
					}  
					tw-border tw-border-solid tw-rounded-tr-md tw-rounded-br-md tw-font-semibold tw-transition-all 
					tw-duration-200 tw-flex tw-justify-center tw-items-center tw-cursor-pointer hover:border-theme-3`}
					onClick={onClick}
				>
					{t('dashboard.button.deactivate')}
				</div>
			</div>
		</div>
	);
};

export default ActivationButtons;
