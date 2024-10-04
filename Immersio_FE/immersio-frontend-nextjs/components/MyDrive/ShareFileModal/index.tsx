import { IFile } from '@/src/interfaces/mydrive/mydrive.interface';
import bytes from 'bytes';
import FileExtension from '../FileExtension';
import { useState } from 'react';
import ConfirmModal from '../ComfirmModal';
import CopyImg from '@/public/assets/img/mydrive/copy.svg';
import GreenCheckIcon from '@/public/assets/img/mydrive/check-green.png';
import { useMutation } from '@/hooks/useMutation';
import { getLinkFileById, publicFile, sendShareEmailFile } from '@/src/services/files/apiFiles';
import { Button, Form } from 'antd';
import { toast } from 'react-toastify';
import { useQuery } from '@/hooks/useQuery';
interface IShareFileModal {
	fileData: IFile;
	onClose: () => void;
}

const ShareFileModal = (props: IShareFileModal) => {
	const { fileData, onClose } = props;
	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
	const [isShared, setIsShared] = useState<boolean>(fileData.public);
	const [isSent, setIsSent] = useState<boolean>(false);
	const [linkFile, setLinkFile] = useState<string>('');

	const publicFileMutation = useMutation(publicFile, {
		onSuccess: (res) => {
			if (res.data.public) {
				setIsShared(true);
				getLinkFileByIdQuery.refetch();
			} else {
				setIsShared(false);
				setLinkFile('');
			}
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const sendShareEmailMutation = useMutation(sendShareEmailFile, {
		onSuccess: (res) => {
			setIsSent(true);
		},
		onError: (err) => {
			toast.error('Sent mail failed!');
		},
	});

	const getLinkFileByIdQuery = useQuery(['GetLinkFileById'], () => getLinkFileById(fileData.id), {
		enabled: fileData.public === true,
		onSuccess: (res) => {
			setLinkFile(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onSendShareFileEmail = (data: { email: string }) => {
		sendShareEmailMutation.mutate({ fileId: fileData.id, email: data.email });
	};

	return (
		<>
			<div>
				<div
					className="tw-fixed tw-z-[9] tw-left-0 tw-top-0 tw-w-screen tw-h-screen tw-opacity-20 bg-theme-1"
					onClick={onClose}
				></div>
				<div
					className="tw-fixed tw-w-[30%] tw-h-fit bg-theme-7 tw-mt-0 tw-my-auto tw-left-[50%] tw-top-[50%] 
        -tw-translate-x-1/2 -tw-translate-y-1/2 tw-z-10 tw-border-2 tw-border-solid tw-px-2
        border-theme-6 tw-rounded-md tw-shadow-[0_11px_8px_0_rgba(0,0,0,0.2)] tw-flex tw-flex-col tw-justify-between"
				>
					<div className="tw-flex tw-p-4 tw-border-0 tw-border-b-[1px] tw-border-solid border-theme-6 tw-gap-2">
						<div className="tw-mr-2 tw-w-8">
							<FileExtension ext="mp4" />
						</div>
						<div className="tw-flex tw-flex-col">
							<p className="tw-text-sm tw-font-normal tw-m-0 tw-overflow-hidden tw-flex-nowrap tw-overflow-ellipsis">
								{fileData ? fileData.name : ''}
							</p>
							<span className="tw-text-xs tw-font-light tw-text-[#637381]">{fileData ? bytes(fileData.size) : 0}</span>
						</div>
						<div className="tw-w-7 tw-mb-2 tw-absolute tw-right-4 tw-opacity-70 tw-cursor-pointer" onClick={onClose}>
							<img className="tw-w-full" src="/assets/img/mydrive/close.png" alt="close" />
						</div>
					</div>
					<div className="tw-w-full tw-p-4 tw-border-0 tw-border-b-[1px] tw-border-solid border-theme-6 ">
						<p>Send to:</p>
						<Form onFinish={onSendShareFileEmail}>
							<div className="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-4 ">
								<Form.Item
									name="email"
									rules={[
										{
											required: true,
											message: 'Please input email!',
										},
									]}
								>
									<input
										className="tw-w-full tw-border-2 tw-border-solid border-theme-6 tw-rounded-md tw-text-base tw-font-light tw-px-4 tw-py-2 bg-theme-7 focus:tw-outline-none"
										placeholder="Email Address"
										disabled={!isShared}
									/>
								</Form.Item>
								<Form.Item>
									<Button disabled={!isShared} htmlType="submit">
										Send
									</Button>
								</Form.Item>
							</div>
						</Form>
						{isSent && (
							<div className="tw-mt-4">
								<p className="tw-inline-flex tw-font-normal tw-text-sm tw-items-center color-theme-3">
									<span className="tw-inline-flex tw-mr-2">
										<img className="tw-w-7" src="/assets/img/mydrive/check-green.png" alt="success" />
									</span>
									Email sent successfully
								</p>
							</div>
						)}
					</div>
					{isShared ? (
						<div className="tw-flex tw-flex-col tw-p-4 tw-w-full tw-items-center tw-gap-4">
							<div className="w-full">
								<p>File link:</p>
								<div className="tw-flex tw-w-full tw-justify-between tw-border-2 tw-border-solid border-theme-6 tw-rounded-md tw-text-base tw-font-light tw-px-4 tw-py-2 bg-theme-7">
									<input
										id="linkFile"
										readOnly={true}
										value={linkFile}
										className="tw-w-[85%] tw-border-none tw-outline-none color-theme-1 tw-font-normal tw-text-ellipsis tw-whitespace-pre-wrap"
									/>
									<div
										onClick={() => {
											navigator.clipboard.writeText(linkFile);
										}}
									>
										<CopyImg className="tw-w-7 tw-h-fit tw-cursor-pointer" />
									</div>
								</div>
							</div>
							<Button
								onClick={() => {
									setIsShared(false);
									publicFileMutation.mutate({ id: fileData.id, public: false });
								}}
							>
								Remove Public Access
							</Button>
						</div>
					) : (
						<div className="tw-flex tw-flex-col tw-p-4 tw-w-full tw-items-center tw-gap-4">
							<Button
								onClick={() => {
									setIsOpenConfirmModal(true);
								}}
							>
								Make Public
							</Button>
							<Button onClick={() => setIsOpenConfirmModal(true)}>Make One Time Link</Button>
						</div>
					)}
				</div>
			</div>
			{isOpenConfirmModal ? (
				<ConfirmModal
					label="Are you sure?"
					description="Making this public will allow anyone to have access to it"
					confirmBtnLabel="Yes, make public"
					isOpen={isOpenConfirmModal}
					onClose={() => setIsOpenConfirmModal(false)}
					onConfirm={() => {
						setIsOpenConfirmModal(false);
						publicFileMutation.mutate({ id: fileData.id, public: true });
					}}
				/>
			) : null}
		</>
	);
};

export default ShareFileModal;
