import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';
import CustomTable from '../common/CustomTable';
import PaymentStatus from './PaymentStatus';

interface IListPaymentLog {
	transactionId: string;
	username: string;
	amount: number;
	paymentStatus: string;
	paymentMethod: string;
	receipt: string;
}

const columns: IHeaderTable<IListPaymentLog & { tools: string }>[] = [
	{
		label: 'Transaction Id',
		key: 'transactionId',
		widthGrid: '1fr',
	},
	{
		label: 'Username',
		key: 'username',
		widthGrid: '1fr',
	},
	{
		label: 'Amount',
		key: 'amount',
		widthGrid: '1fr',
	},
	{
		label: 'Payment Status',
		key: 'paymentStatus',
		widthGrid: '1fr',
	},
	{
		label: 'Payment Method',
		key: 'paymentMethod',
		widthGrid: '1fr',
	},
	{
		label: 'Receipt',
		key: 'receipt',
		widthGrid: '1fr',
	},
	{
		label: 'Actions',
		key: 'tools',
		widthGrid: '1fr',
	},
];

interface ITablePaymentLogs {
	data: IListPaymentLog[] | null;
	onOpenDetail: () => void;
}

const TablePaymentLogs = (props: ITablePaymentLogs) => {
	const { data, onOpenDetail } = props;
	return (
		<CustomTable
			isLoading={false}
			className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
			columns={columns}
			data={data.map((item) => ({
				...item,
				username: (
					<Link href="">
						<a className="color-theme-3 hover:tw-underline">{item.username}</a>
					</Link>
				),
				paymentStatus: <PaymentStatus status="success" />,
				tools: (
					<Button
						className="tw-flex tw-items-center bg-theme-3 !tw-border-none !tw-text-sm"
						type="primary"
						onClick={() => onOpenDetail()}
					>
						<span className="tw-text-[12px]">Detail</span>
					</Button>
				),
			}))}
		/>
	);
};

export default TablePaymentLogs;
