import { PAGE_SIZE } from '@/constants';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { IListTutorPayment } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { Pagination } from 'antd';
import React from 'react';
import ButtonStatus from '../common/ButtonStatus';
import CustomTable from '../common/CustomTable';

const columns: IHeaderTable<IListTutorPayment>[] = [
	{
		label: 'Transaction ID',
		key: 'transactionId',
		widthGrid: '1fr',
	},
	{
		label: 'Requested tutor',
		key: 'requestedTutor',
		widthGrid: '1fr',
	},
	{
		label: 'Amount',
		key: 'amount',
		widthGrid: '1fr',
	},
	{
		label: 'Description',
		key: 'description',
		widthGrid: '1fr',
	},
	{
		label: 'Requested on',
		key: 'requestedOn',
		widthGrid: '1fr',
	},
	{
		label: 'Info',
		key: 'info',
		widthGrid: '1fr',
	},
	{
		label: 'Process',
		key: 'process',
		widthGrid: '1fr',
	},
];

interface ITutorPaymentsTable {
	data: IListTutorPayment[];
	loading: boolean;
	refetch: () => void;
}

const TutorPaymentsTable = (props: ITutorPaymentsTable) => {
	const { data, loading, refetch } = props;
	return (
		<>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={loading}
				data={data.map((item) => ({
					...item,
					process: <ButtonStatus activate={!!item.process} nameActivate="Paid on bank" nameDeactivate="Paid on bank" />,
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={data.length}
				pageSize={PAGE_SIZE}
				current={1}
				onChange={(page: number) => {
					// setCurrentPage(page);
				}}
			/>
		</>
	);
};

export default TutorPaymentsTable;
