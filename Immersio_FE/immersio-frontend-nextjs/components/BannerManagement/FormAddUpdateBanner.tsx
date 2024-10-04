import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { globalStore } from '@/src/stores/global/global.store';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Input, Row, Select, UploadFile } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import CropImageModal from '../common/CropImageModal';
import DashboardRoute from '../routes/DashboardRoute';
import ReviewBannerModal from './ReviewBannerModal';

type FormAddUpdateBannerProps = {
	isUpdate?: boolean;
};

const dummyBanner: UploadFile[] = [
	{
		uid: '0',
		name: 'Banner 1',
		url: 'https://picsum.photos/id/100/760/200',
	},
	{
		uid: '1',
		name: 'Banner 2',
		url: 'https://picsum.photos/id/200/760/200',
	},
	{
		uid: '2',
		name: 'Banner 3',
		url: 'https://picsum.photos/id/500/760/200',
	},
	{
		uid: '3',
		name: 'Banner 4',
		url: 'https://picsum.photos/id/400/760/200',
	},
];

const FormAddUpdateBanner = (props: FormAddUpdateBannerProps) => {
	const { t } = useTranslation();
	const { isUpdate = false } = props;
	const router = useRouter();
	const [formAddBanner] = Form.useForm();
	const [isOpenCropImageModal, setIsOpenCropImageModal] = useState<boolean>(false);
	const [isOpenReviewBannerModal, setIsOpenReviewBannerModal] = useState<boolean>(false);
	const [isDeleteImage, setIsDeleteImage] = useState<boolean>(false);
	const [imgUrl, setImgUrl] = useState('');
	const [textColour, setTextColour] = useState<string>('#000000');
	const listOfBanners = useRef<UploadFile[]>(dummyBanner);

	/* ------------------------------- SUBMIT FORM ------------------------------ */
	const onFinish = () => {};

	const handleColorChange = (event) => {
		setTextColour(event.target.value);
	};

	/* ------------------------------- CROP IMAGE ------------------------------- */
	const onSave = async (imgObj: {
		url: string;
		formData: FormData;
		blob: Blob;
		imgSize: { width: number; height: number };
	}) => {
		try {
			console.log(imgObj);
			const canvas = document.createElement('canvas');
			canvas.width = imgObj.imgSize.width;
			canvas.height = imgObj.imgSize.height;
			const ctx = canvas.getContext('2d');

			const newBanner = new Image();
			newBanner.src = imgObj.url;

			newBanner.onload = () => {
				ctx.drawImage(newBanner, 0, 0);
				ctx.font = formAddBanner.getFieldValue('textFontSize') + 'px Roboto';
				ctx.fillStyle = textColour;
				ctx.textAlign = 'center';
				ctx.fillText(formAddBanner.getFieldValue('text'), canvas.width / 2, canvas.height / 2);
				setImgUrl(canvas.toDataURL());
				listOfBanners.current = listOfBanners.current.filter(
					(x) => x.uid !== (listOfBanners.current.length - 1).toString()
				);
				listOfBanners.current.push({
					uid: listOfBanners.current.length.toString(),
					name: imgObj.blob.name,
					url: canvas.toDataURL(),
				});
			};

			setIsOpenCropImageModal(false);
		} catch {}
	};

	return (
		<DashboardRoute>
			<div
				onClick={() => router.push(RouterConstants.DASHBOARD_BANNER_MANAGEMENT.path)}
				className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-font-bold tw-text-xl"
			>
				<LeftOutlined className="tw-mr-4" />
				{isUpdate ? t('dashboard.button.update') : t('dashboard.button.add')} {t('dashboard.title.banner')}
			</div>
			<div>
				<Form className="tw-w-full tw-m-auto tw-mt-6" onFinish={onFinish} form={formAddBanner} layout="vertical">
					<Row gutter={[24, 24]}>
						<Col span={16}>
							<Form.Item
								name="text"
								label={t('dashboard.option.banner_text')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder={t('dashboard.placeholder.enter_banner_text')} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="textPosition"
								label={t('dashboard.option.text_position')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder={t('dashboard.placeholder.select_position')}
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={globalStore.courseLanguages.map((la) => ({
										value: la.id,
										label: la.name,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={[24, 24]}>
						<Col span={16}>
							<Form.Item
								name="bannerImage"
								label={t('dashboard.option.banner_image')}
								rules={[
									{
										required: true,
									},
								]}
							>
								{imgUrl ? <img src={imgUrl} className="tw-w-full" /> : <Empty />}
								<Button className="tw-mt-4" icon={<UploadOutlined />} onClick={() => setIsOpenCropImageModal(true)}>
									{t('dashboard.button.choose_file')}
								</Button>
							</Form.Item>
							<div className="tw-flex tw-justify-between">
								<div className="tw-flex tw-gap-2">
									<Button onClick={() => {}} className={`tw-rounded-lg`}>
										{t('dashboard.button.cancel')}
									</Button>
									<Form.Item>
										<Button
											htmlType="submit"
											form="addBlogCategory"
											onClick={() => {}}
											className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
										>
											{t('dashboard.button.save')}
										</Button>
									</Form.Item>
								</div>
								<Button onClick={() => setIsOpenReviewBannerModal(true)} className={`tw-rounded-lg`}>
									{t('dashboard.button.preview')}
								</Button>
							</div>
						</Col>
						<Col span={8}>
							<Form.Item
								name="textFontSize"
								label={t('dashboard.option.text_font_size')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input className="tw-w-full" type="number" suffix="px" placeholder={t('dashboard.placeholder.enter_font_size')} />
							</Form.Item>
							<Form.Item
								name="textColour"
								label={t('dashboard.option.text_colour')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input.Group className={`tw-flex tw-flex-row`} compact>
									<Input className="!tw-w-5/6" readOnly value={textColour} />
									<Input className="!tw-w-1/6" type="color" onInput={handleColorChange} value={textColour} />
								</Input.Group>
							</Form.Item>
							<Form.Item
								name="order"
								label={t('dashboard.option.order_number')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder={t('dashboard.placeholder.select_order')}
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={globalStore.courseLanguages.map((la) => ({
										value: la.id,
										label: la.name,
									}))}
								/>
							</Form.Item>
							<Form.Item
								name="delay"
								label={t('dashboard.option.delay_ms')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input type="number" placeholder={t('dashboard.placeholder.enter_delay')} />
							</Form.Item>
							<Form.Item
								name="url"
								label={t('dashboard.option.link_url')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input prefix="#" placeholder={t('dashboard.placeholder.enter_link')} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<CropImageModal
					isOpenModal={isOpenCropImageModal}
					setIsOpenModal={setIsOpenCropImageModal}
					onSave={onSave}
					setIsDeleteImage={setIsDeleteImage}
					isDeleteImage={isDeleteImage}
					aspect={3.8}
				/>
				<ReviewBannerModal
					isOpenModal={isOpenReviewBannerModal}
					setIsOpenModal={setIsOpenReviewBannerModal}
					listOfBanner={listOfBanners.current}
				/>
			</div>
		</DashboardRoute>
	);
};

export default FormAddUpdateBanner;
