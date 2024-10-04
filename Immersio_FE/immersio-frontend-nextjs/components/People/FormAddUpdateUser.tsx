import DashboardRoute from '@/components/routes/DashboardRoute';
import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import {
	EmailNotificationType,
	IAddUpdateEditorCSRequest,
	IAddUpdateStudentRequest,
	IAddUpdateTeacherRequest,
	IGetClassTagsResponse,
	IUpdateUserById,
	RECEIVED_EMAILS_OPTIONS,
	STUDENT_STATUS_OPTIONS,
	TEACHER_STATUS_OPTIONS,
	UserStatus,
} from '@/src/interfaces/people/people.interface';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { IGetUserByIdResponse, IUploadAvatarResponse } from '@/src/interfaces/user/user.interface';
import { getUserById, uploadAvatar } from '@/src/services/user/apiUser';
import { useMobXStores } from '@/src/stores';
import { beforeUploadAvatar } from '@/src/utilities/helper';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import {
	Button,
	Checkbox,
	Col,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
	Upload,
	UploadFile,
	UploadProps,
} from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CustomCKEditor from '../PaymentGateways/CustomCKEditor';
import TextArea from 'antd/lib/input/TextArea';
import { getRoleName } from '@/src/helpers/strings';
import {
	addCustomerService,
	addEditor,
	addInstructor,
	addStudent,
	addTutor,
	getClassTags,
	updateCustomerService,
	updateEditor,
	updateInstructor,
	updateStudent,
	updateTutor,
} from '@/src/services/people/apiPeople';
import { observer } from 'mobx-react-lite';
import { useQuery } from '@/hooks/useQuery';
import { useTranslation } from 'next-i18next';

type FormCreateUserProps = {
	role: ROLE_TYPE;
	isUpdate?: boolean;
};

enum StepCreateUser {
	Step1,
	Step2,
}

type DataStep1 = Omit<IAddUpdateTeacherRequest, 'qualificationDesc' | 'experienceDesc' | 'bio'> &
	Pick<IAddUpdateStudentRequest, 'learningLanguages'> &
	Pick<IAddUpdateEditorCSRequest, 'emailNotificationOptions'>;

type DataAddUpdateTeacherStep2 = Pick<IAddUpdateTeacherRequest, 'qualificationDesc' | 'experienceDesc' | 'bio'>;
type DataAddUpdateStudentStep2 = Pick<
	IAddUpdateStudentRequest,
	'parentDialCode' | 'parentEmail' | 'parentFirstName' | 'parentLastName' | 'parentPhoneNumber'
>;

