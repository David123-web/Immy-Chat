import { ROOT_FOLDER_ID } from '@/constants';
import { checkExt } from '@/constants/fileExtension';
import { useMutation } from '@/hooks/useMutation';
import { QUERY_KEYS, useQuery } from '@/hooks/useQuery';
import { getQueryParams } from '@/src/helpers/getQueryParams';
import { IUploadFileResponse } from '@/src/interfaces/mydrive/mydrive.interface';
import { uploadFile } from '@/src/services/files/apiFiles';
import { getFolderById } from '@/src/services/folders/apiFolders';
import { Upload, UploadFile, UploadProps } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { overrideTailwindClasses } from 'tailwind-override';

interface IButtonUploadFile {
	label: string;
	icon: React.ReactNode;
	className?: string;
	onSuccess: () => void;
	setLoading: (loading: boolean) => void;
}

export const ButtonUploadFile = (props: IButtonUploadFile) => {
	const { icon, label, onSuccess, setLoading, className } = props;
	const queryClient = useQueryClient();
	const parentFolder = useRef(null);
	const [fileList, setFileList] = useState<UploadFile[] | null>(null);
	const [queryAmount, setQueryAmount] = useState<number>(0);

	useEffect(() => {
		if (fileList && fileList.length > 0) {
			if (
				!parentFolder.current?.fixed ||
				fileList.every((file) => checkExt(parentFolder.current.name, file.name?.split('.').pop()))
			) {
				setLoading(true);
				fileList.forEach((file) => {
					const formData = new FormData();
					formData.append('file', file.originFileObj as any);
					formData.append('name', file.name ?? 'fileName');
					formData.append('folderId', getQueryParams('parentFolderId') ?? ROOT_FOLDER_ID);
					formData.append('public', true as any);
					uploadFileMutation.mutate(formData);
				});
			} else {
				toast.error('File(s) type invalid');
			}
		}
	}, [fileList && fileList.length]);

	useQuery('GET_PARENT_FOLDER_XX', () => getFolderById(getQueryParams('parentFolderId')), {
		enabled: !!getQueryParams('parentFolderId'),
		onSuccess: (res) => {
			parentFolder.current = res.data;
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const uploadFileMutation = useMutation<IUploadFileResponse, any>(uploadFile, {
		onSuccess: (res) => {
			setQueryAmount((prev) => prev + 1);
		},
		onError: (err) => {
			toast.error(err.data?.message);
			setLoading(false);
		},
	});
	useEffect(() => {
		if (fileList) {
			if (queryAmount === fileList.length) {
				queryClient.invalidateQueries(QUERY_KEYS.GET_LIST_FILE);
				toast.success('Upload files successfully!');
				setFileList(null);
				setLoading(false);
			}
		}
	}, [queryAmount, fileList]);

	const beforeUpload = (file: RcFile) => {
		const isLt20M = file.size / 1024 / 1024 < 20;
		if (!isLt20M) {
			toast.error('File must smaller than 20MB!');
		}
		return isLt20M;
	};

	const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		setFileList(info.fileList);
	};

	return (
		<Upload
			name="files"
			className="tw-w-full"
			showUploadList={false}
			beforeUpload={beforeUpload}
			onChange={handleChange}
			multiple
			customRequest={() => null}
		>
			<div
				className={overrideTailwindClasses(`tw-flex color-theme-1 tw-cursor-pointer tw-px-6 tw-py-2
        tw-duration-150 tw-transition-all hover-bg-theme-6 hover:color-theme-3 hover:tw-font-medium ${
					className ?? ''
				}`)}
			>
				<div className="tw-w-4">
					<div className="tw-w-full tw-h-full">{icon}</div>
				</div>
				<div className="tw-ml-6">{label}</div>
			</div>
		</Upload>
	);
};
