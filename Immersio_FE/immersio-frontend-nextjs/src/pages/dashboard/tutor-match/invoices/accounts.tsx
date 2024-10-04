import TutorInvoicesLayout from '@/components/TutorMatch/layout/TutorInvoices';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import { ITutorMatchInvoiceAccountsTable } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
	Button,
	Checkbox,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Pagination,
	Radio,
	Select,
	Space,
	Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';

const dummyData: ITutorMatchInvoiceAccountsTable[] = [
	{
		autoInvoiceSettings: 'Auto-invoice disabled',
		balance: 12000,
		family: 'Richard Lim',
		student: 'Michell Wong',
	},
	{
		autoInvoiceSettings: 'Auto-invoice disabled',
		balance: 12000,
		family: 'Richard Lim',
		student: 'Michell Wong',
	},
	{
		autoInvoiceSettings: 'Auto-invoice disabled',
		balance: 12000,
		family: 'Richard Lim',
		student: 'Michell Wong',
	},
	{
		autoInvoiceSettings: 'Auto-invoice disabled',
		balance: 12000,
		family: 'Richard Lim',
		student: 'Michell Wong',
	},
];

const columns: ColumnsType<ITutorMatchInvoiceAccountsTable> = [
	{
		title: 'Family',
		dataIndex: 'family',
		key: 'family',
	},
	{
		title: 'Student',
		dataIndex: 'student',
		key: 'student',
	},
	{
		title: 'Balance',
		dataIndex: 'balance',
		key: 'balance',
		render: (_, record) => <span>${record.balance}</span>,
	},
	{
		title: 'Auto-invoice settings',
		dataIndex: 'autoInvoiceSettings',
		key: 'autoInvoiceSettings',
		render: (_, record) => <span>{record.autoInvoiceSettings}</span>,
	},
];

const searchTutorInvoiceAccountsOptions: { value: keyof ITutorMatchInvoiceAccountsTable; label: string }[] = [
	{
		value: 'family',
		label: 'Family',
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

const TutorInvoiceAccountsPage = () => {
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [formTransaction] = Form.useForm();
	const [currentPage, setCurrentPage] = useState(1);
	const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);

	const handleSearch = (data: ICommonSearchRequest) => {
		console.log(data);
	};

	/* ----------------------------- ADD TRANSACTION ---------------------------- */
	const onFinishAddTransaction = () => {
		setOpenModalAddTransaction(false);
	};

	return (
		<TutorInvoicesLayout>
			<div className="tw-flex tw-justify-between tw-mb-4">
				<div className="tw-flex tw-gap-x-2">
					<Button
						className="bg-theme-6 tw-flex tw-items-center tw-justify-center"
						icon={<PlusOutlined />}
						type="primary"
						onClick={() => setOpenModalAddTransaction(true)}
					>
						<span>Add transaction</span>
					</Button>
					<Select
						defaultValue={autoInvoiceOptions[0]}
						style={{ width: 170 }}
						placeholder="Auto Invoicing"
						options={autoInvoiceOptions}
					/>
				</div>
				<Form
					form={formSearch}
					onFinish={(data: ICommonSearchRequest) => handleSearch(data)}
					className="tw-flex tw-items-center"
				>
					<Form.Item initialValue={searchTutorInvoiceAccountsOptions[0].value} name="searchBy" className="tw-mb-0">
						<Select
							defaultValue={searchTutorInvoiceAccountsOptions[0]}
							style={{ width: 120 }}
							options={searchTutorInvoiceAccountsOptions}
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

			{/* MODAL ADD TRANSACTION */}
			<Modal
				centered
				title={<div className="tw-text-lg tw-font-bold">Add Transaction</div>}
				width={600}
				open={openModalAddTransaction}
				footer={
					<div className="tw-flex tw-justify-between tw-items-center">
						<div
							className="tw-cursor-pointer tw-font-bold"
							onClick={() => setOpenModalAddTransaction(false)}
						>
							Cancel
						</div>
						<Button
							htmlType="submit"
							form="social"
							className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
							// loading={updateUserSocialMutation.isLoading}
						>
							Save & Add
						</Button>
					</div>
				}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setOpenModalAddTransaction(false);
				}}
			>
				<Form id="social" onFinish={onFinishAddTransaction} form={formTransaction} layout="vertical">
					<Form.Item name="type" label="Type">
						<Radio.Group defaultValue={1}>
							<Space direction="vertical">
								<Radio value={1}>
									Payment<span className="tw-text-[#888888]"> - Record a payment from this account</span>
								</Radio>
								<Radio value={2}>
									Change<span className="tw-text-[#888888]">- Add a charge or fee to this account</span>
								</Radio>
								<Radio value={3}>
									Discount<span className="tw-text-[#888888]">- Waive a fee for this account</span>{' '}
								</Radio>
								<Radio value={4}>
									Refund<span className="tw-text-[#888888]">- Record a a return of money to this account</span>
								</Radio>
							</Space>
						</Radio.Group>
					</Form.Item>
					<Form.Item
						name="date"
						label="Date"
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
						name="decs"
						label="Description"
						rules={[
							{
								required: true,
								message: 'Please enter a description',
							},
						]}
					>
						<Input placeholder="This will appear on the invoice" />
					</Form.Item>
					<Form.Item name="sentMail" valuePropName="checked">
						<Checkbox value="sent">Send an email receipt</Checkbox>
					</Form.Item>
				</Form>
			</Modal>
		</TutorInvoicesLayout>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default TutorInvoiceAccountsPage;
