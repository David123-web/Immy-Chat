import ActivationButtons from '@/components/PaymentGateways/ActivationButtons';
import CustomCKEditor from '@/components/PaymentGateways/CustomCKEditor';
import TablePaymentOffline from '@/components/PaymentGateways/TablePaymentOffline';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import {
	ICreateOfflinePaymentGateways,
	IUpdateOfflinePaymentGatewayByIdRequest,
} from '@/src/interfaces/paymentGateways/paymentGateways.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import {
	createOfflinePaymentGateways,
	deleteOfflinePaymentGatewayById,
	getOfflinePaymentGateways,
	updateOfflinePaymentGatewayById,
} from '@/src/services/paymentGateway/apiPaymentGateway';
import { Button, Form, Input, Modal, Pagination } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface IListGatewayOffline {
	id: string;
	name: string;
	description: string;
	instruction: string;
	serialNumber: string;
	isActivated: boolean;
}

function PaymentOffline() {
	const { t } = useTranslation()
	const [form] = Form.useForm<IListGatewayOffline>();
	const [currentPage, setCurrentPage] = useState(1);
	const [openAddGatewaysModal, setOpenAddGatewaysModal] = useState(false);
	const [isActivate, setIsActivate] = useState(false);
	const [rowSelected, setRowSelected] = useState<IListGatewayOffline | null>(null);
	const [offlinePaymentGateways, setOfflinePaymentGateways] = useState<IListGatewayOffline[]>([]);

	const onFinish = (data: any) => {
		if (!data.id) {
			const createOfflinePaymentGatewayRequest: ICreateOfflinePaymentGateways = {
				name: data.name,
				description: data.description,
				instruction: data.instruction,
				serialNumber: data.serialNumber,
				isActivated: data.isActivated,
			};
			createOfflinePaymentGatewayMutation.mutate(createOfflinePaymentGatewayRequest);
		} else {
			const createOfflinePaymentGatewayRequest: IUpdateOfflinePaymentGatewayByIdRequest = {
				name: data.name,
				description: data.description,
				instruction: data.instruction,
				serialNumber: data.serialNumber,
				isActivated: data.isActivated,
			};
			updateOfflinePaymentGatewayMutation.mutate({ id: data.id, body: createOfflinePaymentGatewayRequest });
		}
	};

	useEffect(() => {
		if (rowSelected) {
			setIsActivate(rowSelected.isActivated);
			form.setFieldsValue({
				name: rowSelected.name,
				id: rowSelected.id,
				serialNumber: rowSelected.serialNumber,
				isActivated: rowSelected.isActivated,
			});
		}
	}, [rowSelected]);

	const [pageSize, setPageSize] = useState(5);
	const [totalFile, setTotalFile] = useState(0);
	const getOfflinePaymentGatewaysQuery = useQuery(
		['GET_OFFLINE_PAYMENT_GATEWAYS', currentPage],
		() =>
			getOfflinePaymentGateways({
				take: pageSize,
				skip: pageSize * (currentPage - 1),
			}),
		{
			onSuccess: (res) => {
				setOfflinePaymentGateways(res.data.data);
				setTotalFile(res.data.total);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	const createOfflinePaymentGatewayMutation = useMutation(createOfflinePaymentGateways, {
		onSuccess: (res) => {
			getOfflinePaymentGatewaysQuery.refetch();
			setOpenAddGatewaysModal(false);
			toast.success(t('dashboard.notification.create_offline_gateway_success'));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const updateOfflinePaymentGatewayMutation = useMutation(updateOfflinePaymentGatewayById, {
		onSuccess: (res) => {
			getOfflinePaymentGatewaysQuery.refetch();
			setOpenAddGatewaysModal(false);
			toast.success(t('dashboard.notification.update_offline_gateway_success'));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const deleteOfflinePaymentGatewayMutation = useMutation(deleteOfflinePaymentGatewayById, {
		onSuccess: (res) => {
			getOfflinePaymentGatewaysQuery.refetch();
			setOpenAddGatewaysModal(false);
			toast.success(t('dashboard.notification.delete_offline_gateway_success'));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});
	return (
		<>
			<Head>
				<title>Payment Offline</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<DashboardRoute>
				{/* <HeaderTable tableName="Offline Gateways">
					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-flex tw-items-center first-line:!tw-text-sm`}
						icon={<PlusOutlined />}
						onClick={() => setOpenAddGatewaysModal(!openAddGatewaysModal)}
					>
						<span className="tw-text-[12px]">Add Gateway</span>
					</Button>
				</HeaderTable> */}
				<TablePaymentOffline
					data={offlinePaymentGateways}
					onEdit={(item) => {
						setOpenAddGatewaysModal(true);
						setIsActivate(item.isActivated);
						form.setFieldsValue({
							id: item.id,
							name: item.name,
							serialNumber: item.serialNumber,
							isActivated: item.isActivated,
						});
					}}
					onDelete={(id) => deleteOfflinePaymentGatewayMutation.mutate(id)}
				/>
				<Pagination
					className="!tw-mt-6 tw-flex tw-justify-end"
					total={totalFile}
					pageSize={pageSize}
					current={currentPage}
					onChange={(page: number) => {
						setCurrentPage(page);
						setRowSelected(null);
					}}
				/>
			</DashboardRoute>

			<Modal
				title={t('dashboard.title.add_gateway')}
				width={700}
				open={openAddGatewaysModal}
				onOk={() => {
					setOpenAddGatewaysModal(false);
					form.resetFields();
				}}
				onCancel={() => {
					setOpenAddGatewaysModal(false);
					form.resetFields();
				}}
				footer={
					<div>
						<Button
							onClick={() => {
								setOpenAddGatewaysModal(false);
								form.resetFields();
							}}
						>
							{t('dashboard.button.close')}
						</Button>
						<Button form="payment_offline" htmlType="submit" className={TAILWIND_CLASS.BUTTON_ANTD}>
							{t('dashboard.button.submit')}
						</Button>
					</div>
				}
			>
				<Form id="payment_offline" layout="vertical" form={form} onFinish={onFinish}>
					<Form.Item className="tw-hidden" name="id" initialValue={rowSelected?.id} />
					<Form.Item
						name="name"
						label={t('dashboard.option.name')}
						rules={[
							{
								required: true,
								message: t('dashboard.notification.name_is_required'),
							},
						]}
					>
						<Input placeholder={t('dashboard.placeholder.enter_name')} />
					</Form.Item>
					<Form.Item name="description" label={t('dashboard.option.short_description')}>
						<TextArea placeholder={t('dashboard.placeholder.enter_short_description')} rows={4} />
					</Form.Item>
					<Form.Item name="instruction" label={t('dashboard.option.instruction')}>
						<CustomCKEditor
							form={form}
							name="instruction"
							initialContent={
								//create state to storage data in here or using form.getValue to pass this value, thanks Zahu ngu
								'<ol><li>34534<strong>dsfsdf</strong><i><strong>sdfsdfsd</strong></i><a href=`12123`><i><strong>1`2123</strong></i></a><i><strong>2</strong></i><br><i><strong>aaaaaaaaa</strong></i></li></ol>'
							}
						/>
					</Form.Item>
					<div className="tw-flex tw-gap-4">
						<Form.Item name="isActivated" label={t('dashboard.option.activation')} className="tw-w-full">
							<ActivationButtons
								formInstance={form}
								name="isActivated"
								isActivate={isActivate}
								onClick={() => setIsActivate(!isActivate)}
							/>
						</Form.Item>
						<Form.Item
							name="serialNumber"
							label={t('dashboard.option.serial_number')}
							className="tw-w-full"
							rules={[
								{
									required: true,
									message: t('dashboard.notification.serial_number_is_required'),
								},
								{
									pattern: /^[0-9]*$/,
									message: t('dashboard.notification.this_is_not_valid_serial'),
								},
							]}
						>
							<Input style={{ width: '100%' }} placeholder={t('dashboard.placeholder.enter_your_serial_number')} />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	);
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default PaymentOffline