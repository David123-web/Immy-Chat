import { useQuery } from '@/hooks/useQuery';
import { FileType, IFile } from '@/src/interfaces/mydrive/mydrive.interface';
import { getLinkFileById } from '@/src/services/files/apiFiles';
import { Modal, Spin } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import FileDetailInModal from '../FileDetailInModal';
import ReactAudioPlayer from 'react-audio-player';
import { handleDownloadFile } from '@/src/helpers/file';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

interface IOpenFileModal {
	fileData: IFile;
	isOpen: boolean;
	onClose: () => void;
}

const OpenFileModal = (props: IOpenFileModal) => {
	const { fileData, onClose, isOpen } = props;
	const [linkFile, setLinkFile] = useState();

	const getLinkFileQuery = useQuery('getLinkFileById2xxx', () => getLinkFileById(fileData.id), {
		onSuccess: (res) => {
			setLinkFile(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const renderPreviewFile = () => {
		switch (fileData.type) {
			case FileType.AUDIO:
				return (
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full">
						<ReactAudioPlayer src={linkFile} autoPlay controls />
						<FileDetailInModal
							className="tw-w-1/4"
							location={fileData.s3Location}
							size={fileData.size}
							createdAt={fileData.createdAt}
							onDownload={async () =>
								handleDownloadFile({
									ext: fileData.ext,
									linkFile,
									name: fileData.name,
								})
							}
						/>
					</div>
				);
			case FileType.IMAGE:
				return (
					<>
						<div className="tw-w-3/4 tw-h-full">
							<img className="tw-object-contain tw-w-full tw-h-full" src={linkFile} />
						</div>
						<FileDetailInModal
							className="tw-w-1/4"
							location={fileData.s3Location}
							size={fileData.size}
							createdAt={fileData.createdAt}
							onDownload={async () =>
								handleDownloadFile({
									ext: fileData.ext,
									linkFile,
									name: fileData.name,
								})
							}
						/>
					</>
				);
			case FileType.PDF:
				return <iframe src={linkFile} className="tw-h-full tw-w-full" />;
			case FileType.VIDEO:
				return (
					<>
						<div className="tw-h-[50%]  tw-w-fit">
							<video className="tw-object-contain tw-w-full tw-h-full" controls controlsList="nodownload" autoPlay>
								<source src={linkFile} type="video/mp4" />
							</video>
						</div>
						<FileDetailInModal
							className="tw-h-fit"
							location={fileData.s3Location}
							size={fileData.size}
							createdAt={fileData.createdAt}
							onDownload={async () =>
								handleDownloadFile({
									ext: fileData.ext,
									linkFile,
									name: fileData.name,
								})
							}
						/>
					</>
				);
			// case FileType.DOCUMENTATION:
			// 	return (
			// 		<DocViewer
			// 			documents={[
			// 				{
			// 					uri: linkFile,
			// 					fileType: fileData.ext,
			// 				},
			// 			]}
			// 			pluginRenderers={DocViewerRenderers}
			// 		/>
			// 	);

			default:
				return (
					<DocViewer
						documents={[
							{
								uri: linkFile,
								fileType: fileData.ext,
							},
						]}
						pluginRenderers={DocViewerRenderers}
					/>
				);
			// if (fileData.ext === 'pdf') {
			// 	return <iframe src={linkFile} className="tw-h-full tw-w-full" />;
			// }
			// if (fileData.ext === 'csv') {
			// 	return <iframe src={linkFile} className="tw-h-full tw-w-full" />;
			// }
		}
	};

	return (
		<Modal
			bodyStyle={{
				height:
					fileData.type === FileType.DOCUMENTATION ||
					fileData.type === FileType.OTHER ||
					fileData.type === FileType.PRESENTATION ||
					fileData.type === FileType.SHEET
						? 750
						: 500,
			}}
			width={'70%'}
			open={isOpen}
			destroyOnClose
			maskClosable={false}
			footer={[]}
			keyboard
			onCancel={onClose}
			centered
		>
			<div className="tw-h-fit">
				<div className="tw-text-xl tw-my-6 tw-text-ellipsis tw-text-center tw-font-light tw-overflow-hidden">
					{fileData.name}
				</div>
			</div>
			<div
				className={`tw-w-full tw-h-[82%] tw-flex tw-items-center ${
					fileData.type === FileType.VIDEO ? 'tw-flex-col tw-justify-start' : 'tw-flex-row tw-justify-between'
				}`}
			>
				{getLinkFileQuery.isFetching ? (
					<div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
						<Spin size="large" />
					</div>
				) : (
					renderPreviewFile()
				)}
			</div>
		</Modal>
	);
};

export default OpenFileModal;
