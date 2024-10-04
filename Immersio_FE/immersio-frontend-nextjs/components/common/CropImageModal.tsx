import { TAILWIND_CLASS } from '@/constants';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { canvasPreview } from '@/src/helpers/canvasPreview';
import { Button, Modal, Space, Spin } from 'antd';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ICropImages {
	isOpenModal: boolean;
	setIsOpenModal: (isOpen: boolean) => void;
	onSave: (imgObj: { url: string; formData: FormData; blob: Blob , imgSize:{ width: number, height: number}}) => void;
	isDeleteImage?: boolean;
	setIsDeleteImage?: (isDeleteImage: boolean) => void;
	aspect: number;
	circle?: boolean;
}

export enum TYPES_IMAGE {
	JPG = 'image/jpg',
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	GIF = 'image/gif',
}

const CropImageModal = (props: ICropImages) => {
	const { t } = useTranslation();
	const { isOpenModal, setIsOpenModal, onSave, isDeleteImage, setIsDeleteImage, aspect } = props;
	const [imgSrc, setImgSrc] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [error, setError] = useState<boolean>(false);
	const [croppedImage, setCroppedImage] = useState<HTMLCanvasElement>();
	const [imageRef, setImageRef] = useState<HTMLImageElement>();

	useEffect(() => {
		if (isDeleteImage && imgSrc) {
			setImgSrc('');
			setIsDeleteImage && setIsDeleteImage(false);
		}
	}, [isDeleteImage, imgSrc]);

	useDebounceEffect(
		async () => {
			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
				setCroppedImage(previewCanvasRef.current);
				setImageRef(imgRef.current);
				canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
			}
		},
		[completedCrop],
		100
	);

	const onSetError = (isError: boolean) => {
		setError(isError);
		if (isError) {
			setImgSrc('');
		}
	};

	const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setImgSrc('');
			setIsLoading(true);
			setCrop(undefined); // Makes crop preview update between images.
			const file = e.target.files[0];

			const reader = new FileReader();
			if (file && (file.size > 1 * Math.pow(2, 20) || !Object.values(TYPES_IMAGE).includes(file.type as TYPES_IMAGE))) {
				onSetError(true);
				return;
			}

			reader.onloadend = () => {
				if (reader && reader.result) {
					onSetError(false);
					setImgSrc(reader.result.toString());
				} else {
					onSetError(true);
				}
				setIsLoading(false);
			};
			reader.readAsDataURL(file);
		}
	};

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		if (aspect) {
			const { height, width } = e.currentTarget;

			const initSelectedWidth = 0.8 * width;

			setCrop(undefined);
		}
	};

	const exportCroppedImage = async () => {
		if (croppedImage) {
			const canvas = document.createElement('canvas');
			const pixelRatio = window.devicePixelRatio;
			if (imageRef && completedCrop) {
				const scaleX = imageRef.naturalWidth / imageRef.width;
				const scaleY = imageRef.naturalHeight / imageRef.height;
				canvas.width = completedCrop.width * pixelRatio * scaleX;
				canvas.height = completedCrop.height * pixelRatio * scaleY;

				const ctx = canvas.getContext('2d');
				if (ctx) {
					ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
					ctx.imageSmoothingQuality = 'high';

					ctx.drawImage(
						imageRef,
						completedCrop.x * scaleX,
						completedCrop.y * scaleY,
						completedCrop.width * scaleX,
						completedCrop.height * scaleY,
						0,
						0,
						completedCrop.width * scaleX,
						completedCrop.height * scaleY
					);
				}
				return new Promise((resolve, reject) => {
					canvas.toBlob((blob: any) => {
						if (!blob) {
							reject(new Error('Canvas is empty'));
							return;
						}
						const formData = new FormData();
						formData.append('file', blob);

						const fileUrl = window.URL.createObjectURL(blob);
						resolve({ url: fileUrl, formData: formData, blob, imgSize: {width: canvas.width, height: canvas.height} });
					}, 'image/png');
				});
			}
		}
	};

	const onSubmit = async () => {
		if (!error && imgSrc) {
			const imageUrl: any = await exportCroppedImage();
			onSave(imageUrl ?? '');
		}
	};

	return (
		<Modal
			open={isOpenModal}
			title={<div className="tw-font-bold tw-text-xl">{t('dashboard.title.crop_image')}</div>}
			onCancel={() => setIsOpenModal(false)}
      width={1000}
			footer={
				imgSrc
					? [
							<Button onClick={() => setIsOpenModal(false)}>
								{t('dashboard.button.cancel')}
							</Button>,
							<Button onClick={() => onSubmit()} className={`${TAILWIND_CLASS.BUTTON_ANTD}`}>
								{t('dashboard.button.add')}
							</Button>,
					  ]
					: []
			}
		>
			<div className="tw-max-h-[510px] tw-overflow-hidden">
				<div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
					<input
						type="file"
						accept="image/png, image/gif, image/jpeg, image/jpg"
						onChange={onSelectFile}
						name="uploadMedia"
						required
						className="tw-outline-none tw-w-64"
					/>

					<p className="tw-my-4">
						{t('dashboard.label.max_size_format')}
					</p>

					{error && <p className="tw-font-bold tw-text-2xl tw-my-5 tw-text-primary">
						{t('dashboard.label.please_respect_format')}
					</p>}
				</div>
				{imgSrc ? (
					<div className="tw-grid tw-grid-cols-2 tw-justify-between tw-w-full tw-gap-20">
						<ReactCrop
							aspect={aspect}
							crop={crop}
							onChange={(_: any, percentCrop: any) => {
								setCrop(percentCrop);
							}}
							onComplete={(c: any) => setCompletedCrop(c)}
							// locked
						>
							<img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
						</ReactCrop>

						{completedCrop && (
							<canvas
								ref={previewCanvasRef}
								className="tw-border tw-border-black tw-border-solid tw-object-contain"
								style={{
									width: completedCrop?.width,
									height: completedCrop?.height,
								}}
							/>
						)}
					</div>
				) : error ? (
					''
				) : (
					<Space style={{ padding: '0 4px', justifyContent: 'center', width: '100%' }}>
						<Spin size="default" />
					</Space>
				)}
			</div>
		</Modal>
	);
};

export default CropImageModal;
