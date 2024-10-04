import DeleteIcon from '@/public/assets/img/mydrive/delete.svg';
import DownloadIcon from '@/public/assets/img/mydrive/download.svg';
import MoveIcon from '@/public/assets/img/mydrive/move.svg';
import RenameIcon from '@/public/assets/img/mydrive/rename.svg';
import ShareIcon from '@/public/assets/img/mydrive/share.svg';
import { overrideTailwindClasses } from 'tailwind-override';
interface IActionButton {
	label: string;
	icon: React.ReactNode;
	onAction: () => void;
	className?: string;
}

export const ActionButton = (props: IActionButton) => {
	return (
		<div
			className={overrideTailwindClasses(`tw-flex color-theme-1 tw-cursor-pointer tw-px-6 tw-py-2
        tw-duration-150 tw-transition-all hover-bg-theme-6 hover:color-theme-3 hover:tw-font-medium ${
					props.className ?? ''
				}`)}
			onClick={props.onAction}
		>
			<div className="tw-w-4">
				<div className="tw-w-full tw-h-full">{props.icon}</div>
			</div>
			<div className="tw-ml-6">{props.label}</div>
		</div>
	);
};

export interface IFileActionsModal {
	onRename?: () => void;
	onShare?: () => void;
	onDownload?: () => void;
	onMove?: () => void;
	onDelete?: () => void;
	folderFixed?: boolean;
	className?: string;
}

const FileActionsModal = (props: IFileActionsModal) => {
	return (
		<div
			className={overrideTailwindClasses(
				`tw-w-56 tw-border border-theme-6 tw-shadow-lg tw-rounded-md tw-flex tw-flex-col bg-theme-7 ${
					props.className ?? ''
				}`
			)}
		>
			{props.onRename && <ActionButton icon={<RenameIcon />} label="Rename" onAction={props.onRename} />}
			{props.onShare && <ActionButton icon={<ShareIcon />} label="Share" onAction={props.onShare} />}
			{props.onDownload && !props.folderFixed && (
				<ActionButton icon={<DownloadIcon />} label="Download" onAction={props.onDownload} />
			)}
			{props.onMove && !props.folderFixed && <ActionButton icon={<MoveIcon />} label="Move" onAction={props.onMove} />}
			{props.onDelete && !props.folderFixed && (
				<ActionButton icon={<DeleteIcon />} label="Delete" onAction={props.onDelete} />
			)}
		</div>
	);
};

export default FileActionsModal;
