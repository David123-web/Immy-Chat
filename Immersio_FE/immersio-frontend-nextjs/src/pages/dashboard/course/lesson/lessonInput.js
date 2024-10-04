import { VideoCameraFilled } from '@ant-design/icons';
import { Col, Spin, message } from 'antd';
import { createContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import LessonInputCreateForm from '../../../../../components/Instructor/forms/LessonInputCreateForm';
import DashboardRoute from '../../../../../components/routes/DashboardRoute';
import { useLoadCommonCourse } from '../../../../../hooks/useLoadCommonCourse';
import { useMutation } from '../../../../../hooks/useMutation';
// import Resizer from 'react-image-file-resizer'
import { getListFolders } from '@/src/services/folders/apiFolders';
import { BrowserView, MobileView } from 'react-device-detect';
import MobileLessonInputCreateForm from '../../../../../components/Instructor/forms/mobile/MobileLessonInputCreateForm';
import { withTranslationsProps } from '../../../../next/with-app';
import { getCharacters } from '../../../../services/characters/apiChatacters';

import { getAllCourses, getCourseByID, validateCourse } from '../../../../services/courses/apiCourses';

import {
	getAIVoice,
	getDialogAIDataByLessonID,
	getVoiceLanList,
	getVoiceList,
} from '../../../../services/dialogs/apiDialogs';
import { getDrills, postDrill, updateDrill } from '../../../../services/drills/apiDrills';
import {
	deleteFiles,
	uploadFile,
	uploadFileExternal,
	viewFileLinkByID,
	viewFileStreamByID,
	viewFileThumbnailByID,
} from '../../../../services/files/apiFiles';
import { deleteGrammar, getGrammars, postGrammar, updateGrammar } from '../../../../services/grammars/apiGrammars';
import { getLesson, updateLesson } from '../../../../services/lessons/apiLessons';
import { deletePhrase, getPhrases, postPhrase, updatePhrase } from '../../../../services/phrases/apiPhrases';
import {
	deleteVocabulary,
	getVocabularies,
	postVocabulary,
	updateVocabulary,
} from '../../../../services/vocabularies/apiVocabularies';
import { useMobXStores } from '../../../../stores';
import { beforeUpload, getBase64, uuidv4 } from '../../../../utilities/helper';
import { useTranslation } from 'next-i18next';
import { readJsonConfigFile } from 'typescript';

// Using Context to store data for drills from the 3 lesson input sections
export const DataContext1 = createContext();
export const DataContext2 = createContext();
export const DataContext3 = createContext();

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

const mappingDrillTypeRevert = (type) => {
	const typeFormat = '';
	switch (type) {
		case 'flashcards':
			typeFormat = 'FLASH_CARD';
			break;
		case 'dragNdrop':
			typeFormat = 'DRAG_AND_DROP';
			break;
		case 'dragWords':
			typeFormat = 'DRAG_THE_WORDS';
			break;
		case 'multipleChoice':
			typeFormat = 'MULTIPLE_CHOICES';
			break;
		case 'fillBlank':
			typeFormat = 'LISTEN_AND_FILL_BLANKS';
			break;

		default:
			typeFormat = 'SORT_THE_PARAGRAPH';
			break;
	}

	return typeFormat;
};

const LessonInputCreate = () => {
	const { t } = useTranslation();
	const [loadingSpinning, setLoadingSpinning] = useState(false);
	const [values, setValues] = useState({
		course: undefined,
		lesson: undefined,
		input: {
			vocabulary: { input: [], drills: [] },
			phrases: { input: [], drills: [] },
			grammar: { input: [], drills: [] },
			AI: { input: [{ line: '', alternativeAnswers: [''] }] },
		},
	});

	const [valuesErr, setValuesErr] = useState({});
	const [vocabulary, setVocabulary] = useState([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
	const [phrases, setPhrases] = useState([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
	const [grammar, setGrammar] = useState([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
	const [AIdata, setAIdata] = useState([{ line: '', alternativeAnswers: [''] }]);
	const [currentInput, setCurrentInput] = useState({
		index: undefined,
		uploadingImage: false,
		uploadingVideo: false,
		uploadingAudio: false,
	});

	const [courses, setCourses] = useState([]);
	const [lessons, setLessons] = useState([]);
	const [image, setImage] = useState('');
	const [video, setVideo] = useState('');
	const [previewID, setPreviewID] = useState('');
	const [previewVideoID, setPreviewVideoID] = useState('');

	const [uploading, setUploading] = useState(false);
	const [inputProgress, setInputProgress] = useState(0);

	const [activePanelsVocabulary, setActivePanelsVocabulary] = useState([0]);
	const [activePanelsPhrases, setActivePanelsPhrases] = useState([0]);
	const [activePanelsGrammar, setActivePanelsGrammar] = useState([0]);
	const [activePanelsAI, setActivePanelsAI] = useState([0]);

	const [previewCourse, setPreviewCourse] = useState('');

	const { userStore } = useMobXStores();
	const user = JSON.parse(JSON.stringify(userStore.currentUser));
	const { tags, languages, levels, allInstructors } = useLoadCommonCourse({ isPublic: false });

	const [drillData0, setDrillData0] = useState([]);
	const [drillData1, setDrillData1] = useState([]);
	const [drillData2, setDrillData2] = useState([]);
	const [drillDataLoaded, setDrillDataLoaded] = useState(false);

	const [characters, setCharacters] = useState([]);

	const [currentVoice, setCurrentVoice] = useState('');
	const [voiceList, setVoiceList] = useState([]);
	const [voiceLanList, setVoiceLanList] = useState([]);
	const [dialogs, setDialog] = useState([{ id: '', characterId: '', line: '', audio: null }]);

	const [editGroup, setEditGroup] = useState({
		vocabulary: false,
		phrases: false,
		grammar: false,
		drills: false,
	});

	useEffect(() => {
		loadVoiceLanList();
	}, []);

	const loadVoiceLanList = async () => {
		try {
			const response = await getVoiceLanList();
			if (response?.data) {
				setVoiceLanList(response?.data);
			}
		} catch (error) {
			console.log(`ERROR: \n\n loadvoicelanlist ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		}
	};

	const loadVoiceList = async (language) => {
		try {
			const response = await getVoiceList(language);
			if (response?.data) {
				setVoiceList(response?.data);
				setCurrentVoice({ ...currentVoice, codeLanguage: language });
			}
		} catch (error) {
			console.log(`ERROR: \n\n loadvoicelist ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		}
	};

	const getAudioContext = () => {
		AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContent = new AudioContext();
		return audioContent;
	};

	function toArrayBuffer(buf) {
		const ab = new ArrayBuffer(buf.length);
		const view = new Uint8Array(ab);
		for (let i = 0; i < buf.length; ++i) {
			view[i] = buf[i];
		}
		return ab;
	}

	const _audioFolder = useRef(null);
	useQuery('GET_ROOT_FOLDER', () => getListFolders({ fixed: true }), {
		onSuccess: (res) => {
			const audioFolder = res.data.find((x) => x.name === 'Audio');
			_audioFolder.current = audioFolder;
		},
		onError: (error) => {
			console.log(`ERROR: \n\n usequery ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		},
	});

	useEffect(() => {
		loadCourses();
		loadCharacters();
	}, []);

	const loadCourses = async () => {
		console.log(`lessonInput: loadCourses`)
		try {
			const response = await getAllCourses();
			if (response?.data) {
				setCourses(response.data);
			}
		} catch (error) {
			console.log(`ERROR: \n\n useffect loadcourses ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		}
	};

	const loadCharacters = async () => {
		console.log(`lessonInput: loadCharacters`)
		try {
			const response = await getCharacters();
			if (response?.data) {
				setCharacters(response.data);
			}
		} catch (error) {
			console.log(`ERROR: \n\n loadchars ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		}
	};

	const getImageVideo = async (currentLesson) => {
		console.log(`lessonInput: getImageVideo`)
		if (currentLesson.thumbnailId) {
			setPreviewID(currentLesson.thumbnailId);
			try {
				const responseThumb = await viewFileThumbnailByID(currentLesson.thumbnailId);
				if (responseThumb?.data) {
					setImage(responseThumb.data);
				}
			} catch (error) {
				console.log(`ERROR: \n\n getImageVideo ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			}
		} else {
			setImage('');
		}
		if (currentLesson.instructionVideoId) {
			setPreviewVideoID(currentLesson.instructionVideoId);
			try {
				if (currentLesson?.instructionVideo?.externalLink) {
					const responseVideo = await viewFileStreamByID(currentLesson.instructionVideoId);
					if (responseVideo?.data) {
						setVideo(responseVideo.data?.externalLink);
					}
				} else {
					const responseVideo = await viewFileLinkByID(currentLesson.instructionVideoId);
					if (responseVideo?.data) {
						setVideo(responseVideo.data);
					}
				}
			} catch (error) {
				console.log(`ERROR: \n\n getImageVideo ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			}
		} else {
			setVideo('');
			setPreviewVideoID('');
		}
	};

	const getLessonAPI = async (lessonId) => {
		console.log(`lessonInput: getLessonAPI`)
		try {
			const response = await getLesson(lessonId);
			return response?.data;
		} catch (error) {
			return {};
		}
	};

	const getVocabularyAPI = async (id) => {
		console.log(`lessonInput: getVocabularyAPI`)
		try {
			const response = await getVocabularies({ lessonId: id });
			return response?.data;
		} catch (error) {
			return [];
		}
	};

	const getPhraseAPI = async (id) => {
		console.log(`lessonInput: getPhraseAPI`)
		try {
			const response = await getPhrases({ lessonId: id });
			return response?.data;
		} catch (error) {
			return [];
		}
	};

	const getGrammarAPI = async (id) => {
		console.log(`lessonInput: getGrammarAPI`)
		try {
			const response = await getGrammars({ lessonId: id });
			return response?.data;
		} catch (error) {
			return [];
		}
	};

	const getAIAPI = async (id) => {
		console.log(`lessonInput: getAIAPI`)
		try {
			const response = await getDialogAIDataByLessonID(id);
			return response?.data;
		} catch (error) {
			return [];
		}
	};

	const getDrillsAPI = async (id) => {
		console.log(`lessonInput: getDrillsAPI`)
		try {
			const response = await getDrills({ lessonId: id });
			return response?.data;
		} catch (error) {
			return [];
		}
	};

	const tmpVocabulary = useRef([]);
	const [loadingVocabularyImage, setLoadingVocabularyImage] = useState(false);

	//          getListVocabulary

	const getListVocabulary = async (lessonID, flowGetImage = false) => {
		console.log(`lessonInput: lessonInput`)
		if (flowGetImage === true) {
			setLoadingVocabularyImage(true);
			let response = JSON.parse(JSON.stringify(tmpVocabulary?.current));
			let arr = [];
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
							try {
								const response = await viewFileLinkByID(field.id);
								if (response?.data) {
									if (field.type === 'IMAGE') {
										arrStream = {
											...arrStream,
											image: response.data,
											image_name: `${field.name}.${field.ext}`,
											image_id: field.id,
										};
									}
									if (field.type === 'VIDEO') {
										arrStream = {
											...arrStream,
											video: response.data,
											video_name: `${field.name}.${field.ext}`,
											video_id: field.id,
										};
									}
									if (['OTHER', 'AUDIO'].includes(field.type)) {
										arrStream = {
											...arrStream,
											audio: response.data,
											audio_name: `${field.name}.${field.ext}`,
											audio_id: field.id,
										};
									}
								}
							} catch (error) {
								console.log(`ERROR: \n\ngetListVocab ${JSON.stringify(error, null, 2)}`);
								//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
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
			}

			setVocabulary(arr);
			tmpVocabulary.current = [];
			setLoadingVocabularyImage(false);
		} else {
			let response = await getVocabularyAPI(lessonID);
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
				setActivePanelsVocabulary([arr?.length]);
				tmpVocabulary.current = arr;
			}
		}
	};

	const tmpPhrase = useRef([]);
	const [loadingPhraseImage, setLoadingPhraseImage] = useState(false);

	const getListPhrase = async (lessonID, flowGetImage = false) => {
		if (flowGetImage === true) {
			setLoadingPhraseImage(true);
			let response = JSON.parse(JSON.stringify(tmpPhrase?.current));
			let arr = [];
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
							try {
								const response = await viewFileLinkByID(field.id);
								if (response?.data) {
									if (field.type === 'IMAGE') {
										arrStream = {
											...arrStream,
											image: response.data,
											image_name: `${field.name}.${field.ext}`,
											image_id: field.id,
										};
									}
									if (field.type === 'VIDEO') {
										arrStream = {
											...arrStream,
											video: response.data,
											video_name: `${field.name}.${field.ext}`,
											video_id: field.id,
										};
									}
									if (['OTHER', 'AUDIO'].includes(field.type)) {
										arrStream = {
											...arrStream,
											audio: response.data,
											audio_name: `${field.name}.${field.ext}`,
											audio_id: field.id,
										};
									}
								}
							} catch (error) {
								//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
								console.log(`ERROR: \n\ngetListPhrase ${JSON.stringify(error, null, 2)}`);
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
			}

			setPhrases(arr);
			tmpPhrase.current = [];
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
				setActivePanelsPhrases([arr?.length]);
				tmpPhrase.current = arr;
			}
		}
	};

	const tmpGrammar = useRef([]);
	const [loadingGrammarImage, setLoadingGrammarImage] = useState(false);

	const getListGrammar = async (lessonID, flowGetImage = false) => {
		console.log(`lessonInput: lessonInput`)
		if (flowGetImage === true) {
			setLoadingGrammarImage(true);
			let response = JSON.parse(JSON.stringify(tmpGrammar?.current));
			let arr = [];
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
							try {
								const response = await viewFileLinkByID(field.id);
								if (response?.data) {
									if (field.type === 'IMAGE') {
										arrStream = {
											...arrStream,
											image: response.data,
											image_name: `${field.name}.${field.ext}`,
											image_id: field.id,
										};
									}
									if (field.type === 'VIDEO') {
										arrStream = {
											...arrStream,
											video: response.data,
											video_name: `${field.name}.${field.ext}`,
											video_id: field.id,
										};
									}
									if (['OTHER', 'AUDIO'].includes(field.type)) {
										arrStream = {
											...arrStream,
											audio: response.data,
											audio_name: `${field.name}.${field.ext}`,
											audio_id: field.id,
										};
									}
								}
							} catch (error) {
								//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
								console.log(`ERROR: \n\ngetListGrammar ${JSON.stringify(error, null, 2)}`);
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
			}

			setGrammar(arr);
			tmpGrammar.current = [];
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
				setActivePanelsGrammar([arr?.length]);
				tmpGrammar.current = arr;
			}
		}
	};

	const handleFormatData = async (source) => {
		console.log(`lessonInput: handleFormatData`)
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
		console.log(`lessonInput: getListDrills`)
		console.log(`___ getListDrills lessonID ${lessonID}`);
		setDrillData0([]);
		setDrillData1([]);
		setDrillData2([]);
		console.log(`getListDrills lessonID: ${lessonID}`);
		setLoadingDrillsImage(true);
		try {
			let response = await getDrillsAPI(lessonID);
			console.log(`getListDrills: ${JSON.stringify(response, null, 4)}`);
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

				setDrillDataLoaded(true);
			} else {
				setDrillData0([]);
				setDrillData1([]);
				setDrillData2([]);
			}
		} catch {
			console.log(`error loading ${error}`);
		} finally {
			setLoadingDrillsImage(false);
		}
	};


	const getDrillSection = async (lessonID, drillType, flowGetImage = false) => {
		console.log(`lessonInput: getListDrills`)
		console.log(`___ getListDrills lessonID ${lessonID}`);
		setDrillData0([]);
		setDrillData1([]);
		setDrillData2([]);
		console.log(`getListDrills lessonID: ${lessonID}`);
		setLoadingDrillsImage(true);
		try {
			let response = await getDrillsAPI(lessonID);
			console.log(`getListDrills: ${JSON.stringify(response, null, 4)}`);
			if (response.length) {
				if(drillType === 'VOCABULARY'){
					const filterVocabulary = response.filter((session) => session.sectionType === 'VOCABULARY');
					const orderedVocabulary = (filterVocabulary || []).sort((a, b) => a.index - b.index);
					const formatDataVocabulary = await handleFormatData(orderedVocabulary, flowGetImage);
					setDrillData0(formatDataVocabulary);
				} else if(drillType === 'PHRASE'){
					const filterPhrase = response.filter((session) => session.sectionType === 'PHRASE');
					const orderedPhrase = (filterPhrase || []).sort((a, b) => a.index - b.index);
					const formatDataPhrase = await handleFormatData(orderedPhrase, flowGetImage);
					setDrillData1(formatDataPhrase);
				} else if(drillType === 'GRAMMAR'){
					const filterGrammar = response.filter((session) => session.sectionType === 'GRAMMAR');
					const orderedGrammar = (filterGrammar || []).sort((a, b) => a.index - b.index);
					const formatDataGrammar = await handleFormatData(orderedGrammar, flowGetImage);
					setDrillData2(formatDataGrammar);

				}
				setDrillDataLoaded(true);
			} else {
				setDrillData0([]);
				setDrillData1([]);
				setDrillData2([]);
			}
		} catch {
			console.log(`error loading ${error}`);
		} finally {
			setLoadingDrillsImage(false);
		}
	};

	const loadDialogs = async (lessonDetail) => {
		console.log(`lessonInput: loadDialogs`)
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
							const responseVideo = await viewFileLinkByID(dataCompare[i].medias[0].id);
							if (responseVideo?.data) {
								arrStream = {
									...arrStream,
									audio: responseVideo.data,
									audio_id: dataCompare[i].medias[0].id,
									audio_name: `${dataCompare[i].medias[0]?.name}.${dataCompare[i].medias[0]?.ext}`,
								};
							}
						} catch (error) {
							//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
							console.log(`ERROR: \n\n loadDialogs ${JSON.stringify(error, null, 2)}`);
						}
					}

					arr.push({
						id: dataCompare[i].id,
						characterId: dataCompare[i].characterId,
						line: dataCompare[i].content,
						...arrStream,
					});
				}

				setDialog(arr);
			}
		}
	};

	const getCurrentLesson = (lessons) => {
		console.log(`lessonInput: getCurrentLesson`)
		if (userActivityStore.currentCourseEdit.lessonId) {
			let lesson = lessons.find((l) => l.id === userActivityStore.currentCourseEdit.lessonId);
			console.log(` getCurrentLesson found from store id ${JSON.stringify(lesson, null, 1)}`);
			return lesson;
		} else if (lessons?.length) {
			console.log(` getCurrentLesson first lessone in array ${JSON.stringify(lessons[0], null, 1)}`);
			return lessons[0];
		} else {
			console.log(` getCurrentLesson Nada :(`);
			return null;
		}
	};













	//           getLessons
	const getLessons = async (courseId) => {
		console.log(`lessonInput: getLessons`)
		setVocabulary([]);
		setPhrases([]);
		setGrammar([]);
		setDrillData0([]);
		setDrillData1([]);
		setDrillData2([]);
		setDialog([]);

		setTimeout(async () => {
			setLoadingSpinning(true);

			let less0ns = [];
			try {
				const { data: currentCourse } = await getCourseByID(courseId);
				if (currentCourse) {
					const orderedSections = (currentCourse?.sections || []).sort((a, b) => a.index - b.index);
					orderedSections.forEach((session) => {
						const orderedLessons = (session?.lessons || []).sort((a, b) => a.index - b.index);
						orderedLessons.forEach((item) => {
							less0ns.push(item);
						});
					});
					setLessons(less0ns);

					const currentLesson = getCurrentLesson(less0ns);

					if (currentLesson && Object.keys(currentLesson).length) {
						const lessonDetail = await getLessonAPI(currentLesson.id);

						if (lessonDetail && Object.keys(lessonDetail).length) {
							setValues({
								...values,
								...lessonDetail,
								lessonObj: lessonDetail,
								course: currentCourse?.id,
								lesson: currentLesson.id,
								language: currentCourse?.courseLanguageId,
								level: currentCourse?.levelId,
							});

							await getListVocabulary(currentLesson.id, false);
							await getListPhrase(currentLesson.id, false);
							await getListGrammar(currentLesson.id, false);

							getListVocabulary(currentLesson.id, true);
							getListPhrase(currentLesson.id, true);
							getListGrammar(currentLesson.id, true);
							getListDrills(currentLesson.id, true);
							loadDialogs(lessonDetail);
							getImageVideo(lessonDetail);
						} else {
							setValues({
								lessonObj: {},
								course: currentCourse?.id,
								lesson: currentLesson.id,
								language: currentCourse?.courseLanguageId,
								level: currentCourse?.levelId,
							});

							setVocabulary([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
							setPhrases([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
							setGrammar([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
							setAIdata([{ line: '', alternativeAnswers: [''] }]);
						}
					}
				}
			} catch (error) {
				console.log(`ERROR: \n\n getLessons ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			} finally {
				setLoadingSpinning(false);
			}
		}, 0);
	};

	const getCourseId = (courseId) => {
		console.log(`lessonInput: getCourseId`)
		if (courseId) {
			return courseId;
		} else {
			return values.course;
		}
	};


	
	const loadLessonInput = async (lessonId, courseId = null) => {
		console.log(`lessonInput: loadLessonInput`)
		setLoadingSpinning(true);
		toast(t('course.loading'), {
			position: 'top-right',
			autoClose: 2500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		console.log(`loadLessonInput ${lessonId}`);
		setVocabulary([]);
		setPhrases([]);
		setGrammar([]);
		setDrillData0([]);
		setDrillData1([]);
		setDrillData2([]);
		setDialog([]);

		setTimeout(async () => {
			setLoadingSpinning(true);
			try {
				const cId = getCourseId(courseId);
				console.log(`course Id is ${cId}`);

				const { data: currentCourse } = await getCourseByID(cId);
				console.log(`getting lesson detail  ${lessonId}`);
				let lessonDetail = await getLessonAPI(lessonId);
				console.log(`got lesson detail ${lessonDetail.id}`);

				if (lessonDetail && Object.keys(lessonDetail).length) {
					setValues({
						...values,
						...lessonDetail,
						lessonObj: lessonDetail,
						course: currentCourse?.id,
						lesson: lessonId,
						language: currentCourse?.courseLanguageId,
						level: currentCourse?.levelId,
					});

					await getListVocabulary(lessonId, false);
					await getListPhrase(lessonId, false);
					await getListGrammar(lessonId, false);

					getListVocabulary(lessonId, true);
					getListPhrase(lessonId, true);
					getListGrammar(lessonId, true);
					getListDrills(lessonId, true);
					getImageVideo(lessonDetail);
				} else {
					setValues({
						lessonObj: {},
						course: currentCourse?.id,
						lesson: lessonId,
						language: currentCourse?.courseLanguageId,
						level: currentCourse?.levelId,
						video: '',
						image: '',
						input: {
							vocabulary: { input: [], drills: [] },
							phrases: { input: [], drills: [] },
							grammar: { input: [], drills: [] },
							AI: { input: [] },
						},
					});
					setVocabulary([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
					setPhrases([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
					setGrammar([{ input: '', explanation: '', image: '', audio: '', video: '' }]);
					setAIdata([{ line: '', alternativeAnswers: [''] }]);
				}
			} catch (error) {
				console.log(`ERROR: \n\n loadLessonInput ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			} finally {
				setLoadingSpinning(false);
			}
		}, 0);
	};


    const dispatchDrillAPICall = async (formatData, id) => {
		let result = undefined;
		if(id){
			result = await updateDrill(formatData)
		} else {
			result = await postDrill(formatData)
		}
		console.log(`dispatchDrillAPICall RESPONSE = ${result}`)
	}


	const parseAndSubmitData = async (drillData, type) => {
		console.log(`lessonInput: parseAndSubmitData`)
		console.log(`parseAndSubmitData ${type}`);
		console.log(`parseAndSubmitData drill data ${JSON.stringify(drillData, null, 3)}`);

		if (drillData?.length) {
			const drillDataTouched = await filterTouched(drillData);
			for (let i = 0; i <= drillDataTouched.length - 1; i++) {
				const getField = drillDataTouched[i];
				const detectCallAPI = getField.id ?  updateDrill :  postDrill;

				let inputId = undefined;
				switch (type) {
					case 'VOCABULARY':
						inputId = vocabulary.filter((item) => item?.id)?.pop()?.id || 'string';
						break;

					case 'PHRASE':
						inputId = phrases.filter((item) => item?.id)?.pop()?.id || 'string';
						break;

					default:
						inputId = grammar.filter((item) => item?.id)?.pop()?.id || 'string';
						break;
				}

				let formatData = {
					id: getField.id || undefined,
					parentId: getField.parentId || inputId,
					index: i,
					instruction: getField.instruction || getField.drillType,
					lessonId: values.lesson,
					sectionType: type,
					data: [],
					type: mappingDrillTypeRevert(getField.drillType),
				};
				const parseData = [];
				if (drillDataTouched[i].drillType === FLASH_CARD) {
					let arrImages = [];
					if (getField?.images?.length) {
						for (let ii = 0; ii <= getField.images.length - 1; ii++) {
							const getFieldImage = getField?.images?.length ? getField.images[ii] : '';
							const getFieldImageIds = getField?.images_ids?.length ? getField.images_ids[ii] : '';

							if (getFieldImage instanceof File) {
								try {
									const formData = new FormData();
									formData.append('file', getFieldImage);
									formData.append('public', 'false');

									const response = await uploadFile(formData);
									console.log(`parseAndSubmit flashcard RESPONSE} ${JSON.stringify(response.data)}`)
									if (response?.data) {
										arrImages.push(response?.data?.id);
									}
								} catch (error) {
									console.log(`ERROR: \n\n parseandsubmitdata ${JSON.stringify(error, null, 2)}`);
									toast(`[${FLASH_CARD}, ${DRAG_AND_DROP}] Image upload failed. Try later.`);
									toast.error(
										error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)'
									);
								}
							} else {
								arrImages.push(getFieldImageIds);
							}
						}

						if (getField?.questions?.length) {
							getField.questions.forEach((item, index) => {
								parseData.push({
									id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
									index,
									question: item || '',
									content: getField?.answers?.length ? [getField.answers[index]?.toString()] : [],
									media: arrImages?.length ? arrImages[index] : undefined,
									correctIndex: 0,
								});
							});
						}

						formatData.data = parseData;

						await dispatchDrillAPICall(formatData, getField.id)

					} else {
						if (getField?.questions?.length) {
							getField.questions.forEach((item, index) => {
								parseData.push({
									id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
									index,
									question: item || '',
									content: getField?.answers?.length ? [getField.answers[index]?.toString()] : [],
									media: arrImages?.length ? arrImages[index] : undefined,
									correctIndex: 0,
								});
							});
						}
						formatData.data = parseData;
						await dispatchDrillAPICall(formatData, getField.id)

					}
				}

				if (drillDataTouched[i].drillType === DRAG_AND_DROP) {
					let arrImages = [];
					if (getField?.images?.length) {
						for (let ii = 0; ii <= getField.images.length - 1; ii++) {
							const getFieldImage = getField?.images?.length ? getField.images[ii] : '';
							const getFieldImageIds = getField?.images_ids?.length ? getField.images_ids[ii] : '';

							if (getFieldImage instanceof File) {
								try {
									const formData = new FormData();
									formData.append('file', getFieldImage);
									formData.append('public', 'false');

									const response = await uploadFile(formData);
									if (response?.data) {
										arrImages.push(response?.data?.id);
									}
								} catch (error) {
									toast(`[${FLASH_CARD}, ${DRAG_AND_DROP}] Image upload failed. Try later.`);
									toast.error(
										error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)'
									);
									console.log(`ERROR: \n\n parseandsubmitdata ${JSON.stringify(error, null, 2)}`);
								}
							} else {
								arrImages.push(getFieldImageIds);
							}
						}

						if (getField?.images?.length) {
							getField.images.forEach((item, index) => {
								parseData.push({
									id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
									index,
									question: `image-${index + 1}`,
									content: getField?.answers?.length ? [getField.answers[index]?.toString()] : [],
									media: arrImages?.length ? arrImages[index] : undefined,
									correctIndex: 0,
								});
							});
						}

						formatData.data = parseData;
						await dispatchDrillAPICall(formatData, getField.id)
					} else {
						if (getField?.answers?.length) {
							getField.questions.forEach((item, index) => {
								parseData.push({
									id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
									index,
									question: item || '',
									content: getField?.answers?.length ? [getField.answers[index]?.toString()] : [],
									media: arrImages?.length ? arrImages[index] : undefined,
									correctIndex: 0,
								});
							});
						}

						formatData.data = parseData;
						await dispatchDrillAPICall(formatData, getField.id)
					}
				}

				if (drillDataTouched[i].drillType === DRAG_THE_WORDS) {
					if (getField?.statements?.length) {
						getField.statements.forEach((item, index) => {
							parseData.push({
								id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
								index,
								question: item || '',
								content: [],
								correctIndex: 0,
							});
						});
					}

					formatData.data = parseData;
					await dispatchDrillAPICall(formatData, getField.id)
				}

				if (drillDataTouched[i].drillType === MULTIPLE_CHOICES) {
					if (getField?.questions?.length) {
						getField.questions.forEach((item, index) => {
							parseData.push({
								id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
								index,
								question: item || '',
								content: getField?.array_of_answers?.length ? getField.array_of_answers[index] : [],
								correctIndex: getField?.correct_answers?.length ? getField.correct_answers[index] : undefined,
							});
						});
					}

					formatData.data = parseData;
					await dispatchDrillAPICall(formatData, getField.id)
				}

				if (drillDataTouched[i].drillType === SORT) {
					if (getField?.questions?.length) {
						getField.questions.forEach((item, index) => {
							let obj = {
								id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
								index,
								question: item || '',
								content: getField?.array_of_answers?.length ? getField.array_of_answers[index] : [],
								correctIndex: 0,
							};
							const filtered = obj.content.filter(function (el) {
								return el != null;
							});
							obj.content = filtered;

							parseData.push(obj);
						});
					}

					formatData.data = parseData;
					await dispatchDrillAPICall(formatData, getField.id)
				}

				if (drillDataTouched[i].drillType === LISTEN_AND_FILL_BLANKS) {
					let arrAudios = [];
					if (getField?.audios?.length) {
						for (let ii = 0; ii <= getField.audios.length - 1; ii++) {
							const getFieldAudio = getField?.audios?.length ? getField.audios[ii] : undefined;
							const getFieldAudioIds = getField?.audios_ids?.length ? getField.audios_ids[ii] : undefined;

							if (getFieldAudio instanceof File) {
								try {
									const formData = new FormData();
									formData.append('file', getFieldAudio);
									formData.append('public', 'false');

									const response = await uploadFile(formData);
									if (response?.data) {
										arrAudios.push(response?.data?.id);
									}
								} catch (error) {
									console.log(`ERROR: \n\n parseandsubmitdata ${JSON.stringify(error, null, 2)}`);
									toast(`[${LISTEN_AND_FILL_BLANKS}] Image upload failed. Try later.`);
									toast.error(
										error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)'
									);
								}
							} else {
								arrAudios.push(getFieldAudioIds);
							}
						}

						if (getField?.descriptions?.length) {
							getField.descriptions.forEach((item, index) => {
								parseData.push({
									id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
									index,
									question: item || '',
									content: getField?.statements?.length ? [getField.statements[index]?.toString()] : [],
									media: arrAudios?.length ? arrAudios[index] : undefined,
									correctIndex: 0,
								});
							});
						}

						formatData.data = parseData;
						await dispatchDrillAPICall(formatData, getField.id)
					} else {
						if (getField?.descriptions?.length) {
							getField.descriptions.forEach((item, index) => {
								parseData.push({
									id: getField?.drill_id?.length ? getField.drill_id[index] : (index + 1).toString(),
									index,
									question: item || '',
									content: getField?.statements?.length ? [getField.statements[index]?.toString()] : [],
									media: arrAudios?.length ? arrAudios[index] : undefined,
									correctIndex: 0,
								});
							});
						}

						formatData.data = parseData;
						await dispatchDrillAPICall(formatData, getField.id)
					}
				}
			}
			await unTouchAll(drillData);
		}
		console.log(`====== BAS lessonInput: parseAndSubmitData =======`)
	};

	const filterTouched = async (data) => {
		return data.filter((element) => element.touched === true);
	};

	const touchAll = async (data) => {
		for (let i = 0; i < data.length; i++) {
			data[i].touched = true;
		}
	};

	const unTouchAll = async (data) => {
		for (let i = 0; i < data.length; i++) {
			data[i].touched = false;
		}
	};

	const withValidatedIndices = async (data) => {
		for (let i = 0; i < data.length; i++) {
			data[i].index = i;
		}
		return data;
	};

	const updateInput = async (data, dataType, mediasArr) => {
		console.log(`lessonInput: updateInput`)
		try {
			let result = null;
			if (dataType == 'vocabulary') {
				result = await updateVocabulary({
					id: data.id,
					lessonId: values.lesson,
					value: data.input,
					explanation: data.explanation,
					medias: mediasArr,
					index: data.index,
				});
			} else if (dataType == 'phrases') {
				result = await updatePhrase({
					id: data.id,
					lessonId: values.lesson,
					value: data.input,
					explanation: data.explanation,
					medias: mediasArr,
					index: data.index,
				});
			} else if (dataType == 'grammar') {
				result = await updateGrammar({
					id: data.id,
					lessonId: values.lesson,
					value: data.input,
					explanation: data.explanation,
					medias: mediasArr,
					index: data.index,
				});
			}
		} catch (error) {
			console.log(`ERROR: CREATE UPDATE FAILED on ${dataType} ${error}`);
		}
	};

	const createInput = async (data, dataType, mediasArr) => {
		console.log(`lessonInput: createInput`)
		let result = null;
		if (dataType == 'vocabulary') {
			result = await postVocabulary({
				lessonId: values.lesson,
				value: data.input,
				explanation: data.explanation,
				medias: mediasArr,
				index: data.index,
			});
		} else if (dataType == 'phrases') {
			result = await postPhrase({
				lessonId: values.lesson,
				value: data.input,
				explanation: data.explanation,
				medias: mediasArr,
				index: data.index,
			});
		} else if (dataType == 'grammar') {
			result = await postGrammar({
				lessonId: values.lesson,
				value: data.input,
				explanation: data.explanation,
				medias: mediasArr,
				index: data.index,
			});
		}
		return result;
	};

	const updateDataAPI = async (data = [], dataType) => {
		console.log(`lessonInput: updateDataAPI ${dataType}`)
		try {
			for (let i = 0; i < data.length; i++) {
				if (data[i].touched) {
					if (data[i].input && data[i].explanation) {
						let mediasArr = [];
						if (data[i].image_id) mediasArr.push(data[i].image_id);
						if (data[i].audio_id) mediasArr.push(data[i].audio_id);
						if (data[i].video_id) mediasArr.push(data[i].video_id);

						if (data[i].id) {
							await updateInput(data[i], dataType, mediasArr);
						} else {
							const result = await createInput(data, dataType, mediasArr)
							data[i].id = result.data.id;
						}
					}
				}
			}
		} catch (error) {
			console.log(`ERROR ${error}`);
			console.log(error);
		}
	};

	const saveAll = async (data, dataType) => {
		console.log(`lessonInput: saveAll`)
		await withValidatedIndices(data);
		await touchAll(data);
		await updateDataAPI(data, dataType);
		data.sort((a, b) => a.index - b.index);
	};

	const submitDrillData = async (drillData0, drillData1, drillData2) => {
		console.log(`lessonInput: submitDrillData`)
		setLoadingSpinning(true);

		let formatData = {
			id: values.lesson,
			index: values.index,
			courseSectionId: values?.lessonObj?.courseSectionId || undefined,
			context: values?.context,
			introduction: values.introduction,
		};

		await saveAll(vocabulary, 'vocabulary');
		await saveAll(phrases, 'phrases');
		await saveAll(grammar, 'grammar');

		await touchAll(drillData0);
		await parseAndSubmitData(drillData0, 'VOCABULARY');
		await touchAll(drillData1);
		await parseAndSubmitData(drillData1, 'PHRASE');
		await touchAll(drillData2);
		await parseAndSubmitData(drillData2, 'GRAMMAR');

		setTimeout(() => {
			setDrillData0([]);
			setDrillData1([]);
			setDrillData2([]);
			getListDrills(values.lesson, true);

			toast(t('dashboard.notification.create_lesson_updated'), {
				position: 'top-right',
				autoClose: 2500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			setLoadingSpinning(false);
		}, 2000);

		const courseStatus = await validateCourse(values.course)
		
		showStatus(courseStatus.data);

	};

	const showStatus = (courseStatus) => {
		console.log(`=+=+=+ ${JSON.stringify(courseStatus, null, 2)}`)
		if(!courseStatus.isValid){
			
			if(!courseStatus.courseTitle){
				toastInfo( 'The course needs a title.');
			}  
			if(!courseStatus.instructionVideo){
				toastInfo( 'The course needs an introductory video.');
			}  
			if(!courseStatus.hasLessons){
				toastInfo( 'The course needs some lessons.');
			}  
			if(!courseStatus.hasSections){
				toastInfo( 'The course needs some sections.');
			} 
			for (const lesson of courseStatus.lessons){
				console.log(`||||||| ${JSON.stringify(lesson, null, 2)}`);

				if(!lesson.hasDialog){
					toastInfo( `Lesson ${lesson.title} needs a dialog.`);
				}
				if(!lesson.hasVocabulary){
					toastInfo( `Lesson ${lesson.title} needs some vocabulary inputs.`);
				}

			}
			toastInfo( 'Your course will be visible to students when is is complete.')	
			
		}
	}
	const toastInfo = (message) => {
		toast(`${message}`, {
			position: "top-right",
			autoClose: 30000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
			});
	}


	const submitVocabulary = async (data, dataType) => {
		console.log(`lessonInput: submitVocabulary`)
		withValidatedIndices(data);
		let touchedElements = await filterTouched(data);
		await updateDataAPI(touchedElements, dataType);
	};

	const addAISubLine = ({ index }) => {
		console.log(`lessonInput: addAISubLine`)
		let aiList = [...AIdata];
		aiList[index].alternativeAnswers.push('');
		setAIdata(aiList);
	};

	const addAIdataSubLine = ({ index, subIndex, value }) => {
		console.log(`lessonInput: addAIdataSubLine`)
		let AIlist = [...AIdata];
		subList[index].alternativeAnswers[subIndex] = value;
		setAIdata(AIlist);
	};

	// Handle Video/Image/Video

	const handleChangeMedia = (e) => {
		console.log(`lessonInput: handleChangeMedia`)
		setValues({ ...values, fileExternal: e.target.value });
	};

	const handleInputImageMyDrive = ({ image, imageConfig }) => {
		console.log(`lessonInput: handleInputImageMyDrive`)
		setCurrentInput({ ...currentInput, uploadingImage: true });
		if (currentInput.type === 'vocabulary') {
			let list = [...vocabulary];
			list[currentInput.index].image = image;
			list[currentInput.index].image_name = imageConfig.name;
			list[currentInput.index].image_id = imageConfig.id;
			setVocabulary(list);
			setUpdateEditGroup({ type: 'vocabulary', value: true });
		}
		if (currentInput.type === 'phrases') {
			let list = [...phrases];
			list[currentInput.index].image = image;
			list[currentInput.index].image_name = imageConfig.name;
			list[currentInput.index].image_id = imageConfig.id;
			setPhrases(list);
			setUpdateEditGroup({ type: 'phrases', value: true });
		}
		if (currentInput.type === 'grammar') {
			let list = [...grammar];
			list[currentInput.index].image = image;
			list[currentInput.index].image_name = imageConfig.name;
			list[currentInput.index].image_id = imageConfig.id;
			setGrammar(list);
			setUpdateEditGroup({ type: 'grammar', value: true });
		}
		setCurrentInput({ ...currentInput, image: image, image_name: imageConfig.name, uploadingImage: false });
	};

	const handleInputImage = async ({ info, drillData0, drillData1, drillData2 }) => {
		console.log(`lessonInput: lessonInput`)
		if (beforeUpload(info?.file)) {
			try {
				const formData = new FormData();
				formData.append('file', info.file);
				formData.append('public', 'false');
				setCurrentInput({ ...currentInput, uploadingImage: true });

				const reader = new FileReader();
				reader.readAsDataURL(info.file);
				getBase64(info.file, async (url) => {
					const response = await uploadFile(formData);
					if (response?.data) {
						if (currentInput.type === 'vocabulary') {
							let list = [...vocabulary];
							list[currentInput.index].image = url;
							list[currentInput.index].image_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].image_id = response?.data?.id;
							setVocabulary(list);
							setUpdateEditGroup({ type: 'vocabulary', value: true });
						}
						if (currentInput.type === 'phrases') {
							let list = [...phrases];
							list[currentInput.index].image = url;
							list[currentInput.index].image_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].image_id = response?.data?.id;
							setPhrases(list);
							setUpdateEditGroup({ type: 'phrases', value: true });
						}
						if (currentInput.type === 'grammar') {
							let list = [...grammar];
							list[currentInput.index].image = url;
							list[currentInput.index].image_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].image_id = response?.data?.id;
							setGrammar(list);
							setUpdateEditGroup({ type: 'grammar', value: true });
						}
						setCurrentInput({
							...currentInput,
							image: url,
							image_name: `${response?.data?.name}.${response?.data?.ext}`,
							uploadingImage: false,
						});
					}
				});
			} catch (error) {
				setCurrentInput({ ...currentInput, uploadingImage: false });
				setInputProgress(0);
				console.log(`ERROR: \n\n handleinputimage ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			}
		} else {
			message.error(t('dashboard.notification.image_must_smaller_20MB'));
		}
	};

	const handleInputImageRemove = async (drillData0, drillData1, drillData2) => {
		console.log(`lessonInput: lessonInput`)
		try {
			// const formData = new FormData();
			// formData.append("ids", [currentInput.image_id]);
			// formData.append("public", "false");

			setCurrentInput({ ...currentInput, uploadingImage: true });
			const response = await deleteFiles({
				ids: [currentInput.image_id],
			});
			if (response) {
				setInputProgress(0);
				if (currentInput.type === 'vocabulary') {
					let list = [...vocabulary];
					list[currentInput.index].image = '';
					list[currentInput.index].image_name = '';
					list[currentInput.index].image_id = '';
					setVocabulary(list);
					setUpdateEditGroup({ type: 'vocabulary', value: true });
				}
				if (currentInput.type === 'phrases') {
					let list = [...phrases];
					list[currentInput.index].image = '';
					list[currentInput.index].image_name = '';
					list[currentInput.index].image_id = '';
					setPhrases(list);
					setUpdateEditGroup({ type: 'phrases', value: true });
				}
				if (currentInput.type === 'grammar') {
					let list = [...grammar];
					list[currentInput.index].image = '';
					list[currentInput.index].image_name = '';
					list[currentInput.index].image_id = '';
					setGrammar(list);
					setUpdateEditGroup({ type: 'grammar', value: true });
				}
				setCurrentInput({ ...currentInput, uploadingImage: false, image: '', image_name: '', image_id: '' });
			}
		} catch (error) {
			console.log(`ERROR: \n\n handleinputimageremove ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		}
	};

	const generateAIAudio = async (voice, index) => {
		console.log(`lessonInput: lessonInput`)
		try {
			let list = [];
			switch (currentInput.type) {
				case 'vocabulary':
					list = [...vocabulary];
					break;
				case 'phrases':
					list = [...phrases];
					break;
				case 'grammar':
					list = [...grammar];
					break;

				default:
					break;
			}

			const response = await getAIVoice(voice.codeLanguage, voice.voice, voice.engine, list[index].input);
			if (response?.data) {
				const reader = new FileReader();
				reader.readAsBinaryString;
				switch (currentInput.type) {
					case 'vocabulary':
						setVocabulary(list);
						setUpdateEditGroup({ type: 'vocabulary', value: true });
						break;
					case 'phrases':
						setPhrases(list);
						setUpdateEditGroup({ type: 'phrases', value: true });
						break;
					case 'grammar':
						setGrammar(list);
						setUpdateEditGroup({ type: 'grammar', value: true });
						break;

					default:
						break;
				}

				//Convert to Arraybuffer
				var arrayBuffer = toArrayBuffer(response?.data?.audio?.AudioStream?.data);

				// create audio context
				const audioContext = getAudioContext();
				// create audioBuffer (decode audio file)
				const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
				const formData = new FormData();
				const newBlob = new Blob([new Uint8Array(response?.data?.audio?.AudioStream?.data)]);
				const fileUpload = new File([newBlob], `${voice.codeLanguage}-${voice.voice}.mp3`, { type: 'audio/mpeg' });
				formData.append('file', fileUpload);
				formData.append('name', `${voice.codeLanguage}-${voice.voice}`);
				formData.append('folderId', _audioFolder.current?.id);
				formData.append('public', true);
				try {
					const responseUpload = await uploadFile(formData);
					if (responseUpload) {
						getBase64(fileUpload, (url) => {
							list[index].audio = url;
							list[index].audio_id = responseUpload?.data?.id;
							list[index].audio_name = `${responseUpload?.data?.name}.${responseUpload?.data?.ext}`;
							switch (currentInput.type) {
								case 'vocabulary':
									setVocabulary(list);
									setUpdateEditGroup({ type: 'vocabulary', value: true });
									break;
								case 'phrases':
									setPhrases(list);
									setUpdateEditGroup({ type: 'phrases', value: true });
									break;
								case 'grammar':
									setGrammar(list);
									setUpdateEditGroup({ type: 'grammar', value: true });
									break;

								default:
									break;
							}
						});
					}
				} catch (error) {
					console.log(`ERROR: \n\n generateAIAudio ${JSON.stringify(error, null, 2)}`);
					//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
				}

				// create audio source
				const source = audioContext.createBufferSource();
				source.buffer = audioBuffer;
				source.connect(audioContext.destination);

				// play audio
				source.start();
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		}
	};

	const handleInputAudioMyDrive = ({ audio, audioConfig }) => {
		console.log(`lessonInput: handleInputAudioMyDrive`)
		setCurrentInput({ ...currentInput, uploadingAudio: true });
		if (currentInput.type === 'vocabulary') {
			let list = [...vocabulary];
			list[currentInput.index].audio = audio;
			list[currentInput.index].audio_name = audioConfig.name;
			list[currentInput.index].audio_id = audioConfig.id;
			setVocabulary(list);
			setUpdateEditGroup({ type: 'vocabulary', value: true });
		}
		if (currentInput.type === 'phrases') {
			let list = [...phrases];
			list[currentInput.index].audio = audio;
			list[currentInput.index].audio_name = audioConfig.name;
			list[currentInput.index].audio_id = audioConfig.id;
			setPhrases(list);
			setUpdateEditGroup({ type: 'phrases', value: true });
		}
		if (currentInput.type === 'grammar') {
			let list = [...grammar];
			list[currentInput.index].audio = audio;
			list[currentInput.index].audio_name = audioConfig.name;
			list[currentInput.index].audio_id = audioConfig.id;
			setGrammar(list);
			setUpdateEditGroup({ type: 'grammar', value: true });
		}
		setCurrentInput({ ...currentInput, audio: audio, audio_name: audioConfig.name, uploadingAudio: false });
	};

	const handleInputAudio = async ({ info, drillData0, drillData1, drillData2 }) => {
		console.log(`lessonInput: handleInputAudio`)
		if (beforeUpload(info?.file)) {
			try {
				const formData = new FormData();
				formData.append('file', info.file);
				formData.append('public', 'false');
				setCurrentInput({ ...currentInput, uploadingAudio: true });

				const reader = new FileReader();
				reader.readAsDataURL(info.file);
				getBase64(info.file, async (url) => {
					const response = await uploadFile(formData);
					if (response?.data) {
						if (currentInput.type === 'vocabulary') {
							let list = [...vocabulary];
							list[currentInput.index].audio = url;
							list[currentInput.index].audio_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].audio_id = response?.data?.id;
							setVocabulary(list);
							setUpdateEditGroup({ type: 'vocabulary', value: true });
						}
						if (currentInput.type === 'phrases') {
							let list = [...phrases];
							list[currentInput.index].audio = url;
							list[currentInput.index].audio_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].audio_id = response?.data?.id;
							setPhrases(list);
							setUpdateEditGroup({ type: 'phrases', value: true });
						}
						if (currentInput.type === 'grammar') {
							let list = [...grammar];
							list[currentInput.index].audio = url;
							list[currentInput.index].audio_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].audio_id = response?.data?.id;
							setGrammar(list);
							setUpdateEditGroup({ type: 'grammar', value: true });
						}
						setCurrentInput({
							...currentInput,
							audio: url,
							audio_name: `${response?.data?.name}.${response?.data?.ext}`,
							uploadingAudio: false,
						});
					}
				});
			} catch (error) {
				setCurrentInput({ ...currentInput, uploadingAudio: false });
				setInputProgress(0);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
				console.log(`ERROR: \n\n handleinutaudio ${JSON.stringify(error, null, 2)}`);
			}
		} else {
			message.error(t('dashboard.notification.audio_must_smaller_20MB'));
		}
	};

	const handleInputAudioRemove = async (drillData0, drillData1, drillData2) => {
		console.log(`lessonInput: handleInputAudioRemove`)
		try {
			// const formData = new FormData();
			// formData.append("ids", [currentInput.audio_id]);
			// formData.append("public", "false");

			setCurrentInput({ ...currentInput, uploadingAudio: true });
			const response = await deleteFiles({
				ids: [currentInput.audio_id],
			});
			if (response) {
				setInputProgress(0);
				if (currentInput.type === 'vocabulary') {
					let list = [...vocabulary];
					list[currentInput.index].audio = '';
					list[currentInput.index].audio_id = '';
					list[currentInput.index].audio_name = '';
					setVocabulary(list);
					setUpdateEditGroup({ type: 'vocabulary', value: true });
				}
				if (currentInput.type === 'phrases') {
					let list = [...phrases];
					list[currentInput.index].audio = '';
					list[currentInput.index].audio_id = '';
					list[currentInput.index].audio_name = '';
					setPhrases(list);
					setUpdateEditGroup({ type: 'phrases', value: true });
				}
				if (currentInput.type === 'grammar') {
					let list = [...grammar];
					list[currentInput.index].audio = '';
					list[currentInput.index].audio_id = '';
					list[currentInput.index].audio_name = '';
					setGrammar(list);
					setUpdateEditGroup({ type: 'grammar', value: true });
				}
				setCurrentInput({ ...currentInput, uploadingAudio: false, audio: '', audio_name: '', audio_id: '' });
			}
		} catch (error) {
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			console.log(`ERROR: \n\n handleinputaudioremove ${JSON.stringify(error, null, 2)}`);
		}
	};

	const handleInputVideoMyDrive = ({ video, videoConfig }) => {
		console.log(`lessonInput: handleInputVideoMyDrive`)
		setCurrentInput({ ...currentInput, uploadingVideo: true });
		if (currentInput.type === 'vocabulary') {
			let list = [...vocabulary];
			list[currentInput.index].video = video;
			list[currentInput.index].video_name = videoConfig.name;
			list[currentInput.index].video_id = videoConfig.id;
			setVocabulary(list);
			setUpdateEditGroup({ type: 'vocabulary', value: true });
		}
		if (currentInput.type === 'phrases') {
			let list = [...phrases];
			list[currentInput.index].video = video;
			list[currentInput.index].video_name = videoConfig.name;
			list[currentInput.index].video_id = videoConfig.id;
			setPhrases(list);
			setUpdateEditGroup({ type: 'phrases', value: true });
		}
		if (currentInput.type === 'grammar') {
			let list = [...grammar];
			list[currentInput.index].video = video;
			list[currentInput.index].video_name = videoConfig.name;
			list[currentInput.index].video_id = videoConfig.id;
			setGrammar(list);
			setUpdateEditGroup({ type: 'grammar', value: true });
		}
		setCurrentInput({ ...currentInput, video: video, video_name: videoConfig.name, uploadingVideo: false });
	};

	const handleInputVideo = async ({ info, drillData0, drillData1, drillData2 }) => {
		console.log(`lessonInput: handleInputVideo`)
		if (beforeUpload(info?.file)) {
			try {
				const formData = new FormData();
				formData.append('file', info.file);
				formData.append('public', 'false');
				setCurrentInput({ ...currentInput, uploadingVideo: true });

				const reader = new FileReader();
				reader.readAsDataURL(info.file);
				getBase64(info.file, async (url) => {
					const response = await uploadFile(formData);
					if (response?.data) {
						if (currentInput.type === 'vocabulary') {
							let list = [...vocabulary];
							list[currentInput.index].video = url;
							list[currentInput.index].video_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].video_id = response?.data?.id;
							setVocabulary(list);
							setUpdateEditGroup({ type: 'vocabulary', value: true });
						}
						if (currentInput.type === 'phrases') {
							let list = [...phrases];
							list[currentInput.index].video = url;
							list[currentInput.index].video_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].video_id = response?.data?.id;
							setPhrases(list);
							setUpdateEditGroup({ type: 'phrases', value: true });
						}
						if (currentInput.type === 'grammar') {
							let list = [...grammar];
							list[currentInput.index].video = url;
							list[currentInput.index].video_name = `${response?.data?.name}.${response?.data?.ext}`;
							list[currentInput.index].video_id = response?.data?.id;
							setGrammar(list);
							setUpdateEditGroup({ type: 'grammar', value: true });
						}
						setCurrentInput({
							...currentInput,
							video: url,
							video_name: `${response?.data?.name}.${response?.data?.ext}`,
							uploadingVideo: false,
						});
					}
				});
			} catch (error) {
				setCurrentInput({ ...currentInput, uploadingVideo: false });
				setInputProgress(0);
				console.log(`ERROR: \n\n handleinputvideo ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			}
		} else {
			message.error(t('dashboard.notification.video_must_smaller_20MB'));
		}
	};

	const handleInputVideoRemove = async (drillData0, drillData1, drillData2) => {
		console.log(`lessonInput: handleInputVideoRemove`)
		try {
			// const formData = new FormData();
			// formData.append("ids", [currentInput.video_id]);
			// formData.append("public", "false");

			setCurrentInput({ ...currentInput, uploadingVideo: true });
			const response = await deleteFiles({
				ids: [currentInput.video_id],
			});
			if (response) {
				setInputProgress(0);
				if (currentInput.type === 'vocabulary') {
					let list = [...vocabulary];
					list[currentInput.index].video = '';
					list[currentInput.index].video_id = '';
					list[currentInput.index].video_name = '';
					setVocabulary(list);
					setUpdateEditGroup({ type: 'vocabulary', value: true });
				}
				if (currentInput.type === 'phrases') {
					let list = [...phrases];
					list[currentInput.index].video = '';
					list[currentInput.index].video_id = '';
					list[currentInput.index].video_name = '';
					setPhrases(list);
					setUpdateEditGroup({ type: 'phrases', value: true });
				}
				if (currentInput.type === 'grammar') {
					let list = [...grammar];
					list[currentInput.index].video = '';
					list[currentInput.index].video_id = '';
					list[currentInput.index].video_name = '';
					setGrammar(list);
					setUpdateEditGroup({ type: 'grammar', value: true });
				}
				setCurrentInput({ ...currentInput, uploadingVideo: false, video: '', video_name: '', video_id: '' });
			}
		} catch (error) {
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			console.log(`ERROR: \n\n handleinoputvideoremove ${JSON.stringify(error, null, 2)}`);
		}
	};

	const uploadImageMutation = useMutation(uploadFile, {
		
		onSuccess: (res) => {
			setPreviewID(res?.data?.thumbnail?.id);
			setUploading(false);
		},
		onError: (err) => {
			setPreviewID(undefined);
			setUploading(false);
		},
	});

	const handleImage = async (info) => {
		console.log(`lessonInput: handleImage`)
		if (beforeUpload(info?.file)) {
			setUploading(true);

			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImage(reader.result);
			});
			reader.readAsDataURL(info.file);
			getBase64(info.file, (url) => {
				setImage(url);
			});

			const formData = new FormData();
			formData.append('file', info.file);
			formData.append('public', 'false');

			uploadImageMutation.mutate(formData);
		} else {
			message.error(t('dashboard.notification.image_must_smaller_20MB'));
		}
	};

	const deleteImageMutation = useMutation(deleteFiles, {
		
		onSuccess: (res) => {
			setPreviewID(undefined);
			setImage(undefined);
			setUploading(false);
		},
		onError: (error) => {
			setUploading(false);
			toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
		},
	});

	const handleImageRemove = async () => {
		setUploading(true);
		deleteImageMutation.mutate({
			ids: [previewID],
		});
	};

	const uploadVideoMutation = useMutation(uploadFile, {
		onSuccess: (res) => {
			setPreviewVideoID(res?.data?.id);
			setUploading(false);
		},
		onError: (err) => {
			setPreviewVideoID(undefined);
			setUploading(false);
		},
	});

	const handleVideo = async (info) => {
		console.log(`lessonInput: handleVideo`)
		if (beforeUpload(info?.file)) {
			setUploading(true);

			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setVideo(reader.result);
			});
			reader.readAsDataURL(info.file);
			getBase64(info.file, (url) => {
				setVideo(url);
			});

			const formData = new FormData();
			formData.append('file', info.file);
			// videoData.append('video', file)
			// videoData.append('courseId', values.course)
			// videoData.append('lessonDialogueId', values.lesson)
			formData.append('public', 'false');

			uploadVideoMutation.mutate(formData);
		} else {
			message.error(t('dashboard.notification.video_must_smaller_20MB'));
		}
	};

	const deleteVideoMutation = useMutation(deleteFiles, {
		onSuccess: (res) => {
			setVideo('');
			setPreviewVideoID(undefined);
			setUploading(false);
		},
		onError: (error) => {
			setUploading(false);
			//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			console.log(`ERROR: \n\n handlevideo ${JSON.stringify(error, null, 2)}`);
		},
	});

	const handleVideoRemove = async () => {
		console.log(`lessonInput: handleVideoRemove`)
		setUploading(true);
		deleteVideoMutation.mutate({
			ids: [previewVideoID],
		});
	};

	// End Handle Video/Image/Video

	const setUpdateEditGroup = ({ type, value }) => {
		console.log(`lessonInput: setUpdateEditGroup`)
		setEditGroup({
			...editGroup,
			[type]: value,
		});
	};

	const setResetEditGroup = () => {
		console.log(`lessonInput: setResetEditGroup`)
		setEditGroup({
			vocabulary: false,
			phrases: false,
			grammar: false,
			drills: false,
		});
	};

	const handleDeleteVocabulary = async ({ index, id }) => {
		console.log(`lessonInput: handleDeleteVocabulary`)
		const data = JSON.parse(JSON.stringify([...vocabulary]));
		if (id) {
			setLoadingSpinning(true);
			try {
				const response = await deleteVocabulary(id);
				if (response) {
					data.splice(index, 1);
				}
			} catch (error) {
				console.log(`ERROR: \n\n handledeletevocab ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			} finally {
				setLoadingSpinning(false);
			}
		} else {
			data.splice(index, 1);
		}

		setVocabulary(data);
		setUpdateEditGroup({ type: 'vocabulary', value: true });
	};

	const handleDeletePhrases = async ({ index, id }) => {
		console.log(`lessonInput: handleDeletePhrases`)
		const data = JSON.parse(JSON.stringify([...phrases]));
		if (id) {
			setLoadingSpinning(true);
			try {
				const response = await deletePhrase(id);
				if (response) {
					data.splice(index, 1);
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
				console.log(`ERROR: \n\n handledeletephrases ${JSON.stringify(error, null, 2)}`);
			} finally {
				setLoadingSpinning(false);
			}
		} else {
			data.splice(index, 1);
		}

		setPhrases(data);
		setUpdateEditGroup({ type: 'phrases', value: true });
	};

	const handleDeleteGrammar = async ({ index, id }) => {
		console.log(`lessonInput: handleDeleteGrammar`)
		const data = JSON.parse(JSON.stringify([...grammar]));
		if (id) {
			setLoadingSpinning(true);
			try {
				const response = await deleteGrammar(id);
				if (response) {
					data.splice(index, 1);
				}
			} catch (error) {
				console.log(`ERROR: \n\n handledeletegrammar ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Minor Glitch. Hopefully, things will be fine :)');
			} finally {
				setLoadingSpinning(false);
			}
		} else {
			data.splice(index, 1);
		}

		setGrammar(data);
		setUpdateEditGroup({ type: 'grammar', value: true });
	};

	const setVocabularyItem = ({ index, value }) => {
		console.log(`lessonInput: setVocabularyItem`)
		let myList = [...vocabulary];
		myList[index].input = value;
		myList[index].touched = true;
		setVocabulary(myList);
		setUpdateEditGroup({ type: 'vocabulary', value: true });
	};

	const setPhraseItem = ({ index, value }) => {
		console.log(`lessonInput: setPhraseItem`)
		let myList = [...phrases];
		myList[index].input = value;
		myList[index].touched = true;
		setPhrases(myList);
		setUpdateEditGroup({ type: 'phrases', value: true });
	};

	const setGrammarItem = ({ index, value }) => {
		console.log(`lessonInput: setGrammarItem`)
		let myList = [...grammar];
		myList[index].input = value;
		myList[index].touched = true;
		setGrammar(myList);
		setUpdateEditGroup({ type: 'grammar', value: true });
	};

	const setVocabularyExplanation = ({ index, value }) => {
		console.log(`lessonInput: xxxxxx`)
		let myList = [...vocabulary];
		myList[index].explanation = value;
		myList[index].touched = true;
		setVocabulary(myList);
		setUpdateEditGroup({ type: 'vocabulary', value: true });
	};

	const setPhraseExplanation = ({ index, value }) => {
		console.log(`lessonInput: setVocabularyExplanation`)
		let myList = [...phrases];
		myList[index].explanation = value;
		myList[index].touched = true;
		setPhrases(myList);
		setUpdateEditGroup({ type: 'phrases', value: true });
	};

	const setGrammarExplanation = ({ index, value }) => {
		console.log(`lessonInput: setGrammarExplanation`)
		let myList = [...grammar];
		myList[index].explanation = value;
		myList[index].touched = true;
		setGrammar(myList);
		setUpdateEditGroup({ type: 'grammar', value: true });
	};

	const mergedConfig = {
		loadingSpinning: loadingSpinning,
		dataSource: {
			tags,
			languages,
			levels,
			allInstructors,
			characters,
		},
		values: values,
		dialogs: dialogs,
		setValues: setValues,
		uploading: uploading,

		getLessons: getLessons,
		image: image,
		video: video,

		handleVideo: handleVideo,
		handleVideoRemove: handleVideoRemove,
		handleImageRemove: handleImageRemove,
		handleImage: handleImage,

		user: user,
		submitDrillData: submitDrillData,
		parseAndSubmitData: parseAndSubmitData,
		getLessonInput: getLessonAPI,
		courses: courses,
		lessons: lessons,
		phrases: phrases,
		grammar: grammar,
		AIdata: AIdata,
		vocabulary: vocabulary,
		currentInput: currentInput,
		setCurrentInput: setCurrentInput,
		inputProgress: inputProgress,

		addAISubLine: addAISubLine,
		addAIdataSubLine: addAIdataSubLine,
		handleInputImage: handleInputImage,
		handleInputVideo: handleInputVideo,
		handleInputAudio: handleInputAudio,
		handleInputImageRemove: handleInputImageRemove,
		handleInputVideoRemove: handleInputVideoRemove,
		handleInputAudioRemove: handleInputAudioRemove,
		handleInputImageMyDrive: handleInputImageMyDrive,
		handleInputAudioMyDrive: handleInputAudioMyDrive,
		handleInputVideoMyDrive: handleInputVideoMyDrive,

		deleteVocabulary: handleDeleteVocabulary,
		submitVocabulary: submitVocabulary,
		deletePhrases: handleDeletePhrases,
		deleteGrammar: handleDeleteGrammar,
		setVocabulary: setVocabulary,
		setPhrases: setPhrases,
		setGrammar: setGrammar,
		loadLessonInput: loadLessonInput,
		getDrillSection: getDrillSection,

		setVocabularyItem: setVocabularyItem,
		setPhraseItem: setPhraseItem,
		setGrammarItem: setGrammarItem,
		setVocabularyExplanation: setVocabularyExplanation,
		setPhraseExplanation: setPhraseExplanation,
		setGrammarExplanation: setGrammarExplanation,

		setActivePanelsVocabulary: setActivePanelsVocabulary,
		activePanelsVocabulary: activePanelsVocabulary,
		setActivePanelsPhrases: setActivePanelsPhrases,
		activePanelsPhrases: activePanelsPhrases,
		setActivePanelsGrammar: setActivePanelsGrammar,
		activePanelsGrammar: activePanelsGrammar,
		activePanelsAI: activePanelsAI,
		setActivePanelsAI: setActivePanelsAI,

		previewCourse: previewCourse,
		setPreviewCourse: setPreviewCourse,

		drillData0: drillData0,
		setDrillData0: setDrillData0,
		drillData1: drillData1,
		setDrillData1: setDrillData1,
		drillData2: drillData2,
		setDrillData2: setDrillData2,
		drillDataLoaded: drillDataLoaded,
		setDrillDataLoaded: setDrillDataLoaded,
		filterTouched: filterTouched,

		configLoadingImage: {
			loadingVocabularyImage,
			loadingPhraseImage,
			loadingGrammarImage,
			loadingDrillsImage,
		},

		setUpdateEditGroup: setUpdateEditGroup,
		setResetEditGroup: setResetEditGroup,

		voice: {
			currentVoice,
			setCurrentVoice,
			voiceList,
			setVoiceList,
			voiceLanList,
			setVoiceLanList,
			loadVoiceList,
			generateAIAudio,
		},

		valuesErr: valuesErr,
		setValuesErr: setValuesErr,
		handleChangeMedia: handleChangeMedia,
	};

	return (
		<DashboardRoute>
			<div className="animated fadeIn">
				<BrowserView>
					<div className="section-head mb-4">
						<div className="d-flex align-items-center justify-content-between">
							<Col xs={24} sm={16} className="pe-4 d-flex align-items-center">
								<h3 className="page-title float-left mb-0">{t('dashboard.title.build_lesson_input_drills')}</h3>
								<a className="btn d-flex align-items-center" href="" style={{ color: '#35595C' }}>
									<a
										className="d-flex align-items-center"
										target="_blank"
										href="https://www.youtube.com/watch?v=-g4TnixUdSc"
										style={{ color: '#35595C' }}
									>
										<VideoCameraFilled style={{ margin: '0 15px 0 50px', fontSize: 25, color: '#35595C' }} /> Tutorial
									</a>
								</a>
							</Col>

							<Col xs={24} sm={8} />
						</div>
					</div>

					<Col xs={24} sm={16} className="pe-4">
						<p>{t('dashboard.label.course_description')}</p>
					</Col>
				</BrowserView>

				<div className="md:tw-py-4 -tw-mx-[20px] md:tw-mx-0">
					<Spin spinning={loadingSpinning || false}>
						<BrowserView>
							<LessonInputCreateForm {...mergedConfig} />
						</BrowserView>
						<MobileView>
							<MobileLessonInputCreateForm {...mergedConfig} />
						</MobileView>
					</Spin>
				</div>
			</div>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default LessonInputCreate;
