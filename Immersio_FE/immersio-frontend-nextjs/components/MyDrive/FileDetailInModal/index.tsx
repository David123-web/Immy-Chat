import { FORMAT_DATE } from '@/constants';
import { Button } from 'antd';
import bytes from 'bytes';
import dayjs from 'dayjs';
import { overrideTailwindClasses } from 'tailwind-override';

interface IFileDetailInModal {
	size: number;
	createdAt: string;
	className?: string;
	location: string;
	onDownload: () => void;
}

const FileDetailInModal = (props: IFileDetailInModal) => {
	const { size, createdAt, className, location, onDownload } = props;
	return (
		<div className={overrideTailwindClasses(`tw-px-4 ${className}`)}>
			{/* <p className="tw-font-light tw-my-4">Location: {location}</p> */}
			<p className="tw-font-light tw-my-4">File Size: {bytes(size)}</p>
			<p className="tw-font-light tw-my-4">Created: {dayjs(createdAt).format(FORMAT_DATE)}</p>
			<div className="tw-flex tw-items-center">
				<Button type='primary' onClick={onDownload}>Download</Button>
			</div>
		</div>
	);
};

export default FileDetailInModal;
