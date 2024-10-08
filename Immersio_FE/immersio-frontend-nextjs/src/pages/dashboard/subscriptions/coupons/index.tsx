import ButtonStatus from '@/components/common/ButtonStatus';
import CustomTable from '@/components/common/CustomTable';
import HeaderTable from '@/components/common/HeaderTable';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { ICommonSearchRequest, Option } from '@/src/interfaces/common/common.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { COUPONS_STATUS, ICouponTable } from '@/src/interfaces/subscriptions/subscriptions.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { globalStore } from '@/src/stores/global/global.store';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Pagination, Row, Select } from 'antd';
import dayjs from 'dayjs';
import Head from 'next/head';
import { useState } from 'react';

const dummyData: ICouponTable[] = [
	{
		name: 'Coupon 1',
		code: 'C1',
		discount: 10,
		createdAt: new Date(),
		status: COUPONS_STATUS.ACTIVE,
	},
	{
		name: 'Coupon 2',
		code: 'C2',
		discount: 20,
		createdAt: new Date(),
		status: COUPONS_STATUS.EXPIRED,
	},
];

const COUPON_STATUS_OPTIONS: Option<COUPONS_STATUS>[] = [
	{
		label: 'Active',
		value: COUPONS_STATUS.ACTIVE,
	},
	{
		label: 'Expired',
		value: COUPONS_STATUS.EXPIRED,
	},
];

const columns: IHeaderTable<ICouponTable & { tools: string }>[] = [
	{
		label: 'Name',
		key: 'name',
		widthGrid: '1fr',
	},
	{
		label: 'Code',
		key: 'code',
		widthGrid: '1fr',
	},
	{
		label: 'Discount',
		key: 'discount',
		widthGrid: '1fr',
	},
	{
		label: 'Created',
		key: 'createdAt',
		widthGrid: '1fr',
	},
	{
		label: 'Status',
		key: 'status',
		widthGrid: '1fr',
	},
	{
		label: 'Actions',
		key: 'tools',
		widthGrid: '1fr',
	},
];
const SubscriptionsCoupons = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [formAddCoupon] = Form.useForm();
	const [isOpenAddUpdateCouponModal, setIsOpenAddUpdateCouponModal] = useState<boolean>(false);

	const searchCouponsOptions: Option<keyof any>[] = [
		{
			value: 'name',
			label: 'Name',
		},
		{
			value: 'code',
			label: 'Code',
		},
		{
			value: 'discount',
			label: 'Discount',
		},
	];

	const onSubmit = (data) => {
		console.log(data);
	};

	return (
		<DashboardRoute>
			<Head>
				<title>Subscription Coupons</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<HeaderTable
				tableName={'Coupons'}
				form={formSearch}
				searchOptions={searchCouponsOptions}
				onAdd={() => {
					setIsOpenAddUpdateCouponModal(true);
				}}
				onGetSearchKey={(searchKey) => {}}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={false}
				data={dummyData.map((item) => ({
					...item,
					discount: item.discount + '%',
					createdAt: dayjs(item.createdAt).format('DD/MM/YYYY'),
					status: (
						<ButtonStatus
							activate={item.status == COUPONS_STATUS.ACTIVE}
							nameActivate={COUPONS_STATUS.ACTIVE}
							nameDeactivate={COUPONS_STATUS.EXPIRED}
						/>
					),
					tools: (
						<div className="tw-flex tw-items-center tw-gap-1">
							<Button
								icon={
									<EditOutlined
										style={{
											fontSize: 16,
										}}
									/>
								}
								className="bg-theme-4 color-theme-7 !tw-border-none"
								onClick={() => {
									setIsOpenAddUpdateCouponModal(true);
								}}
							/>
							<Button
								icon={
									<DeleteOutlined
										style={{
											fontSize: 16,
										}}
									/>
								}
								className="!tw-bg-deleteIconDavid color-theme-7 !tw-border-none"
								onClick={() => {}}
							/>
						</div>
					),
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={dummyData.length}
				pageSize={PAGE_SIZE}
				current={1}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>

			<Modal
				width={700}
				open={isOpenAddUpdateCouponModal}
				footer={[
					<Button
						onClick={() => {
							setIsOpenAddUpdateCouponModal(false);
						}}
					>
						Cancel
					</Button>,
					<Button
						onClick={() => {
							setIsOpenAddUpdateCouponModal(false);
						}}
						className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
						form="addSubscriptionCoupon"
						htmlType="submit"
					>
						Add
					</Button>,
				]}
				destroyOnClose
				title={'Add coupon'}
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenAddUpdateCouponModal(false);
				}}
			>
				<Form id="addSubscriptionCoupon" onFinish={onSubmit} form={formAddCoupon} layout="vertical">
					<Row gutter={[24, 24]}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Name"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder="Enter coupon name" />
							</Form.Item>
							<Form.Item
								name="type"
								label="Type"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select coupon type"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={globalStore.courseLanguages.map((la) => ({
										value: la.id,
										label: la.name,
									}))}
								/>
							</Form.Item>
							<Form.Item
								name="startDate"
								label="Start date"
								rules={[
									{
										required: true,
									},
								]}
							>
								<DatePicker placeholder="Enter a start date" className='tw-w-full'/>
							</Form.Item>
							<Form.Item
								name="appliedPackages"
								label="Applied packages"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select package(s)"
									mode="multiple"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={globalStore.courseLanguages.map((la) => ({
										value: la.id,
										label: la.name,
									}))}
								/>
								<div className="tw-opacity-50">
									This coupon can be applied to selected packages. Leave this field blank for all packages
								</div>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="code"
								label="Code"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder="Enter coupon code" />
							</Form.Item>
							<Form.Item
								name="value"
								label="Value"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder="Enter coupon value" />
							</Form.Item>
							<Form.Item
								name="endDate"
								label="End date"
								rules={[
									{
										required: true,
									},
								]}
							>
								<DatePicker placeholder="Enter a end date" className='tw-w-full'/>
							</Form.Item>
							<Form.Item
								name="maximum"
								label="Maximum uses limit"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder="Enter usage limit" />
								<div className="tw-opacity-50">Enter 999999 to make it unlimited</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default SubscriptionsCoupons;
