import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import {
	IAddBlogRequest,
	IGetBlogByIdResponse,
	IGetBlogCategoriesResponse,
	IUpdateBlogRequest,
} from '@/src/interfaces/blogManagement/blogManagement.interface';
import { IUploadFileResponse } from '@/src/interfaces/mydrive/mydrive.interface';
import {
	createBlog,
	getBlogById,
	getBlogCategories,
	updateBlogById,
} from '@/src/services/blogManagement/apiBlogManagement';
import { uploadFile } from '@/src/services/files/apiFiles';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Space, Spin, Upload, UploadProps } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { RcFile, UploadFile } from 'antd/lib/upload';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CustomCKEditor from '../PaymentGateways/CustomCKEditor';
import DashboardRoute from '../routes/DashboardRoute';
import KeyWordTags from './KeywordTags';

type FormAddUpdateBlogProps = {
	isUpdate?: boolean;
};

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const FormAddUpdateBlog = (props: FormAddUpdateBlogProps) => {
	const { t } = useTranslation();
	const { isUpdate = false } = props;
	const router = useRouter();
	const [formAddBlog] = Form.useForm();
	const [keywords, setKeywords] = useState<string[]>([]);

	const [currentPage, setCurrentPage] = useState(1);

	/* ------------------------------- SUBMIT FORM ------------------------------ */
	const onFinish = () => {
		uploadFiles();
	};

	/* ----------------------- GET LIST OF BLOG CATEGORIES ---------------------- */
	const [listOfBlogCategories, setListOfBlogCategories] = useState<IGetBlogCategoriesResponse>({
		total: 0,
		data: [],
	});
	const getListOfBlogCategoriesQuery = useQuery<any>(
		['IGetBlogCategoriesResponse'],
		() =>
			getBlogCategories({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
			}),
		{
			onSuccess: (res) => {
				setListOfBlogCategories({ total: 100, data: res.data.filter((x) => !x.isDeleted) });
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	const onLoadingBlogCategory = (event: any) => {
		const target = event.target;
		if (
			target.scrollTop + target.offsetHeight === target.scrollHeight &&
			listOfBlogCategories.total > listOfBlogCategories.data.length
		) {
			getListOfBlogCategoriesQuery.refetch();
		}
	};

	/* ------------------------------ UPDATE IMAGE ------------------------------ */
	const [queryAmount, setQueryAmount] = useState<number>(0);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState<UploadFile[] | null>(null);
	const fileIds = useRef<string[]>([]);

	const uploadFiles = () => {
		let isUpload = false;
		if (fileList && fileList.length > 0) {
			fileList.forEach((file) => {
				if (!!file.originFileObj) {
					isUpload = true;
					const formData = new FormData();
					formData.append('file', file.originFileObj as any);
					formData.append('public', 'false');
					uploadFileMutation.mutate(formData);
				}
			});
			if (!isUpload) {
				formAddBlog.setFieldValue('fileIds', fileIds.current);
				if (router.query.id) {
					onUpdateBlog();
				} else {
					onCreateBlog();
				}
			}
		}
	};

	const uploadFileMutation = useMutation<IUploadFileResponse, any>(uploadFile, {
		onSuccess: (res) => {
			fileIds.current.push(res.data.id);
			setQueryAmount((prev) => prev + 1);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	useEffect(() => {
		if (fileList) {
			if (queryAmount === fileList.filter((file) => !!file.originFileObj).length) {
				formAddBlog.setFieldValue('fileIds', fileIds.current);
				toast.success(t('dashboard.notification.upload_files_success'));
				if (router.query.id) {
					onUpdateBlog();
				} else {
					onCreateBlog();
				}
			}
		}
	}, [queryAmount]);

	const handleCancel = () => setPreviewOpen(false);

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		console.log(newFileList);
		fileIds.current = newFileList.filter((file) => !file.originFileObj).map((file) => file.uid);
		setFileList(newFileList);
	};

	/* ------------------------------- CREATE BLOG ------------------------------- */
	const createBlogMutation = useMutation<any, IAddBlogRequest>(createBlog, {
		onSuccess: (res) => {
			toast.success(t('dashboard.notification.create_blog_success'));
			setFileList([]);
			setQueryAmount(0);
			setKeywords([]);
			fileIds.current = [];
			formAddBlog.resetFields();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onCreateBlog = () => {
		const formData = formAddBlog.getFieldsValue();
		const createBlogRequest: IAddBlogRequest = {
			title: formData.title,
			categoryId: formData.categoryId,
			author: formData.author,
			content: formData.content,
			metaDescription: formData.metaDescription ?? '',
			metaKeywords: keywords,
			fileIds: formData.fileIds,
		};
		createBlogMutation.mutate(createBlogRequest);
	};

	/* ----------------------------- GET BLOG BY ID ----------------------------- */
	const [blogData, setBlogData] = useState<IGetBlogByIdResponse>();
	const getBlogDataQuery = useQuery<IGetBlogByIdResponse>(
		['IGetBlogByIdResponse'],

		() => getBlogById(router.query.id as string),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setBlogData(res.data);
				setFileList(res.data.files.map((x) => ({ uid: x.id, name: x.name, url: x.s3Location })));
				setKeywords(res.data.metaKeywords);
				fileIds.current = res.data.files.map((x) => x.id);
				formAddBlog.setFieldsValue({
					title: res.data.title,
					categoryId: res.data.categoryId,
					content: res.data.content,
					metaDescription: res.data.metaDescription,
					metaKeywords: keywords,
					author: res.data.author,
					fileIds: res.data.files.map((x) => x.id),
				});
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);

	/* ------------------------------- UPDATE BLOG ------------------------------ */
	const updateBlogMutation = useMutation<any, { id: string; body: IUpdateBlogRequest }>(updateBlogById, {
		onSuccess: () => {
			toast.success(t('dashboard.notification.update_blog_success'));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onUpdateBlog = () => {
		const formData = formAddBlog.getFieldsValue();
		const updateBlogRequest: IUpdateBlogRequest = {
			title: formData.title,
			categoryId: formData.categoryId,
			author: formData.author,
			content: formData.content,
			metaDescription: formData.metaDescription ?? '',
			metaKeywords: keywords,
			fileIds: formData.fileIds,
		};
		updateBlogMutation.mutate({ id: router.query.id as string, body: updateBlogRequest });
	};

	return (
		<DashboardRoute>
			<Head>
				<title>{isUpdate ? `Update ${blogData?.title ?? t('dashboard.title.blog')}` : t('dashboard.title.add_blog')}</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<div
				onClick={() => router.push(RouterConstants.DASHBOARD_BLOG_MANAGEMENT_BLOG.path)}
				className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-font-bold tw-text-xl"
			>
				<LeftOutlined className="tw-mr-4" />
				{isUpdate ? `${t('dashboard.button.update')} ` + blogData?.title ?? t('dashboard.title.blog') : t('dashboard.title.add_blog')}
			</div>
			<div>
				<Form className="tw-w-full tw-m-auto tw-mt-6" onFinish={onFinish} form={formAddBlog} layout="vertical">
					<Form.Item name="fileIds" label="Feature Image">
						<Upload listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
							<div>
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>
									{t('dashboard.button.upload')}
								</div>
							</div>
						</Upload>
						<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
							<img alt="example" style={{ width: '100%' }} src={previewImage} />
						</Modal>
						<div className="tw-opacity-50">
							{t('dashboard.label.upload_title_description')}
						</div>
					</Form.Item>
					<Row gutter={[24, 24]}>
						<Col span={16}>
							<Form.Item
								name="title"
								label={t('dashboard.option.blog_title')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder={t('dashboard.placeholder.enter_blog')} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="categoryId"
								label={t('dashboard.option.category')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder={t('dashboard.placeholder.select_category')}
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									dropdownRender={(menu) => (
										<>
											{menu}
											{getListOfBlogCategoriesQuery.isFetching || getListOfBlogCategoriesQuery.isRefetching ? (
												<Space style={{ padding: '0 4px', justifyContent: 'center', width: '100%' }}>
													<Spin size="default" />
												</Space>
											) : null}
										</>
									)}
									options={listOfBlogCategories.data.map((la) => ({
										value: la.id,
										label: la.name,
									}))}
									onPopupScroll={onLoadingBlogCategory}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={[24, 24]}>
						<Col span={16}>
							<Form.Item
								name="content"
								label={t('dashboard.option.blog_content')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<CustomCKEditor initialContent={blogData?.content} form={formAddBlog} name="content" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="author"
								label={t('dashboard.option.author')}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input placeholder={t('dashboard.placeholder.enter_author_name')} />
							</Form.Item>
							<Form.Item name="metaKeywords" label={t('dashboard.option.meta_keywords')}>
								<KeyWordTags defaultKeywords={keywords} onGetListKeywordTags={(value) => setKeywords(value)} />
							</Form.Item>
							<Form.Item name="metaDescription" label={t('dashboard.option.meta_description')}>
								<TextArea rows={4} placeholder={t('dashboard.placeholder.enter_meta_description')} />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item>
						<Button htmlType="submit" className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-px-12`}>
							{t('dashboard.button.save')}
						</Button>
					</Form.Item>
				</Form>
			</div>
		</DashboardRoute>
	);
};

export default FormAddUpdateBlog;
