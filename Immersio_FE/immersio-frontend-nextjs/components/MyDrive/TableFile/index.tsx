import CustomTable from '@/components/common/CustomTable';
import { FORMAT_DATE_TIME } from '@/constants';
import { useClickOutsideElement } from '@/hooks/useClickOutsideElement';
import { useMutation } from '@/hooks/useMutation';
import { IDeleteFilesRequest, IFile, IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { deleteFiles, getLinkFileById } from '@/src/services/files/apiFiles';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ButtonThreeDot from '../ButtonThreeDot';
import FileActionsModal from '../FileActionsModal';
import FileExtension from '../FileExtension';
import { handleDownloadFile } from '@/src/helpers/file';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

export interface ICustomTableFile extends IFile {
	tools: string;
}

const columns: IHeaderTable<ICustomTableFile>[] = [
	{
		label: 'Name',
		key: 'name',
		widthGrid: '1fr',
		enableSort: true,
	},
	// {
	// 	label: 'Location',
	// 	key: 's3Location',
	// 	widthGrid: '15rem',
	// },
	{
		label: 'Modified',
		key: 'updatedAt',
		widthGrid: '15rem',
	},
	{
		label: '',
		key: 'tools',
		widthGrid: '5rem',
	},
];

interface ITableFile {
	data: IFile[];
	currentFileSelected: IFile | null;
	isLoading: boolean;
	getIndexRowSelected: (index: number) => void;
	onDoubleClick: () => void;
	onDelete: () => void;
	onRename: () => void;
	onMove: () => void;
	onShare: () => void;
	refetch: () => void;
	getSortBy?: (key: string) => void;
	getSortDesc?: (isDesc: boolean) => void;
}

const TableFile = (props: ITableFile) => {
	const {
		data,
		currentFileSelected,
		isLoading,
		getIndexRowSelected,
		onDoubleClick,
		onDelete,
		onRename,
		onMove,
		onShare,
		refetch,
		getSortBy,
		getSortDesc,
	} = props;
	const [isOpenActionsModal, setIsOpenActionsModal] = useState(false);
	const [indexRowSelected, setIndexRowSelected] = useState(-1);
	const [listIndexSelected, setListIndexSelected] = useState<number[]>([]);

	const ref: any = useRef(null);

	const { confirm } = Modal;

	/* -------------------------------- DOWNLOAD -------------------------------- */
	const downloadFileMutation = useMutation(getLinkFileById, {
		onSuccess: (res) => {
			handleDownloadFile({
				linkFile: res.data,
				name: currentFileSelected?.name,
				ext: currentFileSelected?.ext,
			});
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* --------------------------------- DELETE --------------------------------- */
	const showDeleteConfirm = () => {
		confirm({
			title: 'Are you sure delete list files?',
			icon: <ExclamationCircleOutlined />,
			content: "You won't be able to revert this!",
			okText: 'Yes, delete',
			okType: 'danger',
			cancelText: 'Cancel',
			onOk() {
				const listIds = data.reduce((ids, item, index) => {
					if (listIndexSelected.includes(index)) {
						ids.push(item.id);
					}
					return ids;
				}, []);

				deleteFilesMutation.mutate({ ids: listIds });
			},
		});
	};

	const deleteFilesMutation = useMutation<any, IDeleteFilesRequest>(deleteFiles, {
		onSuccess: () => {
			refetch();
			toast.success('Delete file success');
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ------------------------------ CLOSE ACTION ------------------------------ */
	useClickOutsideElement(ref, () => {
		setIsOpenActionsModal(false);
	});

	return (
		<>
			<CustomTable
				columns={columns}
				isLoading={isLoading || deleteFilesMutation.isLoading}
				getIndexRowSelected={(i) => {
					setIndexRowSelected(i);
					getIndexRowSelected(i);
				}}
				getListIndexSelected={(listIndex: number[]) => {
					setListIndexSelected(listIndex);
				}}
				getSortBy={getSortBy}
				contextContent={
					<FileActionsModal
						// onDownload={() => {
						// 	setIsOpenActionsModal(false);
						// 	downloadFileMutation.mutate(currentFileSelected?.id);
						// }}
						// onShare={() => {
						// 	onShare();
						// 	setIsOpenActionsModal(false);
						// }}
						onDelete={() => {
							showDeleteConfirm();
							// onDelete();
							// setIsOpenActionsModal(false);
						}}
						// onMove={() => {
						// onMove();
						// setIsOpenActionsModal(false);
						// }}
						// onRename={() => {
						// onRename();
						// setIsOpenActionsModal(false);
						// }}
					/>
				}
				getSortDesc={getSortDesc}
				onDoubleClick={onDoubleClick}
				data={
					data &&
					data.map((file, i) => ({
						...file,
						folder: null,
						name: (
							<div className="tw-flex tw-items-center">
								<FileExtension ext={file.ext} />
								<span className="tw-ml-4">{file.name}</span>
							</div>
						),
						updatedAt: dayjs(file.updatedAt).format(FORMAT_DATE_TIME),
						tools: (
							<div className="tw-relative">
								<ButtonThreeDot
									className="tw-border-none tw-rounded-full"
									onClick={(e) => {
										setIsOpenActionsModal(true);
									}}
								/>
								{indexRowSelected === i && isOpenActionsModal && (
									<div ref={ref} className={`tw-absolute tw-top-10 -tw-left-44 tw-z-[1]`}>
										<FileActionsModal
											onDownload={() => {
												setIsOpenActionsModal(false);
												downloadFileMutation.mutate(currentFileSelected?.id);
											}}
											onShare={() => {
												onShare();
												setIsOpenActionsModal(false);
											}}
											onDelete={() => {
												onDelete();
												setIsOpenActionsModal(false);
											}}
											onMove={() => {
												onMove();
												setIsOpenActionsModal(false);
											}}
											onRename={() => {
												onRename();
												setIsOpenActionsModal(false);
											}}
										/>
									</div>
								)}
							</div>
						),
					}))
				}
			/>
		</>
	);
};

export default TableFile;
