import PaymentLogsDetail from '@/components/PaymentLogs/PaymentLogsDetail';
import TablePaymentLogs from '@/components/PaymentLogs/TablePaymentLogs';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { withTranslationsProps } from '@/src/next/with-app';
import { Pagination } from 'antd';
import Head from 'next/head';
import { useState } from 'react';

interface IListPaymentLog {
	transactionId: string;
	username: string;
	amount: number;
	paymentStatus: string;
	paymentMethod: string;
	receipt: string;
}

const dummyData: IListPaymentLog[] = [
	{
		transactionId: '62dfffb092cd5',
		username: 'nolan',
		amount: 2999,
		paymentStatus: 'Success',
		paymentMethod: '',
		receipt: '-',
	},
	{
		transactionId: '62dfffa2822e6',
		username: 'nolan',
		amount: 999,
		paymentStatus: 'Success',
		paymentMethod: '',
		receipt: '-',
	},
];

function PaymentLogs() {
	const [isOpenPaymentLogDetail, setIsOpenPaymentLogDetail] = useState(false);
	return (
		<>
			<Head>
				<title>Payment Logs</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<DashboardRoute>
				{/* <HeaderTable tableName="Payment Log">
					<div className="tw-w-1/3 tw-gap-2 tw-flex">
						<Input placeholder="Search by Transaction" />
						<Input placeholder="Search by Username" />
					</div>
				</HeaderTable> */}
				<TablePaymentLogs
					data={dummyData}
					onOpenDetail={() => 
						setIsOpenPaymentLogDetail(true)
					}
				/>
				<Pagination
					className="!tw-mt-6 tw-flex tw-justify-end"
					total={100}
					pageSize={10}
					current={1}
					onChange={(page: number) => {
						// setCurrentPage(page);
						// setCurrentFileSelected(null);
					}}
				/>
				{isOpenPaymentLogDetail && (
					<PaymentLogsDetail
						open={isOpenPaymentLogDetail}
						onClose={() => setIsOpenPaymentLogDetail(false)}
					/>
				)}
			</DashboardRoute>
		</>
	);
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default PaymentLogs;
