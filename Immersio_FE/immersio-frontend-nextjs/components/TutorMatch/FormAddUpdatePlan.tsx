import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { IFile, IGetFileByIdResponse, IUploadFileResponse } from '@/src/interfaces/mydrive/mydrive.interface';
import { IGetClassTagsResponse, IGetUsersByClassTagResponse } from '@/src/interfaces/people/people.interface';
import {
	Course,
	IAddPlanForm,
	IAddPlansRequest,
	IFormAddMaterial,
	IGetTutorPlanByIdResponse,
	IPlanDrill,
	IPlanMaterial,
	IUpdateMaterialRequest,
	IUpdatePlansRequest,
	IUploadMaterialRequest,
	PLAN_STATUS,
	Section,
	TUTOR_DRILL_TYPE,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { getAllCourses } from '@/src/services/courses/apiCourses';
import { uploadFile, viewFileStreamByID } from '@/src/services/files/apiFiles';
import { getClassTags, getUsersInClassTag } from '@/src/services/people/apiPeople';
import {
	addPlan,
	deteteMaterial,
	detetePlanDrill,
	getPlanById,
	updateMaterial,
	updatePlan,
	uploadMaterial,
} from '@/src/services/tutorMatch/apiTutorMatch';
import { useMobXStores } from '@/src/stores';
import { CheckSquareOutlined, LeftOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Form, Input, Modal, Radio, Row, Select, Tabs, Upload, UploadProps } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import FolderContentMydrive from '../Instructor/components/folderContent/FolderContentMydrive';
import { ControlUploadTabsStyle } from '../Instructor/styled/ControlUploadTabs.style';
import CustomCKEditor from '../PaymentGateways/CustomCKEditor';
import TutorPlanDrillItem from './TutorPlanDrillItem';
import TutorPlanDrillModal from './TutorPlanDrillModal';
import TutorPlanLesson from './TutorPlanLesson';
import TutorPlanMaterial from './TutorPlanMaterial';
import TutorClassesLayout from './layout/TutorClasses';

const { Panel } = Collapse;

const listDrills = [
	{
		name: 'Flashcards',
		value: TUTOR_DRILL_TYPE.FLASH_CARD,
	},
	{
		name: 'Drag and Drop',
		value: TUTOR_DRILL_TYPE.DRAG_AND_DROP,
	},
	{
		name: 'Drag the Words',
		value: TUTOR_DRILL_TYPE.DRAG_THE_WORDS,
	},
	{
		name: 'Multiple Choices',
		value: TUTOR_DRILL_TYPE.MULTIPLE_CHOICES,
	},
	{
		name: 'Sort the Paragraph',
		value: TUTOR_DRILL_TYPE.SORT_THE_PARAGRAPH,
	},
	{
		name: 'Listen and fill in the blanks',
		value: TUTOR_DRILL_TYPE.LISTEN_AND_FILL_BLANKS,
	},
];

const planStatus = [
	{
		name: 'Publish',
		value: PLAN_STATUS.PUBLISH,
	},
	{
		name: 'Private',
		value: PLAN_STATUS.PRIVATE,
	},
];

type FormAddUpdatePlanProps = {
	isUpdate?: boolean;
};

const FormAddUpdatePlan = (props: FormAddUpdatePlanProps) => {
	const { isUpdate = false } = props;
	const router = useRouter();
	const { globalStore } = useMobXStores();
	const [formAddPlan] = Form.useForm<IAddPlanForm>();

	const [formAddMaterial] = Form.useForm<IFormAddMaterial>();
	const [formAddDrill] = Form.useForm<{ lessionId: number; drills }>();

	const [isOpenDrillModal, setIsOpenDrillModal] = useState<boolean>(false);
	const [isOpenDrillReviewModal, setIsOpenDrillReviewModal] = useState<boolean>(false);
	const [isOpenAddMaterial, setisOpenAddMaterial] = useState(false);
	const [isOpenAddMaterialFile, setIsOpenAddMaterialFile] = useState(false);
	const [isOpenAddDrill, setisOpenAddDrill] = useState<boolean>(false);
	const [calendarColour, setCalendarColour] = useState<string>('#000000');

	/* ------------------------------- SUBMIT FORM ------------------------------ */
	const onFinish = () => {
		formAddPlan.setFieldValue(['calendarColour'], calendarColour);
		if (isUpdate) {
			updatePlanMutation.mutate({ id: router.query.id as string, data: formAddPlan.getFieldsValue() });
		} else {
			createPlanMutation.mutate(formAddPlan.getFieldsValue());
		}
	};

	const handleColorChange = (event) => {
		setCalendarColour(event.target.value);
	};
	/* ---------------------------- CREATE A NEW PLAN --------------------------- */
	const createPlanMutation = useMutation<any, IAddPlansRequest>(addPlan, {
		onSuccess: (res) => {
			toast.success('Add new plan successfully!');
			formAddPlan.resetFields();
		},
		onError: (err) => {
			toast.error('Add new plan failed!');
		},
	});

	/* ---------------------------- UPDATE A NEW PLAN --------------------------- */
	const updatePlanMutation = useMutation<any, { id: string; data: IUpdatePlansRequest }>(updatePlan, {
		onSuccess: (res) => {
			toast.success('Update plan successfully!');
		},
		onError: (err) => {
			toast.error('Update plan failed!');
		},
	});

	/* ---------------------------- GET LIST COURSES ---------------------------- */
	const [listCourse, setListCourse] = useState<Course[]>([]);

	const getListCourse = useQuery<Course[]>(['Course'], () => getAllCourses(null), {
		onSuccess: (res) => {
			setListCourse(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ----------------------------- GET PLAN BY ID ----------------------------- */
	const [planData, setPlanData] = useState<IGetTutorPlanByIdResponse>();
	const [planMaterialData, setPlanMaterialData] = useState<IPlanMaterial[]>([]);
	const getTutorPlanByIdQuery = useQuery<IGetTutorPlanByIdResponse>(
		['IGetTutorPlanByIdResponse'],

		() => getPlanById(router.query.id as string),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setPlanData(res.data);
				setCalendarColour(res.data.calendarColour);
				setPlanMaterialData(res.data.tutoringMaterials);
				setListDrill(res.data.drills);
				formAddPlan.setFieldsValue({
					title: res.data.title,
					language: res.data.courseLanguageId,
					course: res.data.courseId,
					calendarColour: res.data.calendarColour,
					description: res.data.description,
					status: res.data.status == PLAN_STATUS.PRIVATE ? PLAN_STATUS.PRIVATE : PLAN_STATUS.PUBLISH,
					students: res.data.students.map((x) => x.id),
					tutors: res.data.tutors.map((x) => x.id),
					classTags: res.data.classTags.map((x) => x.id),
				});
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);

	/* ------------------------------ GET CLASS TAG ----------------------------- */
	const [listClassTag, setListClassTag] = useState<IGetClassTagsResponse>({
		data: [],
		total: 0,
	});
	useQuery<IGetClassTagsResponse>(['getClassTagsQuery'], () => getClassTags(), {
		onSuccess: (res) => {
			setListClassTag(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});
	/* ---------------------- GET LIST PEOPLE IN CLASS TAG ---------------------- */
	const [listStudent, setListStudent] = useState<IGetUsersByClassTagResponse[]>([]);
	const [listTutors, setListTutors] = useState<IGetUsersByClassTagResponse[]>([]);
	const getUserByClassTagQuery = useQuery<IGetUsersByClassTagResponse[]>(
		['IGetUsersByClassTagResponse'],
		() => getUsersInClassTag({ ids: formAddPlan.getFieldValue('classTags') }),
		{
			enabled: !!formAddPlan.getFieldValue('classTags'),
			onSuccess: (res) => {
				setListStudent(res.data.filter((x) => x.role === ROLE_TYPE.STUDENT));
				setListTutors(res.data.filter((x) => x.role === ROLE_TYPE.TUTOR));
				formAddPlan.setFieldsValue({
					students: formAddPlan.getFieldValue('students')?.filter((x) =>
						res.data
							.filter((x) => x.role === ROLE_TYPE.STUDENT)
							.map((x) => x.profile.studentId)
							.includes(x)
					),
					tutors: formAddPlan.getFieldValue('tutors')?.filter((x) =>
						res.data
							.filter((x) => x.role === ROLE_TYPE.TUTOR)
							.map((x) => x.profile.tutorId)
							.includes(x)
					),
				});
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ------------------------------- UPLOAD FILE ------------------------------ */
	const uploadFileMutation = useMutation<IUploadFileResponse, any>(uploadFile, {
		onSuccess: (res) => {
			var formMaterialData = formAddMaterial.getFieldsValue();
			if (!!selectedMaterial.current) {
				const updateMaterial: IUpdateMaterialRequest = {
					title: formMaterialData.title,
					fileId: res.data.id,
					description: formMaterialData.description,
					shareWithStudent: true,
					shareWithInstructor: false,
				};
				updatePlanMaterialMutation.mutate({
					materialId: selectedMaterial.current.id,
					data: updateMaterial,
				});
			} else {
				const newMaterial: IUploadMaterialRequest = {
					lessonId: formMaterialData.lessonId,
					title: formMaterialData.title,
					fileId: res.data.id,
					description: formMaterialData.description,
					shareWithStudent: true,
					shareWithInstructor: false,
				};
				uploadMaterialMutation.mutate({ planId: router.query.id as string, data: newMaterial });
			}
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ----------------------------- UPLOAD MATERIAL ---------------------------- */
	const onFinishAddMaterial = (data: any) => {
		if (selectedMaterial.current && selectedMaterial.current?.fileId == data.file.fileId) {
			const updateMaterialData: IUpdateMaterialRequest = {
				title: formAddMaterial.getFieldValue('title'),
				description: formAddMaterial.getFieldValue('description'),
				fileId: data.file.fileId,
				shareWithInstructor: selectedMaterial.current?.shareWithInstructor,
				shareWithStudent: selectedMaterial.current?.shareWithStudent,
			};
			updatePlanMaterialMutation.mutate({ materialId: selectedMaterial.current.id, data: updateMaterialData });
		}
		if (data.file.uid && !data.file.originFileObj) {
			if (!!selectedMaterial.current) {
				const updateMaterial: IUpdateMaterialRequest = {
					title: data.title,
					fileId: data.file.uid,
					description: data.description,
					shareWithStudent: true,
					shareWithInstructor: false,
				};
				updatePlanMaterialMutation.mutate({
					materialId: selectedMaterial.current.id,
					data: updateMaterial,
				});
			} else {
				const newMaterial: IUploadMaterialRequest = {
					lessonId: data.lessonId,
					title: data.title,
					fileId: data.file.uid,
					description: data.description,
					shareWithStudent: true,
					shareWithInstructor: false,
				};
				uploadMaterialMutation.mutate({ planId: router.query.id as string, data: newMaterial });
			}
		} else if (data.file.originFileObj) {
			const formData = new FormData();
			formData.append('file', data.file.originFileObj as any);
			formData.append('public', 'false');
			uploadFileMutation.mutate(formData);
		}
	};

	const uploadMaterialMutation = useMutation<IPlanMaterial, { planId: string; data: IUploadMaterialRequest }>(
		uploadMaterial,
		{
			onSuccess: (res) => {
				setPlanMaterialData([...planMaterialData, res.data]);
				formAddMaterial.resetFields();
				setisOpenAddMaterial(false);
				toast.success('Add new material successfully!');
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ----------------------------- DELETE MATERIAL ---------------------------- */
	const deleteMaterialMutation = useMutation<any, string>(deteteMaterial, {
		onSuccess: (res, variables) => {
			setPlanMaterialData(planMaterialData.filter((x) => x.id !== variables));
			toast.success('Delete material successfully!');
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ------------------------------ EDIT MATERIAL ----------------------------- */
	const selectedMaterial = useRef<IPlanMaterial>(null);
	const onEditMaterial = (material: IPlanMaterial) => {
		selectedMaterial.current = material;
		getFileByIdMutation.mutate(material.fileId);
	};

	const getFileByIdMutation = useMutation<IGetFileByIdResponse, string>(viewFileStreamByID, {
		onSuccess: (res) => {
			formAddMaterial.setFieldsValue({
				title: selectedMaterial.current.title,
				description: selectedMaterial.current.description,
				lessonId: selectedMaterial.current.lessonId,
				file: { fileId: res.data.id, name: res.data.name + '.' + res.data.ext },
				shareWithInstructor: selectedMaterial.current.shareWithInstructor,
				shareWithStudent: selectedMaterial.current.shareWithStudent,
			});
			setisOpenAddMaterial(true);
		},
		onError: (err) => {},
	});

	const updatePlanMaterialMutation = useMutation<IPlanMaterial, { materialId: string; data: IUpdateMaterialRequest }>(
		updateMaterial,
		{
			onSuccess(res, variables) {
				setPlanMaterialData(planMaterialData.map((x) => (x.id === res.data.id ? res.data : x)));
				setisOpenAddMaterial(false);
				toast.success('Update material successfully!');
			},
			onError(err) {
				toast.error(err.data?.message);
			},
		}
	);
	/* ------------------------------ ON SAVE DRILL ----------------------------- */
	const onSaveDrill = (drill: IPlanDrill) => {
		setListDrill([...listDrill.filter((x) => x.id !== drill.id), drill].sort((a, b) => a.index - b.index));
	};

	/* -------------------------------- ADD DRILL ------------------------------- */
	const [listDrill, setListDrill] = useState<IPlanDrill[]>([]);
	const [selectedDrill, setSelectedDrill] = useState<IPlanDrill>(null);
	const onAddDrill = (data) => {
		const newDrill: IPlanDrill = {
			id: null,
			instruction: '',
			lessonId: data.lessonId,
			index: listDrill.length,
			sectionType: 'TUTOR_PLAN',
			data: [],
			type: data.drills.target.value as TUTOR_DRILL_TYPE,
			parentId: '',
		};
		setSelectedDrill(newDrill);
		setisOpenAddDrill(false);
		setIsOpenDrillModal(true);
	};
	/* ------------------------------ DELETE DRILL ------------------------------ */
	const deleteDrillMutation = useMutation<any, string>(detetePlanDrill, {
		onSuccess: (res, variables) => {
			setListDrill(listDrill.filter((x) => x.id !== variables));
			toast.success('Delete drill successfully!');
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});
	/* ----------------------------- RENDER SECTION ----------------------------- */
	const renderSection = (data: Section[]) => {
		return data
			.sort((x, y) => x.index - y.index)
			.map((section, i) => (
				<Panel
					header={<div className="tw-text-xl tw-uppercase tw-text-zinc-600">{section.title}</div>}
					key={section.id}
				>
					{section.lessons
						.sort((x, y) => x.index - y.index)
						.map((item) => (
							<>
								<TutorPlanLesson
									key={item.id}
									lessonName={item.title}
									onAddDrill={() => {
										formAddDrill.setFieldValue('lessonId', item.id);
										setisOpenAddDrill(true);
									}}
									onAddMaterial={() => {
										formAddMaterial.setFieldValue('lessonId', item.id);
										setisOpenAddMaterial(true);
									}}
								/>
								{planMaterialData
									.filter((x) => x.lessonId === item.id)
									.map((material) => (
										<TutorPlanMaterial
											fileId={material.fileId}
											title={material.title}
											onEditMaterial={() => onEditMaterial(material)}
											onDeleteMaterial={() => deleteMaterialMutation.mutate(material.id)}
										/>
									))}
								{listDrill
									.filter((x) => x.lessonId === item.id)
									.map((drill) => (
										<TutorPlanDrillItem
											drill={drill}
											onOpenEditDrill={() => {
												setSelectedDrill(drill);
												setIsOpenDrillModal(true);
											}}
											onOpenPreviewDrill={() => {
												setSelectedDrill(drill);
												setIsOpenDrillReviewModal(true);
											}}
											onDeleteDrill={() => {
												deleteDrillMutation.mutate(drill.id);
											}}
										/>
									))}
							</>
						))}
				</Panel>
			));
	};
	/* --------------------- SELECT MATERIAL FILE FROM MODAL -------------------- */
	const onSelectMaterialFromComputer: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		formAddMaterial.setFieldValue('file', newFileList[0]);
	};
	const onSelectMaterialFromMyDrive = (file: IFile) => {
		formAddMaterial.setFieldValue('file', { uid: file.id, name: file.name + '.' + file.ext });
	};

	return (
		<TutorClassesLayout>
			<div
				onClick={() => router.push(RouterConstants.DASHBOARD_TUTOR_MATCH_CLASSES.path)}
				className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-font-bold tw-text-xl"
			>
				<LeftOutlined className="tw-mr-4" />
				{isUpdate ? 'Update' : 'Add'} Plan
			</div>
			<div>
				<Form className="tw-w-full tw-m-auto tw-mt-6" onFinish={onFinish} form={formAddPlan} layout="vertical">
					<Form.Item name="title" label="Plan title">
						<Input placeholder="Enter a plan title" />
					</Form.Item>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<Form.Item
								name="language"
								label="Language"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select a language"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={globalStore.courseLanguages.map((la) => ({
										value: la.id,
										label: la.name,
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="course"
								label="Course"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select a course"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={listCourse.map((la) => ({
										value: la.id,
										label: la.title,
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="calendarColour" label="Calendar colour">
								<Input.Group className={`tw-flex tw-flex-row`} compact>
									<Input className="!tw-w-5/6" readOnly value={calendarColour} />
									<Input className="!tw-w-1/6" type="color" onInput={handleColorChange} value={calendarColour} />
								</Input.Group>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="description"
						label="Plan description"
						rules={[
							{
								required: true,
							},
						]}
					>
						<CustomCKEditor
							form={formAddPlan}
							name="description"
							initialContent={planData ? planData.description : ''}
						/>
					</Form.Item>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<Form.Item
								name="classTags"
								label="Class tag"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									onChange={(value: string[]) => {
										if (value.length == 0) {
											formAddPlan.setFieldsValue({
												students: [],
												tutors: [],
											});
											setListTutors([]);
											setListStudent([]);
										} else {
											getUserByClassTagQuery.refetch();
										}
									}}
									placeholder="Select a class tag"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={listClassTag.data.map((la) => ({
										value: la.id,
										label: la.name,
									}))}
									mode="multiple"
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="students"
								label="Students"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Add students"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={listStudent.map((la) => ({
										value: la.profile.studentId,
										label: `${la.profile.firstName} ${la.profile.lastName}`,
									}))}
									mode="multiple"
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="tutors"
								label="Tutors"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select tutors"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={listTutors.map((la) => ({
										value: la.profile.tutorId,
										label: `${la.profile.firstName} ${la.profile.lastName}`,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<Form.Item
								name="status"
								label="Class status"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select a status"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={planStatus.map((la) => ({
										value: la.value,
										label: la.name,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>
					{isUpdate && planData && (
						<div className="tw-w-full tw-bg-zinc-200 tw-p-4 tw-rounded-md tw-mb-6">
							<div className="tw-w-full tw-h-full tw-bg-white tw-rounded-md">
								<Collapse defaultActiveKey={[0]} ghost>
									{renderSection(planData.course.sections as Section[])}
								</Collapse>
							</div>
						</div>
					)}
					<Form.Item>
						<Button htmlType="submit" className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-px-12`}>
							Save and Add
						</Button>
					</Form.Item>
				</Form>
				<Modal
					title={<div className="tw-text-lg tw-font-bold">{selectedMaterial.current ? 'Update' : 'Add'} material</div>}
					width={600}
					open={isOpenAddMaterial}
					footer={
						<Button
							htmlType="submit"
							form="material"
							className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded-lg`}
						>
							{selectedMaterial.current ? 'Update' : 'Add'}
						</Button>
					}
					destroyOnClose
					afterClose={() => {
						formAddMaterial.resetFields();
						selectedMaterial.current = null;
					}}
					maskClosable={false}
					keyboard
					onCancel={() => {
						setisOpenAddMaterial(false);
					}}
				>
					<Form id="material" onFinish={onFinishAddMaterial} form={formAddMaterial} layout="vertical">
						<Form.Item name="lessonId" className="tw-hidden"></Form.Item>
						<Form.Item
							name="title"
							label="Title"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Input placeholder="Enter the material title" />
						</Form.Item>
						<Form.Item
							name="description"
							label="Description"
							rules={[
								{
									required: true,
								},
							]}
						>
							<CustomCKEditor
								form={formAddMaterial}
								name="description"
								initialContent={formAddMaterial.getFieldValue('description')}
							/>
						</Form.Item>
						<Form.Item
							name="file"
							label="Add file"
							rules={[
								{
									required: true,
								},
							]}
						>
							<Upload
								disabled
								maxCount={1}
								defaultFileList={!!formAddMaterial.getFieldValue('file') ? [formAddMaterial.getFieldValue('file')] : []}
								fileList={!!formAddMaterial.getFieldValue('file') ? [formAddMaterial.getFieldValue('file')] : []}
							>
								<Button
									icon={<UploadOutlined />}
									onClick={() => setIsOpenAddMaterialFile(true)}
									className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}
								>
									Add file
								</Button>
							</Upload>
						</Form.Item>
					</Form>
				</Modal>

				<Modal
					title="Add drill"
					width={600}
					open={isOpenAddDrill}
					footer={
						<Button htmlType="submit" form="drill" className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded-lg`}>
							Add selected drills
						</Button>
					}
					destroyOnClose
					maskClosable={false}
					onCancel={() => {
						setisOpenAddDrill(false);
					}}
				>
					<Form id="drill" onFinish={onAddDrill} form={formAddDrill} className="tw-bg-zinc-200 tw-rounded-md">
						<Form.Item name="lessonId" className="tw-hidden"></Form.Item>
						<Form.Item name="drills" valuePropName="radio" className="tw-mb-0 tw-p-3">
							<Radio.Group className="tw-w-full tw-flex tw-flex-col tw-gap-y-4">
								{listDrills.map((drill) => (
									<Radio
										value={drill.value}
										className="tw-flex tw-items-center tw-w-full tw-bg-white tw-px-2 tw-h-11 tw-rounded-md"
									>
										<div className="tw-flex tw-items-center">
											<CheckSquareOutlined className="tw-text-yellowDavid tw-text-2xl tw-mr-2" />
											<span className="tw-font-semibold tw-text-base tw-mt-2">{drill.name}</span>
										</div>
									</Radio>
								))}
							</Radio.Group>
						</Form.Item>
					</Form>
				</Modal>

				<Modal
					title="Add material"
					open={isOpenAddMaterialFile}
					onCancel={() => setIsOpenAddMaterialFile(false)}
					footer={null}
					destroyOnClose
				>
					<style jsx global>
						{ControlUploadTabsStyle}
					</style>
					<Tabs className="control-upload-tabs" type="card">
						<TabPane tab="From my computer" key="1">
							<div className="d-flex flex-column align-items-center justify-content-center">
								<Upload maxCount={1} onChange={onSelectMaterialFromComputer}>
									<Button icon={<UploadOutlined />}>Click to Upload</Button>
								</Upload>
							</div>
						</TabPane>
						<TabPane tab="From Mydrive" key="2">
							<FolderContentMydrive getSelectedFile={onSelectMaterialFromMyDrive} />
						</TabPane>
					</Tabs>
				</Modal>

				{!!selectedDrill && (
					<TutorPlanDrillModal
						drill={selectedDrill}
						isOpenDrillModal={isOpenDrillModal}
						setIsOpenDrillModal={setIsOpenDrillModal}
						isOpenDrillReviewModal={isOpenDrillReviewModal}
						setIsOpenDrillReviewModal={setIsOpenDrillReviewModal}
						onSaveDrill={onSaveDrill}
						onClose={() => setSelectedDrill(null)}
					/>
				)}
			</div>
		</TutorClassesLayout>
	);
};

export default FormAddUpdatePlan;
