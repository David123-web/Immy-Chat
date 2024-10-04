import { FORMAT_DATE } from '@/constants';
import FileImg from '@/public/assets/img/mydrive/file-svg.svg';
import dayjs from 'dayjs';

export interface IFileItem {
	thumbnail: string | null;
	name: string;
	ext: string;
	createdAt: string;
	updatedAt?: string;
	isSelected?: boolean;
	onClick: () => void;
	onDoubleClick?: () => void;
}

const FileItem = (props: IFileItem) => {
	return (
		<div
			className="tw-flex tw-flex-col tw-h-40 tw-w-48 tw-rounded-[0.25rem] tw-border
      border-theme-6 hover:border-theme-3 tw-border-solid
      tw-transition-all tw-duration-300 tw-cursor-pointer"
			onClick={props.onClick}
			onDoubleClick={props.onDoubleClick}
		>
			<div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-h-24">
				{props.thumbnail ? (
					<img className="tw-w-full tw-h-full tw-object-contain" src={props.thumbnail} alt="file" />
				) : (
					<FileImg className="tw-w-full tw-h-full" />
				)}
			</div>
			<div
				className={`tw-transition-all tw-duration-300 tw-h-full tw-w-full tw-px-3 tw-py-4 ${
					props.isSelected ? 'bg-theme-3' : ''
				}`}
			>
				<div
					className={`tw-text-sm tw-leading-[0.8175rem] tw-w-full tw-truncate tw-transition-all tw-duration-300 ${
						props.isSelected ? 'color-theme-7' : ''
					}`}
				>
					{props.name}.{props.ext}
				</div>
				<div
					className={`tw-text-xs tw-w-full tw-truncate tw-transition-all tw-duration-300 ${
						props.isSelected ? 'color-theme-7' : 'color-theme-1'
					}`}
				>{`Created ${dayjs(props.createdAt).format(FORMAT_DATE)}`}</div>
			</div>
		</div>
	);
};

export default FileItem;