const FormAddUpdateUser = (props: FormCreateUserProps) => {
	const { t } = useTranslation()
	const { role, isUpdate = false } = props;
	const router = useRouter();
	const { globalStore } = useMobXStores();
	const [formDataStep1] = Form.useForm<DataStep1>();
	const [formAddUpdateTeacherStep2] = Form.useForm<DataAddUpdateTeacherStep2>();
	const [formAddUpdateStudentStep2] = Form.useForm<DataAddUpdateStudentStep2>();

	/* ------------------------------ STORAGE DATA ----------------------------- */
	const [storageData, setStorageData] = useState<DataStep1>();
	const [stepCreateUser, setStepCreateUser] = useState<StepCreateUser>(StepCreateUser.Step1);

	/* --------------------------- ADD UPDATE TEACHER --------------------------- */
	const createTeacherMutation = useMutation<any, IAddUpdateTeacherRequest>(
		role === ROLE_TYPE.INSTRUCTOR ? addInstructor : addTutor,
		{
			onSuccess: () => {
				toast.success(t('dashboard.notification.add_row_success'));
				formDataStep1.resetFields();
				formAddUpdateTeacherStep2.resetFields();
			},
			onError: (err) => {
				toast.error(err.data?.message || t('dashboard.notification.add_row_error'));
			},
		}
	);

	const updateTeacherMutation = useMutation<any, IUpdateUserById<IAddUpdateTeacherRequest>>(
		role === ROLE_TYPE.INSTRUCTOR ? updateInstructor : updateTutor,
		{
			onSuccess: () => {
				toast.success(t('dashboard.notification.update_row_success'));
			},
			onError: (err) => {
				toast.error(err.data?.message || t('dashboard.notification.update_row_error'));
			},
		}
	);

	const onAddUpdateTeacher = (data: DataAddUpdateTeacherStep2) => {
		if (isUpdate) {
			updateTeacherMutation.mutate({
				data: {
					...data,
					...storageData,
				},
				id: router.query.id as string,
			});
		} else {
			createTeacherMutation.mutate({
				...data,
				...storageData,
			});
		}
	};

	/* --------------------------- ADD UPDATE STUDENT --------------------------- */
	const createStudentMutation = useMutation<any, IAddUpdateStudentRequest>(addStudent, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.add_row_success'));
			formDataStep1.resetFields();
			formAddUpdateStudentStep2.resetFields();
		},
		onError: (err) => {
			toast.error(err.data?.message || t('dashboard.notification.add_row_error'));
		},
	});

	const updateStudentMutation = useMutation<any, IUpdateUserById<IAddUpdateStudentRequest>>(updateStudent, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.update_row_success'));
		},
		onError: (err) => {
			toast.error(err.data?.message || t('dashboard.notification.update_row_error'));
		},
	});

	const onAddUpdateStudent = (data: DataAddUpdateStudentStep2) => {
		if (isUpdate) {
			updateStudentMutation.mutate({
				data: {
					...data,
					...storageData,
				},
				id: router.query.id as string,
			});
		} else {
			createStudentMutation.mutate({
				...data,
				...storageData,
			});
		}
	};

	/* ------------------------ ADD UPDATE EDITOR AND CS ------------------------ */
	const createEditorAndCSMutation = useMutation<any, IAddUpdateEditorCSRequest>(
		role === ROLE_TYPE.CUSTOMER_SERVICE ? addCustomerService : addEditor,
		{
			onSuccess: () => {
				toast.success(t('dashboard.notification.add_row_success'));
				formDataStep1.resetFields();
			},
			onError: (err) => {
				toast.error(
					err.data?.message || t('dashboard.notification.add_row_error')
				);
			},
		}
	);

	const updateEditorCSMutation = useMutation<any, IUpdateUserById<IAddUpdateEditorCSRequest>>(
		role === ROLE_TYPE.CUSTOMER_SERVICE ? updateCustomerService : updateEditor,
		{
			onSuccess: () => {
				toast.success(t('dashboard.notification.update_row_success'));
			},
			onError: (err) => {
				toast.error(
					err.data?.message || t('dashboard.notification.update_row_error')
				);
			},
		}
	);

	const onSubmitDataStep1 = (data: DataStep1) => {
		if (role === ROLE_TYPE.EDITOR || role === ROLE_TYPE.CUSTOMER_SERVICE) {
			if (isUpdate) {
				updateEditorCSMutation.mutate({
					data,
					id: router.query.id as string,
				});
			} else {
				createEditorAndCSMutation.mutate(data);
			}
		} else {
			setStorageData(data);
			setStepCreateUser(StepCreateUser.Step2);
		}
	};

	/* ----------------------------- GET USER BY ID ----------------------------- */
	const [userData, setUserData] = useState<IGetUserByIdResponse>();
	const getUserByIdQuery = useQuery<IGetUserByIdResponse, string>(
		['IGetUserByIdResponsexxx'],
		() => getUserById(router.query.id as string),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setUserData(res.data);
				const { profile, roleProfile, email, status, classTags } = res.data;
				const {
					firstName,
					address,
					avatarUrl,
					city,
					country,
					dialCode,
					lastName,
					phoneNumber,
					state,
					timezone,
					zipCode,
				} = profile;
				const {
					learningLanguages,
					hourRate,
					teachLanguages,
					languagesSpoken,
					bio,
					qualificationDesc,
					experienceDesc,
					parentDialCode,
					parentEmail,
					parentFirstName,
					parentLastName,
					parentPhoneNumber,
					emailNotificationOptions,
				} = roleProfile;
				formDataStep1.setFieldsValue({
					firstName: firstName ? firstName : '',
					lastName: lastName ? lastName : '',
					email,
					dialCode,
					phoneNumber,
					hourRate,
					teachLanguages: teachLanguages ? teachLanguages.map((value) => value.id) : [],
					languageCodes: languagesSpoken ? languagesSpoken.map((value) => value.code) : [],
					learningLanguages: learningLanguages ? learningLanguages.map((item) => item.id) : [],
					address,
					avatarUrl,
					city,
					country,
					emailNotificationOptions: emailNotificationOptions ?? [],
					state,
					status,
					timezone,
					zipCode,
					classTagIds: classTags.map((item) => item.id),
				});
				formAddUpdateTeacherStep2.setFieldsValue({
					bio,
					experienceDesc,
					qualificationDesc,
				});
				formAddUpdateStudentStep2.setFieldsValue({
					parentDialCode,
					parentEmail,
					parentFirstName,
					parentLastName,
					parentPhoneNumber,
				});
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);

	/* ------------------------------ UPLOAD AVATAR ----------------------------- */
	const uploadFileMutation = useMutation<IUploadAvatarResponse, any>(uploadAvatar, {
		onSuccess: (res) => {
			formDataStep1.setFieldValue('avatarUrl', res.data.avatarUrl);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === 'uploading') {
			return;
		}
		const formData = new FormData();
		formData.append('file', info.file.originFileObj as any);
		uploadFileMutation.mutate(formData);
	};

	/* ------------------------------ PUSH TO TABLE ----------------------------- */
	const onPushUserRoute = () => {
		switch (role) {
			case ROLE_TYPE.STUDENT:
				return router.push(RouterConstants.DASHBOARD_PEOPLE_STUDENT.path);
			case ROLE_TYPE.INSTRUCTOR:
				return router.push(RouterConstants.DASHBOARD_PEOPLE_INSTRUCTOR.path);
			case ROLE_TYPE.TUTOR:
				return router.push(RouterConstants.DASHBOARD_PEOPLE_TUTOR.path);
			case ROLE_TYPE.EDITOR:
				return router.push(RouterConstants.DASHBOARD_PEOPLE_EDITOR.path);
			case ROLE_TYPE.CUSTOMER_SERVICE:
				return router.push(RouterConstants.DASHBOARD_PEOPLE_CUSTOMER_SERVICE.path);
			default:
				return null;
		}
	};

	/* ------------------------------ GET CLASS TAG ----------------------------- */
	const [listClassTag, setListClassTag] = useState<IGetClassTagsResponse>({
		data: [],
		total: 0,
	});
	useQuery<IGetClassTagsResponse>(['getClassTagsQuery2231212'], () => getClassTags(), {
		onSuccess: (res) => {
			setListClassTag(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* --------------------------------- LOADING -------------------------------- */
	const isLoadingMutation =
		updateTeacherMutation.isLoading ||
		createTeacherMutation.isLoading ||
		createStudentMutation.isLoading ||
		updateTeacherMutation.isLoading ||
		updateStudentMutation.isLoading;

	return (
		<>
			<Head>
				<title>
					{isUpdate ? 'Update' : 'Add'} || {getRoleName(role)}
				</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<DashboardRoute>
				<div
					onClick={() => onPushUserRoute()}
					className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-font-bold tw-text-xl"
				>
					<LeftOutlined className="tw-mr-4" />
					{getUserByIdQuery.isFetching
						? 'Loading...'
						: userData
						? `${userData.profile?.firstName} ${userData.profile?.lastName}`
						: `${t('dashboard.button.add')} ${getRoleName(role)}`}
				</div>
				{/* ------------------------------- FORM STEP 1 ------------------------------ */}
				<div className={stepCreateUser === StepCreateUser.Step1 ? 'tw-block' : 'tw-hidden'}>
					<Form
						id="formCreateUser"
						className="tw-w-2/3 tw-m-auto tw-mt-4"
						onFinish={onSubmitDataStep1}
						form={formDataStep1}
						layout="vertical"
					>
						<Row gutter={[24, 24]}>
							<Col span={12}>
								<Form.Item
									name="firstName"
									label={t('dashboard.label.first_name')}
									rules={[
										{
											required: true,
											message: t('dashboard.notification.firstName_validation_required'),
										},
									]}
								>
									<Input placeholder={t('dashboard.placeholder.enter_first_name')} />
								</Form.Item>
								<Form.Item
									name="email"
									label={t('dashboard.option.email')}
									rules={[
										{
											required: true,
											message: t('dashboard.notification.email_validation_required'),
										},
									]}
								>
									<Input disabled={isUpdate} type="email" placeholder={t('dashboard.placeholder.enter_email')} />
								</Form.Item>
								{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
									<>
										<Form.Item
											name="hourRate"
											label={t('dashboard.label.hourly_rate')}
											rules={[
												{
													required: true,
													message: t('dashboard.notification.please_input_your_hourly_rate'),
												},
											]}
										>
											<InputNumber<string>
												className="tw-w-full"
												formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
												style={{ width: '100%' }}
												min="0"
												step="0.01"
												stringMode
												parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
											/>
										</Form.Item>
										<Form.Item
											name="languageCodes"
											label={t('dashboard.label.languages_spoken')}
											rules={[
												{
													required: true,
													message: t('dashboard.notification.please_input_your_languages'),
												},
											]}
										>
											<Select
												mode="multiple"
												showSearch
												placeholder={t('dashboard.placeholder.select_your_language')}
												filterOption={(input, option) =>
													(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
												}
												options={globalStore.courseLanguages.map((la) => ({
													value: la.code,
													label: la.name,
												}))}
											/>
										</Form.Item>
									</>
								)}
								<Form.Item
									initialValue={
										role === ROLE_TYPE.STUDENT ? STUDENT_STATUS_OPTIONS[0].value : TEACHER_STATUS_OPTIONS[0].value
									}
									name="status"
									label={t('dashboard.label.account_status')}
								>
									<Select options={role === ROLE_TYPE.STUDENT ? STUDENT_STATUS_OPTIONS : TEACHER_STATUS_OPTIONS} />
								</Form.Item>
								<Form.Item
									name="avatarUrl"
									label={t('dashboard.label.avatar')}
									rules={[
										{
											required: true,
											message: t('dashboard.notification.please_input_your_avatar'),
										},
									]}
								>
									<Upload name="avatar" beforeUpload={beforeUploadAvatar} onChange={handleChange}>
										<Button icon={<UploadOutlined />}>{t('dashboard.button.upload_avatar')}</Button>
									</Upload>
								</Form.Item>
								{role === ROLE_TYPE.STUDENT && (
									<Form.Item
										name="learningLanguages"
										label={t('dashboard.label.language_learning')}
										rules={[
											{
												required: true,
												message: t('dashboard.notification.please_input_your_languages'),
											},
										]}
									>
										<Select
											showSearch
											placeholder={t('dashboard.placeholder.select_your_language')}
											filterOption={(input, option) =>
												(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
											}
											options={globalStore.courseLanguages.map((la) => ({
												value: la.id,
												label: la.name,
											}))}
											mode="multiple"
										/>
									</Form.Item>
								)}
								<Form.Item name="zipCode" label={t('dashboard.label.zip_code_postcode')}>
									<Input placeholder={t('dashboard.placeholder.enter_a_zip_code_portal_code')} />
								</Form.Item>
								<Form.Item name="state" label={t('dashboard.label.state')}>
									<Input placeholder={t('dashboard.placeholder.enter_a_state')} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name="lastName"
									label={t('dashboard.label.last_name')}
									rules={[
										{
											required: true,
											message: t('dashboard.notification.lastName_validation_required'),
										},
									]}
								>
									<Input placeholder={t('dashboard.placeholder.enter_last_name')} />
								</Form.Item>

								<Form.Item label={t('dashboard.label.phone_number')}>
									<Space.Compact className="tw-w-full">
										<Form.Item
											initialValue={globalStore.listCountries[0].dialCode}
											className="!tw-mb-0"
											name="dialCode"
										>
											<Select
												options={globalStore.listCountries.map((item) => ({
													label: `${item.emoji} ${item.dialCode}`,
													value: item.dialCode,
												}))}
												className="!tw-w-24"
												showSearch
												filterOption={(input, option) =>
													(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
												}
											/>
										</Form.Item>
										<Form.Item
											rules={[
												{
													pattern: /^[0-9]*$/,
													message: t('dashboard.notification.phone_number_is_not_valid'),
												},
												{
													max: 12,
													message: t('dashboard.notification.phone_number_is_not_valid'),
												},
											]}
											className="!tw-mb-0 tw-w-full"
											name="phoneNumber"
										>
											<Input placeholder={t('dashboard.placeholder.enter_phone_number')} />
										</Form.Item>
									</Space.Compact>
								</Form.Item>
								{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
									<>
										<Form.Item
											name="teachLanguages"
											label={t('dashboard.label.language_teaching')}
											rules={[
												{
													required: true,
													message: t('dashboard.notification.please_input_your_languages'),
												},
											]}
										>
											<Select
												showSearch
												placeholder={t('dashboard.placeholder.select_your_language')}
												filterOption={(input, option) =>
													(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
												}
												options={globalStore.courseLanguages.map((la) => ({
													value: la.id,
													label: la.name,
												}))}
												mode="multiple"
											/>
										</Form.Item>
										{/* <Form.Item
											name="proficiencyLevelCode"
											label="Level"
											rules={[
												{
													required: true,
													message: 'Please select your level!',
												},
											]}
										>
											<Select
												showSearch
												placeholder="Select your level of proficiency"
												filterOption={(input, option) =>
													(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
												}
												options={globalStore.proficiencyLevels.map((p) => ({
													value: p.code,
													label: p.name,
												}))}
											/>
										</Form.Item> */}
									</>
								)}
								{role !== ROLE_TYPE.EDITOR && (
									<Form.Item
										name="classTagIds"
										label={t('dashboard.title.class_tags')}
										rules={[{ required: true, message: t('dashboard.notification.please_select_class_tags') }]}
									>
										<Select
											options={listClassTag.data.map((item) => ({
												label: item.name,
												value: item.id,
											}))}
											mode="multiple"
											showSearch
											placeholder={t('dashboard.placeholder.select_class_tag')}
											filterOption={(input, option) =>
												(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
											}
										/>
									</Form.Item>
								)}
								<Form.Item initialValue={globalStore.timezone[0].value} name="timezone" label={t('dashboard.option.timezone')}>
									<Select
										options={globalStore.timezone.map((item) => ({
											label: item.text,
											value: item.value,
										}))}
									/>
								</Form.Item>

								<Form.Item name="address" label={t('dashboard.label.address')}>
									<Input placeholder={t('dashboard.placeholder.enter_an_address')} />
								</Form.Item>
								{role === ROLE_TYPE.STUDENT && (
									<Form.Item
										name="languageCodes"
										label={t('dashboard.label.languages_spoken')}
										rules={[
											{
												required: true,
												message: t('dashboard.notification.please_input_your_languages'),
											},
										]}
									>
										<Select
											mode="multiple"
											showSearch
											placeholder={t('dashboard.placeholder.select_your_language')}
											filterOption={(input, option) =>
												(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
											}
											options={globalStore.courseLanguages.map((la) => ({
												value: la.code,
												label: la.name,
											}))}
										/>
									</Form.Item>
								)}
								<Form.Item name="city" label={t('dashboard.label.city')}>
									<Input placeholder={t('dashboard.placeholder.enter_a_city')} />
								</Form.Item>
								<Form.Item name="country" label={t('dashboard.label.country')}>
									<Select
										showSearch
										placeholder={t('dashboard.placeholder.select_a_country')}
										filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
										options={globalStore.listCountries.map((la) => ({
											value: la.code,
											label: la.name,
										}))}
									/>
								</Form.Item>
							</Col>
						</Row>
						{(role === ROLE_TYPE.CUSTOMER_SERVICE || role === ROLE_TYPE.EDITOR) && (
							<Form.Item label={t('dashboard.label.received_emails')} name="emailNotificationOptions" isList>
								<Checkbox.Group className="tw-flex tw-flex-col" options={RECEIVED_EMAILS_OPTIONS} />
							</Form.Item>
						)}

						<Button
							className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`}
							size="large"
							htmlType="submit"
							disabled={createEditorAndCSMutation.isLoading || updateEditorCSMutation.isLoading}
							loading={createEditorAndCSMutation.isLoading || updateEditorCSMutation.isLoading}
						>
							{role === ROLE_TYPE.CUSTOMER_SERVICE || role === ROLE_TYPE.EDITOR ? t('dashboard.button.save') : t('dashboard.button.next')}
						</Button>
					</Form>
				</div>
				{/* ------------------------------- FORM STEP 2 ------------------------------ */}
				<div className={stepCreateUser === StepCreateUser.Step2 ? 'tw-block' : 'tw-hidden'}>
					{(role === ROLE_TYPE.INSTRUCTOR || role === ROLE_TYPE.TUTOR) && (
						<Form
							className="tw-w-2/3 tw-m-auto tw-mt-4"
							onFinish={onAddUpdateTeacher}
							form={formAddUpdateTeacherStep2}
							layout="vertical"
							id="formStep2"
						>
							<Form.Item
								name="qualificationDesc"
								rules={[
									{
										required: true,
										message: t('dashboard.notification.please_provide_a_qualification_description'),
									},
									{
										max: 150,
										message: t('dashboard.notification.the_qualification_description_should_not_exceed_150_characters'),
									},
								]}
								label="Qualification"
							>
								<TextArea
									placeholder={t('dashboard.placeholder.list_out_all_the_qualifications')}
									rows={4}
								/>
							</Form.Item>
							<div className="tw-mb-4">{t('dashboard.label.to_be_verified_by_out_administrator')}</div>
							<Form.Item
								name="experienceDesc"
								label={t('dashboard.label.teaching_experience')}
								rules={[
									{
										required: true,
										message: t('dashboard.notification.please_provide_a_experience_description'),
									},
									{
										max: 150,
										message: t('dashboard.notification.the_experience_description_should_not_exceed_150_characters'),
									},
								]}
							>
								<CustomCKEditor
									initialContent={userData?.roleProfile ? userData.roleProfile.experienceDesc : ''}
									form={formAddUpdateTeacherStep2}
									name="experienceDesc"
								/>
							</Form.Item>
							<Form.Item
								name="bio"
								label={t('dashboard.label.bio')}
								rules={[
									{
										required: true,
										message: t('dashboard.notification.please_provide_a_bio_description'),
									},
									{
										max: 150,
										message: t('dashboard.notification.the_bio_description_should_not_exceed_150_characters'),
									},
								]}
							>
								<CustomCKEditor
									initialContent={userData?.roleProfile ? userData.roleProfile.bio : ''}
									form={formAddUpdateTeacherStep2}
									name="bio"
								/>
							</Form.Item>
						</Form>
					)}
					{role === ROLE_TYPE.STUDENT && (
						<Form
							className="tw-w-2/3 tw-m-auto tw-mt-4"
							onFinish={onAddUpdateStudent}
							form={formAddUpdateStudentStep2}
							id="formStep2"
							layout="vertical"
						>
							<Row gutter={[24, 24]}>
								<Col span={12}>
									<Form.Item name="parentFirstName" label={t('dashboard.option.parent_first_name')}>
										<Input placeholder={t('dashboard.placeholder.enter_parent_first_name')} />
									</Form.Item>
									<Form.Item name="parentEmail" label={t('dashboard.option.parent_email')}>
										<Input type="email" placeholder={t('dashboard.placeholder.enter_parent_email')} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item name="parentLastName" label={t('dashboard.option.parent_last_name')}>
										<Input placeholder={t('dashboard.placeholder.enter_parent_last_name')} />
									</Form.Item>
									<Form.Item label={t('dashboard.option.parent_phone')}>
										<Space.Compact className="tw-w-full">
											<Form.Item
												initialValue={globalStore.listCountries[0].dialCode}
												className="!tw-mb-0"
												name="parentDialCode"
											>
												<Select
													options={globalStore.listCountries.map((item) => ({
														label: `${item.emoji} ${item.dialCode}`,
														value: item.dialCode,
													}))}
													className="!tw-w-24"
													showSearch
													filterOption={(input, option) =>
														(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
													}
												/>
											</Form.Item>
											<Form.Item
												rules={[
													{
														pattern: /^[0-9]*$/,
														message: t('dashboard.notification.phone_number_is_not_valid'),
													},
												]}
												className="!tw-mb-0 tw-w-full"
												name="parentPhoneNumber"
											>
												<Input placeholder={t('dashboard.placeholder.enter_parent_phone')} />
											</Form.Item>
										</Space.Compact>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					)}
					<div className="tw-w-2/3 tw-m-auto">
						<Button
							className="!tw-px-6 !tw-rounded-md color-theme-1 bg-theme-6 tw-mr-8"
							size="large"
							type="default"
							onClick={() => {
								setStepCreateUser(StepCreateUser.Step1);
							}}
							disabled={isLoadingMutation}
							loading={isLoadingMutation}
						>
							{t('dashboard.button.back')}
						</Button>
						<Button
							form="formStep2"
							className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`}
							size="large"
							htmlType="submit"
							disabled={isLoadingMutation}
							loading={isLoadingMutation}
						>
							{t('dashboard.button.save')}
						</Button>
					</div>
				</div>
			</DashboardRoute>
		</>
	);
};

export default observer(FormAddUpdateUser);
