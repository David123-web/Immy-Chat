import DashboardRoute from '@/components/routes/DashboardRoute';
import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { roundPercentage } from '@/src/helpers/number';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import {
	AvailableTime,
	CreateAvailabilityTimeRequest,
	IGetAvailableTimesResponse,
	IInviteInterviewRequest,
} from '@/src/interfaces/people/people.interface';
import { IGetUserByIdResponse } from '@/src/interfaces/user/user.interface';
import { createAvailabilityTime, getAvailabilityTimes, inviteForInterview } from '@/src/services/people/apiPeople';
import { getUserById } from '@/src/services/user/apiUser';
import { LeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Modal, Row, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AvailabilityPicker from './AvailabilityPicker';
import { useForm } from 'antd/lib/form/Form';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';

type ProfileUserProps = {
	role: ROLE_TYPE;
};

const ProfileUser = (props: ProfileUserProps) => {
	const { t } = useTranslation()
	const router = useRouter();
	const [formAvailability] = useForm<CreateAvailabilityTimeRequest>();
	const { role } = props;
	const [openInterview, setOpenInterview] = useState<boolean>(false);
	const [openAvailability, setOpenAvailability] = useState<boolean>(false);
	const [listAvailableTime, setListAvailableTime] = useState<AvailableTime[]>([]);
	const [listAvailableTimeChecked, setListAvailableTimeChecked] = useState<AvailableTime[]>([]);
	const [deleteIds, setDeleteIds] = useState<number[]>([]);

	/* ----------------------------- GET USER BY ID ----------------------------- */
	const [userData, setUserData] = useState<IGetUserByIdResponse>();
	const getUserByIdQuery = useQuery<IGetUserByIdResponse, string>(
		['IGetUserByIdResponse1'],
		() => getUserById(router.query.id as string),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setUserData(res.data);
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);
	/* ---------------------------- INVITE INTERVIEW ---------------------------- */
	const inviteInterviewMutation = useMutation<any, IInviteInterviewRequest>(inviteForInterview, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.invite_interview_success'));
		},
		onError: () => {
			toast.error(t('dashboard.notification.invite_interview_error'));
		},
	});

	/* ------------------------------ PUSH TO TABLE ----------------------------- */
	const onGetUserRoute = () => {
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

	const BoxInfo = ({ title, info }: { title: string; info: React.ReactNode }) => (
		<div className="tw-border tw-border-solid border-theme-6 tw-rounded-md">
			<div className="tw-px-2 tw-py-1 tw-border-b tw-border-t-0 tw-border-x-0 tw-border-solid border-theme-6 tw-font-bold">
				{title}
			</div>
			<div className="tw-px-2 tw-py-1 tw-capitalize tw-flex tw-flex-wrap tw-gap-y-2">{info}</div>
		</div>
	);

	const onInviteInterview = (data: IInviteInterviewRequest) => {
		inviteInterviewMutation.mutate({
			content: data.content,
			id: router.query.id as string,
		});
	};

	/* --------------------------- CREATE AVAILABILITY -------------------------- */
	const createAvailabilityTimeMutation = useMutation<any, CreateAvailabilityTimeRequest>(createAvailabilityTime, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.update_availability_success'));
			setOpenAvailability(false);
			setDeleteIds([]);
			setListAvailableTimeChecked([]);
			setListAvailableTime([]);
		},
		onError: () => {
			toast.error(t('dashboard.notification.update_availability_error'));
		},
	});
	const onFinishAvailability = (data: CreateAvailabilityTimeRequest) => {
		console.log('listAvailableTime', listAvailableTime);
		console.log('listAvailableTimeChecked', listAvailableTimeChecked);
		console.log('deleteIds', deleteIds);
		createAvailabilityTimeMutation.mutate({
			userId: router.query.id as string,
			availableTimes: listAvailableTimeChecked,
			deleteIds: deleteIds,
		});
	};

	/* -------------------------- GET AVAILABILITY TIME ------------------------- */
	const [currentDay, setCurrentDay] = useState(dayjs());
	const getAvailabilityTimesQuery = useQuery<IGetAvailableTimesResponse[]>(
		['getAvailabilityTimesQuery', currentDay],
		() =>
			getAvailabilityTimes({
				userId: router.query.id as string,
				start: currentDay.startOf('week').utc(true).toISOString(),
				end: currentDay.endOf('week').utc(true).toISOString(),
			}),
		{
			onSuccess: (res) => {
				setListAvailableTime(
					res.data.map((item) => ({
						repeat: item.repeat,
						start: item.start,
					}))
				);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	return (
		<>
			<Head>
				<title>{userData ? `${userData.profile.firstName} ${userData.profile.lastName}` : 'User Profile'}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<DashboardRoute>
				{getUserByIdQuery.isSuccess && userData ? (
					<div className="color-theme-1">
						<div className="tw-flex tw-gap-x-4 tw-items-center">
							<LeftOutlined
								onClick={() => router.push(onGetUserRoute())}
								className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-font-bold tw-text-xl"
							/>
							<Button
								className="bg-theme-6 tw-font-medium border-theme-1"
								onClick={(e) => {
									router.push(`${onGetUserRoute()}/${router.query.id}`);
								}}
							>
								{t('dashboard.button.edit')}
							</Button>
							<Button className="bg-theme-6 tw-font-medium border-theme-1" onClick={() => setOpenInterview(true)}>
								{t('dashboard.button.invite_for_interview')}
							</Button>
							<Button className="bg-theme-6 tw-font-medium border-theme-1" onClick={() => setOpenAvailability(true)}>
								{t('dashboard.button.availability')}
							</Button>
						</div>
						<div className="tw-border-b border-theme-6 tw-border-solid tw-border-x-0 tw-border-t-0 tw-text-xl tw-font-bold tw-pb-2 tw-mt-6">
							<div>{userData ? `${userData.profile.firstName} ${userData.profile.lastName}` : 'Loading...'}</div>
						</div>
						<Row className="tw-mt-4 tw-mb-6 tw-justify-between" gutter={[40, 0]}>
							<Col span={4}>
								<Avatar shape="square" className="tw-h-24 tw-w-24 tw-mt-1" src={userData.profile.avatarUrl} />
							</Col>
							<Col span={10}>
								<div>
									<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
										{t('dashboard.option.email')}:
									</span>
									<span className="tw-font-medium">{userData.email}</span>
								</div>
								<div>
									<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
										{t('dashboard.option.phone')}:
									</span>
									<span className="tw-font-medium">
										{userData.profile.dialCode}
										{userData.profile.phoneNumber}
									</span>
								</div>
								<div>
									<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
										{t('dashboard.option.location')}:
									</span>
									<span className="tw-font-medium">
										{userData.profile.state},{userData.profile.city},{userData.profile.country}
									</span>
								</div>
								<div>
									<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
										{t('dashboard.option.role')}:
									</span>
									<span className="tw-font-medium tw-capitalize">{userData.role.toLowerCase()}</span>
								</div>
								{role === ROLE_TYPE.STUDENT && (
									<>
										<div>
											<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
												{t('dashboard.option.parent_name')}:
											</span>
											<span className="tw-font-medium tw-capitalize">
												{userData.roleProfile.parentFirstName} {userData.roleProfile.parentLastName}
											</span>
										</div>
										<div>
											<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
												{t('dashboard.option.parent_phone')}:
											</span>
											<span className="tw-font-medium tw-capitalize">
												{userData.roleProfile.parentDialCode}
												{userData.roleProfile.parentPhoneNumber}
											</span>
										</div>
									</>
								)}
							</Col>
							<Col span={10}>
								<div>
									<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
										{t('dashboard.option.full_name')}:
									</span>
									<span className="tw-font-medium">
										{userData.profile.firstName} {userData.profile.lastName}
									</span>
								</div>
								<div>
									<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
										{t('dashboard.option.profile_completion')}:
									</span>
									<span className="tw-font-medium">{roundPercentage(userData.profile.profileCompletion)}%</span>
								</div>
								<div>
									<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
										{t('dashboard.option.date_created')}:
									</span>
									<span className="tw-font-medium">{dayjs(userData.createdAt).format('MMM D, YYYY')}</span>
								</div>
								{(role === ROLE_TYPE.EDITOR || role === ROLE_TYPE.CUSTOMER_SERVICE) && (
									<div>
										<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
											{t('dashboard.option.timezone')}:
										</span>
										<span className="tw-font-medium">{userData.profile.timezone}</span>
									</div>
								)}

								{role === ROLE_TYPE.STUDENT && (
									<div>
										<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
											{t('dashboard.option.amount_purchased')}:
										</span>
										<span className="tw-font-medium">${userData.roleProfile.amountPurchased ?? 0}</span>
									</div>
								)}
								{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
									<div>
										<span className="tw-text-slate-500 tw-mr-2 tw-w-40 tw-text-right tw-inline-block">
											{t('dashboard.option.amount_paid')}:
										</span>
										<span className="tw-font-medium">${userData.roleProfile.amountPaid ?? 0}</span>
									</div>
								)}
							</Col>
						</Row>
						{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
							<>
								<div className="tw-mb-6">
									<div className="tw-font-bold">{t('dashboard.label.bio')}</div>
									<div>{parse(userData.roleProfile.bio)}</div>
								</div>
								<div className="tw-mb-6">
									<div className="tw-font-bold">{t('dashboard.label.teaching_experience')}</div>
									<div>{parse(userData.roleProfile.experienceDesc)}</div>
								</div>
								<div className="tw-mb-6">
									<div className="tw-font-bold">{t('dashboard.label.qualification')}</div>
									<div>{userData.roleProfile.qualificationDesc}</div>
								</div>
							</>
						)}
						<Row
							gutter={[40, 0]}
							className={role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR ? '' : 'tw-mt-20'}
						>
							<Col span={8} className="tw-flex tw-flex-col tw-gap-y-6">
								{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
									<BoxInfo title={t('dashboard.label.hourly_rate')} info={`$${userData.roleProfile.hourRate}`} />
								)}
								<BoxInfo title={t('dashboard.label.account_status')} info={userData.status.toLowerCase()} />
							</Col>
							<Col span={8} className="tw-flex tw-flex-col tw-gap-y-6">
								{role === ROLE_TYPE.STUDENT && (
									<BoxInfo
										title={t('dashboard.label.learning_languages')}
										info={userData.roleProfile.learningLanguages.map((lang) => (
											<span key={lang.id} className="border-theme-6 tw-px-2 tw-mr-1 tw-rounded-md">
												{lang.name}
											</span>
										))}
									/>
								)}
								{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
									<>
										<BoxInfo
											title={t('dashboard.label.email_status')}
											info={userData.isVerified ? t('dashboard.option.verified') : t('dashboard.option.not_verified')}
										/>
										<BoxInfo title={t('dashboard.label.account_role')} info={userData.role.toLowerCase()} />
									</>
								)}
							</Col>
							<Col span={8} className="tw-flex tw-flex-col tw-gap-y-6">
								{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
									<BoxInfo
										title={t('dashboard.label.teaching_languages')}
										info={userData.roleProfile.teachLanguages.map((lang) => (
											<span key={lang.id} className="border-theme-6 tw-px-2 tw-mr-1 tw-rounded-md">
												{lang.name}
											</span>
										))}
									/>
								)}
								{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR || role === ROLE_TYPE.STUDENT) && (
									<BoxInfo
										title={t('dashboard.label.languages_spoken')}
										info={userData.roleProfile.languagesSpoken.map((lang) => (
											<span key={lang.code} className="border-theme-6 tw-px-2 tw-mr-1 tw-rounded-md">
												{lang.name}
											</span>
										))}
									/>
								)}
							</Col>
						</Row>
					</div>
				) : (
					<div className="tw-w-full tw-h-full tw-py-80 tw-flex tw-justify-center tw-items-center">
						<Spin size="large" />
					</div>
				)}
				<Modal
					width={700}
					open={openInterview}
					footer={[
						<div>
							<Button
								disabled={inviteInterviewMutation.isLoading}
								loading={inviteInterviewMutation.isLoading}
								className="bg-theme-5 color-theme-7 !tw-border-none"
								onClick={() => setOpenInterview(false)}
							>
								{t('dashboard.button.cancel')}
							</Button>
							<Button
								className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
								form="invite-interview"
								htmlType="submit"
								disabled={inviteInterviewMutation.isLoading}
								loading={inviteInterviewMutation.isLoading}
							>
								{t('dashboard.button.invite_for_interview')}
							</Button>
						</div>,
					]}
					destroyOnClose
					maskClosable={false}
					keyboard
					title={t('dashboard.button.invite_for_interview')}
					onCancel={() => setOpenInterview(false)}
				>
					<Form id="invite-interview" onFinish={onInviteInterview}>
						<Form.Item
							name="content"
							rules={[
								{
									required: true,
									message: t('dashboard.notification.content_must_not_be_empty'),
								},
							]}
						>
							<TextArea rows={4} placeholder="Write your own message" />
						</Form.Item>
						<div>{t('dashboard.notification.write_your_own_text_template')}</div>
					</Form>
				</Modal>
				<Modal
					centered
					title={t('dashboard.modal.teacher_availability_for_tutoring')}
					width={1200}
					open={openAvailability}
					footer={[
						<Button
							onClick={() => {
								setOpenAvailability(false);
								setDeleteIds([]);
								setListAvailableTimeChecked([]);
								setListAvailableTime([]);
							}}
							loading={createAvailabilityTimeMutation.isLoading}
							disabled={createAvailabilityTimeMutation.isLoading}
						>
							{t('dashboard.button.cancel')}
						</Button>,
						<Button
							onClick={() => {
								formAvailability.submit();
							}}
							className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
							loading={createAvailabilityTimeMutation.isLoading}
							disabled={createAvailabilityTimeMutation.isLoading}
						>
							{t('dashboard.button.save')}
						</Button>,
					]}
					destroyOnClose
					maskClosable={false}
					keyboard
					onCancel={() => {
						setOpenAvailability(false);
					}}
				>
					<Form
						id="availability"
						className="tw-w-full tw-m-auto"
						form={formAvailability}
						onFinish={onFinishAvailability}
						layout="vertical"
					>
						<AvailabilityPicker
							form={formAvailability}
							listAvailableTime={listAvailableTime}
							setListAvailableTime={setListAvailableTime}
							deleteIds={deleteIds}
							listAvailableTimeChecked={listAvailableTimeChecked}
							setDeleteIds={setDeleteIds}
							setListAvailableTimeChecked={setListAvailableTimeChecked}
							currentDay={currentDay}
							setCurrentDay={setCurrentDay}
							getAvailabilityTimesQuery={getAvailabilityTimesQuery}
						/>
					</Form>
				</Modal>
			</DashboardRoute>
		</>
	);
};

export default ProfileUser;
