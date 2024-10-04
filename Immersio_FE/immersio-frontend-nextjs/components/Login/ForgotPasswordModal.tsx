import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { forgotPassword } from '@/src/services/auth/apiAuth';
import { Button, Form, Input, Modal } from 'antd';
import Link from 'next/link';
import * as React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface IForgotPasswordModal {
	open: boolean;
	handleOk: () => void;
	handleCancel: () => void;
}

const ForgotPasswordModal = (props: IForgotPasswordModal) => {
	const { open, handleOk, handleCancel } = props;
	const [forgotPasswordForm] = Form.useForm();
	
	const forgotPasswordMutation = useMutation(forgotPassword, {
		onSuccess: (res) => {},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onForgotPassword = (values: { emailForgotPassword: string }) => {
		forgotPasswordMutation.mutate({ email: values.emailForgotPassword });
	};

	return (
		<>
			<Modal
				open={open}
				title={<div className="tw-font-bold tw-text-xl">Forgot your password?</div>}
				onOk={handleOk}
				footer={<></>}
				onCancel={handleCancel}
			>
				<Form form={forgotPasswordForm} name="forgot-password-form" onFinish={onForgotPassword} layout="vertical">
					<div className="!tw-flex !tw-flex-col !tw-justify-center !tw-gap-4">
						<div className="!tw-flex !tw-w-full !tw-items-center">
							<p className="!tw-text-right !tw-w-1/4 !tw-m-0 !tw-pr-3">Enter your email:</p>
							<Form.Item
								name="emailForgotPassword"
								className="!tw-w-3/4 !tw-flex !tw-flex-col !tw-m-0 !tw-justify-center"
								rules={[{ required: true, message: 'Please input your email!' }]}
							>
								<Input type="email" disabled={forgotPasswordMutation.isLoading} />
							</Form.Item>
						</div>
						<div className="tw-w-full tw-flex tw-justify-end ">
							<Form.Item className="tw-w-3/4 ">
								<Button
									className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`}
									size="large"
									htmlType="submit"
									block
									disabled={forgotPasswordMutation.isLoading}
								>
									Submit
								</Button>
							</Form.Item>
						</div>
					</div>
				</Form>
				{forgotPasswordMutation.isSuccess && (
					<div className="tw-mt-8">
						<p className="tw-font-bold tw-text-xl">We sent you an email with reset instructions. </p>
						<p className="tw-mt-4">
							If you don't receive instructions shortly, please check your email's spam or junk folder. If this does not
							work, try re-sending your request.
							<Link href={''}>
								<a>Re-send request.</a>
							</Link>{' '}
						</p>
					</div>
				)}
			</Modal>
		</>
	);
};

export default ForgotPasswordModal;
