
import { useRouter } from "next/router"; //???? cu the la gi?

import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { RouterConstants } from "../../constants/router";
import { useMutation } from "../../hooks/useMutation";
import { ROLE_TYPE } from "../../src/interfaces/auth/auth.interface";
import { register } from "../../src/services/auth/apiAuth";
import LoginThirdPartyCom from "../Login/LoginThirdParty.tsx";
import NotiModal from "../common/NotiModal";

const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpenNotiModal, setIsOpenNotiModal] = useState(false);

  const registerMutation = useMutation(register, {
    onSuccess: () => {
      setIsOpenNotiModal(true);
    },
    onError: (err) => {
      toast.error(err.data?.message);
    },
  });
  const onFinish = (data) => {
    registerMutation.mutate({
      phoneNumber: data.phoneNumber,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      role: ROLE_TYPE.STUDENT,
    });
  };

  return (
    <>
      <section className="signup__area p-relative z-index-1 pt-100 pb-145">
        <div className="sign__shape">
          <img className="man-1" src="assets/img/icon/sign/man-3.png" alt="" />
          <img
            className="man-2 man-22"
            src="assets/img/icon/sign/man-2.png"
            alt=""
          />
          <img
            className="circle"
            src="assets/img/icon/sign/circle.png"
            alt=""
          />
          <img
            className="zigzag"
            src="assets/img/icon/sign/zigzag.png"
            alt=""
          />
          <img className="dot" src="assets/img/icon/sign/dot.png" alt="" />
          <img className="bg" src="assets/img/icon/sign/sign-up.png" alt="" />
          <img
            className="flower"
            src="assets/img/icon/sign/flower.png"
            alt=""
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
              <div className="sign__wrapper bg-theme-7">
                <div className="mb-35 tw-w-full">
                  <div className="tw-text-3xl tw-font-bold tw-mb-4">
                    {t('register.title')}
                  </div>
                  <div className="text-left tw-w-full tw-px-0">
                    <p>
                      {t('register.already_account')}{" "}
                      <Link passHref legacyBehavior href="/login">
                        <a className="color-theme-3 !tw-font-semibold">
                          {t('register.sign_in')}
                        </a>
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="sign__form">
                  <Form onFinish={onFinish}>
                    <div className="mb-25">
                      <h5>{t('register.firstName_placeholder')}</h5>
                      <div className="sign___input">
                        <Form.Item
                          name="firstName"
                          rules={[
                            {
                              required: true,
                              message: t('register.firstName_validation_required'),
                            },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined />}
                            bordered={false}
                            type="text"
                            placeholder={t('register.firstName_placeholder')}
                            disabled={registerMutation.isLoading}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="mb-25">
                      <h5>{t('register.lastName_placeholder')}</h5>
                      <div className="sign___input">
                        <Form.Item
                          name="lastName"
                          rules={[
                            {
                              required: true,
                              message: t('register.lastName_validation_required'),
                            },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined />}
                            bordered={false}
                            type="text"
                            placeholder={t('register.lastName_placeholder')}
                            disabled={registerMutation.isLoading}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="mb-25">
                      <h5>{t('register.email_label')}</h5>
                      <div className="sign___input">
                        <Form.Item
                          name="email"
                          rules={[
                            {
                              required: true,
                              message: t('register.email_validation_required'),
                            },
                            {
                              type: "email",
                              message: t('register.email_validation_error'),
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            prefix={<MailOutlined />}
                            bordered={false}
                            type="email"
                            placeholder={t('register.email_placeholder')}
                            disabled={registerMutation.isLoading}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="mb-25">
                      <h5>{t('register.phone_placeholder')}</h5>
                      <div className="sign___input">
                        <Form.Item
                          name="phoneNumber"
                          rules={[
                            {
                              required: true,
                              message: t('register.phone_validation_required'),
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: t('register.phone_validation_error'),
                            },
                            {
                              max: 12,
                              message: t('register.phone_validation_error'),
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            prefix={<PhoneOutlined />}
                            bordered={false}
                            placeholder={t('register.phone_placeholder')}
                            disabled={registerMutation.isLoading}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="mb-25">
                      <h5>{t('register.password_placeholder')}</h5>
                      <div className="sign___input">
                        <Form.Item
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: t('register.password_validation_required'),
                            },
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            bordered={false}
                            type="password"
                            placeholder={t('register.password_placeholder')}
                            disabled={registerMutation.isLoading}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="mb-10">
                      <h5>{t('register.re_password_placeholder')}</h5>
                      <div className="sign___input">
                        <Form.Item
                          name="repassword"
                          rules={[
                            {
                              required: true,
                              message: t('register.password_validation_required'),
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    t('register.password_validation_not_match')
                                  )
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            bordered={false}
                            type="password"
                            placeholder={t('register.re_password_placeholder')}
                            disabled={registerMutation.isLoading}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="sign__action d-flex justify-content-between mb-30">
                      <div className="sign__agree d-flex align-items-center">
                        <input
                          required
                          className="m-check-input"
                          type="checkbox"
                          id="m-agree"
                        />
                        <label className="m-check-label" htmlFor="m-agree">
                          {t('register.i_a')} <Link href="/terms-of-service"><a>{t('register.terms')}</a></Link>
                        </label>
                      </div>
                    </div>
                    <Form.Item>
                      <button
                        disabled={registerMutation.isLoading}
                        type="submit"
                        className="tp-btn w-100"
                      >
                        {t('register.register_btn')}
                      </button>
                    </Form.Item>
                    <LoginThirdPartyCom role={ROLE_TYPE.STUDENT} />
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
        <NotiModal
          open={isOpenNotiModal}
          onCancel={() => {
            setIsOpenNotiModal(false);
            setTimeout(() => {
              router.push(RouterConstants.LOGIN.path);
            }, 1000);
          }}
          msg={t('register.noti_msg')}
          title={t('register.noti_title')}
        />
      </section>
    </>
  );
};

export default SignUp;
