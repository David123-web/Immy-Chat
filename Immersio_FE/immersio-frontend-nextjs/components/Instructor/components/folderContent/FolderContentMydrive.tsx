import FileExtension from '@/components/MyDrive/FileExtension';
import { FORMAT_DATE, ROOT_FOLDER_ID } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import BackIcon from '@/public/assets/img/mydrive/back.svg';
import FolderImg from '@/public/assets/img/mydrive/folder-svg.svg';
import { IFile, IFolder, IGetFilesRequest, IGetFoldersRequest } from '@/src/interfaces/mydrive/mydrive.interface';
import { getLinkObjectFileById, getListFiles } from '@/src/services/files/apiFiles';
import { getFolderById, getListFolders } from '@/src/services/folders/apiFolders';
import { Spin } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
interface IFolderContentMydrive {
	fileType?: 'Image' | 'Audio' | 'Video';
	onSave?: (data: any, id: string) => void;
	getSelectedFile?: (file: IFile) => void;
}
function FolderContentMydrive(props: IFolderContentMydrive) {
	const { fileType, onSave, getSelectedFile } = props;
	const [listFolder, setListFolder] = useState([]);
	const [listFile, setListFile] = useState([]);
	const [selectedRowState, setSelectedRowState] = useState<{ type: 'File' | 'Folder'; id: string }>(null);
	const [currentFolder, setCurrentFolder] = useState<IFolder>();
	const _audioFolder = useRef(null);

	const getFolderByIdMutation = useMutation<any, any>(getFolderById, {
		onSuccess: (res) => {
			setCurrentFolder(res.data);
			setListFolder(res.data.folders);
			setListFile(res.data.files);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const getLinkFileByIdMutation = useMutation<any, any>(getLinkObjectFileById, {
		onSuccess: (res, variables) => {
			axios
				.get(res.data, {
					responseType: 'blob',
				})
				.then((_res) => {
					var reader = new window.FileReader();
					reader.readAsDataURL(_res.data);
					reader.onloadend = function () {
						const base64data = reader.result;
						onSave(base64data, variables);
					};
					toast.success('Selected file is added');
				});
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	useQuery('GET_ROOT_FOLDER', () => getListFolders({}), {
		onSuccess: (res) => {
			if (fileType) {
				const audioFolder = res.data.find((x) => x.name === fileType);
				audioFolder && getFolderByIdMutation.mutate(audioFolder?.id);
				_audioFolder.current = audioFolder;
			}
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ----------------------------- GET LIST FOLDER ---------------------------- */
	const getRootFoldersQuery = useQuery<IFolder[], IGetFoldersRequest>(
		['IGetFoldersRequestAgain'],
		() =>
			getListFolders({
				parentFolderId: ROOT_FOLDER_ID,
			}),
		{
			enabled: !fileType,
			onSuccess: (res) => {
				setListFolder(res.data.sort((a, b) => +b.fixed - +a.fixed));
				setCurrentFolder(null);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ------------------------------ GET LIST FILE ----------------------------- */
	const getRootFilesQuery = useQuery<IFile[], IGetFilesRequest>(
		['IGetFilesRequest'],
		() =>
			getListFiles({
				folderId: ROOT_FOLDER_ID,
				take: 0,
				skip: 0,
			}),
		{
			enabled: !fileType,
			onSuccess: (res) => {
				setListFile(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	const handleDoubleClick = (data: IFolder | IFile, type: 'Folder' | 'File') => {
		if (type === 'Folder') {
			getFolderByIdMutation.mutate(data.id);
			setCurrentFolder(data as IFolder);
		} else {
			getSelectedFile?.(data as IFile);
			fileType && getLinkFileByIdMutation.mutate({ id: data.id, name: data.name });
		}
		setSelectedRowState(null);
	};

	const onBack = () => {
		if (!!currentFolder.parentFolderId) {
			getFolderByIdMutation.mutate(currentFolder.parentFolderId);
		} else {
			getRootFoldersQuery.refetch();
			getRootFilesQuery.refetch();
		}
		setSelectedRowState(null);
	};

	const renderRows = (data: IFolder[] | IFile[]) =>
		data.map((row) => (
			<div
				key={row.id}
				className={`tw-flex tw-h-12 tw-items-center tw-justify-between tw-rounded-lg tw-m-1 tw-cursor-pointer hover-bg-theme-6 ${
					selectedRowState?.id === row.id ? 'bg-theme-6' : ''
				} tw-text-zinc-600 tw-text-ellipsis tw-whitespace-nowrap tw-overflow-hidden`}
				onClick={() => {
					getSelectedFile?.(row);
					setSelectedRowState({ type: row.type ? 'File' : 'Folder', id: row.id });
				}}
				onDoubleClick={() => {
					handleDoubleClick(row, row.type ? 'File' : 'Folder');
				}}
			>
				<div className="tw-flex tw-ml-4 tw-items-center tw-w-1/2">
					{row.type ? <FileExtension ext={row.ext} /> : <FolderImg className="tw-w-10 tw-h-fit tw-opacity-70" />}
					<div className="tw-text-left tw-ml-4 tw-w-3/5 tw-truncate">{row.name}</div>
				</div>
				<div className="tw-text-left tw-mr-4">{dayjs(row.createdAt).format(FORMAT_DATE)}</div>
			</div>
		));

	return (
		<div className="tw-max-h-[80vh]">
			<div className="tw-w-full tw-h-8 tw-flex tw-items-center tw-justify-start">
				<div
					onClick={onBack}
					className={`tw-w-8 tw-cursor-pointer ${
						_audioFolder.current?.id !== currentFolder?.id && !!currentFolder
							? ''
							: 'tw-pointer-events-none tw-opacity-20'
					}`}
				>
					<BackIcon className="tw-w-full tw-h-fit" />
				</div>
			</div>

			<div className="tw-w-full tw-h-12 tw-flex tw-items-center tw-justify-center">
				<input
					className="tw-w-full tw-border-2 tw-border-solid border-theme-6 tw-rounded-sm tw-text-base tw-font-light tw-px-5 tw-py-2 bg-theme-6 tw-mt-3 focus:bg-theme-7 focus:tw-outline-none"
					placeholder="Search"
				/>
			</div>
			<div className="tw-w-full tw-overflow-y-auto tw-h-[35vh] tw-my-4">
				{getRootFilesQuery.isFetching || getFolderByIdMutation.isLoading ? (
					<div className="tw-h-full tw-w-full tw-flex tw-justify-center tw-items-center">
						<Spin />
					</div>
				) : (
					<div>
						{renderRows(listFolder)} {renderRows(listFile)}
					</div>
				)}
			</div>
		</div>
	);
}

export default FolderContentMydrive;
