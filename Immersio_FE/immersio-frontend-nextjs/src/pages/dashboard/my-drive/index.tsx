import AddUploadButton from '@/components/MyDrive/AddUploadButton';
import ConfirmModal from '@/components/MyDrive/ComfirmModal';
import CreateFolderModal from '@/components/MyDrive/CreateFolderModal';
import EmptyFileDetail from '@/components/MyDrive/EmptyFileDetail';
import FileItem from '@/components/MyDrive/FileItem';
import FolderItem from '@/components/MyDrive/FolderItem';
import MoveItemModal from '@/components/MyDrive/MoveItemModal';
import OpenFileModal from '@/components/MyDrive/OpenFileModal';
import RecordDetail from '@/components/MyDrive/RecordDetail';
import RenameItemModal from '@/components/MyDrive/RenameItemModal';
import Section from '@/components/MyDrive/Section';
import ShareFileModal from '@/components/MyDrive/ShareFileModal';
import TableFile, { ICustomTableFile } from '@/components/MyDrive/TableFile';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { PAGE_SIZE, PARENT_FOLDER_ID, ROOT_FOLDER_ID, TAKE_ALL } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { QUERY_KEYS, useQuery } from '@/hooks/useQuery';
import GridIcon from '@/public/assets/img/mydrive/grid-icon.svg';
import ListIcon from '@/public/assets/img/mydrive/list-icon.svg';
import { handleDownloadFile } from '@/src/helpers/file';
import {
	FolderType,
	IDeleteFilesRequest,
	IDeleteFoldersRequest,
	IFile,
	IFolder,
	IGetFileAmountRequest,
	IGetFilesRequest,
	IGetFoldersRequest,
	TTypeRecord,
} from '@/src/interfaces/mydrive/mydrive.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { deleteFiles, getFileAmount, getLinkFileById, getListFiles } from '@/src/services/files/apiFiles';
import { deleteFolders, getListFolders } from '@/src/services/folders/apiFolders';
import { Breadcrumb, Empty, Pagination, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function MyDrive() {
	const { t } = useTranslation();
	const [enableTypeGrid, setEnableTypeGrid] = useState<boolean>(false);
	const [openOpenFileModal, setOpenFileModal] = useState<boolean>(false);
	const [openCreateFolderModal, setOpenCreateFolderModal] = useState<boolean>(false);
	const [openDeleteItemModal, setOpenDeleteItemModal] = useState<boolean>(false);
	const [openMoveItemModal, setOpenMoveItemModal] = useState<boolean>(false);
	const [openRenameItemModal, setOpenRenameItemModal] = useState<boolean>(false);
	const [openShareFileModal, setOpenShareFileModal] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [loadingDetail, setLoadingDetail] = useState(false);
	const [breadcrumb, setBreadcrumb] = useState<{ label: string; id: string; order: number }[]>([]);

	const router = useRouter();
	useEffect(() => {
		document.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	}, []);

	/* ------------------------------ DOWNLOAD FILE ----------------------------- */
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

	/* -------------------------- SET PARENT FOLDER ID -------------------------- */
	// const [parentFolderId, setParentFolderId] = useState<string>(getQueryParams(PARENT_FOLDER_ID));
	useEffect(() => {
		// setParentFolderId(router.query.parentFolderId as string);
		setCurrentPage(1);
		setLoadingDetail(true);
		setTimeout(() => {
			setLoadingDetail(false);
		}, 1000);
	}, [router.query.parentFolderId]);

	/* ----------------------------- GET LIST FOLDER ---------------------------- */
	const [currentFolderSelected, setCurrentFolderSelected] = useState<IFolder | null>(null);
	const [listFolder, setListFolder] = useState<IFolder[]>([]);
	const getFolderQuery = useQuery<IFolder[], IGetFoldersRequest>(
		['IGetFoldersRequestAgain', router.query.parentFolderId],
		() =>
			getListFolders({
				parentFolderId: (router.query.parentFolderId as string) ?? ROOT_FOLDER_ID,
			}),
		{
			onSuccess: (res) => {
				setListFolder(res.data.sort((a, b) => +b.fixed - +a.fixed));
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ------------------------------ GET LIST FILE ----------------------------- */
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [currentFileSelected, setCurrentFileSelected] = useState<IFile | null>(null);
	const [listFile, setListFile] = useState<IFile[] | null>(null);
	const [sortDesc, setSortDesc] = useState(false);
	const [sortBy, setSortBy] = useState<keyof ICustomTableFile>('name');

	const getFileQuery = useQuery<IFile[], IGetFilesRequest>(
		[QUERY_KEYS.GET_LIST_FILE, currentPage, pageSize, router.query.parentFolderId, sortBy, sortDesc],
		() =>
			getListFiles({
				folderId: (router.query.parentFolderId as string) ?? ROOT_FOLDER_ID,
				take: pageSize,
				skip: pageSize * (currentPage - 1),
				sortBy: sortBy,
				sortDesc: sortDesc ? sortDesc : '',
			}),
		{
			onSuccess: (res) => {
				setListFile(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ----------------------------- GET TOTAL FILE ----------------------------- */
	const [totalFile, setTotalFile] = useState(0);
	const getTotalFileQuery = useQuery<number, IGetFileAmountRequest>(
		['IGetFileAmountRequest', router.query.parentFolderId],
		() =>
			getFileAmount({
				folderId: (router.query.parentFolderId as string) ?? ROOT_FOLDER_ID,
			}),
		{
			onSuccess: (res) => {
				setTotalFile(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ------------------------------ DELETE FOLDER ----------------------------- */
	const deleteFoldersMutation = useMutation<any, IDeleteFoldersRequest>(deleteFolders, {
		onSuccess: () => {
			getFolderQuery.refetch();
			toast.success('Delete folder success');
			setOpenDeleteItemModal(false);
			setCurrentFolderSelected(null);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ------------------------------- DELETE FILE ------------------------------ */
	const deleteFilesMutation = useMutation<any, IDeleteFilesRequest>(deleteFiles, {
		onSuccess: () => {
			getFileQuery.refetch();
			toast.success('Delete file success');
			setOpenDeleteItemModal(false);
			setCurrentFileSelected(null);
			getTotalFileQuery.refetch();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onHandleSelectFolder = (folderId: string, folderName?: string) => {
		router.query[PARENT_FOLDER_ID] = folderId;
		router.push(router);
		setCurrentFolderSelected(null);
		setCurrentFileSelected(null);
		setBreadcrumb((prev) => [...prev, { label: folderName ?? '', id: folderId, order: prev.length }]);
		// setParentFolderId(folderId);
	};

	const onHandleRefetch = (type: TTypeRecord) => {
		if (type === 'file') {
			getFileQuery.refetch();
			getTotalFileQuery.refetch();
			setCurrentFileSelected(null);
		} else {
			getFolderQuery.refetch();
			setCurrentFolderSelected(null);
		}
	};

	return (
		<>
			<Head>
				<title>My Drive</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<DashboardRoute>
				<div className="my_drive_page tw-flex tw-w-full">
					{/* MAIN SECTION */}
					<div className="lg:tw-w-full tw-h-auto tw-overflow-hidden">
						{breadcrumb.length > 0 && (
							<Breadcrumb className="tw-mb-4">
								<Breadcrumb.Item onClick={() => setBreadcrumb([])}>
									<Link href={RouterConstants.DASHBOARD_MY_DRIVE.path}>Home</Link>
								</Breadcrumb.Item>
								{breadcrumb.map((item, index) => (
									<Breadcrumb.Item
										key={index}
										onClick={() => {
											const filteredItems = breadcrumb.filter((record) => record.order <= item.order);
											setBreadcrumb(filteredItems);
										}}
									>
										<Link href={`${RouterConstants.DASHBOARD_MY_DRIVE.path}?${PARENT_FOLDER_ID}=${item.id}`}>
											{item.label}
										</Link>
									</Breadcrumb.Item>
								))}
							</Breadcrumb>
						)}
						{loadingDetail ? (
							<div className="tw-fixed tw-h-[83%] tw-w-[60%] tw-flex tw-justify-center tw-items-center">
								<Spin size="large" />
							</div>
						) : (
							<div className="tw-w-full tw-h-full">
								{/* TUTORIAL */}
								<Section label={t('sidebar_menu.my_drive')}>
									<div>
										{t('dashboard.label.my_drive_description')}
									</div>
								</Section>
								{/* FOLDERS */}
								{listFolder.length > 0 && (
									<Section label="Folders">
										<div className="tw-flex tw-flex-wrap tw-gap-6">
											{listFolder.map((folder, index) => (
												<FolderItem
													key={folder.id}
													name={folder.name}
													location={folder.name}
													isSelected={listFolder.indexOf(currentFolderSelected) === index}
													onClick={() => {
														setCurrentFolderSelected(folder);
														setCurrentFileSelected(null);
													}}
													onDoubleClick={() => {
														onHandleSelectFolder(folder.id, folder.name);
													}}
												/>
											))}
										</div>
									</Section>
								)}

								<Section
									label="Home Files"
									icon={
										<div className="tw-w-full tw-h-full tw-flex tw-items-center tw-mr-4 tw-gap-x-2">
											<ListIcon
												className={`tw-w-5 tw-h-5 tw-cursor-pointer ${
													enableTypeGrid ? 'fill-theme-6' : 'fill-theme-3'
												}`}
												onClick={() => {
													setPageSize(PAGE_SIZE);
													setEnableTypeGrid(false);
												}}
											/>
											<GridIcon
												className={`tw-w-5 tw-h-5 tw-cursor-pointer ${
													enableTypeGrid ? 'fill-theme-3' : 'fill-theme-6'
												}`}
												onClick={() => {
													setEnableTypeGrid(true);
													setPageSize(TAKE_ALL);
												}}
											/>
										</div>
									}
								>
									{enableTypeGrid ? (
										<div className="tw-flex tw-flex-wrap tw-gap-6">
											{getFileQuery.isFetching ? (
												<div className="tw-w-full tw-h-full tw-py-40 tw-flex tw-justify-center tw-items-center">
													<Spin size="large" />
												</div>
											) : listFile.length > 0 ? (
												listFile.map((_, i) => (
													<FileItem
														key={_.id}
														createdAt={_.createdAt}
														ext={_.ext}
														name={_.name}
														thumbnail={_.thumbnail}
														onClick={() => {
															setCurrentFileSelected(listFile[i]);
															setCurrentFolderSelected(null);
														}}
														isSelected={
															currentFileSelected &&
															listFile.findIndex((file) => file.id === currentFileSelected.id) === i
														}
														onDoubleClick={() => {
															setCurrentFileSelected(listFile[i]);
															setCurrentFolderSelected(null);
															setOpenFileModal(true);
														}}
													/>
												))
											) : (
												<div className="tw-w-full tw-h-full tw-py-10 tw-flex tw-justify-center tw-items-center">
													<Empty />
												</div>
											)}
										</div>
									) : (
										<>
											<TableFile
												data={listFile}
												currentFileSelected={currentFileSelected}
												isLoading={getFileQuery.isFetching}
												getIndexRowSelected={(i) => {
													setCurrentFileSelected(listFile[i]);
													setCurrentFolderSelected(null);
												}}
												onDoubleClick={() => setOpenFileModal(true)}
												onDelete={() => setOpenDeleteItemModal(true)}
												onRename={() => setOpenRenameItemModal(true)}
												onMove={() => setOpenMoveItemModal(true)}
												onShare={() => setOpenShareFileModal(true)}
												refetch={() => {
													onHandleRefetch('file');
												}}
												getSortBy={(key) => setSortBy(key as any)}
												getSortDesc={(desc) => setSortDesc(desc)}
											/>

											<Pagination
												className="!tw-mt-6 tw-flex tw-justify-end"
												total={totalFile}
												pageSize={pageSize}
												current={currentPage}
												onChange={(page: number) => {
													setCurrentPage(page);
													setCurrentFileSelected(null);
												}}
											/>
										</>
									)}
								</Section>
							</div>
						)}
					</div>
					{/* RIGHT SECTION */}
					<div
						className={`tw-sticky tw-top-0 tw-right-0 tw-pb-6 tw-h-screen tw-max-w-[275px] lg:tw-w-[250px] xxl:tw-w-full 
          ${currentFileSelected ? '' : 'tw-justify-center tw-items-center'}
          `}
					>
						<AddUploadButton
							onAddNew={() => setOpenCreateFolderModal(true)}
							onSuccess={() => onHandleRefetch('file')}
						/>
						<div className="tw-h-[90%] tw-w-[250px] tw-flex tw-flex-col tw-border-[1px] border-theme-6 tw-border-solid tw-mt-6 tw-px-6">
							{currentFileSelected ? (
								<RecordDetail
									createdAt={currentFileSelected.createdAt}
									name={currentFileSelected.name}
									size={currentFileSelected.size}
									type={currentFileSelected.type}
									location={currentFileSelected.s3Location}
									privacy={currentFileSelected.public}
									thumbnail={currentFileSelected.thumbnail}
									onClose={() => {
										setCurrentFileSelected(null);
										setCurrentFolderSelected(null);
									}}
									typeRecord="file"
									onOpen={() => setOpenFileModal(true)}
									onDownload={() => downloadFileMutation.mutate(currentFileSelected.id)}
									onDelete={() => setOpenDeleteItemModal(true)}
									onMove={() => setOpenMoveItemModal(true)}
									onRename={() => setOpenRenameItemModal(true)}
									onShare={() => setOpenShareFileModal(true)}
								/>
							) : currentFolderSelected ? (
								<RecordDetail
									createdAt={currentFolderSelected.createdAt}
									name={currentFolderSelected.name}
									type={FolderType.FOLDER}
									onClose={() => {
										setCurrentFileSelected(null);
										setCurrentFolderSelected(null);
									}}
									typeRecord="folder"
									onOpen={(folderId) => {
										onHandleSelectFolder(folderId);
									}}
									onDelete={() => setOpenDeleteItemModal(true)}
									onMove={() => setOpenMoveItemModal(true)}
									onRename={() => setOpenRenameItemModal(true)}
									folderFixed={currentFolderSelected.fixed}
									id={currentFolderSelected.id}
								/>
							) : (
								<EmptyFileDetail />
							)}
						</div>
					</div>
				</div>
				{openOpenFileModal && currentFileSelected && (
					<OpenFileModal
						fileData={currentFileSelected}
						onClose={() => setOpenFileModal(false)}
						isOpen={openOpenFileModal}
					/>
				)}
				{openCreateFolderModal && (
					<CreateFolderModal
						isOpen={openCreateFolderModal}
						onClose={() => setOpenCreateFolderModal(false)}
						onRefetchFolderList={() => getFolderQuery.refetch()}
					/>
				)}

				{openDeleteItemModal && (
					<ConfirmModal
						label="Confirm Deletion"
						description="You cannot undo this action"
						confirmBtnLabel="Yes, delete"
						isOpen={openDeleteItemModal}
						onClose={() => setOpenDeleteItemModal(false)}
						onConfirm={() => {
							if (currentFolderSelected) {
								deleteFoldersMutation.mutate({
									ids: [currentFolderSelected.id],
								});
							}
							if (currentFileSelected) {
								deleteFilesMutation.mutate({
									ids: [currentFileSelected.id],
								});
							}
						}}
						loading={deleteFilesMutation.isLoading}
						disabled={deleteFilesMutation.isLoading}
					/>
				)}

				{openMoveItemModal && (
					<MoveItemModal
						initMoveFolderList={listFolder}
						onClose={() => setOpenMoveItemModal(false)}
						initCurrentFolderId={router.query.parentFolderId as string}
						movedItemId={currentFileSelected?.id ?? currentFolderSelected?.id}
						movedItemType={currentFileSelected ? 'FILE' : 'FOLDER'}
						onRefetchFolderList={() => onHandleRefetch(currentFileSelected ? 'file' : 'folder')}
						isOpen={openMoveItemModal}
					/>
				)}

				{openRenameItemModal && (
					<RenameItemModal
						onClose={() => setOpenRenameItemModal(false)}
						itemType={currentFileSelected ? 'FILE' : 'FOLDER'}
						itemId={currentFileSelected ? currentFileSelected?.id : currentFolderSelected?.id}
						onRefetch={() => onHandleRefetch(currentFileSelected ? 'file' : 'folder')}
						isOpen={openRenameItemModal}
					/>
				)}

				{currentFileSelected && openShareFileModal && (
					<ShareFileModal
						fileData={currentFileSelected}
						onClose={() => {
							setOpenShareFileModal(false);
							onHandleRefetch('file');
						}}
					/>
				)}
				{/* <UploadProgress /> */}
			</DashboardRoute>
		</>
	);
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default observer(MyDrive);
