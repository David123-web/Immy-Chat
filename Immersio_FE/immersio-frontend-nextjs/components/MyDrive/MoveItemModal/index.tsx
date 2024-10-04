import { FORMAT_DATE, TAILWIND_CLASS } from '@/constants';
import { useClickOutsideElement } from '@/hooks/useClickOutsideElement';
import { useMutation } from '@/hooks/useMutation';
import BackIcon from '@/public/assets/img/mydrive/back.svg';
import FolderImg from '@/public/assets/img/mydrive/folder-svg.svg';
import HomeImg from '@/public/assets/img/mydrive/home.svg';
import { IFolder } from '@/src/interfaces/mydrive/mydrive.interface';
import { moveFile } from '@/src/services/files/apiFiles';
import { getFolderById, getListFolders, moveFolder } from '@/src/services/folders/apiFolders';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
interface IMoveItemModal {
	onClose: () => void;
	initMoveFolderList: IFolder[];
	initCurrentFolderId: string;
	movedItemId: string;
	movedItemType: 'FILE' | 'FOLDER';
	onRefetchFolderList: () => void;
	isOpen: boolean;
}

const MoveItemModal = (props: IMoveItemModal) => {
	const {
		onClose,
		initMoveFolderList,
		initCurrentFolderId,
		movedItemId,
		movedItemType,
		onRefetchFolderList,
		isOpen
	} = props;
	const [indexSelectedRowState, setIndexSelectedRowState] = useState(-1);
	const [listFolder, setListFolder] = useState(
		initMoveFolderList.filter((x) => x.id !== movedItemId)
	);
	const [currentFolder, setCurrentFolder] = useState<IFolder>();

	useEffect(() => {
		if (!!initCurrentFolderId) {
			getFolderByIdMutation.mutate(initCurrentFolderId);
		}
	}, []);

	const getFolderByIdMutation = useMutation<any, any>(getFolderById, {
		onSuccess: (res) => {
			setCurrentFolder(res.data);
			setListFolder(res.data.folders.filter((x) => x.id !== movedItemId));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const getFolderMutation = useMutation<any, any>(getListFolders, {
		onSuccess: (res) => {
			setListFolder(res.data.filter((x) => x.id !== movedItemId));
			setCurrentFolder(null);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const moveFileMutation = useMutation<any, any>(moveFile, {
		onSuccess: (res) => {
			toast.success('Selected file is moved successfully');
			onRefetchFolderList();
			onClose();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const moveFolderMutation = useMutation<any, any>(moveFolder, {
		onSuccess: (res) => {
			toast.success('Selected folder is moved successfully');
			onRefetchFolderList();
			onClose();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const ref: any = useRef(null);

	useClickOutsideElement(ref, () => {
		setIndexSelectedRowState(-1);
	});

	const renderRows = (data: IFolder[]) =>
		data.map((row, i) => (
			<div
				key={row.id}
				className={`tw-flex tw-h-12 tw-items-center tw-justify-between tw-rounded-lg tw-m-1 tw-cursor-pointer hover:tw-opacity-70 hover-bg-theme-6 ${
					indexSelectedRowState === i ? 'bg-theme-6' : ''
				} color-theme-1 tw-text-ellipsis tw-whitespace-nowrap tw-overflow-hidden`}
				onClick={() => setIndexSelectedRowState(i)}
				onDoubleClick={() => {
					setCurrentFolder(row);
					getFolderByIdMutation.mutate(row.id);
					setIndexSelectedRowState(-1);
				}}
			>
				<div className="tw-flex tw-ml-4 tw-items-center tw-w-1/2">
					<FolderImg className="tw-w-8 tw-h-fit tw-opacity-70" />
					<div className="tw-text-left tw-ml-4 tw-w-3/5 tw-truncate">{row.name}</div>
				</div>
				<div className="tw-text-left tw-mr-4">{dayjs(row.createdAt).format(FORMAT_DATE)}</div>
			</div>
		));

	const onBack = () => {
		currentFolder.parentFolderId
			? getFolderByIdMutation.mutate(currentFolder.parentFolderId)
			: getFolderMutation.mutate({
					parentFolderId: 'root',
			  });
		setIndexSelectedRowState(-1);
	};

	const goHome = () => {
		getFolderMutation.mutate({
			parentFolderId: 'root',
		});
		setCurrentFolder(null);
		setIndexSelectedRowState(-1);
	};

	const onMoveItem = () => {
		console.log(indexSelectedRowState,listFolder )
		if (movedItemType === 'FILE') {
			moveFileMutation.mutate({
				id: movedItemId,
				folderId: indexSelectedRowState >= 0 ? listFolder[indexSelectedRowState].id : currentFolder ? currentFolder.id : null,
			});
		}

		if (movedItemType === 'FOLDER') {
			moveFolderMutation.mutate({
				id: movedItemId,
				parentFolderId: indexSelectedRowState >= 0 ? listFolder[indexSelectedRowState].id : currentFolder ? currentFolder.id : null,
			});
		}
	};

	return (
		<Modal
			open={isOpen}
			footer={[
					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
						onClick={onMoveItem}
						ref={ref}
						disabled={indexSelectedRowState < 0 && currentFolder?.id == initCurrentFolderId}
					>{`Move ${indexSelectedRowState >= 0 ? 'To folder' : 'Here'}`}</Button>
      ]}
			width={'30%'}
			destroyOnClose
			maskClosable={false}
			keyboard
      onCancel={onClose}
		>
				<div className="tw-w-full tw-h-8 tw-flex tw-items-center tw-justify-between tw-mt-5">
					<div
						onClick={onBack}
						className={`tw-w-8 tw-cursor-pointer ${
							!!currentFolder ? '' : 'tw-pointer-events-none tw-opacity-20'
						}`}
					>
						<BackIcon className="tw-w-full tw-h-fit" />
					</div>
					<p className="">Title</p>
					<div
						onClick={goHome}
						className={`tw-w-8 tw-h-fit tw-cursor-pointer ${
							!!currentFolder ? '' : 'tw-pointer-events-none tw-opacity-20'
						} `}
					>
						<HomeImg className="tw-w-full tw-h-fit" />
					</div>
				</div>

				<div className="tw-w-full tw-h-12 tw-flex tw-items-center tw-justify-center">
					<input
						className="tw-w-full tw-border-2 tw-border-solid border-theme-6 tw-rounded-sm tw-text-base tw-font-light tw-px-5 tw-py-2 bg-theme-6 tw-mt-3 focus:bg-theme-7 focus:tw-outline-none"
						placeholder="Search"
					/>
				</div>
				<div className="tw-w-full tw-overflow-y-auto tw-h-full tw-my-4">
					<div ref={ref}>{renderRows(listFolder)}</div>
				</div>
		</Modal>
	);
};

export default MoveItemModal;
