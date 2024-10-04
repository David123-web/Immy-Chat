import TutorInvoicesLayout from '@/components/TutorMatch/layout/TutorInvoices';
import CustomTable from '@/components/common/CustomTable';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import {
	ITutorMatchInvoiceAccountsTable,
	ITutorMatchInvoicesTable,
	TutorInvoiceMode,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import {
	BellOutlined,
	DeleteOutlined,
	DownloadOutlined,
	MailOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Pagination, Select, Table } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import { ColumnsType } from 'antd/lib/table';

const dummyData: ITutorMatchInvoicesTable[] = [
	{
		family: 'Richard Lim',
		student: 'Michell Wong',
		amount: 1000,
		dateRange: '2023-06-18 - 2023-07-20',
		status: true,
		mode: TutorInvoiceMode.Class,
		invoice: '23-1234',
		invoiceDate: '2023-06-18',
	},
	{
		family: 'Richard Lim',
		student: 'Michell Wong',
		amount: 1000,
		dateRange: '2023-06-18 - 2023-07-20',
		status: false,
		mode: TutorInvoiceMode.Manual,
		invoice: '23-1234',
		invoiceDate: '2023-06-18',
	},
	{
		family: 'Richard Lim',
		student: 'Michell Wong',
		amount: 1000,
		dateRange: '2023-06-18 - 2023-07-20',
		status: false,
		mode: TutorInvoiceMode.Period,
		invoice: '23-1234',
		invoiceDate: '2023-06-18',
	},
];

const columns: ColumnsType<ITutorMatchInvoicesTable> = [
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (_, record) =>
			record.status ? (
				<div className="tw-flex tw-items-center tw-gap-x-1">
					<Button
						icon={
							<MailOutlined
								style={{
									fontSize: 16,
								}}
							/>
						}
						className="bg-theme-3 !tw-text-white !tw-border-none"
					/>
					<Button
						icon={
							<BellOutlined
								style={{
									fontSize: 16,
								}}
							/>
						}
						className="!tw-bg-deleteIconDavid !tw-text-white !tw-border-none"
					/>
				</div>
			) : (
				<Image src="/assets/img/ios-cash.svg" alt="cash" width={30} height={16} />
			),
	},
	{
		title: 'Invoice #',
		dataIndex: 'invoice',
		key: 'invoice',
	},
	{
		title: 'Invoice date',
		dataIndex: 'invoiceDate',
		key: 'invoiceDate',
	},
	{
		title: 'Student',
		dataIndex: 'student',
		key: 'student',
	},
	{
		title: 'Date range',
		dataIndex: 'dateRange',
		key: 'dateRange',
	},
	{
		title: 'Mode',
		dataIndex: 'mode',
		key: 'mode',
	},
	{
		title: 'Amount',
		dataIndex: 'amount',
		key: 'amount',
	},
	{
		title: 'Action',
		dataIndex: 'action',
		key: 'action',
		render: () => (
			<div className="tw-flex tw-items-center tw-gap-1">
				<Button
					icon={
						<MailOutlined
							style={{
								fontSize: 16,
							}}
						/>
					}
					className="bg-theme-3 !tw-text-white !tw-border-none"
				/>
				<Button
					icon={
						<DeleteOutlined
							style={{
								fontSize: 16,
							}}
						/>
					}
					className="!tw-bg-deleteIconDavid !tw-text-white !tw-border-none"
					onClick={(e) => {
						// showDeleteConfirm(item.id);
					}}
				/>
				<Button
					icon={
						<DownloadOutlined
							style={{
								fontSize: 16,
							}}
						/>
					}
					className="bg-theme-3 !tw-text-white !tw-border-none"
					onClick={(e) => {
						// showDeleteConfirm(item.id);
					}}
				/>
			</div>
		),
	},
];

const autoInvoiceOptions: { value: string; label: string }[] = [
	{
		value: 'Setup Auto Invoicing',
		label: 'Setup Auto Invoicing',
	},
	{
		value: 'Disable Auto Invoicing',
		label: 'Disable Auto Invoicing',
	},
];

