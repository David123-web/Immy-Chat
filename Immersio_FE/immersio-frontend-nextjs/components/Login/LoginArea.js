import { authStore } from '@/src/stores/auth/auth.store';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { setCookie } from 'cookies-next';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { RouterConstants } from '../../constants/router';
import { useMutation } from '../../hooks/useMutation';
import { QUERY_KEYS } from '../../hooks/useQuery';
import { ROLE_TYPE } from '../../src/interfaces/auth/auth.interface';
import { login } from '../../src/services/auth/apiAuth.ts';
import NotiModal from '../common/NotiModal';
import ForgotPasswordModal from './ForgotPasswordModal.tsx';
import LoginThirdParty from './LoginThirdParty.tsx';
import { useTranslation } from 'next-i18next';

const LoginArea = () => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isOpenForgotPasswordModal, setIsOpenForgotPasswordModal] = useState(false);
	const [isOpenNotiModal, setIsOpenNotiModal] = useState(false);

	const onSubmit = (data) => {
		loginMutation.mutate({ email: email, password: password });
	};

	const loginMutation = useMutation(login, {
		onSuccess: (res) => {
			const loginResponse = res.data;
			setCookie('accessToken', loginResponse.accessToken);
			authStore.setIsLoginSuccess(true);
			if (loginResponse.roleProfile?.id) {
				if ([ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR].includes(loginResponse.role)) {
					router.push(RouterConstants.DASHBOARD.path);
				} else if (loginResponse.role == ROLE_TYPE.STUDENT) {
					router.push(RouterConstants.DASHBOARD_MY_SPACE.path);
				} else {
					router.push(RouterConstants.DASHBOARD.path);
				}
			}
			queryClient.invalidateQueries(QUERY_KEYS.GET_ME);
		},
		onError: (err) => {
			if (err.data?.statusCode == 403) {
				setIsOpenNotiModal(true);
			} else {
				toast.error('Login failed');
			}
		},
	});

	return (
		<>
			<section className="signup__area p-relative z-index-1 pt-100 pb-145">
				<div className="sign__shape">
					<img className="man-1" src="assets/img/icon/sign/man-1.png" alt="" />
					<img className="man-2" src="assets/img/icon/sign/man-2.png" alt="" />
					<img className="circle" src="assets/img/icon/sign/circle.png" alt="" />
					<img className="zigzag" src="assets/img/icon/sign/zigzag.png" alt="" />
					<img className="dot" src="assets/img/icon/sign/dot.png" alt="" />
					<img className="bg" src="assets/img/icon/sign/sign-up.png" alt="" />
				</div>
				<div className="container">
					<div className="row">
						<div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
							<div className="sign__wrapper bg-theme-7">
								<div className="mb-35 position-relative tw-w-full">
									<div className="tw-text-3xl tw-font-bold tw-mb-4">
										{t('login.login_email')}
									</div>
									<div className="text-left tw-w-full tw-px-0">
										<p>
											<Link href="/register" passHref legacyBehavior>
												<a className="color-theme-3 !tw-font-semibold">
													{t('login.sign_up_student')}
												</a>
											</Link>{' '}
											{t('login.or')}{' '}
											<Link href="/teach" passHref legacyBehavior>
												<a className="color-theme-3 !tw-font-semibold">
													{t('login.sign_up_instructor')}
												</a>
											</Link>
										</p>
									</div>
								</div>

								<div className="sign__form">
									<Form name="basic" onFinish={onSubmit}>
										<div className="mb-25">
											<h5>{t('login.email_label')}</h5>
											<div className="sign___input">
												<Form.Item
													name="email"
													rules={[
														{
															required: true,
															message: t('login.email_validation_required'),
														},
														{
															type: 'email',
															message: t('login.email_validation_error'),
														},
													]}
													hasFeedback
												>
													<Input
														prefix={<MailOutlined />}
														bordered={false}
														type="email"
														placeholder={t('login.email_placeholder')}
														onChange={(e) => setEmail(e.target.value)}
														disabled={loginMutation.isLoading}
													/>
												</Form.Item>
											</div>
										</div>
										<div className="sign__input-wrapper mb-10">
											<h5>{t('login.password_placeholder')}</h5>

											<div className="sign___input">
												<Form.Item
													name="password"
													rules={[
														{
															required: true,
															message: t('login.password_validation_required'),
														},
													]}
												>
													<Input.Password
														prefix={<LockOutlined />}
														bordered={false}
														type="password"
														placeholder={t('login.password_placeholder')}
														onChange={(e) => setPassword(e.target.value)}
														disabled={loginMutation.isLoading}
													/>
												</Form.Item>
											</div>
										</div>
										<div className="sign__action d-sm-flex justify-content-between mb-30">
											<div className="sign__agree d-flex align-items-center">
												<input className="m-check-input" type="checkbox" id="m-agree" />
												<label className="m-check-label" htmlFor="m-agree">
													{t('login.remember_me')}
												</label>
											</div>
											<div className="sign__forgot">
												<button
													style={{
														cursor: 'pointer',
														background: 'transparent',
													}}
													type="button"
													onClick={() => {
														setIsOpenForgotPasswordModal(true);
													}}
												>
													{t('login.forgot_password')}
												</button>
											</div>
										</div>
										<Form.Item>
											<button disabled={loginMutation.isLoading} className="tp-btn  w-100" type="submit">
												{t('login.login_btn')}
											</button>
										</Form.Item>
										<div className="tw-flex tw-w-full tw-justify-between tw-items-center tw-my-6">
											<div className="tw-basis-1/3 tw-border-0 tw-border-b-[0.5px] tw-h-0 tw-border-solid border-theme-1"></div>
											<div className="">{t('teach_register_form.or_login')}</div>
											<div className="tw-basis-1/3 tw-border-0 tw-border-b-[0.5px] tw-h-0 tw-border-solid border-theme-1"></div>
										</div>
										<LoginThirdParty role={ROLE_TYPE.STUDENT} />
										<div className="sign__new text-center mt-20">
											<p>
												{t('teach_register_form.clicking_sign_up')}{' '}
												<Link href="/terms-of-service">
													<a>{t('teach_register_form.terms')}</a>
												</Link>{' '}
												{t('teach_register_form.and')}{' '}
												<Link href="/privacy-and-policy">
													<a>{t('teach_register_form.privacy')}</a>
												</Link>{' '}
											</p>
										</div>
									</Form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<ForgotPasswordModal
				open={isOpenForgotPasswordModal}
				handleOk={() => {}}
				handleCancel={() => {
					setIsOpenForgotPasswordModal(false);
				}}
			/>

			<NotiModal
				open={isOpenNotiModal}
				onCancel={() => {
					setIsOpenNotiModal(false);
				}}
				msg={t('login.noti_msg')}
				title={t('login.noti_title')}
			/>
		</>
	);
};

export default observer(LoginArea);
