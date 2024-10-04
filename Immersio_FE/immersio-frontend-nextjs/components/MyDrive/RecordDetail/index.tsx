import { FORMAT_DATE } from '@/constants';
import { useClickOutsideElement } from '@/hooks/useClickOutsideElement';
import Thumbnail from '@/public/assets/img/mydrive/thumbnail.svg';
import { FileType, FolderType, TTypeRecord } from '@/src/interfaces/mydrive/mydrive.interface';
import { Button } from 'antd';
import bytes from 'bytes';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import ButtonThreeDot from '../ButtonThreeDot';
import FileActionsModal, { IFileActionsModal } from '../FileActionsModal';
interface IRecordDetail extends IFileActionsModal {
	name: string;
	type: FileType | FolderType;
	size?: number;
	createdAt: string;
	location?: string;
	privacy?: boolean;
	thumbnail?: string;
	onClose: () => void;
	typeRecord: TTypeRecord;
	onOpen: (folderId?: string) => void;
	id?: string;
}

const RecordDetail = (props: IRecordDetail) => {
	const [isOpenFileActions, setIsOpenFileActions] = useState(false);
	const ref: any = useRef(null);

	useClickOutsideElement(ref, () => {
		setIsOpenFileActions(false);
	});
	return (
		<div className="tw-mt-6 tw-z-10">
			<div className="tw-relative">
				<div onClick={props.onClose} className="tw-absolute -tw-top-4 -tw-right-4 tw-w-8 tw-h-8 tw-cursor-pointer">
					<img className="tw-w-full tw-h-full" src={'/assets/img/mydrive/close.png'} alt="close" />
				</div>
				<div className="tw-h-[7.5rem] tw-w-[10rem]">
					{props.thumbnail ? (
						<img className="tw-w-full tw-h-full tw-object-contain" src={props.thumbnail} alt="close" />
					) : (
						<Thumbnail className="tw-h-full fill-theme-3" />
					)}
				</div>
				<div className="tw-font-bold tw-my-4 tw-truncate">{props.name}</div>
				<div className="tw-flex tw-flex-col tw-gap-y-2 tw-text-sm tw-mb-6">
					<div className="tw-flex">
						<span className="tw-w-1/2 color-theme-1">Type</span>
						<span className="tw-w-1/2 tw-truncate">{props.type}</span>
					</div>
					{props.size && (
						<div className="tw-flex">
							<span className="tw-w-1/2 color-theme-1">Size</span>
							<span className="tw-w-1/2 tw-truncate">{bytes(props.size)}</span>
						</div>
					)}
					<div className="tw-flex">
						<span className="tw-w-1/2 color-theme-1">Created</span>
						<span className="tw-w-1/2 tw-truncate">{dayjs(props.createdAt).format(FORMAT_DATE)}</span>
					</div>
					{props.location && (
						<div className="tw-flex">
							<span className="tw-w-1/2 color-theme-1">Location</span>
							<span className="tw-w-1/2 tw-truncate">{props.location}</span>
						</div>
					)}
					<div className="tw-flex">
						<span className="tw-w-1/2 color-theme-1">Privacy</span>
						<span className="tw-w-1/2 tw-truncate">{props.privacy ? 'Public' : 'Only me'}</span>
					</div>
				</div>
				<div className="tw-flex tw-justify-between">
					<Button
						onClick={() => {
							props.onOpen(props.typeRecord === 'folder' ? props.id : null);
						}}
					>
            Open {props.typeRecord}
          </Button>
					{!props.folderFixed && <ButtonThreeDot onClick={() => setIsOpenFileActions(true)} />}
					<div ref={ref} className="tw-absolute tw-bottom-0 tw-left-0">
						{isOpenFileActions &&
							(props.typeRecord === 'file' ? (
								<FileActionsModal
									onDelete={props.onDelete}
									onMove={props.onMove}
									onRename={props.onRename}
									onDownload={() => {
										props.onDownload();
										setIsOpenFileActions(false);
									}}
									onShare={props.onShare}
								/>
							) : (
								<FileActionsModal
									onDelete={props.onDelete}
									onMove={props.onMove}
									onRename={props.onRename}
									folderFixed={props.folderFixed}
								/>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecordDetail;
