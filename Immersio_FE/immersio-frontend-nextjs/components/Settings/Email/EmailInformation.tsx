import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { EmailSmtpSecure, IGetSubdomainSettingsResponse, IUpdateEmailSmtpRequest } from '@/src/interfaces/settings/settings.interfaces';
import { sendTestEmail, updateEmailSmtp } from '@/src/services/settings/apiSettings';
import { Button, Col, Form, Input, Radio, Row, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface IEmailInformationTabProps {
	data: IGetSubdomainSettingsResponse
}

const EmailInformationTab = (props: IEmailInformationTabProps) => {
	const { t } = useTranslation()
	const { data } = props;
	const [form] = useForm();
	const [formTest] = useForm();

	useEffect(() => {
		data &&
		form.setFieldsValue({
			fromEmail: data.emailFrom,
			host: data.emailSMTPHost,
			port: data.emailSMTPPort,
			username: data.emailSMTPUsername,
			fromName: data.emailName,
			secure: data.emailSMTPSecure,
			authenticate: data.emailSMTPAuth,
			password: data.emailSMTPPassword,
		});	
	},[data])

	const onFinish = (data) => {
		updateEmailSmtpMutation.mutate(data)
	};

	const onFinishTest = (data) => {
		sendTestEmailMutation.mutate(data)
	};
	
	/* ---------------------------- UPDATE EMAIL SMTP --------------------------- */
	const updateEmailSmtpMutation = useMutation<any, IUpdateEmailSmtpRequest>(updateEmailSmtp, {
		onSuccess: (res) => {
			toast.success(t('dashboard.notification.update_row_success'));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	})

	/* ----------------------------- SEND TEST EMAIL ---------------------------- */
	const sendTestEmailMutation = useMutation<any, any>(sendTestEmail, {
		onSuccess: (res) => {
			toast.success(t('dashboard.notification.sent_row_success'));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		}
	})

	return (
		<div>
			<Form className="tw-w-2/3 tw-mt-4" onFinish={onFinish} form={form} layout="vertical">
				<Row gutter={[24, 24]}>
					<Col span={12}>
						<Form.Item
							name="fromEmail"
							label={t('dashboard.label.from_email')}
							rules={[
								{
									required: true,
									message: t('dashboard.notification.email_validation_required'),
								},
							]}
						>
							<Input type="email" placeholder={t('dashboard.placeholder.enter_email')} />
						</Form.Item>
						<Form.Item
							name="host"
							label={t('dashboard.label.SMTP_host')}
							rules={[
								{
									required: true,
									message: t('dashboard.notification.please_input_your_smtp_host'),
								},
							]}
						>
							<Input placeholder={t('dashboard.placeholder.enter_smtp_host')} />
						</Form.Item>
						<Form.Item
							name="port"
							label={t('dashboard.label.SMTP_port')}
							rules={[
								{
									required: true,
									message: t('dashboard.notification.please_input_your_smtp_port'),
								},
								{
									pattern: /^[0-9]*$/,
									message: t('dashboard.notification.please_input_a_valid_port'),
								},
								{
									max: 6,
									message: t('dashboard.notification.please_input_not_a_valid_port'),
								},
							]}
						>
							<Input type='number' placeholder={t('dashboard.placeholder.enter_smtp_port')} />
						</Form.Item>
						<Form.Item
							name="username"
							label="Username"
							rules={[
								{
									required: true,
									message: t('dashboard.notification.please_input_your_username'),
								},
							]}
						>
							<Input placeholder={t('dashboard.placeholder.enter_username')} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="fromName"
							label={t('dashboard.option.from_name')}
							rules={[
								{
									required: true,
									message: t('dashboard.placeholder.please_input_your_from_name'),
								},
							]}
						>
							<Input placeholder={t('dashboard.placeholder.enter_email')} />
						</Form.Item>
						<Form.Item label={t('dashboard.label.SMTP_secure')} name="secure">
							<Radio.Group className="tw-w-full tw-flex tw-flex-col tw-gap-y-4" defaultValue={EmailSmtpSecure.None}>
								<Space direction="horizontal">
									<Radio value={EmailSmtpSecure.None}>None</Radio>
									<Radio value={EmailSmtpSecure.SSL}>SSL</Radio>
									<Radio value={EmailSmtpSecure.TSL}>TSL</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>
						<Form.Item label="SMTP Authentication" name="authenticate">
							<Radio.Group className="tw-w-full tw-flex tw-flex-col tw-gap-y-4" defaultValue={false}>
								<Space direction="horizontal">
									<Radio value={false}>{t('dashboard.button.no')}</Radio>
									<Radio value={true}>{t('dashboard.button.yes')}</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>
						<Form.Item
							label="Password"
							name="password"
							rules={[{ required: true, message: t('dashboard.notification.phone_validation_required') }]}
						>
							<Input.Password placeholder={t('dashboard.placeholder.enter_password')} />
						</Form.Item>
					</Col>
				</Row>
				<Button
					className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`}
					htmlType="submit"
					disabled={updateEmailSmtpMutation.isLoading}
					loading={updateEmailSmtpMutation.isLoading}
				>
					{t('dashboard.button.save_changes')}
				</Button>
			</Form>
			<div className="tw-mt-8 tw-font-semibold tw-text-lg">
				{t('dashboard.label.test_settings')}
			</div>
			<Form className="tw-w-2/3 tw-mt-4" onFinish={onFinishTest} form={formTest} layout="vertical">
				<Row gutter={[24, 0]}>
					<Col span={12}>
						<Form.Item
							name="to"
							label={t('dashboard.option.to')}
							rules={[
								{
									required: true,
									message: t('dashboard.notification.email_validation_required'),
								},
							]}
						>
							<Input type="email" placeholder={t('dashboard.placeholder.enter_email')} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="subject"
							label={t('dashboard.option.subject')}
							rules={[
								{
									required: true,
									message: t('dashboard.notification.please_input_your_subject'),
								},
							]}
						>
							<Input placeholder={t('dashboard.placeholder.enter_subject')} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name="message"
					rules={[
						{
							required: true,
							message: t('dashboard.notification.please_input_your_message'),
						},
						{
							max: 150,
							message: t('dashboard.notification.the_message_should_not_exceed_150_characters'),
						},
					]}
					label={t('dashboard.option.message')}
					className="tw-w-full"
				>
					<TextArea placeholder={t('dashboard.placeholder.testing_message')} rows={4} />
				</Form.Item>
        <Button
					className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`}
					htmlType="submit"
					// disabled={isLoadingMutation}
					// loading={isLoadingMutation}
				>
					{t('dashboard.button.send_test')}
				</Button>
			</Form>
		</div>
	);
};

export default EmailInformationTab;
