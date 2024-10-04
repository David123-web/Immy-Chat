import { TAILWIND_CLASS } from '@/constants';
import { Button, Modal, Typography } from 'antd';
import React from 'react';

interface IPaymentLogsDetail {
	paymentLogData?: any;
	open: boolean;
	onClose: () => void;
}

function PaymentLogsDetail(props: IPaymentLogsDetail) {
	const { open, onClose, paymentLogData } = props;
	return (
		<>
			<Modal
				open={open}
				title={<div className="tw-font-bold tw-text-xl">Payment Log Detail</div>}
				onCancel={onClose}
				footer={[
					<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`} size="large" onClick={onClose}>
						Close
					</Button>,
				]}
			>
				<Typography.Title level={4} style={{ marginBottom: 8 }} className="color-theme-3">
					User details
				</Typography.Title>
				<div>
					<p className="tw-m-0">Name</p>
					<p>Christopher Nolan</p>
				</div>

				<div>
					<p className="tw-m-0">Username</p>
					<p>nolan</p>
				</div>

				<div>
					<p className="tw-m-0">Company</p>
					<p>Queak</p>
				</div>

				<div>
					<p className="tw-m-0">Email</p>
					<p>email@email.com</p>
				</div>

				<div>
					<p className="tw-m-0">Phone</p>
					<p>-</p>
				</div>
				<Typography.Title level={4} style={{ marginBottom: 8 }} className="color-theme-3">
					Payment details
				</Typography.Title>
				<p>
					<span className="tw-font-medium">Package Price:</span> 0
				</p>
				<p>
					<span className="tw-font-medium">Currency:</span> USD
				</p>
				<p>
					<span className="tw-font-medium">Method:</span>{' '}
				</p>
				<Typography.Title level={4} style={{ marginBottom: 8 }} className="color-theme-3">
					Package Details
				</Typography.Title>
				<p>
					<span className="tw-font-medium">Title:</span> Bussiness
				</p>
				<p>
					<span className="tw-font-medium">Term:</span> lifetime
				</p>
				<p>
					<span className="tw-font-medium">Start Date:</span> Jul-21-2022
				</p>
				<p>
					<span className="tw-font-medium">Expired Date:</span> Lifetime
				</p>
				<p>
					<span className="tw-font-medium">Purchase Type:</span> Regular
				</p>
			</Modal>
		</>
	);
}

export default PaymentLogsDetail;
