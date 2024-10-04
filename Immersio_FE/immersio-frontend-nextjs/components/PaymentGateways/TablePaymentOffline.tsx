import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React from 'react';
import CustomTable from '../common/CustomTable';
import ActivationButtons from './ActivationButtons';
import { useTranslation } from 'next-i18next';

const { confirm } = Modal;

export interface IListGatewayOffline {
	id: string;
	name: string;
	description: string;
	instruction: string;
	serialNumber: string;
	isActivated: boolean;
}

interface ITablePaymentOffline {
	data: IListGatewayOffline[] | null;
	onEdit: (item: IListGatewayOffline) => void;
	onDelete: (id: string) => void;
}

const TablePaymentOffline = (props: ITablePaymentOffline) => {
	const { t } = useTranslation()
	const { data, onEdit, onDelete } = props;

	const columns: IHeaderTable<IListGatewayOffline & { tools: string }>[] = [
		{
			label: t('dashboard.option.name'),
			key: 'name',
			widthGrid: '1fr',
			enableSort: true,
		},
		{
			label: t('dashboard.option.status'),
			key: 'isActivated',
			widthGrid: '1fr',
		},
		{
			label: t('dashboard.option.serial_number'),
			key: 'serialNumber',
			widthGrid: '1fr',
			enableSort: true,
		},
		{
			label: t('dashboard.option.actions'),
			key: 'tools',
			widthGrid: '1fr',
		},
	];

	const showDeleteConfirm = (id: string) => {
		confirm({
			title: t('dashboard.modal.are_you_sure_delete_this_item'),
			icon: <ExclamationCircleOutlined />,
			content: t('dashboard.modal.you_will_not_be_able_to_revert_this'),
			okText: t('dashboard.button.yes'),
			okType: 'danger',
			cancelText: t('dashboard.button.no'),
			afterClose() {
				console.log('close');
			},
			onOk() {
				onDelete(id);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	return (
		<CustomTable
			isLoading={false}
			className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
			columns={columns}
			data={data.map((item) => ({
				...item,
				isActivated: <ActivationButtons className="tw-mb-0" isActivate={item.isActivated} onClick={() => null} />,
				tools: (
					<div key={item.id} className="tw-flex tw-items-center tw-gap-1">
						<Button
							icon={
								<EditOutlined
									style={{
										fontSize: 16,
									}}
								/>
							}
							className="bg-theme-4 color-theme-7 !tw-border-none tw-flex tw-items-center"
							onClick={() => onEdit(item)}
						>
							{t('dashboard.button.edit')}
						</Button>
						<Button
							icon={
								<DeleteOutlined
									style={{
										fontSize: 16,
									}}
								/>
							}
							className="!tw-bg-deleteIconDavid color-theme-7 !tw-border-none tw-flex tw-items-center"
							onClick={() => showDeleteConfirm(item.id)}
						>
							{t('dashboard.button.delete')}
						</Button>
					</div>
				),
			}))}
		/>
	);
};

export default TablePaymentOffline;
