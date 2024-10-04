import { TAILWIND_CLASS } from '@/constants';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { useTranslation } from 'next-i18next';
import React from 'react';

export type TSearchOptions<T = any> = {
	value: keyof T;
	label: string;
};

interface IHeaderTableProps {
	children?: React.ReactNode;
	tableName: string;
	form?: FormInstance<ICommonSearchRequest<any>>;
	searchOptions?: TSearchOptions[];
	onAdd?: () => void;
	onGetSearchKey?: (searchKey: string) => void;
	customHeaderButton?: React.ReactNode;
	description?: string;
}

const HeaderTable = (props: IHeaderTableProps) => {
	const { t } = useTranslation();
	const { tableName, form, searchOptions, onAdd, onGetSearchKey, customHeaderButton = null } = props;
	return (
		<div className="tw-mb-4 tw-flex tw-flex-col tw-gap-y-4">
			<div className="tw-flex tw-items-center tw-gap-x-4">
				<div>
					<div className="tw-text-3xl tw-font-semibold">{tableName}</div>
				</div>
				{onAdd && (
					<Button
						className="bg-theme-3 color-theme-7 !tw-border-none tw-rounded-md tw-w-52 tw-h-10 tw-flex tw-items-center tw-justify-center"
						icon={<PlusOutlined />}
						onClick={() => onAdd()}
					>
						<span className="tw-text-xl">{t('dashboard.button.add_new')}</span>
					</Button>
				)}
				{customHeaderButton}
			</div>
			<div className="tw-flex tw-items-center tw-gap-x-2 color-theme-3">
				<span className="tw-cursor-pointer">{t('dashboard.button.all')}</span>
				<span>|</span>
				<span className="tw-cursor-pointer">{t('dashboard.button.trash')}</span>
			</div>
			{searchOptions && form && (
				<div className="tw-flex tw-justify-between tw-items-center">
					<Form
						form={form}
						onFinish={(data: ICommonSearchRequest) => onGetSearchKey(data.searchKey)}
						className="tw-flex tw-items-center"
					>
						<Form.Item initialValue={searchOptions[0].value} name="searchBy" className="tw-mb-0">
							<Select defaultValue={searchOptions[0]} style={{ width: 120 }} options={searchOptions} />
						</Form.Item>
						<Form.Item name="searchKey" className="tw-mb-0 tw-w-[30rem]">
							<Input placeholder={t('header.search_placeholder')} />
						</Form.Item>
						<Button htmlType="submit" className={TAILWIND_CLASS.BUTTON_ANTD} icon={<SearchOutlined />} />
					</Form>
				</div>
			)}
		</div>
	);
};

export default HeaderTable;
