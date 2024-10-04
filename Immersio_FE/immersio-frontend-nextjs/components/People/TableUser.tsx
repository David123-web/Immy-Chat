import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { getRoleName } from '@/src/helpers/strings';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import {
	IListUserByRoleResponse,
	ISocialLinks,
	IUpdateAccountStatusRequest,
	IUpdateUserSocialRequest,
	IUserManagement,
	ResendVerifyEmailRequest,
	STUDENT_STATUS_OPTIONS,
	TEACHER_STATUS_OPTIONS,
	columns,
	columnsStudent,
	searchUserOptions,
} from '@/src/interfaces/people/people.interface';
import {
	deleteUser,
	getListUserByRole,
	resendVerifyEmail,
	updateAccountStatus,
	updateUsersSocial,
} from '@/src/services/people/apiPeople';
import { useMobXStores } from '@/src/stores';
import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	MailFilled,
	ShareAltOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Form, Input, Modal, Pagination, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ButtonStatus from '../common/ButtonStatus';
import CustomTable from '../common/CustomTable';
import HeaderTable from '../common/HeaderTable';
import DashboardRoute from '../routes/DashboardRoute';
import { useTranslation } from 'next-i18next';

interface ITableUser {
	role: ROLE_TYPE;
}

const TableUser = (props: ITableUser) => {
	const { t } = useTranslation()
	const { role } = props;
	const { userStore } = useMobXStores();
	const router = useRouter();
	const { confirm } = Modal;
	const [formUpdateSocialUser] = Form.useForm<ISocialLinks>();
	const [formSearch] = Form.useForm<ICommonSearchRequest>();

	const [currentUserSelected, setCurrentUserSelected] = useState<IUserManagement | null>();
	const [currentPage, setCurrentPage] = useState(1);
	const [isOpenModalSocial, setIsOpenModalSocial] = useState<boolean>(false);

	/* ------------------------ GET LIST USER BY ROLE ------------------------ */
	const [listUserByRole, setListUserByRole] = useState<IListUserByRoleResponse>({
		total: 0,
		users: [],
	});
	const [searchKey, setSearchKey] = useState<string>('');
	const getUserByRoleQuery = useQuery<IListUserByRoleResponse>(
		['IListUserByRoleResponse', currentPage, searchKey],
		() =>
			getListUserByRole({
				role: role,
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
				searchBy: formSearch.getFieldValue('searchBy'),
				searchKey: searchKey,
			}),
		{
			onSuccess: (res) => {
				setListUserByRole(res.data);
				if (res.data.users.length === 0 || searchKey) {
					setCurrentPage(1);
				}
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* -------------------------- UPDATE ACCOUNT STATUS ------------------------- */
	const updateAccountStatusMutation = useMutation<any, IUpdateAccountStatusRequest>(updateAccountStatus, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.update_account_status_success'));
		},
		onError: () => {
			getUserByRoleQuery.refetch();
			toast.error(t('dashboard.notification.update_account_status_error'));
		},
	});

	/* ------------------------------- DELETE USER ------------------------------ */
	const deleteUserMutation = useMutation<any, string>(deleteUser, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.delete_row_success'));
			getUserByRoleQuery.refetch();
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
				deleteUserMutation.mutate(id);
			},
		});
	};

	/* --------------------------- RESEND VERIFY EMAIL -------------------------- */
	const resendVerifyEmailMutation = useMutation<any, ResendVerifyEmailRequest>(resendVerifyEmail, {
		onSuccess: () => {
			toast.success('Resend verify email successfully!');
		},
		onError: () => {
			toast.error('Resend verify email failed!');
		},
	});

	const onPushCreateUserRoute = () => {
		switch (role) {
			case ROLE_TYPE.STUDENT:
				return router.push(RouterConstants.DASHBOARD_ADD_STUDENT.path);
			case ROLE_TYPE.INSTRUCTOR:
				return router.push(RouterConstants.DASHBOARD_ADD_INSTRUCTOR.path);
			case ROLE_TYPE.TUTOR:
				return router.push(RouterConstants.DASHBOARD_ADD_TUTOR.path);
			case ROLE_TYPE.EDITOR:
				return router.push(RouterConstants.DASHBOARD_ADD_EDITOR.path);
			case ROLE_TYPE.CUSTOMER_SERVICE:
				return router.push(RouterConstants.DASHBOARD_ADD_CUSTOMER_SERVICE.path);
			default:
				return null;
		}
	};

	const onPushUpdateUserRoute = () => {
		switch (role) {
			case ROLE_TYPE.STUDENT:
				return RouterConstants.DASHBOARD_PEOPLE_STUDENT.path;
			case ROLE_TYPE.INSTRUCTOR:
				return RouterConstants.DASHBOARD_PEOPLE_INSTRUCTOR.path;
			case ROLE_TYPE.TUTOR:
				return RouterConstants.DASHBOARD_PEOPLE_TUTOR.path;
			case ROLE_TYPE.EDITOR:
				return RouterConstants.DASHBOARD_PEOPLE_EDITOR.path;
			case ROLE_TYPE.CUSTOMER_SERVICE:
				return RouterConstants.DASHBOARD_PEOPLE_CUSTOMER_SERVICE.path;
			default:
				return null;
		}
	};

	const onPushProfileUserRoute = () => {
		switch (role) {
			case ROLE_TYPE.STUDENT:
				return RouterConstants.DASHBOARD_PROFILE_STUDENT.path;
			case ROLE_TYPE.INSTRUCTOR:
				return RouterConstants.DASHBOARD_PROFILE_INSTRUCTOR.path;
			case ROLE_TYPE.TUTOR:
				return RouterConstants.DASHBOARD_PROFILE_TUTOR.path;
			case ROLE_TYPE.EDITOR:
				return RouterConstants.DASHBOARD_PROFILE_EDITOR.path;
			case ROLE_TYPE.CUSTOMER_SERVICE:
				return RouterConstants.DASHBOARD_PROFILE_CUSTOMER_SERVICE.path;
			default:
				return null;
		}
	};

	/* --------------------------- UPDATE USER SOCIAL --------------------------- */
	const updateUserSocialMutation = useMutation<boolean, IUpdateUserSocialRequest>(updateUsersSocial, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.update_row_success'));
			setIsOpenModalSocial(false);
		},
		onError: () => {
			toast.error(t('dashboard.notification.update_row_error'));
		},
		onSettled: () => getUserByRoleQuery.refetch(),
	});

	const onFinishUpdateSocial = (data: ISocialLinks) => {
		if (currentUserSelected) {
			updateUserSocialMutation.mutate({
				...data,
				id: currentUserSelected.id,
			});
		}
	};

	return (
		<DashboardRoute>
			<HeaderTable
				tableName={`${getRoleName(role)}s`}
				form={formSearch}
				searchOptions={searchUserOptions}
				onAdd={() => onPushCreateUserRoute()}
				onGetSearchKey={(searchKey) => {
					setSearchKey(searchKey ?? '');
					getUserByRoleQuery.refetch();
				}}
				customHeaderButton={
					// import instructor and only super admin can do that
					userStore.currentUser &&
					(userStore.currentUser.role === ROLE_TYPE.SUBDOMAIN_ADMIN ||
						userStore.currentUser.role === ROLE_TYPE.SUPER_ADMIN) && (
						<Button
							onClick={() => {
								router.push(`${RouterConstants.DASHBOARD_PROFILE_IMPORT_CSV.path}?role=${role}`);
							}}
							className={`tw-rounded-md tw-px-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-bg-lightGray`}
						>
							Import CSV
						</Button>
					)
				}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={role === ROLE_TYPE.STUDENT ? columnsStudent : columns}
				isLoading={getUserByRoleQuery.isFetching}
				data={listUserByRole.users.map((item) => ({
					...item,
					email: (
						<div className="tw-truncate" onClick={() => router.push(`${onPushProfileUserRoute()}/${item.id}`)}>
							{item.email}
						</div>
					),
					avatarUrl: (
						<Avatar
							size="large"
							shape="square"
							icon={<UserOutlined />}
							src={item.profile?.avatarUrl}
							onClick={() => router.push(`${onPushProfileUserRoute()}/${item.id}`)}
						/>
					),
					fullName: (
						<div className="tw-truncate" onClick={() => router.push(`${onPushProfileUserRoute()}/${item.id}`)}>
							{item.profile?.firstName} {item.profile?.lastName}
						</div>
					),
					phoneNumber: (
						<div onClick={() => router.push(`${onPushProfileUserRoute()}/${item.id}`)}>
							{item.profile?.dialCode}
							{item.profile?.phoneNumber}
						</div>
					),
					isVerified: <ButtonStatus activate={item.isVerified} nameActivate="Verified" nameDeactivate="Not verified" />,
					status: (
						<Select
							defaultValue={item.status}
							style={{ width: 120 }}
							options={role === ROLE_TYPE.STUDENT ? STUDENT_STATUS_OPTIONS : TEACHER_STATUS_OPTIONS}
							onClick={(e) => e.stopPropagation()}
							onChange={(value) =>
								updateAccountStatusMutation.mutate({
									id: item.id,
									status: value,
								})
							}
						/>
					),
					parentEmail: <div className="tw-truncate">{item.profile?.student?.parentEmail}</div>,
					parentPhoneNumber: (
						<div className="tw-truncate">
							{item.profile?.student?.parentDialCode}
							{item.profile?.student?.parentPhoneNumber}
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
								onClick={(e) => {
									router.push(`${onPushUpdateUserRoute()}/${item.id}`);
								}}
							/>
							<Button
								icon={<ShareAltOutlined />}
								className={TAILWIND_CLASS.BUTTON_ANTD}
								onClick={(e) => {
									setIsOpenModalSocial(true);
									formUpdateSocialUser.setFieldsValue({
										facebook: item.profile?.socialLinks?.facebook,
										instagram: item.profile?.socialLinks?.instagram,
										linkedin: item.profile?.socialLinks?.linkedin,
										twitter: item.profile?.socialLinks?.twitter,
										youtube: item.profile?.socialLinks?.youtube,
									});
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
							<Button
								icon={
									<MailFilled
										style={{
											fontSize: 16,
										}}
									/>
								}
								className="bg-theme-4 color-theme-7 !tw-border-none"
								onClick={(e) => {
									resendVerifyEmailMutation.mutate({
										userId: item.id,
									});
								}}
							/>
						</div>
					),
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={listUserByRole.total}
				pageSize={PAGE_SIZE}
				current={currentPage}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>
			{/* ADD SOCIAL MODAL */}
			<Modal
				title={<div className="tw-text-lg tw-font-bold">{t('dashboard.button.add_social_links')}</div>}
				width={600}
				open={isOpenModalSocial}
				footer={
					<Button
						htmlType="submit"
						form="social"
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded-lg`}
						loading={updateUserSocialMutation.isLoading}
					>
						{t('dashboard.button.update')}
					</Button>
				}
				destroyOnClose
				keyboard
				onCancel={() => {
					setIsOpenModalSocial(false);
					setCurrentUserSelected(null);
				}}
			>
				<Form id="social" onFinish={onFinishUpdateSocial} form={formUpdateSocialUser} layout="vertical">
					<Form.Item name="linkedin" label="Linkedin">
						<Input placeholder={t('dashboard.placeholder.enter_url_social_media_account')} />
					</Form.Item>
					<Form.Item name="facebook" label="Facebook">
						<Input placeholder={t('dashboard.placeholder.enter_url_social_media_account')} />
					</Form.Item>
					<Form.Item name="instagram" label="Instagram">
						<Input placeholder={t('dashboard.placeholder.enter_url_social_media_account')} />
					</Form.Item>
					<Form.Item name="youtube" label="Youtube">
						<Input placeholder={t('dashboard.placeholder.enter_url_social_media_account')} />
					</Form.Item>
					<Form.Item name="twitter" label="Twitter">
						<Input placeholder={t('dashboard.placeholder.enter_url_social_media_account')} />
					</Form.Item>
				</Form>
			</Modal>
		</DashboardRoute>
	);
};

export default observer(TableUser);