const TutorInvoicesPage = () => {
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [currentPage, setCurrentPage] = useState(1);
	const [formAddInvoice] = Form.useForm();
	const [openModalAddInvoice, setOpenModalAddInvoice] = useState(false);

	const searchTutorInvoicesOptions: { value: keyof ITutorMatchInvoiceAccountsTable; label: string }[] = [
		{
			value: 'family',
			label: 'Family',
		},
	];

	const handleSearch = (data: ICommonSearchRequest) => {
		console.log(data);
	};

	const onFinish = () => {
		// setOpenModalAddInvoice(true);
	};

	return (
		<TutorInvoicesLayout>
			<div className="tw-flex tw-justify-between tw-mb-4">
				<Button
					className="bg-theme-6 tw-flex tw-items-center tw-justify-center"
					icon={<PlusOutlined />}
					type="primary"
					onClick={() => setOpenModalAddInvoice(true)}
				>
					<span>Add Invoice</span>
				</Button>
				<Form
					form={formSearch}
					onFinish={(data: ICommonSearchRequest) => handleSearch(data)}
					className="tw-flex tw-items-center"
				>
					<Form.Item name="date" className="tw-mb-0">
						<DatePicker
							style={{
								width: '100%',
							}}
							name="date"
						/>
					</Form.Item>
					<Form.Item initialValue={searchTutorInvoicesOptions[0].value} name="searchBy" className="tw-mb-0">
						<Select
							defaultValue={searchTutorInvoicesOptions[0]}
							style={{ width: 120 }}
							options={searchTutorInvoicesOptions}
						/>
					</Form.Item>
					<Form.Item name="searchKey" className="tw-mb-0 tw-w-[30rem]">
						<Input placeholder="Search..." />
					</Form.Item>
					<Button htmlType="submit" className={TAILWIND_CLASS.BUTTON_ANTD} icon={<SearchOutlined />} />
				</Form>
			</div>
			<Table
				dataSource={dummyData}
				columns={columns}
				pagination={{
					total: dummyData.length,
					pageSize: PAGE_SIZE,
					current: currentPage,
					onChange: (page: number) => {
						setCurrentPage(page);
					},
				}}
			/>
			<Modal
				centered
				title={<div className="tw-text-lg tw-font-bold">Add Invoice</div>}
				width={600}
				open={openModalAddInvoice}
				footer={
					<div className="tw-flex tw-justify-between tw-items-center">
						<div
							className="tw-cursor-pointer tw-font-bold"
							onClick={() => setOpenModalAddInvoice(false)}
						>
							Cancel
						</div>
						<Button
							htmlType="submit"
							form="social"
							className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
							// loading={updateUserSocialMutation.isLoading}
						>
							Create
						</Button>
					</div>
				}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setOpenModalAddInvoice(false);
				}}
			>
				<Form onFinish={onFinish} form={formAddInvoice} layout="vertical">
					<Form.Item
						name="class"
						label="Class"
						rules={[
							{
								required: true,
								message: 'Please select an class',
							},
						]}
					>
						<Select
							defaultValue={autoInvoiceOptions[0]}
							style={{ width: '100%' }}
							placeholder="Select a class from the booking system"
							options={autoInvoiceOptions}
						/>
					</Form.Item>
					<Form.Item
						name="account"
						label="Account"
						rules={[
							{
								required: true,
								message: 'Please select an account',
							},
						]}
					>
						<Select
							defaultValue={autoInvoiceOptions[0]}
							style={{ width: '100%' }}
							placeholder="Select a student account"
							options={autoInvoiceOptions}
						/>
					</Form.Item>
					<Form.Item
						name="tutor"
						label="Tutor"
						rules={[
							{
								required: true,
								message: 'Please select an tutor',
							},
						]}
					>
						<Select
							defaultValue={autoInvoiceOptions[0]}
							style={{ width: '100%' }}
							placeholder="Select a student tutor"
							options={autoInvoiceOptions}
						/>
					</Form.Item>
					<Form.Item
						name="dueDate"
						label="Due Date"
						rules={[
							{
								required: true,
								message: 'Please select a date',
							},
						]}
					>
						<DatePicker
							style={{
								width: '100%',
							}}
							name="date"
						/>
					</Form.Item>
					<Form.Item
						name="invoiceDate"
						label="Invoice Date"
						rules={[
							{
								required: true,
								message: 'Please select a date',
							},
						]}
					>
						<DatePicker
							style={{
								width: '100%',
							}}
							name="date"
						/>
					</Form.Item>
					<Form.Item
						name="amount"
						label="Amount"
						rules={[
							{
								required: true,
								message: 'Please enter an amount',
							},
						]}
					>
						<InputNumber<string>
							className="tw-w-full"
							formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							style={{ width: '100%' }}
							min="0"
							step="0.01"
							stringMode
							parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
						/>
					</Form.Item>
					<Form.Item
						name="note"
						label="Note"
						rules={[
							{
								required: true,
								message: 'Please enter a note',
							},
						]}
					>
						<Input placeholder="An optional note to be included at the end of invoice" />
					</Form.Item>
				</Form>
			</Modal>
		</TutorInvoicesLayout>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default TutorInvoicesPage;
