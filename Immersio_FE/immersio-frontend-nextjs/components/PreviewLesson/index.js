import { CloseCircleFilled, LeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Divider, Drawer, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { toast } from 'react-toastify';
import Preview from '../../src/pages/student/myCourses/lesson/preview';
import { getCourseByIDPublic, updateTrackingCourseByID, assignToCourse } from '../../src/services/courses/apiCourses';
import { getDrillsPublic } from '../../src/services/drills/apiDrills';
import { viewFileLinkByID, viewPublicFile, viewPublicVideo } from '../../src/services/files/apiFiles';
import { getGrammarsPublic } from '../../src/services/grammars/apiGrammars';
import { getLesson } from '../../src/services/lessons/apiLessons';
import { getPhrasesPublic } from '../../src/services/phrases/apiPhrases';
import { getVocabulariesPublic } from '../../src/services/vocabularies/apiVocabularies';
import { useMobXStores } from '../../src/stores';
import { formatSumDrills } from '../../src/utilities/helper';
import PreviewMobile from './mobile/PreviewMobile';

export const FLASH_CARD = 'flashcards';
export const DRAG_AND_DROP = 'dragNdrop';
export const DRAG_THE_WORDS = 'dragWords';
export const MULTIPLE_CHOICES = 'multipleChoice';
export const LISTEN_AND_FILL_BLANKS = 'fillBlank';
export const SORT = 'sort';



const mappingDrillType = (type) => {
	const typeFormat = '';
	switch (type) {
		case 'FLASH_CARD':
			typeFormat = 'flashcards';
			break;
		case 'DRAG_AND_DROP':
			typeFormat = 'dragNdrop';
			break;
		case 'DRAG_THE_WORDS':
			typeFormat = 'dragWords';
			break;
		case 'MULTIPLE_CHOICES':
			typeFormat = 'multipleChoice';
			break;
		case 'LISTEN_AND_FILL_BLANKS':
			typeFormat = 'fillBlank';
			break;

		default:
			typeFormat = 'sort';
			break;
	}

	return typeFormat;
};

export const LessonContext = createContext();
const PreviewPage = ({ isAdmin = false }) => {
	const { globalStore } = useMobXStores();
	const router = useRouter();
	const course_id = router.query.course_id;
	const lesson_id = router.query.lesson_id;

	const [loaded, setLoaded] = useState(false);
	const [values, setValues] = useState({
		course: undefined,
		lesson: undefined,
		input: {
			vocabulary: { input: [], drills: [] },
			phrases: { input: [], drills: [] },
			grammar: { input: [], drills: [] },
			AI: { input: [] },
		},
	});

  useEffect(async () => {
    const assignment = await(assignToCourse({ "courseId": course_id, "purchased": false, "active:" : true, "studentId": 0 }));
  }, []);

	const [vocabulary, setVocabulary] = useState([]);
	const [phrases, setPhrases] = useState([]);
	const [grammar, setGrammar] = useState([]);
	const [AIdata, setAIdata] = useState([]);
	const [currentInput, setCurrentInput] = useState({
		index: undefined,
		uploadingImage: false,
		uploadingVideo: false,
		uploadingAudio: false,
	});

	const [courses, setCourses] = useState([]);
	const [currentCourseData, setCurrentCourseData] = useState();
	const [lessons, setLessons] = useState([]);
	const [image, setImage] = useState({});
	const [video, setVideo] = useState({});
	const [openDrawer, setOpenDrawer] = useState(false);

	const { userStore } = useMobXStores();
	const user = JSON.parse(JSON.stringify(userStore.currentUser));

	const [drillData0, setDrillData0] = useState([]);
	const [drillData1, setDrillData1] = useState([]);
	const [drillData2, setDrillData2] = useState([]);
	const [dialogs, setDialog] = useState([{ id: '', characterId: '', line: '', audio: null }]);
	const [indexStep, setIndexStep] = useState(1);
	const [isCompletedStep, setComplete] = useState(false);

	const getImageVideo = async (currentLesson) => {
		if (currentLesson.instructionVideoId) {
			try {
				if (currentLesson?.instructionVideo?.externalLink) {
					const responseVideo = await viewPublicFile(currentLesson.instructionVideoId);
					if (responseVideo?.data) {
						setVideo(responseVideo.data?.externalLink);
					}
				} else {
					const responseVideo = await viewPublicVideo(currentLesson.instructionVideoId);
					if (responseVideo?.data) {
						setVideo(responseVideo.data);
					}
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		} else {
			setVideo('');
		}
	};

	const getLessonAPI = async (lessonId) => {
		try {
			const response = await getLesson(lessonId);
			return response?.data;
		} catch (err) {
			return {};
		}
	};

	const getVocabularyAPI = async (id) => {
		try {
			const response = await getVocabulariesPublic({ lessonId: id });
			return response?.data;
		} catch (err) {
			return [];
		}
	};

	const getPhraseAPI = async (id) => {
		try {
			const response = await getPhrasesPublic({ lessonId: id });
			return response?.data;
		} catch (err) {
			return [];
		}
	};

	const getGrammarAPI = async (id) => {
		try {
			const response = await getGrammarsPublic({ lessonId: id });
			return response?.data;
		} catch (err) {
			return [];
		}
	};

	const getDrillsAPI = async (id) => {
		try {
			const response = await getDrillsPublic({ lessonId: id });
			globalStore.setListDrills(response?.data);
			let listDrillsId = [];
			response?.data.forEach((item) => {
				if (item.type === 'DRAG_AND_DROP') {
          listDrillsId.push(item.data[item.index - 1].id);
				} else {
					item.data.forEach((value) => {
						listDrillsId.push(value.id);
					});
				}
			});
			globalStore.setListDrillsIds(listDrillsId);
			return response?.data;
		} catch (err) {
			return [];
		}
	};

	const handleGetImageInput = async (response) => {
		let arr = [];
		let urls = [];

		for (let i = 0; i <= response.length - 1; i++) {
			let arrStream = {
				audio: '',
				audio_id: '',
				video: '',
				video_id: '',
				image: '',
				image_id: '',
			};

			if (response[i]?.medias?.length) {
				for (let ii = 0; ii <= response[i].medias.length - 1; ii++) {
					const field = response[i]?.medias[ii];
					if (field.id) {
						if (field.type === 'IMAGE') {
							arrStream = {
								...arrStream,
								image_name: `${field.name}.${field.ext}`,
								image_id: field.id,
							};
						}
						if (field.type === 'VIDEO') {
							arrStream = {
								...arrStream,
								video_name: `${field.name}.${field.ext}`,
								video_id: field.id,
							};
						}
						if (['OTHER', 'AUDIO'].includes(field.type)) {
							arrStream = {
								...arrStream,
								audio_name: `${field.name}.${field.ext}`,
								audio_id: field.id,
							};
						}
					}
				}
			}

			arr.push({
				id: response[i].id,
				input: response[i].input,
				explanation: response[i].explanation,
				index: i,
				...arrStream,
			});

			urls.push({
				items: response[i]?.medias?.length,
				arrStream,
			});
		}

		const urlFormat = urls.map((item) => {
			return [
				item.arrStream?.image_id ? { type: 'IMAGE', url: item.arrStream.image_id } : {},
				item.arrStream?.video_id ? { type: 'VIDEO', url: item.arrStream.video_id } : {},
				item.arrStream?.audio_id ? { type: 'AUDIO', url: item.arrStream.audio_id } : {},
			];
		});

		let getUrls = [];
		for (let i = 0; i <= urlFormat.length - 1; i++) {
			getUrls.push(...urlFormat[i]);
		}

		const fetchData = async () => {
			try {
				const response = await Promise.all(
					getUrls.map(async (item) => {
						if (item.url) {
							return await viewFileLinkByID(item.url);
						}
						return { data: '' };
					})
				);

				for (let i = 0; i <= urls.length - 1; i++) {
					arr[i].image = response[i * urls[i].items + 0].data;
					arr[i].video = response[i * urls[i].items + 1].data;
					arr[i].audio = response[i * urls[i].items + 2].data;
				}
			} catch (error) {
				console.log('Error', error);
			}
		};
		await fetchData();

		return arr;
	};

	let tmpVocabulary = [];
	const [loadingVocabularyImage, setLoadingVocabularyImage] = useState(false);

	const getListVocabulary = async (lessonID, flowGetImage = false) => {
		console.log(`getListVocabulary flowGetImage ${flowGetImage}`)
		if (flowGetImage === true) {
			setLoadingVocabularyImage(true);
			let response = JSON.parse(JSON.stringify(tmpVocabulary));
			console.log(`getListVocabulary flowGetImage response ${JSON.stringify(response, null, 2)}`)
			const arr = await handleGetImageInput(response);

			setVocabulary(arr);
			console.log(`getListVocabulary sp vocab is  ${JSON.stringify(arr, null, 2)}`)
			tmpVocabulary = [];
			setLoadingVocabularyImage(false);
		} else {
			let response = await getVocabularyAPI(lessonID);
			console.log(`getListVocabulary flowGetImage response ${JSON.stringify(response, null, 2)}`)
			if (response.length) {
				const responseVocabulary = response.sort((a, b) => a.index - b.index);
				let arr = [];
				for (let i = 0; i <= responseVocabulary.length - 1; i++) {
					arr.push({
						id: responseVocabulary[i].id,
						input: responseVocabulary[i].value,
						explanation: responseVocabulary[i].explanation,
						medias: responseVocabulary[i].medias,
						index: i,
					});
				}

				setVocabulary(arr);
				console.log(`getListVocabulary sp vocab is  ${JSON.stringify(arr, null, 2)}`)
				tmpVocabulary = arr;
			}
		}
	};

	let tmpPhrase = [];
	const [loadingPhraseImage, setLoadingPhraseImage] = useState(false);
	const getListPhrase = async (lessonID, flowGetImage = false) => {
		if (flowGetImage === true) {
			setLoadingPhraseImage(true);
			let response = JSON.parse(JSON.stringify(tmpPhrase));
			const arr = await handleGetImageInput(response);

			setPhrases(arr);
			tmpPhrase = [];
			setLoadingPhraseImage(false);
		} else {
			let response = await getPhraseAPI(lessonID);
			if (response.length) {
				const responsePhrase = response.sort((a, b) => a.index - b.index);
				let arr = [];
				for (let i = 0; i <= responsePhrase.length - 1; i++) {
					arr.push({
						id: responsePhrase[i].id,
						input: responsePhrase[i].value,
						explanation: responsePhrase[i].explanation,
						medias: responsePhrase[i].medias,
						index: i,
					});
				}

				setPhrases(arr);
				tmpPhrase = arr;
			}
		}
	};

	let tmpGrammar = [];
	const [loadingGrammarImage, setLoadingGrammarImage] = useState(false);
	const getListGrammar = async (lessonID, flowGetImage = false) => {
		if (flowGetImage === true) {
			setLoadingGrammarImage(true);
			let response = JSON.parse(JSON.stringify(tmpGrammar));
			const arr = await handleGetImageInput(response);

			setGrammar(arr);
			tmpGrammar = [];
			setLoadingGrammarImage(false);
		} else {
			let response = await getGrammarAPI(lessonID);
			if (response.length) {
				const responseGrammar = response.sort((a, b) => a.index - b.index);
				let arr = [];
				for (let i = 0; i <= responseGrammar.length - 1; i++) {
					arr.push({
						id: responseGrammar[i].id,
						input: responseGrammar[i].value,
						explanation: responseGrammar[i].explanation,
						medias: responseGrammar[i].medias,
						index: i,
					});
				}

				setGrammar(arr);
				tmpGrammar = arr;
			}
		}
	};

	const handleFormatData = async (source) => {
		let arr = [];
		for (let i = 0; i <= source.length - 1; i++) {
			const session = source[i];
			let format = {
				drill_id: [],
			};

			if (mappingDrillType(session.type) === FLASH_CARD) {
				format = {
					...format,
					questions: [],
					answers: [],
					images: [],
					images_ids: [],
				};
				if (session?.data?.length) {
					const ordered = session.data.sort((a, b) => a.index - b.index);
					for (let ii = 0; ii <= ordered.length - 1; ii++) {
						const s = ordered[ii];

						format.drill_id.push(s.id);
						format.questions.push(s?.question);
						format.answers.push(s?.content?.toString());

						if (s.media) {
							const responseVideo = await viewFileLinkByID(s.media);
							if (responseVideo?.data) {
								format.images.push(responseVideo.data);
								format.images_ids.push(s.media);
							}
						}
					}
				}
			}

			if (mappingDrillType(session.type) === DRAG_AND_DROP) {
				format = {
					...format,
					questions: [],
					answers: [],
					images: [],
					images_ids: [],
				};
				if (session?.data?.length) {
					const ordered = session.data.sort((a, b) => a.index - b.index);
					for (let ii = 0; ii <= ordered.length - 1; ii++) {
						const s = ordered[ii];

						format.drill_id.push(s.id);
						format.questions.push(s?.question);
						format.answers.push(s?.content?.toString());

						if (s.media) {
							const responseVideo = await viewFileLinkByID(s.media);
							if (responseVideo?.data) {
								format.images.push(responseVideo.data);
								format.images_ids.push(s.media);
							}
						}
					}
				}
			}

			if (mappingDrillType(session.type) === DRAG_THE_WORDS) {
				format = {
					...format,
					fragments: [],
					statements: [],
					// temp object
					questions: [],
					answers: [],
					words: [],
				};
				if (session?.data?.length) {
					const ordered = session.data.sort((a, b) => a.index - b.index);
					ordered.forEach((s) => {
						format.drill_id.push(s.id);
						format.statements.push(s?.question?.toString());
						format.fragments.push([s?.question]);
						format.words.push([s?.question]);
					});
				}
			}

			if (mappingDrillType(session.type) === MULTIPLE_CHOICES) {
				format = {
					...format,
					correct_answers: [],
					array_of_answers: [],
					// temp object
					questions: [],
					answers: [],
				};
				if (session?.data?.length) {
					const ordered = session.data.sort((a, b) => a.index - b.index);
					ordered.forEach((s) => {
						format.drill_id.push(s.id);
						format.questions.push(s?.question);
						format.array_of_answers.push(s?.content);
						format.correct_answers.push(s.correctIndex);
					});
				}
			}

			if (mappingDrillType(session.type) === SORT) {
				format = {
					...format,
					array_of_answers: [],
					// temp object
					questions: [],
					answers: [],
				};
				if (session?.data?.length) {
					const ordered = session.data.sort((a, b) => a.index - b.index);
					ordered.forEach((s) => {
						format.drill_id.push(s.id);
						format.questions.push(s?.question);
						format.array_of_answers.push(s?.content);
					});
				}
			}

			if (mappingDrillType(session.type) === LISTEN_AND_FILL_BLANKS) {
				format = {
					...format,
					questions: [],
					descriptions: [],
					answers: [],
					fragments: [],
					statements: [],
					audios: [],
					audios_ids: [],
					words: [],
				};
				if (session?.data?.length) {
					const ordered = session.data.sort((a, b) => a.index - b.index);
					for (let ii = 0; ii <= ordered.length - 1; ii++) {
						const s = ordered[ii];

						format.drill_id.push(s.id);
						format.descriptions.push(s?.question);
						format.statements.push(s?.content?.toString());
						format.fragments.push(s?.content);
						format.words.push(s?.content);

						if (s.media) {
							const responseVideo = await viewFileLinkByID(s.media);
							if (responseVideo?.data) {
								format.audios.push(responseVideo.data);
								format.audios_ids.push(s.media);
							}
						}
					}
				}
			}

			arr.push({
				id: session.id,
				index: i,
				drillId: i,
				drillType: mappingDrillType(session.type),
				instruction: session.instruction,
				parentId: session.parentId,
				...format,
			});
		}

		return arr;
	};

	const [loadingDrillsImage, setLoadingDrillsImage] = useState(false);
	const getListDrills = async (lessonID, flowGetImage = false) => {
		setLoadingDrillsImage(true);
		try {
			let response = await getDrillsAPI(lessonID);
			if (response.length) {
				const filterVocabulary = response.filter((session) => session.sectionType === 'VOCABULARY');
				const orderedVocabulary = (filterVocabulary || []).sort((a, b) => a.index - b.index);
				const formatDataVocabulary = await handleFormatData(orderedVocabulary, flowGetImage);
				setDrillData0(formatDataVocabulary);

				const filterPhrase = response.filter((session) => session.sectionType === 'PHRASE');
				const orderedPhrase = (filterPhrase || []).sort((a, b) => a.index - b.index);
				const formatDataPhrase = await handleFormatData(orderedPhrase, flowGetImage);
				setDrillData1(formatDataPhrase);

				const filterGrammar = response.filter((session) => session.sectionType === 'GRAMMAR');
				const orderedGrammar = (filterGrammar || []).sort((a, b) => a.index - b.index);
				const formatDataGrammar = await handleFormatData(orderedGrammar, flowGetImage);
				setDrillData2(formatDataGrammar);
			} else {
				setDrillData0([]);
				setDrillData1([]);
				setDrillData2([]);
			}
		} finally {
			setLoadingDrillsImage(false);
		}
	};

	const loadDialogs = async (lessonDetail) => {
		if (lessonDetail?.dialogs?.length) {
			if (lessonDetail?.dialogs[0]?.lines?.length) {
				let arr = [];
				const dataCompare = lessonDetail.dialogs[0].lines.sort((a, b) => a.index - b.index);

				for (let i = 0; i <= dataCompare.length - 1; i++) {
					let arrStream = {
						audio: undefined,
						audio_id: undefined,
						audio_name: undefined,
					};

					if (dataCompare[i].medias?.length && dataCompare[i].medias[0]) {
						try {
							arrStream = {
								...arrStream,
								audio_id: dataCompare[i].medias[0].id,
								audio_name: `${dataCompare[i].medias[0]?.name}.${dataCompare[i].medias[0]?.ext}`,
							};
						} catch (error) {
							toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
						}
					}

					arr.push({
						id: dataCompare[i].id,
						characterId: dataCompare[i].characterId,
						line: dataCompare[i].content,
						...arrStream,
					});
				}

				const getUrls = arr.map((item) => {
					if (item.audio_id) {
						return { type: 'AUDIO', url: item.audio_id };
					}
					return {};
				});

				const fetchData = async () => {
					try {
						const response = await Promise.all(
							getUrls.map(async (item) => {
								if (item.url) {
									return await viewFileLinkByID(item.url);
								}
								return { data: '' };
							})
						);

						for (let i = 0; i <= arr.length - 1; i++) {
							arr[i].audio = response[i].data;
						}
					} catch (error) {
						console.log('Error', error);
					}
				};
				await fetchData();

				setDialog(arr);
			}
		}
	};

	useEffect(() => {
		if (course_id) {
			getCourses(course_id);
		}
	}, [course_id, lesson_id]);

	const [isLoadingLessonDetail, setIsLoadingLessonDetail] = useState(false);
	const [dataCourseSlide, setDataCourseSlide] = useState([]);
	const [contextAudio, setContextAudio] = useState('');

	const getCourses = async (courseId) => {
		let less0ns = [];
		try {
			const { data: currentCourse } = await getCourseByIDPublic(courseId);
			setCurrentCourseData(currentCourse);
			if (currentCourse) {
				const orderedSections = (currentCourse?.sections || []).sort((a, b) => a.index - b.index);
				orderedSections.forEach((session, index) => {
					const orderedLessons = (session?.lessons || []).sort((a, b) => a.index - b.index);
					orderedLessons.forEach((item) => {
						less0ns.push({
							...item,
							sectionIndex: session.id,
						});
					});
				});
				setLessons(less0ns);

				let currentLesson;
				if (lesson_id) {
					const filter = less0ns.filter((s) => s?.id?.toString() === lesson_id?.toString());
					if (filter?.length) {
						currentLesson = filter[0];
					}
				} else if (less0ns.length > 0) {
					currentLesson = less0ns[0];
				}

				if (currentLesson && Object.keys(currentLesson).length) {
					getImageVideo(currentLesson);
					setValues({
						...values,
						...currentLesson,
						lessonObj: currentLesson,
						course: currentCourse?.id,
						lesson: currentLesson.id,
						language: currentCourse?.courseLanguageId,
						level: currentCourse?.levelId,
					});
					setLoaded(true);
					setIsLoadingLessonDetail(true);
					await getListVocabulary(currentLesson.id, false);
					getListVocabulary(currentLesson.id, true);

					await getListPhrase(currentLesson.id, false);
					getListPhrase(currentLesson.id, true);

					await getListGrammar(currentLesson.id, false);
					getListGrammar(currentLesson.id, true);

					getListDrills(currentLesson.id, true);

					const lessonDetail = await getLessonAPI(currentLesson.id);
					if (lessonDetail.dialogs[0].contextAudioId) {
						const audioContextUrl = await viewFileLinkByID(lessonDetail.dialogs[0].contextAudioId);
						const data = lessonDetail.dialogs[0].lines
							.sort((a, b) => a.index - b.index)
							.map((item) => ({
								audio: item.medias[0].s3Location,
								image: item.medias[1] ? item.medias[1].s3Location : '',
								content: item.content,
							}));
						setDataCourseSlide(data);
						setIsLoadingLessonDetail(false);
						setContextAudio(audioContextUrl.data);
					} else {
						const data = lessonDetail.dialogs[0].lines
							.sort((a, b) => a.index - b.index)
							.map((item) => ({
								audio: item.medias[0].s3Location,
								image: item.medias[1] ? item.medias[1].s3Location : '',
								content: item.content,
							}));
						setDataCourseSlide(data);
						setIsLoadingLessonDetail(false);
					}
					loadDialogs(lessonDetail);
					setAIdata([]);
				}
			}
		} catch (error) {
			setIsLoadingLessonDetail(false);
			console.log(`preview lesson ${JSON.stringify(error)}`)
			if(error.data?.message?.includes('Payment')){
				toast.error(t('course.unauthorized_no_pay'));
				router.back();
			} else {
				toast.error(error.data?.message || error.response?.data || 'An error occurred, please refresh the page');
			}
			
		}
	};

	const handleUpdateProgress = () => {
		let sumDrills = 0;
		sumDrills += formatSumDrills(drillData0);
		sumDrills += formatSumDrills(drillData1);
		sumDrills += formatSumDrills(drillData2);
		const sumTotal = vocabulary?.length + phrases?.length + grammar?.length + sumDrills + dialogs?.length;

		if (!isCompletedStep) {
			updateTrackingCourseByID({
				lessonId: lesson_id ? Number(lesson_id) : undefined,
				courseId: course_id ? Number(course_id) : undefined,
				indexStep,
				isCompleted: indexStep === sumTotal,
			});
		}
	};

	const handleRedirect = () => {
		handleUpdateProgress();
		router.push(`/student/myCourses/lesson/introduction?course_id=${course_id}&lesson_id=${lesson_id}`);
	};

	const openPreviewLesson = (lessonId) => {
		setLoaded(false);
		router.push(`${location.pathname}?course_id=${course_id}&lesson_id=${lessonId}`, undefined, {
			shallow: true,
			scroll: false,
		});
		setOpenDrawer(false);
	};

	const orderedSections = (currentCourseData?.sections || []).sort((a, b) => a.index - b.index);
	return (
		<>
			{loaded ? (
				<div className="lesson-preview">
					<div className="lesson-preview-introduction">
						<div className="lesson-preview-introduction-header ps-relative">
							{isAdmin === false ? (
								<div
									// className="lesson-preview-introduction-header-back tw-cursor-pointer"
									onClick={handleRedirect}
									style={{
										position: 'absolute',
										top: 30,
										left: 30,
										color: '#A0A0A0',
										fontSize: 30,
										cursor: 'pointer',
									}}
								>
									<CloseCircleFilled style={{ fontSize: 34, color: '#a0a0a0' }} />
								</div>
							) : null}
							<h1 className="lesson-preview-introduction-header-title">{values?.title}</h1>
							<Button type="text" className="lesson-preview__btn-drawer" onClick={() => setOpenDrawer(true)}>
								<LeftOutlined style={{ fontSize: 25 }} />
							</Button>

							<Drawer
								width={300}
								className="step-flow-drawer"
								title={currentCourseData?.title || 'Greetings & Introduction'}
								placement="right"
								onClose={() => setOpenDrawer(false)}
								open={openDrawer}
							>
								<div className="step-flow-drawer-content">
									<Collapse defaultActiveKey={['0']}>
										{orderedSections.map((section, index) => (
											<Collapse.Panel
												key={index}
												header={
													<b
														style={{
															fontSize: '16px',
															color: 'white',
															display: 'block',
															textTransform: 'capitalize',
														}}
													>
														{section.title}
													</b>
												}
											>
												{lessons
													.filter((s) => s.sectionIndex === section.id)
													.map((lesson) => (
														<a
															key={`lesson-${lesson.id}`}
															className={`lesson-preview__drawer-link step-flow-drawer-item ${
																lesson.id == lesson_id ? 'active' : ''
															}`}
															onClick={() => openPreviewLesson(lesson.id)}
														>
															{lesson.title}
															<Checkbox checked={lesson.id == lesson_id} />
														</a>
													))}
												<Divider style={{ margin: 0, backgroundColor: 'white' }} />
											</Collapse.Panel>
										))}
									</Collapse>
								</div>
							</Drawer>
						</div>
					</div>

					<div className="lesson-preview-introduction-content">
						<LessonContext.Provider
							value={{
								vocabulary,
								grammar,
								phrases,
								vocabularyDrills: drillData0,
								phrasesDrills: drillData1,
								grammarDrills: drillData2,
								dialogs,
								course_id,
								lesson_id,
								isAdmin,
								configNextLesson: {
									openPreviewLesson,
									lesson_id,
									lessons,
								},
							}}
						>
							<BrowserView>
								<Preview
									contextAudio={contextAudio}
									dataCourseSlide={dataCourseSlide}
									isLoadingLessonDetail={isLoadingLessonDetail}
									values={{
										...values,
										video,
										image,
									}}
									setValues={setValues}
									process={{
										indexStep,
										setIndexStep,
										isCompletedStep,
										setComplete,
									}}
									// getLessons={getLessons}
									image={image}
									video={video}
									user={user}
									// getLessonInput={getLessonInput}
									courses={courses}
									lessons={lessons}
									phrases={phrases}
									grammar={grammar}
									AIdata={AIdata}
									vocabulary={vocabulary}
									currentInput={currentInput}
									setCurrentInput={setCurrentInput}
									setVocabulary={setVocabulary}
									setPhrases={setPhrases}
									setGrammar={setGrammar}
									// loadLessonInput={loadLessonInput}

									setImage={setImage}
									setVideo={setVideo}
								/>
							</BrowserView>
							<MobileView>
								<PreviewMobile
									contextAudio={contextAudio}
									dataCourseSlide={dataCourseSlide}
									isLoadingLessonDetail={isLoadingLessonDetail}
									values={{
										...values,
										video,
										image,
									}}
									process={{
										indexStep,
										setIndexStep,
										isCompletedStep,
										setComplete,
									}}
								/>
							</MobileView>
						</LessonContext.Provider>
					</div>
				</div>
			) : (
				<div className="container mt-50">
					<Skeleton active className="mb-20" />
					<Skeleton active className="mb-20" />
					<Skeleton active className="mb-20" />
				</div>
			)}
		</>
	);
};

export default PreviewPage;
