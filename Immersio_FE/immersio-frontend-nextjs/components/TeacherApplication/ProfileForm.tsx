import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { IRegisterTeacherRequest, ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { IPostProfileTeacher, IUploadAvatarResponse } from '@/src/interfaces/user/user.interface';
import { registerTeacher } from '@/src/services/auth/apiAuth';
import { postProfileTeacher, uploadAvatar } from '@/src/services/user/apiUser';
import { useMobXStores } from '@/src/stores';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, message, Spin, Upload } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import NotiModal from '../common/NotiModal';
import { ITeacherSubForm } from './AboutForm';
import { beforeUploadAvatar } from '@/src/utilities/helper';

interface IProfileForm extends ITeacherSubForm {
	storageData: IPostProfileTeacher & {dialCode: string};
	setLoading: (loading: boolean) => void;
}

const ProfileForm = (props: IProfileForm) => {
	const router = useRouter();
	const { authStore } = useMobXStores();

	const [loadingUploadImg, setLoadingUploadImg] = useState(false);
	const [imageUrlPreview, setImageUrlPreview] = useState<string>();
	const [avatarUrl, setAvatarUrl] = useState<string>();
	const [isOpenNotiModal, setIsOpenNotiModal] = useState<boolean>(false);

	const getBase64 = (img: RcFile, callback: (url: string) => void) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result as string));
		reader.readAsDataURL(img);
	};

	const uploadFileMutation = useMutation<IUploadAvatarResponse, any>(uploadAvatar, {
		onSuccess: (res) => {
			setAvatarUrl(res.data.avatarUrl);
		},
		onError: (err) => {
			setImageUrlPreview(undefined);
			toast.error(err.data?.message);
		},
		onSettled: () => {
			props.setLoading(false);
			setLoadingUploadImg(false);
		},
	});

	const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === 'uploading') {
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(info.file.originFileObj);
		getBase64(info.file.originFileObj as RcFile, (url) => {
			setImageUrlPreview(url);
		});

		const formData = new FormData();
		formData.append('file', info.file.originFileObj as any);
		uploadFileMutation.mutate(formData);
		setLoadingUploadImg(true);
		props.setLoading(true);
	};

	const uploadButton = (
		<div>
			{loadingUploadImg ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	const registerTeacherMutation = useMutation<any, IRegisterTeacherRequest>(registerTeacher, {
		onSuccess: () => {
			setIsOpenNotiModal(true);
		},
		onError: (err) => {
			setImageUrlPreview(undefined);
			toast.error(err.data?.message);
		},
		onSettled: () => props.setLoading(false),
	});

	const updateInstructorProfileMutation = useMutation<any, IPostProfileTeacher>(postProfileTeacher, {
		onSuccess: () => {
			router.push(RouterConstants.DASHBOARD.path);
		},
		onError: (err) => {
			setImageUrlPreview(undefined);
			toast.error(err.data?.message);
		},
		onSettled: () => props.setLoading(false),
	});

	const onFinish = (data: IPostProfileTeacher) => {
		const {
			experienceDesc,
			firstName,
			languageCodes,
			lastName,
			phoneNumber,
			qualificationDesc,
			// relatedMaterialDesc,
			role,
			teachLanguages,
			website,
			dialCode,
			hourRate,
		} = props.storageData;
		props.setStorageData((prev) => ({ ...prev, ...data }));
		registerTeacherMutation.mutate({
			bio: data.bio,
			experienceDesc,
			firstName,
			languageCodes,
			lastName,
			qualificationDesc,
			// relatedMaterialDesc,
			role: role,
			teachLanguages,
			avatarUrl,
			hourRate,
			phoneNumber,
			title: null,
			website,
			email: authStore.instructorRegisterData.email,
			password: authStore.instructorRegisterData.password,
			dialCode
		});
		props.setLoading(registerTeacherMutation.isLoading);
		// if (authStore.instructorRegisterData?.email) {
		// } else {
		// 	updateInstructorProfileMutation.mutate({
		// 		bio: data.bio,
		// 		// countryCode,
		// 		experienceDesc,
		// 		firstName,
		// 		languageCodes,
		// 		lastName,
		// 		proficiencyLevelCode,
		// 		qualificationDesc,
		// 		relatedMaterialDesc,
		// 		role,
		// 		teachLanguages,
		// 		avatarUrl,
		// 		hourRate: null,
		// 		phoneNumber: phoneNumber ? phoneNumber.toString() : null,
		// 		title: null,
		// 		website,
		// 	});
		// 	props.setLoading(updateInstructorProfileMutation.isLoading);
		// }
	};

	return (
		<>
			<Form layout="vertical" form={props.formInstance} onFinish={onFinish}>
				<Form.Item name="avatarUrl" label="Upload your photo">
					<Upload
						name="avatar"
						listType="picture-card"
						className="avatar-uploader"
						showUploadList={false}
						beforeUpload={beforeUploadAvatar}
						onChange={handleChange}
						disabled={
							registerTeacherMutation.isLoading ||
							uploadFileMutation.isLoading ||
							updateInstructorProfileMutation.isLoading
						}
					>
						{imageUrlPreview ? (
							<div className="tw-w-full tw-h-full tw-relative">
								<img src={imageUrlPreview} alt="avatar" className="tw-w-full tw-h-full tw-object-contain" />
								{uploadFileMutation.isLoading && (
									<div className="tw-w-full tw-h-full tw-absolute tw-top-0 tw-left-0 bg-theme-7 tw-opacity-50 tw-flex tw-justify-center tw-items-center">
										<Spin />
									</div>
								)}
							</div>
						) : (
							uploadButton
						)}
					</Upload>
				</Form.Item>
				<Form.Item
					rules={[
						{
							required: true,
						},
					]}
					name="bio"
					label="Describe who you are"
				>
					<TextArea
						disabled={
							registerTeacherMutation.isLoading ||
							uploadFileMutation.isLoading ||
							updateInstructorProfileMutation.isLoading
						}
						rows={8}
					/>
				</Form.Item>
			</Form>
			<NotiModal
				open={isOpenNotiModal}
				onCancel={() => {
					setIsOpenNotiModal(false);
					setTimeout(() => {
						router.push(RouterConstants.LOGIN.path);
					}, 1000);
				}}
				msg="An email has been sent to your email address with a link to verify your account. Your must verify your account to enter"
				title="Register account successfully!"
			/>
		</>
	);
};

export default ProfileForm;
