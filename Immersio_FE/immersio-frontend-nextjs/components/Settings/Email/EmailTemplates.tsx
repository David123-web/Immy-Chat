import CustomCKEditor from '@/components/PaymentGateways/CustomCKEditor';
import CustomTable from '@/components/common/CustomTable';
import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { EmailTemplateType, IGetEmailTemplateResponse, IUpdateEmailTemplateRequest, columnEmailTemplates } from '@/src/interfaces/settings/settings.interfaces';
import { getEmailTemplates, updateEmailTemplate } from '@/src/services/settings/apiSettings';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';

const EmailTemplatesTab = () => {
	const { t } = useTranslation()
	const [form] = useForm();
	const [isOpenEdit, setIsOpenEdit] = useState(false);

	const onFinish = (value) => {
		const body: IUpdateEmailTemplateRequest = {
			subject: value.subject,
			content: value.content,
		}
		updateEmailTemplateMutation.mutate({type: value.type, body});
		setIsOpenEdit(false);
	};

	/* --------------------------- GET EMAIL TEMPLATES -------------------------- */
	const [emailTemplates, setEmailTemplates] = useState<IGetEmailTemplateResponse[]>([]);
	const getTemplateQuery = useQuery<any, IGetEmailTemplateResponse[]>(
		['IGetEmailTemplateResponse'],
		() => getEmailTemplates(),
		{
			onSuccess: (res) => {
				setEmailTemplates(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			}
		}
	)

	/* --------------------------- EDIT EMAIL TEMPLATE -------------------------- */
	const onUpdateEmailTemplate = (type: EmailTemplateType) => {
		const selectEmailTemplate = emailTemplates.find((item) => item.type === type);
		form.setFieldsValue({
			type: selectEmailTemplate.type,
			subject: selectEmailTemplate.subject,
			content: selectEmailTemplate.content
		});
		setIsOpenEdit(true);
	};

	const updateEmailTemplateMutation = useMutation<any, {type: EmailTemplateType, body: IUpdateEmailTemplateRequest}>(updateEmailTemplate, {
		onSuccess: (res) => {
			toast.success(t('dashboard.notification.update_row_success'));
			setIsOpenEdit(false);
			getTemplateQuery.refetch();
			form.resetFields();
		},
		onError: (err) => {
			toast.error(t('dashboard.notification.update_row_error'));
		},
	});



	return (
		<>
			{/* <HeaderTable
				tableName={`${getRoleName(role)}s`}
				form={formSearch}
				searchOptions={searchUserOptions}
				onAdd={() => onPushCreateUserRoute()}
				onGetSearchKey={(searchKey) => {
					setSearchKey(searchKey ?? '');
					getUserByRoleQuery.refetch();
				}}
			/> */}
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columnEmailTemplates}
				isLoading={false}
				data={emailTemplates.map((item) => ({
					emailType: item.type,
					emailSubject: item.subject,
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
									onUpdateEmailTemplate(item.type);
								}}
							/>
						</div>
					),
				}))}
			/>
			{/* <Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={emailTemplates.length}
				pageSize={PAGE_SIZE}
				current={currentPage}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/> */}
			<Modal
				title={<div className="tw-text-lg tw-font-bold">{t('dashboard.title.edit_email_template')}</div>}
				width={1000}
				centered
				open={isOpenEdit}
				footer={
					<></>
					// <Button
					// 	htmlType="submit"
					// 	form="social"
					// 	className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded-lg`}
					// 	loading={updateUserSocialMutation.isLoading}
					// >
					// 	Update
					// </Button>
				}
				destroyOnClose
				keyboard
				onCancel={() => {
					setIsOpenEdit(false);
				}}
			>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
					<Col span={16}>
						<Form id="social" onFinish={onFinish} form={form} layout="vertical">
							<Form.Item name="type" label={t('dashboard.label.email_type')}>
								<Input disabled />
							</Form.Item>
							<Form.Item name="subject" label={t('dashboard.label.email_subject')}>
								<Input placeholder={t('dashboard.placeholder.enter_email_subject')} />
							</Form.Item>
							<Form.Item
								name="content"
								label={t('dashboard.option.content')}
								rules={[
									{
										required: true,
										message: t('dashboard.notification.please_input_content'),
									},
									{
										max: 500,
										message: t('dashboard.notification.the_content_must_be_less_than_500_characters'),
									},
								]}
							>
								<CustomCKEditor
									initialContent={form.getFieldValue('content')}
									form={form}
									name="content"
								/>
							</Form.Item>
							<div className='tw-w-full tw-flex tw-justify-end'>
							<Button
								htmlType="submit"
								form="social"
								className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
								loading={updateEmailTemplateMutation.isLoading}
							>
								{t('dashboard.button.update')}
							</Button>
							</div>
						</Form>
					</Col>
					<Col span={8}>
						<div>Code</div>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default EmailTemplatesTab;
