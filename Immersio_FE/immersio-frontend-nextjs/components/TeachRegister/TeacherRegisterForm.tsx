import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { checkExistEmail, login } from '@/src/services/auth/apiAuth';
import { useMobXStores } from '@/src/stores';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import LoginThirdParty from '../Login/LoginThirdParty';
import { useTranslation } from 'next-i18next';

const TeacherRegisterForm = ({ title, description }) => {
	const { t } = useTranslation();
	const { authStore } = useMobXStores();
	const router = useRouter();
	const accountInfo = useRef<{ email: string; password: string }>();
	const onFinish = (data: { email: string; password: string }) => {
		accountInfo.current = data;
		checkExistEmailMutation.mutate({ email: data.email });
	};

	const checkExistEmailMutation = useMutation(checkExistEmail, {
		onSuccess: (res) => {
			console.log(res)
			if (res.data) {
				toast.error('Email is existed');
			} else {
				authStore
					.setInstructorRegisterData({
						email: accountInfo.current.email,
						password: accountInfo.current.password,
					})
					.then(() => {
						router.push(RouterConstants.TEACHER_APPLICATION.path);
					});
			}
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	return (
		<div className="container tw-px-5 md:tw-px-[12px]">
			<div className="d-flex d-flex-mobile">
				<div className="tw-hidden md:tw-block breadcrumb-teacher-register-banner flex-fill pr-80">
					<h1>{title}</h1>
					<p className="pt-15 pb-15">
						{description}
					</p>
				</div>

				<div className="breadcrumb-teacher-register-form">
					<p className="breadcrumb-teacher-register-form-title">
						{t('teach_register_form.create_account')}
					</p>
					<div className="tw-mb-4 md:tw-mb-[8px]">
						{t('teach_register_form.already_account')}{' '}
						<Link href="/login">
							<a className="color-theme-3 !tw-font-semibold">
								{t('teach_register_form.sign_in')}
							</a>
						</Link>
					</div>
					<Form name="instructor-register" onFinish={onFinish} layout="vertical" requiredMark={false}>
						<Form.Item
							name="email"
							rules={[
								{ required: true, message: t('teach_register_form.email_validation_required') },
								{ type: 'email', message: t('teach_register_form.email_validation_error') },
							]}
							label="Email"
							hasFeedback
						>
							<Input bordered={false} type="email" placeholder={t('teach_register_form.email_placeholder')} />
						</Form.Item>
						<Form.Item
							name="password"
							rules={[{ required: true, message: t('teach_register_form.phone_validation_required') }]}
							label="Password"
						>
							<Input.Password placeholder={t('teach_register_form.phone_placeholder')} bordered={false} name="password" type="password" />
						</Form.Item>
						<Form.Item>
							<Button
								className={`!tw-px-6 !tw-rounded-md tw-w-full bg-theme-5 border-theme-5`}
								size="large"
								htmlType="submit"
								type="primary"
								form="instructor-register"
							>
								{t('teach_register_form.create_btn')}
							</Button>
						</Form.Item>
					</Form>

					<div className="tw-flex tw-w-full tw-justify-between tw-items-center tw-my-6">
						<div className="tw-basis-[30%] tw-border-0 tw-border-b-[0.5px] tw-h-0 tw-border-solid border-theme-1"></div>
						<div className="">{t('teach_register_form.or_register')}</div>
						<div className="tw-basis-[30%] tw-border-0 tw-border-b-[0.5px] tw-h-0 tw-border-solid border-theme-1"></div>
					</div>
					<LoginThirdParty role={ROLE_TYPE.INSTRUCTOR} />
					<div className="tw-text-center tw-mt-4">
						<p>
							{t('teach_register_form.clicking_sign_up')}{' '}
							<a className="color-theme-3 !tw-font-semibold" href="">
								{' '}
								{t('teach_register_form.terms')}
							</a>{' '}
							{t('teach_register_form.and')}{' '}
							<a className="color-theme-3 !tw-font-semibold" href="">
								{' '}
								{t('teach_register_form.privacy')}
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherRegisterForm;
