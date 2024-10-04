import LoadingPage from '@/components/common/LoadingPage';
import FlashCardDemo from '@/components/Instructor/tools/drills/FlashCard/FlashCardDemo';
import DragAndDropDrill from '@/components/TutorMatch/DragAndDropDrill';
import DragAndDropDrillClassEnv from '@/components/TutorMatch/DragAndDropDrillClassEnv';
import DragTheWordsDrill from '@/components/TutorMatch/DragTheWordsDrill';
import DragTheWordsDrillClassEnv from '@/components/TutorMatch/DragTheWordsDrillClassEnv';
import FlashCardDrill from '@/components/TutorMatch/FlashCardDrill';
import FlashCardDrillClassEnv from '@/components/TutorMatch/FlashCardDrillClassEnv';
import ListenAndFillInTheBlanksClassEnv from '@/components/TutorMatch/ListenAndFillInTheBlanksClassEnv';
import ListenAndFillInTheBlanksDrill from '@/components/TutorMatch/ListenAndFillInTheBlanksDrill';
import MultipleChoiceDrill from '@/components/TutorMatch/MultipleChoiceDrill';
import MultipleChoiceDrillClassEnv from '@/components/TutorMatch/MultipleChoiceDrillClassEnv';
import SortTheParagraphDrill from '@/components/TutorMatch/SortTheParagraphDrill';
import { TAILWIND_CLASS } from '@/constants';
import { AUDIO_EXT, IMAGE_EXT, VIDEO_EXT } from '@/constants/fileExtension';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { handleDownloadFile } from '@/src/helpers/file';
import { getExtensionFromPath, getFileNameFromPath } from '@/src/helpers/strings';
import {
	GetLessonCompleteByClassIdRequest,
	GetLessonCompleteByClassIdResponse,
	HandleCompleteClassRequest,
	IGetClassByIdResponse,
	IGetTutorPlanByIdResponse,
	IPlanDrill,
	Section,
	TUTOR_DRILL_TYPE,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { getLinkFileById } from '@/src/services/files/apiFiles';
import {
	getClassById,
	getPlanById,
	getLessonCompleteByClassId,
	handleCompleteClass,
} from '@/src/services/tutorMatch/apiTutorMatch';
import {
	DownloadOutlined,
	ExclamationCircleOutlined,
	LoadingOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { Button, Checkbox, Collapse, Empty, Modal } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { toast } from 'react-toastify';
const { Panel } = Collapse;

const ClassEnvironment = () => {
	const router = useRouter();
	const { confirm } = Modal;
	const [collapseMenu, setCollapseMenu] = useState(false);

	useEffect(() => {
		if (!router.query.id) {
			router.push(RouterConstants.NOT_FOUND.path);
		}
	}, [router.query]);

	/* ----------------------------- GET CLASS BY ID ---------------------------- */
	const [classData, setClassData] = useState<IGetClassByIdResponse>();
	const getClassByIdQuery = useQuery<any, IGetClassByIdResponse>(
		['IGetClassByIdResponse'],
		() => getClassById(+router.query.id),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setClassData(res.data);
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);

	/* ----------------------------- GET PLAN BY ID ----------------------------- */
	const [planData, setPlanData] = useState<IGetTutorPlanByIdResponse>();
	const [listDrill, setListDrill] = useState<IPlanDrill[]>([]);
	const [drillSelected, setDrillSelected] = useState<IPlanDrill>();
	const getTutorPlanByIdQuery = useQuery<IGetTutorPlanByIdResponse>(
		['IGetTutorPlanByIdResponses', classData],
		() => getPlanById(classData.planId),
		{
			enabled: !!classData && !!classData.planId,
			onSuccess: (res) => {
				setPlanData(res.data);
				setListDrill(res.data.drills);
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);

	/* ----------------------------- GET FILE BY ID ----------------------------- */
	const [linkFileMaterial, setLinkFileMaterial] = useState('');
	const getFileByIdMutation = useMutation(getLinkFileById, {
		onSuccess: (res) => {
			setLinkFileMaterial(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ------------------------------ DOWNLOAD FILE ----------------------------- */
	const downloadFileMutation = useMutation(getLinkFileById, {
		onSuccess: (res) => {
			handleDownloadFile({
				linkFile: res.data,
				name: getFileNameFromPath(res.data),
				ext: getExtensionFromPath(res.data),
			});
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const renderDrillName = (drillType: TUTOR_DRILL_TYPE) => {
		switch (drillType) {
			case TUTOR_DRILL_TYPE.DRAG_AND_DROP:
				return 'Drag and Drop';
			case TUTOR_DRILL_TYPE.DRAG_THE_WORDS:
				return 'Drag the Words';
			case TUTOR_DRILL_TYPE.FLASH_CARD:
				return 'Flash Card';
			case TUTOR_DRILL_TYPE.LISTEN_AND_FILL_BLANKS:
				return 'Listen and Fill Blanks';
			case TUTOR_DRILL_TYPE.MULTIPLE_CHOICES:
				return 'Multiple Choices';
			default:
				return 'Sort the paragraph';
		}
	};

	/* ----------------------------- GET CLASS BY ID ---------------------------- */
	const [lessonComplete, setLessonComplete] = useState<GetLessonCompleteByClassIdResponse[]>([]);
	const { refetch } = useQuery<GetLessonCompleteByClassIdResponse[], GetLessonCompleteByClassIdRequest>(
		['GetLessonCompleteByClassIdRequest'],
		() =>
			getLessonCompleteByClassId({
				classId: +router.query.id,
			}),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setLessonComplete(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* -------------------------- HANDLE COMPLETE CLASS ------------------------- */
	const handleCompleteClassMutation = useMutation<boolean, HandleCompleteClassRequest>(handleCompleteClass, {
		onSuccess: () => {
			toast.success('Complete class successfully!');
			refetch();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const renderSection = (data: Section[]) => {
		return data
			.sort((x, y) => `${x.title}`.localeCompare(`${y.title}`))
			.map((section, index) =>
				section.lessons.map((les) => (
					<Collapse key={index.toString()} defaultActiveKey={['0']} expandIconPosition={'end'} ghost>
						<Panel
							key={index.toString()}
							header={
								<div className="tw-flex tw-items-center tw-gap-2">
									<Checkbox
										onChange={(e) => {
											e.stopPropagation();
											if (e.target.checked) {
												handleCompleteClassMutation.mutate({
													classId: +router.query.id,
													lessonId: les.id,
												});
											}
										}}
										checked={!!lessonComplete.find((item) => item.lessonId === les.id)}
									/>
									<div className="tw-text-base tw-font-semibold">{les.title}</div>
								</div>
							}
						>
							{planData.tutoringMaterials
								.filter((data) => data.lessonId === les.id)
								.map((item, index) => (
									<>
										{index === 0 && <div className="tw-font-semibold">Materials</div>}
										<div className="tw-flex tw-w-full tw-justify-between tw-pb-1">
											<div
												className="color-theme-4 tw-cursor-pointer"
												onClick={() => {
													getFileByIdMutation.mutate(item.fileId);
													setDrillSelected(undefined);
												}}
											>
												{item.title}
											</div>
											{downloadFileMutation.isLoading && downloadFileMutation.variables === item.fileId ? (
												<LoadingOutlined />
											) : (
												<DownloadOutlined
													className="tw-cursor-pointer"
													onClick={() => {
														handleDownloadFile({
															linkFile: linkFileMaterial,
															name: getFileNameFromPath(linkFileMaterial),
															ext: getExtensionFromPath(linkFileMaterial),
														});
													}}
												/>
											)}
										</div>
									</>
								))}
							<div className="tw-font-semibold tw-mt-2">Drills</div>
							<div className="tw-flex tw-w-full tw-flex-wrap tw-gap-2">
								{listDrill
									.filter((x) => x.lessonId === les.id)
									.map((item, indexDrill) => (
										<>
											<Button
												className={`${
													drillSelected && drillSelected.id === item.id
														? TAILWIND_CLASS.BUTTON_ANTD
														: TAILWIND_CLASS.BUTTON_GRAY_ANTD
												}`}
												onClick={() => setDrillSelected(item)}
											>
												{renderDrillName(item.type)}
											</Button>
										</>
									))}
							</div>
						</Panel>
					</Collapse>
				))
			);
	};

	const renderPreviewFile = (linkFileMaterial: string) => {
		if (linkFileMaterial) {
			const fileExt = getExtensionFromPath(linkFileMaterial);
			const isImage = IMAGE_EXT.includes(fileExt);
			const isVideo = VIDEO_EXT.includes(fileExt);
			const isAudio = AUDIO_EXT.includes(fileExt);
			if (isAudio) {
				return (
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-h-full">
						<ReactAudioPlayer src={linkFileMaterial} autoPlay={false} controls />
					</div>
				);
			}
			if (isImage) {
				return (
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-h-full">
						<img className="tw-object-contain tw-w-4/5 tw-h-4/5" src={linkFileMaterial} alt="linkFileMaterial" />
					</div>
				);
			}
			if (isVideo) {
				return (
					<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-h-full">
						<video className="tw-object-contain tw-w-4/5 tw-h-4/5" controls controlsList="nodownload" autoPlay>
							<source src={linkFileMaterial} type="video/mp4" />
						</video>
					</div>
				);
			}
			return (
				<div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-h-screen tw-p-4">
					<DocViewer
						documents={[
							{
								uri: linkFileMaterial,
								fileType: fileExt,
							},
						]}
						pluginRenderers={DocViewerRenderers}
					/>
				</div>
			);
		}
	};

	const renderDrill = (drillType: TUTOR_DRILL_TYPE) => {
		switch (drillType) {
			case TUTOR_DRILL_TYPE.FLASH_CARD:
				return <FlashCardDrillClassEnv drill={drillSelected} />;
			case TUTOR_DRILL_TYPE.DRAG_AND_DROP:
				return <DragAndDropDrillClassEnv drill={drillSelected} />;
			case TUTOR_DRILL_TYPE.DRAG_THE_WORDS:
				return <DragTheWordsDrillClassEnv drill={drillSelected} />;
			case TUTOR_DRILL_TYPE.MULTIPLE_CHOICES:
				return <MultipleChoiceDrillClassEnv drill={drillSelected} />;
			case TUTOR_DRILL_TYPE.SORT_THE_PARAGRAPH:
				return <Empty description="Coming soon" />;
			case TUTOR_DRILL_TYPE.LISTEN_AND_FILL_BLANKS:
				return <ListenAndFillInTheBlanksClassEnv drill={drillSelected} />;
			default:
				return null;
		}
	};

	return (
		<>
			<Head>
				<title>Class Environment</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			{getClassByIdQuery.isFetching || getTutorPlanByIdQuery.isFetching ? (
				<LoadingPage />
			) : (
				getTutorPlanByIdQuery.data &&
				getClassByIdQuery.data && (
					<div className="tw-p-4 tw-pt-2">
						<div className="mb-2">
							{collapseMenu ? (
								<MenuUnfoldOutlined className="tw-text-2xl tw-cursor-pointer" onClick={() => setCollapseMenu(false)} />
							) : (
								<MenuFoldOutlined className="tw-text-2xl tw-cursor-pointer" onClick={() => setCollapseMenu(true)} />
							)}
						</div>
						<div className="tw-flex">
							<div className="tw-w-1/4 tw-flex tw-flex-col tw-h-[90vh] tw-gap-3">
								{classData.virtualClassLink && (
									<Link href={classData.virtualClassLink} legacyBehavior>
										<a href={classData.virtualClassLink} target={'_blank'}>
											<Button className={`tw-w-full bg-theme-4 border-theme-4 color-theme-7 tw-rounded-md tw-h-12`}>
												Click to join the virtual classroom
											</Button>
										</a>
									</Link>
								)}

								<div className="tw-w-full tw-grow tw-overflow-y-auto">
									<h5>{planData.course.title}</h5>
									{renderSection(planData.course.sections as Section[])}
								</div>
								<Button
									className={`tw-w-full bg-theme-6 border-theme-1 color-theme-1 tw-rounded-md tw-h-12`}
									onClick={() => router.push(RouterConstants.DASHBOARD_TUTOR_MATCH_CLASSES_CLASSES.path)}
								>
									Back to my space
								</Button>
							</div>
							<div className="tw-w-3/4">
								{drillSelected ? renderDrill(drillSelected.type) : renderPreviewFile(linkFileMaterial)}
							</div>
						</div>
					</div>
				)
			)}
		</>
	);
};

export default ClassEnvironment;
