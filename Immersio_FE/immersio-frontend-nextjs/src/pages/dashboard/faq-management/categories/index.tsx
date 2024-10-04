import CustomTable from '@/components/common/CustomTable';
import HeaderTable from '@/components/common/HeaderTable';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { BLOG_CATEGORY_STATUS } from '@/src/interfaces/blogManagement/blogManagement.interface';
import { ICommonSearchRequest, Option } from '@/src/interfaces/common/common.interface';
import {
	IAddFAQCategoryRequest,
	IFAQCategoriesTable,
	IGetFAQCategoriesResponse
} from '@/src/interfaces/faqManagement/faqManagement.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import {
	createFAQCategory,
	deleteFAQCategoryById,
	getFAQCategories,
	updateFAQCategoryById,
} from '@/src/services/faqManagement/apiFAQManagement';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Pagination, Select } from 'antd';
import Head from 'next/head';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

const FAQCategories = () => {
	const { t } = useTranslation()
	const [currentPage, setCurrentPage] = useState(1);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [addFAQCategoryForm] = Form.useForm();
	const [isOpenAddFAQCategory, setIsOpenAddFAQCategory] = useState(false);

	const searchFAQCategoriesOptions: Option<keyof any>[] = [
		{
			value: 'name',
			label: t('dashboard.option.name'),
		},
		{
			value: 'status',
			label: t('dashboard.option.status'),
		},
	];

	const faqCategoryStatus = [
		{
			name: t('dashboard.option.active'),
			value: true,
		},
		{
			name: t('dashboard.option.not_active'),
			value: false,
		},
	];
	
	const columns: IHeaderTable<IFAQCategoriesTable & { tools: string }>[] = [
		{
			label: t('dashboard.option.name'),
			key: 'name',
			widthGrid: '1fr',
		},
		{
			label: t('dashboard.option.status'),
			key: 'status',
			widthGrid: '1fr',
		},
		{
			label: t('dashboard.option.actions'),
			key: 'tools',
			widthGrid: '1fr',
		},
	];

	/* ----------------------- GET LIST OF FAQ CATEGORIES ----------------------- */
	const [listOfFAQCategories, setListOfFAQCategories] = useState<IGetFAQCategoriesResponse>({
		total: 0,
		data: [],
	});
	const [searchKey, setSearchKey] = useState<string>('');
	const getListOfFAQCategoriesQuery = useQuery<any>(
		['IGetFAQCategoriesResponse', currentPage],
		() =>
			getFAQCategories({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
			}),
		{
			onSuccess: (res) => {
				setListOfFAQCategories({ total: 100, data: res.data.filter((x) => !x.isDeleted) });
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* -------------------------- CREATE BLOG CATERORY -------------------------- */
	const onAddFAQCategory = (value) => {
		const body: IAddFAQCategoryRequest = {
			name: value.name,
			active: value.status,
		};
		if (!value.id) {
			createFAQCategoryMutation.mutate(body);
		} else {
			updateFAQCategoryMutation.mutate({ id: value.id, body });
		}
	};

	const createFAQCategoryMutation = useMutation<any, IAddFAQCategoryRequest>(createFAQCategory, {
		onSuccess: (res) => {
			toast.success(t('dashboard.notification.create_blog_category_success'));
			setIsOpenAddFAQCategory(false);
			addFAQCategoryForm.resetFields();
			getListOfFAQCategoriesQuery.refetch();
		},
		onError: (err) => {
			toast.error(t('dashboard.notification.create_blog_category_error'));
		},
	});

	/* --------------------------- EDIT BLOG CATEGORY --------------------------- */
	const onEditFAQCategory = (id: string) => {
		const selectedFAQCategory = listOfFAQCategories.data.find((item) => item.id === id);
		addFAQCategoryForm.setFieldsValue({
			id: selectedFAQCategory.id,
			name: selectedFAQCategory.name,
			status: selectedFAQCategory.active,
		});
		setIsOpenAddFAQCategory(true);
	};

	const updateFAQCategoryMutation = useMutation<any, { id: string; body: IAddFAQCategoryRequest }>(
		updateFAQCategoryById,
		{
			onSuccess: (res) => {
				toast.success(t('dashboard.notification.update_blog_category_success'));
				setIsOpenAddFAQCategory(false);
				addFAQCategoryForm.resetFields();
				getListOfFAQCategoriesQuery.refetch();
			},
			onError: (err) => {
				toast.error(t('dashboard.notification.update_blog_category_error'));
			},
		}
	);

	/* --------------------------- DELETE BLOG CATEGORY --------------------------- */
	const onDeleteFAQCategoryMutation = useMutation<any, string>(deleteFAQCategoryById, {
		onSuccess: (res) => {
			toast.success(t('dashboard.notification.delete_blog_category_success'));
			getListOfFAQCategoriesQuery.refetch();
		},
		onError: (err) => {
			toast.error(t('dashboard.notification.delete_blog_category_error'));
		},
	});

	return (
		<DashboardRoute>
			<Head>
				<title>FAQ Categories</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<HeaderTable
				tableName={t('dashboard.title.faq_categories')}
				form={formSearch}
				searchOptions={searchFAQCategoriesOptions}
				onAdd={() => setIsOpenAddFAQCategory(true)}
				onGetSearchKey={(searchKey) => {}}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={false}
				data={listOfFAQCategories.data.map((item) => ({
					name: item.name,
					status: item.active ? BLOG_CATEGORY_STATUS.ACTIVE : BLOG_CATEGORY_STATUS.NOT_ACTIVE,
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
								onClick={() => onEditFAQCategory(item.id)}
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
								onClick={() => onDeleteFAQCategoryMutation.mutate(item.id)}
							/>
						</div>
					),
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={listOfFAQCategories.total}
				pageSize={PAGE_SIZE}
				current={1}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>
			<Modal
				title={`${addFAQCategoryForm.getFieldValue('id') ? t('dashboard.button.edit') : t('dashboard.button.add')} ${t('dashboard.title.faq_category')}`}
				open={isOpenAddFAQCategory}
				footer={[
					<Button
						onClick={() => {
							setIsOpenAddFAQCategory(false);
						}}
						className={`tw-rounded-lg`}
					>
						{t('dashboard.button.cancel')}
					</Button>,
					<Button
						htmlType="submit"
						form="addFAQCategory"
						onClick={() => {
							setIsOpenAddFAQCategory(false);
						}}
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
					>
						{t('dashboard.button.save')}
					</Button>,
				]}
				width={400}
				afterClose={() => {
					addFAQCategoryForm.resetFields();
				}}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenAddFAQCategory(false);
				}}
			>
				<Form id="addFAQCategory" onFinish={onAddFAQCategory} form={addFAQCategoryForm} layout="vertical">
					<Form.Item className="tw-hidden" name="id" initialValue={null} />
					<Form.Item
						name="name"
						label={t('dashboard.option.category_name')}
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input placeholder={t('dashboard.placeholder.enter_category_name')} />
					</Form.Item>
					<Form.Item
						name="status"
						label={t('dashboard.option.category_status')}
						rules={[
							{
								required: true,
							},
						]}
					>
						<Select
							placeholder={t('dashboard.placeholder.select_a_status')}
							options={faqCategoryStatus.map((la) => ({
								value: la.value,
								label: la.name,
							}))}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default FAQCategories;
