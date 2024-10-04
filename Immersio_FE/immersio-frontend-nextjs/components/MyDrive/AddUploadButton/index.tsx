import { useClickOutsideElement } from '@/hooks/useClickOutsideElement';
import DropdownIcon from '@/public/assets/img/mydrive/dropselect.svg';
import FolderIcon from '@/public/assets/img/mydrive/folder-icon.svg';
import UploadIcon from '@/public/assets/img/mydrive/upload-icon.svg';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { ButtonUploadFile } from '../ButtonUploadFile';
import { ActionButton } from '../FileActionsModal';
import { Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

interface IAddUploadButton {
	onAddNew: () => void;
	onSuccess: () => void;
}

const AddUploadButton = (props: IAddUploadButton) => {
	const ref: any = useRef(null);
	const [isOpenAddUploadButtons, setIsOpenAddUploadButtons] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	useClickOutsideElement(ref, () => {
		setIsOpenAddUploadButtons(false);
	});

	return (
		<div ref={ref} className="tw-relative tw-h-auto tw-cursor-pointer tw-z-20">
			{/* <div className="tw-flex bg-theme-3 tw-rounded-md tw-transition-all tw-duration-200 hover:tw-opacity-70"> */}
			<Button
				loading={isUploading}
				disabled={isUploading}
				onClick={() => setIsOpenAddUploadButtons(!isOpenAddUploadButtons)}
				icon={
					<CaretDownOutlined
						style={{
							color: '#fff',
							position: 'absolute',
							top: '50%',
							right: '10%',
							transform: 'translateY(-50%)',
						}}
					/>
				}
				type="primary"
				className="tw-w-full color-theme-7 tw-h-10 tw-font-semibold tw-flex tw-justify-center tw-items-center"
			>
				ADD NEW
			</Button>
			{isOpenAddUploadButtons && (
				<div className="tw-absolute tw-w-full tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-bottom-20 bg-theme-7 tw-shadow-xl tw-rounded-md">
					<ButtonUploadFile
						icon={<UploadIcon />}
						label="Upload Files"
						className="color-theme-1"
						onSuccess={props.onSuccess}
            setLoading={setIsUploading}
					/>
					<ActionButton
						icon={<FolderIcon />}
						label="Create Folder"
						onAction={props.onAddNew}
						className="color-theme-1"
					/>
				</div>
			)}
		</div>
	);
};

export default observer(AddUploadButton);
