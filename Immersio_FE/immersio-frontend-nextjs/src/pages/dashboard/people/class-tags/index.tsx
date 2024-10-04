import CustomTable from '@/components/common/CustomTable';
import HeaderTable from '@/components/common/HeaderTable';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import {
	IClassTagsTable,
	ICreateClassTagRequest,
	IGetClassTagsResponse,
	IUpdateClassTagRequest,
	searchClassTagsOptions,
} from '@/src/interfaces/people/people.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { createClassTag, deleteClassTag, getClassTags, updateClassTag } from '@/src/services/people/apiPeople';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Pagination } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Head from 'next/head';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

const ClassTagsPage = () => {
	const { t } = useTranslation()
	const [currentPage, setCurrentPage] = useState(1);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [isOpenAddTag, setIsOpenAddTag] = useState(false);
	const [form] = useForm<ICreateClassTagRequest>();
	const { confirm } = Modal;
	const [tagSelected, setTagSelected] = useState<IUpdateClassTagRequest | null>(null);

	const columns: IHeaderTable<IClassTagsTable & { tools: string }>[] = [
		{
			label: t('dashboard.option.name'),
			key: 'name',
			widthGrid: '1fr',
		},
		{
			label: t('dashboard.option.description'),
			key: 'description',
			widthGrid: '1fr',
		},
		{
			label: t('dashboard.option.connections'),
			key: 'connections',
			widthGrid: '1fr',
		},
		{
			label: t('dashboard.option.actions'),
			key: 'tools',
			widthGrid: '1fr',
		},
	];

	/* ------------------------------ GET CLASS TAG ----------------------------- */
	const [listClassTag, setListClassTag] = useState<IGetClassTagsResponse>({
		data: [],
		total: 0,
	});
	const [searchKey, setSearchKey] = useState<string>('');
	const getClassTagsQuery = useQuery<IGetClassTagsResponse>(
		['getClassTagsQuery223', currentPage, searchKey],
		() =>
			getClassTags({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
				searchBy: formSearch.getFieldValue('searchBy'),
				searchKey: searchKey,
			}),
		{
			onSuccess: (res) => {
				setListClassTag(res.data);
				if (res.data.data.length === 0 || searchKey) {
					setCurrentPage(1);
				}
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* --------------------------------- CREATE --------------------------------- */
	const createClassTagMutation = useMutation<any, ICreateClassTagRequest>(createClassTag, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.create_class_tag_success'));
			getClassTagsQuery.refetch();
			setIsOpenAddTag(false);
		},
		onError: () => {
			toast.error(t('dashboard.notification.create_class_tag_error'));
		},
	});

	/* --------------------------------- UPDATE --------------------------------- */
	const updateClassTagMutation = useMutation<any, IUpdateClassTagRequest>(updateClassTag, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.update_class_tag_success'));
			getClassTagsQuery.refetch();
			setIsOpenAddTag(false);
		},
		onError: () => {
			toast.error(t('dashboard.notification.update_class_tag_error'));
		},
	});

	/* --------------------------------- DELETE --------------------------------- */
	const deleteClassTagMutation = useMutation<any, string>(deleteClassTag, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.delete_class_tag_success'));
			getClassTagsQuery.refetch();
			setIsOpenAddTag(false);
		},
		onError: () => {
			toast.error(t('dashboard.notification.delete_class_tag_error'));
		},
	});
	const showDeleteConfirm = (id: string) => {
		confirm({
			title: t('dashboard.modal.are_you_sure_delete_this_item'),
			icon: <ExclamationCircleOutlined />,
			content: t('dashboard.modal.you_will_not_be_able_to_revert_this'),
			okText: t('dashboard.button.yes'),
			okType: 'danger',
			cancelText: t('dashboard.button.no'),
			onOk() {
				deleteClassTagMutation.mutate(id);
			},
		});
	};

	const onFinish = (data: ICreateClassTagRequest) => {
		if (tagSelected) {
			updateClassTagMutation.mutate({
				description: data.description,
				name: data.name,
				id: tagSelected?.id,
			});
		} else {
			createClassTagMutation.mutate({
				name: data.name,
				description: data.description,
			});
		}
	};

	return (
		<DashboardRoute>
			<Head>
				<title>Class tags</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<HeaderTable
				tableName={t('dashboard.title.class_tags')}
				form={formSearch}
				searchOptions={searchClassTagsOptions}
				onGetSearchKey={(searchKey) => {
					setSearchKey(searchKey ?? '');
					getClassTagsQuery.refetch();
				}}
				onAdd={() => setIsOpenAddTag(true)}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={getClassTagsQuery.isFetching}
				data={listClassTag.data.map((item) => ({
					...item,
					connections: (
						<div>
							<div>{t('dashboard.label.instructors')}: {item.connections.instructor}</div>
							<div>{t('dashboard.label.students')}: {item.connections.student}</div>
							<div>{t('dashboard.label.tutors')}: {item.connections.tutor}</div>
							<div>{t('dashboard.label.customers_service')}: {item.connections.customer_service}</div>
						</div>
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
									setIsOpenAddTag(true);
									form.setFieldsValue({
										name: item.name,
										description: item.description,
									});
									setTagSelected(item);
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
								onClick={(e) => {
									showDeleteConfirm(item.id);
								}}
							/>
						</div>
					),
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={listClassTag.total}
				pageSize={PAGE_SIZE}
				current={currentPage}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>

			<Modal
				title={t('dashboard.title.add_new_tag')}
				open={isOpenAddTag}
				footer={[
					<Button
						onClick={() => {
							setIsOpenAddTag(false);
						}}
						loading={createClassTagMutation.isLoading || updateClassTagMutation.isLoading}
						disabled={createClassTagMutation.isLoading || updateClassTagMutation.isLoading}
					>
						{t('dashboard.button.cancel')}
					</Button>,
					<Button
						type="primary"
						className={TAILWIND_CLASS.BUTTON_ANTD}
						onClick={() => {
							form.submit();
						}}
						loading={createClassTagMutation.isLoading || updateClassTagMutation.isLoading}
						disabled={createClassTagMutation.isLoading || updateClassTagMutation.isLoading}
					>
						{tagSelected ? t('dashboard.button.update') : t('dashboard.button.create')}
					</Button>,
				]}
				width={600}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenAddTag(false);
				}}
			>
				<Form onFinish={onFinish} layout="vertical" form={form}>
					<Form.Item
						name="name"
						label={t('dashboard.option.name')}
						rules={[{ required: true, message: t('dashboard.notification.please_enter_name') }]}
					>
						<Input placeholder={t('dashboard.placeholder.enter_name')} />
					</Form.Item>
					<Form.Item
						name="description"
						label={t('dashboard.option.description')}
						rules={[{ required: true, message: t('dashboard.notification.please_enter_description') }]}
					>
						<Input placeholder={t('dashboard.placeholder.enter_description')} />
					</Form.Item>
				</Form>
			</Modal>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default ClassTagsPage;
