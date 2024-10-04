import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { jwtValidate } from '@/src/helpers/auth';
import { IResetPasswordRequest } from '@/src/interfaces/auth/auth.interface';
import { resetPassword } from '@/src/services/auth/apiAuth';
import { Button, Form, Input, Modal } from 'antd';
import { useRouter } from 'next/router';
import * as React from 'react';
import { toast } from 'react-toastify';

interface ISetNewPasswordModalProps {
	open: boolean;
	handleOk: () => void;
	handleCancel: () => void;
	token: string;
}

const SetNewPasswordModal = (props: ISetNewPasswordModalProps) => {
	const { open, handleOk, handleCancel, token } = props;
	const router = useRouter();
	const resetPasswordMutation = useMutation(resetPassword, {
		onSuccess: () => {
			toast.success('Your password is changed successfully');
			handleCancel();
			jwtValidate() && router.push(RouterConstants.DASHBOARD.path);
		},
		onError: (err) => {
			//change content in popup notify request error
			toast.error(err.data?.message);
		},
	});

	const onSetNewPassword = (values: { newPassword: string }) => {
		console.log(values.newPassword);
		const resetPasswordModal: IResetPasswordRequest = {
			token: token,
			newPassword: values.newPassword,
		};
		resetPasswordMutation.mutate(resetPasswordModal);
	};

	return (
		<>
			<Modal
				open={open}
				title={<div className="tw-font-bold tw-text-xl">Change your password</div>}
				onOk={handleOk}
				footer={<></>}
				onCancel={handleCancel}
				afterClose={() => jwtValidate() && router.push(RouterConstants.DASHBOARD.path)}
			>
				<Form name="forgot-password-form" onFinish={onSetNewPassword} layout="vertical">
					<div className="!tw-flex !tw-flex-col !tw-justify-center !tw-gap-4">
						<div className="!tw-flex !tw-w-full !tw-items-center">
							<p className="!tw-text-right !tw-w-1/4 !tw-m-0 !tw-pr-3">Enter your new password:</p>
							<Form.Item
								name="newPassword"
								className="!tw-w-3/4 !tw-flex !tw-flex-col !tw-m-0 !tw-justify-center"
								rules={[{ required: true, message: 'Please input new password!' }]}
							>
								<Input.Password disabled={resetPasswordMutation.isLoading} />
							</Form.Item>
						</div>
						<div className="tw-w-full tw-flex tw-justify-end ">
							<Form.Item className="tw-w-3/4 ">
								<Button
									className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`}
									size="large"
									htmlType="submit"
									block
									disabled={resetPasswordMutation.isLoading}
								>
									Submit
								</Button>
							</Form.Item>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default SetNewPasswordModal;
