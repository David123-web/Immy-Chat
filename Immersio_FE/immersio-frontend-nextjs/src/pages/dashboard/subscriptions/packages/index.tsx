import HeaderTable from '@/components/common/HeaderTable';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { ICommonSearchRequest, Option, SubdomainPlanFeature } from '@/src/interfaces/common/common.interface';

import { useQuery } from '@/hooks/useQuery';
import {
  CreateSubscriptionPlanRequest,
  DeactivateSubscriptionPlanRequest,
  ICreditsResponse,
  ISubscriptionPlanResponse,
  PACKAGES_STATUS
} from '@/src/interfaces/subscriptions/subscriptions.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { getCreditValue } from '@/src/services/settings/apiSettings';
import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  setInactiveSubscriptionPlans
} from '@/src/services/subscriptions/apiSubscriptions';
import { EditOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import Head from 'next/head';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMobXStores } from '@/src/stores';

const SubscriptionsPackages = () => {
  const { globalStore } = useMobXStores();


	// const [currentPage, setCurrentPage] = useState(1);
	const [packagePlans, setPackagePlans] = useState<ISubscriptionPlanResponse[]>([]);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [formAddPackage] = Form.useForm();
	const [isOpenAddUpdatePackageModal, setIsOpenAddUpdatePackageModal] = useState<boolean>(false);
	const [packageFeaturesSelected, setPackageFeaturesSelected] = useState<SubdomainPlanFeature[]>([
		SubdomainPlanFeature.AllCourses,
		SubdomainPlanFeature.ImmyChatBot,
		SubdomainPlanFeature.ImmyChatBot,
		SubdomainPlanFeature.MyRecordings,
	]);

	const searchPackagesOptions: Option<keyof any>[] = [
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

	const getPackageQuery = useQuery<ISubscriptionPlanResponse[], Error>(
		['ISubscriptionPlanResponse'],
		() => getSubscriptionPlans(),
		{
			onSuccess: (res) => {
				setPackagePlans(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ------------------------------- CREATE PLAN ------------------------------ */
	const createPackageMutation = useMutation<any, CreateSubscriptionPlanRequest>(createSubscriptionPlan, {
		onSuccess: () => {
			toast.success('Create Package successfully!');
			getPackageQuery.refetch();
			formAddPackage.resetFields();
			setIsOpenAddUpdatePackageModal(false);
		},
		onError: () => {
			toast.error('Create Package failed!');
		},
	});

	/* ------------------------------- DEACTIVATE PLAN ------------------------------ */
	// { id: string; body: IUpdateBlogRequest }
	//useMutation<any, { id: string; body: IUpdateBlogRequest }>
	const updatePackageMutation = useMutation<any, { id: string; body: DeactivateSubscriptionPlanRequest }>(
		setInactiveSubscriptionPlans,
		{
			onSuccess: () => {
				toast.success('Package set to legacy');
				getPackageQuery.refetch();
			},
			onError: () => {
				toast.error('Deactivate Package failed!');
			},
		}
	);

	const deactivate = (id: string) => {
		Modal.confirm({
			title: 'Confirm Deactivation',
			content: 'Are you sure you want to deactivate this package? It will become legacy. This cannot be undone',
			okText: 'Yes',
			cancelText: 'No',
			onOk: () => {
				updatePackageMutation.mutate({ id: id, body: { isActive: false } });
			},
		});
	};

	const onSubmit = (data: CreateSubscriptionPlanRequest) => {
		console.log('data', data);
		createPackageMutation.mutate({
			cost: data.cost,
			currency: globalStore.currencySubdomain,
			description: '',
			features: packageFeaturesSelected,
			term: data.term,
			title: data.title,
		});
	};

	/* ----------------------------- TABLE PACKAGES ----------------------------- */
	const columnsPackages: ColumnsType<ISubscriptionPlanResponse> = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Cost',
			dataIndex: 'cost',
			key: 'cost',
			render: (_, record) => `${record.cost} ${globalStore.currencySubdomain}`,
		},
		{
			title: 'Term',
			dataIndex: 'term',
			key: 'term',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (isActive) => (isActive ? PACKAGES_STATUS.Active : PACKAGES_STATUS.Inactive),
		},
		{
			title: 'Deactivate',
			dataIndex: 'deactivate',
			key: 'deactivate',
			render: (_, record) => (
				<div className="tw-flex tw-items-center tw-gap-1">
					{record.isActive ? (
						<Button
							icon={
								<MinusOutlined
									style={{
										fontSize: 16,
									}}
								/>
							}
							className="!tw-bg-deleteIconDavid color-theme-7 !tw-border-none"
							onClick={() => {
								deactivate(record.id); // Pass item.id to setInactive function
							}}
						/>
					) : null}
				</div>
			),
		},
		{
			title: 'Actions',
			dataIndex: 'action',
			key: 'action',
			render: () => (
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
					/>
				</div>
			),
		},
	];

	return (
		<DashboardRoute>
			<Head>
				<title>Subscription Package</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<HeaderTable
				tableName={'Packages'}
				form={formSearch}
				searchOptions={searchPackagesOptions}
				onAdd={() => {
					setIsOpenAddUpdatePackageModal(true);
				}}
			/>
			{/* // TODO PAGINATION, EDIT PACKAGES */}
			<Table
				dataSource={packagePlans}
				columns={columnsPackages}
				// pagination={{
				// 	total: dummyData.length,
				// 	pageSize: PAGE_SIZE,
				// 	current: currentPage,
				// 	onChange: (page: number) => {
				// 		setCurrentPage(page);
				// 	},
				// }}
			/>
			<Modal
				centered
				width={700}
				open={isOpenAddUpdatePackageModal}
				footer={[
					<Button
						onClick={() => {
							setIsOpenAddUpdatePackageModal(false);
						}}
						loading={createPackageMutation.isLoading}
						disabled={createPackageMutation.isLoading}
						className={`tw-rounded-lg`}
					>
						Cancel
					</Button>,
					<Button
						onClick={() => {
							formAddPackage.submit();
						}}
						loading={createPackageMutation.isLoading}
						disabled={createPackageMutation.isLoading}
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
					>
						Create
					</Button>,
				]}
				destroyOnClose
				title={'Add package'}
				maskClosable={false}
				keyboard
				onCancel={() => {
					formAddPackage.resetFields();
					setIsOpenAddUpdatePackageModal(false);
				}}
			>
				<Form onFinish={onSubmit} form={formAddPackage} layout="vertical">
					<Row gutter={[24, 24]}>
						<Col span={12}>
							<Form.Item
								name="title"
								label="Package title"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder="Enter package title" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="cost"
								label={`Price ${globalStore.currencySubdomain}`}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder="Enter package price" type="number" />
							</Form.Item>
							<Form.Item name="term" label="Package term (in days)" rules={[{ required: true }]}>
								<InputNumber min={1} placeholder="Enter term length in days" style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default SubscriptionsPackages;
