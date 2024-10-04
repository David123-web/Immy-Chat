import { useMutation } from '@/hooks/useMutation';
import { IUploadFileResponse } from '@/src/interfaces/mydrive/mydrive.interface';
import { uploadFile } from '@/src/services/files/apiFiles';
import { CloseCircleFilled, CloudUploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload, UploadProps } from 'antd';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import React, { ReactElement, useState } from 'react';
import { toast } from 'react-toastify';
const { Dragger } = Upload;

interface IAddMediaModal {
	defaultMediaUrl: string
	isOpenAddMediaModal: boolean;
	setIsOpenAddMediaModal: (isOpenAddMediaModal: boolean) => void;
	isAudio?: boolean;
	onSave: (fileId: string, fileUrl: string) => void; 
}

const audioFileTypes = '.MP3, .WAV';
const imageFileTypes = '.JPG, .PNG, .GIF';
const AddMediaModal = (props: IAddMediaModal) => {
	const { isOpenAddMediaModal, setIsOpenAddMediaModal, isAudio = false, onSave, defaultMediaUrl } = props;
	const [file, setFile] = useState<UploadFile | null>({url: defaultMediaUrl, name: "default", uid: '1'});

	const uploadProps: UploadProps = {
		name: 'file',
		listType: 'picture-card',
		maxCount: 1,
		accept: isAudio ? audioFileTypes : imageFileTypes,
		onChange(info) {
			const { status } = info.file;
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
				setFile(info.file);
			}
		},
		defaultFileList: defaultMediaUrl && !isAudio ? [{uid: '1', name: "default", thumbUrl :defaultMediaUrl}] : null,
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
		showUploadList: isAudio ? false : { showPreviewIcon: true, showRemoveIcon: true },
	};

	/* ------------------------------- UPLOAD FILE ------------------------------ */
	const uploadFileMutation = useMutation<IUploadFileResponse, any>(uploadFile, {
		onSuccess: (res) => {
			onSave(res.data.id, res.data.s3Location);
			setIsOpenAddMediaModal(false);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onUploadFile = () => {
		const formData = new FormData();
		formData.append('file', file.originFileObj as any);
		formData.append('public', 'true');
		uploadFileMutation.mutate(formData);
	};

	return (
		<Modal
			closeIcon={<CloseCircleFilled />}
			destroyOnClose={isOpenAddMediaModal}
			title="Add Media"
			open={isOpenAddMediaModal}
			onCancel={() => setIsOpenAddMediaModal(false)}
			className="drillModal"
			footer={
				<Button
					block
					className="bg-theme-4 color-theme-7 tw-rounded-lg"
					onClick={() => {
						onUploadFile();
					}}
					loading={uploadFileMutation.isLoading}
				>
					Save
				</Button>
			}
		>
			{isAudio ? (
				<p>Upload an audio file for this task (max file size 20MB, file type: mp3/wav)</p>
			) : (
				<p>Upload an image of this box (max file size 20MB, file type: jpg/png/gif)</p>
			)}
			<Dragger {...uploadProps} className="!tw-h-[30vh]">
				<CloudUploadOutlined className="color-theme-1 tw-text-3xl" />
				<p className="ant-upload-text">Drag and drop a file here or click</p>
			</Dragger>
			<div className="tw-w-full tw-flex tw-justify-center">
				{isAudio && <audio src={file.originFileObj ? URL.createObjectURL(file.originFileObj) : defaultMediaUrl }  preload="auto" controls />}
			</div>
		</Modal>
	);
};

export default AddMediaModal;
