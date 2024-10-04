import CustomTable from '@/components/common/CustomTable';
import HeaderTable from '@/components/common/HeaderTable';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import {
	ICreateSocialMedialLink,
	IDeleteSocialMediaLinkRequest,
	IGetSocialMediaLinkResponse,
	IUpdateSocialMediaLinkRequest,
	SocialMediaIcon,
	columnSettings,
	searchSettingOptions,
} from '@/src/interfaces/settings/settings.interfaces';
import { withTranslationsProps } from '@/src/next/with-app';
import {
	createSocialMediaLink,
	deleteSocialMediaLink,
	getListSocialMediaLink,
	updateSocialMediaLink,
} from '@/src/services/settings/apiSettings';
import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	FacebookFilled,
	InstagramFilled,
	LinkedinFilled,
	TwitterOutlined,
	YoutubeFilled,
} from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Pagination } from 'antd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useState } from 'react';
import { toast } from 'react-toastify';

const SocialMediaPage = () => {
	const { t } = useTranslation()
	const { confirm } = Modal;
	const [form] = Form.useForm();
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [currentSocialMedia, setCurrentSocialMedia] = useState<IGetSocialMediaLinkResponse>();
	const [iconSelected, setIconSelected] = useState<SocialMediaIcon>(SocialMediaIcon.Facebook);
	const [currentPage, setCurrentPage] = useState(1);
	const [isOpenModalAddSocial, setIsOpenModalSocial] = useState<boolean>(false);

	/* -------------------------- GET LIST SOCIAL MEDIA ------------------------- */
	const [listSocialMediaLink, setListSocialMediaLink] = useState<IGetSocialMediaLinkResponse[]>([]);
	const [searchKey, setSearchKey] = useState<string>('');
	const getListSocialMedialLinkQuery = useQuery<IGetSocialMediaLinkResponse[]>(
		['getListSocialMedialLinkQuery', currentPage, searchKey],
		() =>
			getListSocialMediaLink({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
				searchBy: formSearch.getFieldValue('searchBy'),
				searchKey: searchKey,
			}),
		{
			onSuccess: (res) => {
				setListSocialMediaLink(res.data);
				setCurrentPage(1);
				// if (res.data.users.length === 0 || searchKey) {
				// }
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* -------------------------- UPDATE ACCOUNT STATUS ------------------------- */
	const updateSocialMediaLinkMutation = useMutation<any, IUpdateSocialMediaLinkRequest>(updateSocialMediaLink, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.update_row_success'));
			setIsOpenModalSocial(false);
			form.resetFields();
			getListSocialMedialLinkQuery.refetch();
		},
		onError: () => {
			toast.error(t('dashboard.notification.update_row_error'));
		},
	});

	/* ------------------------------- DELETE ------------------------------ */
	const deleteSocialMediaLinkMutation = useMutation<any, IDeleteSocialMediaLinkRequest>(deleteSocialMediaLink, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.delete_row_success'));
			getListSocialMedialLinkQuery.refetch();
		},
		onError: () => {
			toast.error(t('dashboard.notification.delete_row_error'));
		},
	});

	/* ------------------------------ MODAL DELETE ------------------------------ */
	const showDeleteConfirm = (id: string) => {
		confirm({
			title: t('dashboard.modal.are_you_sure_delete_this_item'),
			icon: <ExclamationCircleOutlined />,
			content: t('dashboard.modal.you_will_not_be_able_to_revert_this'),
			okText: t('dashboard.button.yes'),
			okType: 'danger',
			cancelText: t('dashboard.button.no'),
			onOk() {
				deleteSocialMediaLinkMutation.mutate({ id });
			},
		});
	};

	/* -------------------------- CREATE SOCIAL MEDIAL -------------------------- */
	const createSocialMediaLinkMutation = useMutation<any, ICreateSocialMedialLink>(createSocialMediaLink, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.add_row_success'));
			setIsOpenModalSocial(false);
			form.resetFields();
			getListSocialMedialLinkQuery.refetch();
		},
		onError: () => {
			toast.error(t('dashboard.notification.add_row_error'));
		},
	});

	const getIconComponent = (icon: SocialMediaIcon) => {
		switch (icon) {
			case SocialMediaIcon.Facebook:
				return <FacebookFilled />;
			case SocialMediaIcon.Instagram:
				return <InstagramFilled />;
			case SocialMediaIcon.Linkedin:
				return <LinkedinFilled />;
			case SocialMediaIcon.Twitter:
				return <TwitterOutlined />;
			default:
				return <YoutubeFilled />;
		}
	};

	const onFinish = (data: ICreateSocialMedialLink) => {
		if (currentSocialMedia) {
			updateSocialMediaLinkMutation.mutate({
				...data,
				id: currentSocialMedia.id,
				icon: iconSelected,
			});
		} else {
			createSocialMediaLinkMutation.mutate({
				order: data.order,
				icon: iconSelected,
				url: data.url,
			});
		}
	};

	return (
		<DashboardRoute>
			<Head>
				<title>Social Media</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<HeaderTable
				tableName={t('dashboard.title.social_media')}
				form={formSearch}
				searchOptions={searchSettingOptions}
				onAdd={() => setIsOpenModalSocial(true)}
				onGetSearchKey={(searchKey) => {
					setSearchKey(searchKey ?? '');
					getListSocialMedialLinkQuery.refetch();
				}}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columnSettings}
				isLoading={getListSocialMedialLinkQuery.isFetching}
				data={listSocialMediaLink.map((item) => ({
					...item,
					icon: <div className="tw-text-xl tw-mb-2 color-theme-3">{getIconComponent(item.icon)}</div>,
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
								onClick={(e) => {
									form.setFieldsValue({
										url: item.url,
										order: item.order,
									});
									setIconSelected(item.icon);
									setIsOpenModalSocial(true);
									setCurrentSocialMedia(item);
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
				// total={listUserByRole.total}
				total={10}
				pageSize={PAGE_SIZE}
				current={currentPage}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>
			{/* ADD SOCIAL MODAL */}
			<Modal
				title={<div className="tw-text-lg tw-font-bold">{t('dashboard.title.add_social_media')}</div>}
				width={600}
				open={isOpenModalAddSocial}
				footer={
					<>
						<Button
							form="social"
							className={`tw-rounded-lg`}
							onClick={() => setIsOpenModalSocial(false)}
							loading={updateSocialMediaLinkMutation.isLoading || createSocialMediaLinkMutation.isLoading}
							disabled={updateSocialMediaLinkMutation.isLoading || createSocialMediaLinkMutation.isLoading}
						>
							{t('dashboard.button.cancel')}
						</Button>
						<Button
							htmlType="submit"
							form="social"
							className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
							onClick={() => form.submit()}
							loading={updateSocialMediaLinkMutation.isLoading || createSocialMediaLinkMutation.isLoading}
							disabled={updateSocialMediaLinkMutation.isLoading || createSocialMediaLinkMutation.isLoading}
						>
							{currentSocialMedia ? t('dashboard.button.update') : t('dashboard.button.add')}
						</Button>
					</>
				}
				destroyOnClose
				keyboard
				onCancel={() => {
					setIsOpenModalSocial(false);
					setCurrentSocialMedia(null);
				}}
			>
				<Form onFinish={onFinish} form={form} layout="vertical">
					<Form.Item name="icon" label="Social Media Icon">
						<div className="tw-flex tw-gap-4 tw-text-neutral-400 tw-text-2xl">
							<FacebookFilled
								className={iconSelected === SocialMediaIcon.Facebook ? 'color-theme-3' : ''}
								onClick={() => setIconSelected(SocialMediaIcon.Facebook)}
							/>
							<LinkedinFilled
								className={iconSelected === SocialMediaIcon.Linkedin ? 'color-theme-3' : ''}
								onClick={() => setIconSelected(SocialMediaIcon.Linkedin)}
							/>
							<InstagramFilled
								className={iconSelected === SocialMediaIcon.Instagram ? 'color-theme-3' : ''}
								onClick={() => setIconSelected(SocialMediaIcon.Instagram)}
							/>
							<YoutubeFilled
								className={iconSelected === SocialMediaIcon.Youtube ? 'color-theme-3' : ''}
								onClick={() => setIconSelected(SocialMediaIcon.Youtube)}
							/>
							<TwitterOutlined
								className={iconSelected === SocialMediaIcon.Twitter ? 'color-theme-3' : ''}
								onClick={() => setIconSelected(SocialMediaIcon.Twitter)}
							/>
						</div>
					</Form.Item>
					<Form.Item
						name="url"
						label={t('dashboard.option.social_media_URL')}
						rules={[{ required: true, message: t('dashboard.notification.please_enter_URL') }]}
					>
						<Input placeholder={t('dashboard.placeholder.enter_url_social_media_account')} />
					</Form.Item>
					<Form.Item
						className="tw-mb-0"
						name="order"
						label={t('dashboard.label.enter_order_number')}
						rules={[{ required: true, message: t('dashboard.notification.please_enter_order_number') }]}
					>
						<InputNumber min={1} max={5} />
					</Form.Item>
					<div className="tw-text-sm tw-mt-1 tw-text-gray">
						{t('dashboard.label.the_higher_order_number_is')}
					</div>
				</Form>
			</Modal>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default observer(SocialMediaPage);
