import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { IListRoleManagementResponse, IUpdatePermissionRequest } from '@/src/interfaces/people/people.interface';
import { updatePermission } from '@/src/services/people/apiPeople';
import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';
import CustomTable from '../common/CustomTable';
import FormSwitch from './FormSwitch';

interface ITableRole {
	data: IListRoleManagementResponse[];
	loading: boolean;
	refetch: () => void;
}

const TableRole = (props: ITableRole) => {
	const { t } = useTranslation()
	const { data, loading, refetch } = props;
	const [form] = Form.useForm();

	const [openManageRole, setOpenManageRole] = useState(false);
	const [listPermission, setListPermission] = useState<{ [key: string]: boolean }>();
	const [roleSelected, setRoleSelected] = useState<IListRoleManagementResponse>();

	const columns: IHeaderTable<IListRoleManagementResponse & { permissions: boolean }>[] = [
		{
			label: t('dashboard.option.name'),
			key: 'name',
			widthGrid: '1fr',
			enableSort: true,
		},
		{
			label: t('dashboard.option.permissions'),
			key: 'permissions',
			widthGrid: '1fr',
		},
	];

	const updatePermissionMutation = useMutation<any, IUpdatePermissionRequest>(updatePermission, {
		onSuccess: () => {
			setOpenManageRole(false);
			toast.success(t('dashboard.notification.update_row_success'));
			refetch();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onFinish = (data: { [key: string]: boolean }) => {
		if (roleSelected) {
			updatePermissionMutation.mutate({
				value: data,
				id: roleSelected.id,
			});
		}
	};

	const setHeightContent = () => {
		switch (roleSelected?.role) {
			case ROLE_TYPE.SUBDOMAIN_ADMIN:
				return '550px';
			case ROLE_TYPE.INSTRUCTOR:
				return '300px';
			default:
				return '130px';
		}
	};

	const renderListPermission = () => {
		if (listPermission) {
			return Object.entries(listPermission).map(([name, value]) => (
				<FormSwitch
					key={name}
					defaultChecked={value}
					label={name}
					name={name}
					onChange={(checked: boolean) =>
						setListPermission((prev) => ({
							...prev,
							[name]: checked,
						}))
					}
				/>
			));
		}
		return null;
	};

	return (
		<div id="role-management">
			<Modal
				centered
				title={<div className="tw-text-lg tw-font-bold">{t('dashboard.title.permissions_management')}</div>}
				width={roleSelected?.role === ROLE_TYPE.EDITOR ? 800 : 1000}
				open={openManageRole}
				footer={
					<Button
						htmlType="submit"
						form="permission"
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded-lg`}
						loading={updatePermissionMutation.isLoading}
					>
						{t('dashboard.button.update')}
					</Button>
				}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => setOpenManageRole(false)}
			>
				<div className="tw-pb-6 tw-flex tw-items-center">
					<span className="tw-text-lg tw-font-semibold">{t('dashboard.option.role')}</span>
					<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-ml-4`}>{roleSelected?.name}</Button>
					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-ml-4 tw-w-fit`}
						onClick={() => {
							const ObjActiveAllPermission: Record<string, boolean> = {};
							Object.keys(roleSelected.value).forEach((key) => {
								ObjActiveAllPermission[key] = true;
							});
							setListPermission(ObjActiveAllPermission);
							form.setFieldsValue(ObjActiveAllPermission);
						}}
					>
						{t('dashboard.button.switch_all_to_active')}
					</Button>
				</div>
				<Form
					style={{
						height: setHeightContent(),
					}}
					id="permission"
					form={form}
					onFinish={onFinish}
					className="tw-flex tw-flex-wrap tw-h-full tw-flex-col"
				>
					{renderListPermission()}
				</Form>
			</Modal>

			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={loading}
				data={data.map((item) => ({
					...item,
					permissions: (
						<Button
							icon={
								<EditOutlined
									style={{
										fontSize: 16,
									}}
								/>
							}
							className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-flex tw-items-center tw-justify-center`}
							onClick={() => {
								setOpenManageRole(!openManageRole);
								setListPermission(item.value);
								setRoleSelected(item);
							}}
						>
							{t('dashboard.button.manage')}
						</Button>
					),
				}))}
			/>
		</div>
	);
};

export default TableRole;
