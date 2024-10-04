import { useQuery } from '@/hooks/useQuery';
import { getListFolders } from '@/src/services/folders/apiFolders';
import { VideoCameraFilled } from '@ant-design/icons';
import { Col, Spin, message, Button } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { toast } from 'react-toastify';
import DialogLessonCreateForm from '../../../../../components/Instructor/forms/DialogLessonCreateForm';
import MobileDialogLessonCreateForm from '../../../../../components/Instructor/forms/mobile/MobileDialogLessonCreateForm';
import DashboardRoute from '../../../../../components/routes/DashboardRoute';
import { RouterConstants } from '../../../../../constants/router';
import { useLoadCommonCourse } from '../../../../../hooks/useLoadCommonCourse';
import { useMutation } from '../../../../../hooks/useMutation';
import { withTranslationsProps } from '../../../../next/with-app';
import { getCharacters, postCharacter } from '../../../../services/characters/apiChatacters';
import { getAllCourses, getCourseByID ,validateCourse} from '../../../../services/courses/apiCourses';

import {
	deleteDialogByLessonID,
	getAIVoice,
	getDialogsByLessonID,
	getVoiceLanList,
	getVoiceList,
	postDialog,
	postDialogByLessonID,
	updateDialog,
	updateDialogByLessonID,
} from '../../../../services/dialogs/apiDialogs';
import {
	deleteFiles,
	uploadFile,
	uploadFileExternal,
	viewFileLinkByID,
	viewFileStreamByID,
	viewFileThumbnailByID,
} from '../../../../services/files/apiFiles';
import { getLesson, updateLesson } from '../../../../services/lessons/apiLessons';
import { useMobXStores } from '../../../../stores';
import { beforeUpload, getBase64, uuidv4 } from '../../../../utilities/helper';
import { useTranslation } from 'next-i18next';
import ModalViewPlayer from '../../../../../components/common/ModalViewPlayer';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';

const LessonDialogueIndex = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const [loadingSpinning, setLoadingSpinning] = useState(false);
	const [values, setValues] = useState({
		course: undefined,
		lesson: undefined,
		lessonObj: {},
		context: '',
		introduction: '',

		language: undefined,
		level: undefined,
		animatedVideo: true,
	});

	const [valuesErr, setValuesErr] = useState({});
	const [dialog, setDialog] = useState([]);
	const [newChara, setNewChara] = useState({
		name: '',
		age: '',
		gender: '',
		occupation: '',
	});

	const [characters, setCharacters] = useState([]);
	const [visibleCharacter, setVisibleCharacter] = useState(false);
	const [visibleAddAudio, setVisibleAddAudio] = useState(false);
	const [currentVoice, setCurrentVoice] = useState('');
	const [voiceList, setVoiceList] = useState([]);
	const [voiceLanList, setVoiceLanList] = useState([]);

	const [courses, setCourses] = useState([]);
	const [lessons, setLessons] = useState([]);
	const [image, setImage] = useState('');
	const [video, setVideo] = useState('');
	const [previewID, setPreviewID] = useState(undefined);
	const [previewVideoID, setPreviewVideoID] = useState('');
	const [uploading, setUploading] = useState(false);
	const [listImageSlideDialog, setListImageSlideDialog] = useState([]);

	const [previewCourse, setPreviewCourse] = useState('');
	const [submitNext, setSubmitNext] = useState(false);

	const [isUploadAudioContextForSlide, setIsUploadAudioContextForSlide] = useState(false);
	const [showSlideOrVideo, setShowSlideOrVideo] = useState({
		isShowVideo: true,
		isShowSlide: true,
	});
	const audioContext = useRef({
		id: null,
		audio: '',
		name: '',
	});

	const { userStore, userActivityStore } = useMobXStores();
	const user = JSON.parse(JSON.stringify(userStore.currentUser));
	const { tags, languages, levels, allInstructors } = useLoadCommonCourse({ isPublic: false });

	useEffect(() => {
		loadCourses();
		loadVoiceLanList();
		loadCharacters();
	}, []);

	const loadVoiceLanList = async () => {
		console.log(`-- => lessonDialog loadVoiceLanList`);
		try {
			const response = await getVoiceLanList();
			if (response?.data) {
				setVoiceLanList(response?.data);
			}
		} catch (error) {
			console.log(`ERROR: \n\n loadvoicelanlist ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const loadVoiceList = async (language) => {
		console.log(`-- => lessonDialog loadVoiceList`);
		try {
			const response = await getVoiceList(language);
			if (response?.data) {
				setVoiceList(response?.data);
				setNewChara({ ...newChara, codeLanguage: language });
			}
		} catch (error) {
			console.log(`ERROR: \n\n getLessons ${JSON.stringify(loadvoicelist, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const getAudioContext = () => {
		console.log(`-- => lessonDialog getAudioContext`);
		AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContent = new AudioContext();
		return audioContent;
	};

	function toArrayBuffer(buf) {
		console.log(`-- => lessonDialog toArrayBuffer`);
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
			console.log(`ERROR: \n\n getLessons ${JSON.stringify(audiofolder, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	const generateAIAudio = async (voice, index) => {
		console.log(`-- => lessonDialog generateAIAudio`);
		try {
			let list = [...dialog];
			const response = await getAIVoice(voice.codeLanguage, voice.voice, voice.engine, dialog[index].line);
			if (response?.data) {
				const reader = new FileReader();
				reader.readAsBinaryString;

				//Convert to Arraybuffer
				var arrayBuffer = toArrayBuffer(response?.data.audio.AudioStream.data);

				// create audio context
				const audioContext = getAudioContext();
				// create audioBuffer (decode audio file)
				const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
				const formData = new FormData();
				const newBlob = new Blob([new Uint8Array(response?.data.audio.AudioStream.data)]);
				const fileUpload = new File([newBlob], `${voice.codeLanguage}-${voice.voice}.mp3`, { type: 'audio/mpeg' });
				formData.append('file', fileUpload);
				formData.append('name', `${voice.codeLanguage}-${voice.voice}`);
				formData.append('folderId', _audioFolder.current?.id);
				formData.append('public', true);

				try {
					const responseUpload = await uploadFile(formData);
					if (responseUpload) {
						getBase64(fileUpload, (url) => {
							if (isUploadAudioContextForSlide) {
								audioContext.current = {
									id: responseUpload?.data?.id,
									audio: url,
									name: `${responseUpload?.data?.name}.${responseUpload?.data?.ext}`,
								};
							} else {
								list[index].audio = url;
								list[index].audio_id = responseUpload?.data?.id;
								list[index].audio_name = `${responseUpload?.data?.name}.${responseUpload?.data?.ext}`;
								setDialog(list);
							}
							setUploading(false);
						});
					}
				} catch (error) {
					setUploading(false);
					console.log(`ERROR: \n\n generateaiaudio ${JSON.stringify(error, null, 2)}`);
					//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
				}

				// create audio source
				const source = audioContext.createBufferSource();
				source.buffer = audioBuffer;
				source.connect(audioContext.destination);

				// play audio
				source.start();
				//console.log(response?.data)
			}
		} catch (error) {
			console.log(`ERROR: \n\n generateaiaudio ${JSON.stringify(error, null, 2)}`);
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const loadCourses = async () => {
		console.log(`-- => lessonDialog loadCourses`);
		try {
			const response = await getAllCourses();
			if (response?.data) {
				await setCourses(response.data);
			}
		} catch (error) {
			console.log(`ERROR: \n\n loadcourses ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const loadCharacters = async () => {
		console.log(`-- => lessonDialog loadCharacters`);
		try {
			const response = await getCharacters();
			if (response?.data) {
				setCharacters(response.data);
			}
		} catch (error) {
			console.log(`ERROR: \n\n loadchars ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const getImageVideo = async (currentLesson) => {
		console.log(`-- => lessonDialog getImageVideo`);
		if (currentLesson.thumbnailId) {
			setPreviewID(currentLesson.thumbnailId);
			try {
				const responseThumb = await viewFileThumbnailByID(currentLesson.thumbnailId);
				if (responseThumb?.data) {
					setImage(responseThumb.data);
				}
			} catch (error) {
				console.log(`ERROR: \n\n getimagevideo ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		} else {
			setImage('');
			setPreviewID(undefined);
		}
		if (currentLesson.instructionVideoId) {
			setPreviewVideoID(currentLesson.instructionVideoId);
			// stream video phải mở thêm service cloudfront nữa
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
				console.log(`ERROR: \n\n getimagevideo ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		} else {
			setVideo('');
			setPreviewVideoID('');
		}
	};

	const getLessonAPI = async (lessonId) => {
		console.log(`-- => lessonDialog getLessonAPI`);
		try {
			const response = await getLesson(lessonId);
			return response?.data;
		} catch (error) {
			return {};
		}
	};

	const getCurrentLesson = (lessons) => {
		console.log(`-- => lessonDialog getCurrentLesson`);
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

	const getLessons = async (courseId) => {
		console.log(`-- => lessonDialog getLessons`);
		console.log(`______+++ getLessons ${courseId}`);
		toast(t('course.loading'), {
			position: 'top-right',
			autoClose: 2500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		await setDialog([]);
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
						// Setup Dialog info/builder
						setValues({
							...values,
							...lessonDetail,
							lessonObj: lessonDetail,
							course: currentCourse?.id,
							lesson: currentLesson.id,
							language: currentCourse?.courseLanguageId,
							level: currentCourse?.levelId,
							context: lessonDetail?.dialogs && lessonDetail?.dialogs[0] ? lessonDetail?.dialogs[0].context : ' -- ',
							introduction:
								lessonDetail?.dialogs && lessonDetail?.dialogs[0] ? lessonDetail?.dialogs[0].introduction : ' -- ',
						});

						await getImageVideo(lessonDetail);
						setShowSlideOrVideo({
							isShowVideo: lessonDetail.showIntroductionVideo,
							isShowSlide: lessonDetail.showDialogSlide,
						});
					}
				}
				return currentLesson.id;
			} else {
				return null;
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		} finally {
			setLoadingSpinning(false);
		}
	};

	const loadDialog = async (lessonId) => {
		console.log(`-- => lessonDialog loadDialog`);
		console.log(`>>>>loading dialog ${lessonId}`);
		toast(t('course.loading'), {
			position: 'top-right',
			autoClose: 2500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		setDialog([]);
		setValues([]);
		setLoadingSpinning(true);

		try {
			const lessonDetail = await getLessonAPI(lessonId);
			setListImageSlideDialog([]);
			console.log(`>>>>>>> lessonDetail from the horses mouth ${JSON.stringify(lessonDetail, null, 5)}`);
			if (lessonDetail && Object.keys(lessonDetail).length) {
				let context =
					lessonDetail?.dialogs && lessonDetail?.dialogs[0] && lessonDetail?.dialogs[0].context
						? lessonDetail?.dialogs[0].context
						: '-';
				let introduction =
					lessonDetail?.dialogs && lessonDetail?.dialogs[0] && lessonDetail?.dialogs[0].introduction
						? lessonDetail?.dialogs[0].introduction
						: '-';
				setValues({
					...values,
					...lessonDetail,
					lessonObj: lessonDetail,
					lesson: lessonId,
					context: context,
					introduction: introduction,
				});

				if (lessonDetail?.dialogs?.length) {
					if (lessonDetail?.dialogs[0]?.lines?.length) {
						let arr = [];
						const dataCompare = lessonDetail.dialogs[0].lines.sort((a, b) => a.index - b.index);
						console.log(`>>> datacompare ${JSON.stringify(dataCompare, null, 4)}`);
						console.log('>>> -----');

						for (let i = 0; i <= dataCompare.length - 1; i++) {
							let arrStream = {
								audio: undefined,
								audio_id: undefined,
								audio_name: undefined,
								dialogLineId: undefined,
							};

							if (dataCompare[i].medias?.length && dataCompare[i].medias[0]) {
								let mediaItems = dataCompare[i].medias;
								for (let media of mediaItems) {
									console.log(`>>+++ media ${JSON.stringify(media, null, 2)}`);
									let fullMediaItem = await viewFileLinkByID(media.id);
									if (fullMediaItem?.data) {
										if (media.type === 'AUDIO') {
											console.log('>> got audio');
											arrStream = {
												...arrStream,
												audio: fullMediaItem.data,
												audio_id: media.id,
												audio_name: `${media?.name}.${media?.ext}`,
												dialogLineId: dataCompare.id,
											};
										} else if (media.type === 'IMAGE') {
											console.log('>>> got image');
											arrStream = {
												...arrStream,
												image: fullMediaItem.data,
												image_id: media.id,
												image_name: `${media?.name}.${media?.ext}`,
												dialogLineId: dataCompare[i].id,
											};
											setListImageSlideDialog((prev) => [
												...prev,
												{
													index: i,
													imageId: media.id,
													imageUrl: fullMediaItem.data,
													dialogLineId: dataCompare[i].id,
												},
											]);
											console.log(`>>> setListImageSlideDialog ${JSON.stringify(listImageSlideDialog, null, 2)}`);
										}
									}
									console.log(`>>-->> \narrstream is ${JSON.stringify(arrStream, null, 2)}`);
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
					} else {
						setDialog([]);
					}
				} else {
					setDialog([]);
				}

				//if lesson has image or video
				await getImageVideo(lessonDetail);
				console.log('BAS >>> loaded dialog');
			}
		} catch (error) {
			console.log(`ERROR: \n\n loaddialog ${JSON.stringify(error, null, 2)}`);
			if (error?.message) {
				console.log(`ERROR: \n\n loaddialog ${error.message}`);
			}
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		} finally {
			setLoadingSpinning(false);
		}
	};

	const updateAPI = async (dialogID) => {
		console.log(`-- => lessonDialog updateAPI`);
		for (let i = 0; i <= dialog.length - 1; i++) {
			const imageSlideId = listImageSlideDialog.find((item) => item.index === i)?.imageId;
			if (dialog[i].id) {
				await updateDialogByLessonID({
					id: dialog[i].id,
					dialogId: dialogID,
					characterId: dialog[i].characterId,
					content: dialog[i].line,
					medias: dialog[i].audio_id ? (imageSlideId ? [dialog[i].audio_id, imageSlideId] : [dialog[i].audio_id]) : [],
					index: i,
				});
			} else {
				await postDialogByLessonID({
					dialogId: dialogID,
					characterId: dialog[i].characterId,
					content: dialog[i].line,
					medias: dialog[i].audio_id ? (imageSlideId ? [dialog[i].audio_id, imageSlideId] : [dialog[i].audio_id]) : [],
					index: i,
				});
			}
		}

		if (submitNext) {
			router.push(
				`${RouterConstants.DASHBOARD_COURSE_LESSON_INPUT.path}?courseId=${values.course}&lessonId=${values.lesson}`
			);
		} else {
			await loadDialog(values.lesson);
		}

		toast(t('dashboard.notification.create_lesson_dialogue_has_been_c_u'), {
			position: 'top-right',
			autoClose: 2500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		setLoadingSpinning(false);
	};

	const handleSubmit = async () => {
		console.log(`-- => lessonDialog handleSubmit`);
		console.log(`-- => lessonDialog handleSubmit ${JSON.stringify(listImageSlideDialog, null, 2)}`);
		if (!previewVideoID && !values.fileExternal && showSlideOrVideo.isShowVideo) {
			setValuesErr({
				...valuesErr,
				// previewID: !previewID,
				previewVideoID: !previewVideoID,
			});
			setLoadingSpinning(false);
			toast.warning(t('dashboard.notification.at_least_one_required_filed_was_empty'));
			return false;
		}

		setLoadingSpinning(true);

		let formatData = {
			id: values.lesson,
			courseSectionId: values?.lessonObj?.courseSectionId || undefined,
			context: values?.context,
			introduction: values.introduction,
			// thumbnailId: previewID,
			index: values.index,
			showIntroductionVideo: showSlideOrVideo.isShowVideo,
			showDialogSlide: showSlideOrVideo.isShowSlide,
		};

		if (values.fileExternal) {
			try {
				console.log(`-- => lessonDialog handleSubmit uploading external files`);
				const responseUpload = await uploadFileExternal({
					link: values.fileExternal,
					name: `link-external-${uuidv4()}`,
				});
				if (responseUpload) {
					formatData = {
						...formatData,
						instructionVideoId: responseUpload?.data?.id,
					};
				}
			} catch (error) {
				console.log(`ERROR: \n\n handlesubmit ${JSON.stringify(error, null, 2)}`);
			}
		} else {
			formatData = {
				...formatData,
				instructionVideoId: previewVideoID,
			};
		}

		await updateLesson(formatData);

		if (values?.lessonObj?.dialogs?.length) {
			
			console.log(`-- => lessonDialog updating dialogs ${JSON.stringify(listImageSlideDialog, null, 2)}`);

			const responseUpdateDialog = await updateDialog({
				id: values?.lessonObj?.dialogs[0].id,
				index: 0,
				lessonId: values.lesson,
				context: values?.context,
				introduction: values.introduction,
				lines: [],
				medias: [],
				contextAudioId: audioContext.current.id,
			});
			if (responseUpdateDialog) {
				console.log(`-- => lessonDialog handleSubmit updating dialog media ${JSON.stringify(values?.lessonObj?.dialogs[0], null, 2)}`);
				await updateAPI(values?.lessonObj?.dialogs[0].id);
			}
		} else {
			const responseCreateDialog = await postDialog({
				index: 0,
				lessonId: values.lesson,
				context: values?.context,
				introduction: values.introduction,
				lines: [],
				medias: [],
				contextAudioId: audioContext.current.id,
			});
			if (responseCreateDialog?.data) {
				await updateAPI(responseCreateDialog?.data?.id);
			}
		}
		const courseStatus = await validateCourse(values.course)
		
		showStatus(courseStatus.data);
		return true;
	};


	const showStatus = (courseStatus) => {
		console.log(`=+=+=+ ${JSON.stringify(courseStatus, null, 2)}`)
		if(!courseStatus.isValid){
			
			if(!courseStatus.courseTitle){
				toastInfo( 'The course needs a title.');
			}  
			if(!courseStatus.instructionVideo){
				toastInfo( 'The course needs an intooductory video.');
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


	// Handle Video/Image/Video

	const handleChangeMedia = (e) => {
		console.log(`-- => lessonDialog handleChangeMedia`);
		setValues({ ...values, fileExternal: e.target.value });
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
		console.log(`-- => lessonDialog handleImage`);
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
			console.log(`-- => lessonDialog deleteImageMutation`);
			setPreviewID(undefined);
			setImage(undefined);
			setImage('');
			setUploading(false);
		},
		onError: (error) => {
			setUploading(false);
			console.log(`ERROR: \n\n handleimage ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	const handleImageRemove = async () => {
		console.log(`-- => lessonDialog handleImageRemove`);
		setUploading(true);
		deleteImageMutation.mutate({
			ids: [previewID],
		});
	};

	const uploadVideoMutation = useMutation(uploadFile, {
		onSuccess: (res) => {
			console.log(`-- => lessonDialog uploadVideoMutation`);
			setPreviewVideoID(res?.data?.id);
			setUploading(false);
		},
		onError: (err) => {
			setPreviewVideoID(undefined);
			setUploading(false);
		},
	});

	const handleVideo = async (info) => {
		console.log(`-- => lessonDialog handleVideo`);
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
			console.log(`-- => lessonDialog deleteVideoMutation`);
			setVideo('');
			setPreviewVideoID(undefined);
			setVideo(undefined);
			setUploading(false);
		},
		onError: (error) => {
			setUploading(false);
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	const handleVideoRemove = async () => {
		console.log(`-- => lessonDialog handleVideoRemove`);
		setUploading(true);
		deleteVideoMutation.mutate({
			ids: [previewVideoID],
		});
	};

	const handleAudio = async ({ fileList }) => {
		console.log(`-- => lessonDialog handleAudio`);
		const getFile = fileList[fileList.length - 1].originFileObj;
		if (beforeUpload(getFile)) {
			let index = newChara.index;
			setUploading(true);
			let list = [...dialog];

			const reader = new FileReader();
			reader.addEventListener('load', () => {
				if (isUploadAudioContextForSlide) {
					audioContext.current.audio = reader.result;
				} else {
					list[index].audio = reader.result;
				}
			});
			reader.readAsDataURL(getFile);
			getBase64(getFile, (url) => {
				if (isUploadAudioContextForSlide) {
					audioContext.current.audio = url;
				} else {
					list[index].audio = url;
				}
			});

			const formData = new FormData();
			formData.append('file', getFile);
			formData.append('public', 'false');

			try {
				const response = await uploadFile(formData);
				if (response) {
					if (isUploadAudioContextForSlide) {
						audioContext.current.id = response?.data?.id;
						audioContext.current.name = `${response?.data?.name}.${response?.data?.ext}`;
					} else {
						list[index].audio_id = response?.data?.id;
						list[index].audio_name = `${response?.data?.name}.${response?.data?.ext}`;
						setDialog(list);
					}
					setUploading(false);
				}
			} catch (error) {
				setUploading(false);
				console.log(`ERROR: \n\n handleaudio ${JSON.stringify(error, null, 2)}`);
				//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		} else {
			message.error(t('dashboard.notification.audio_must_smaller_20MB'));
		}
	};

	const handleRemoveAudio = async ({ index }) => {
		console.log(`-- => lessonDialog handleRemoveAudio`);
		setUploading(true);
		let list = [...dialog];

		try {
			const response = await deleteFiles({
				ids: [list[index].audio_id],
			});
			if (response) {
				list[index].audio = undefined;
				list[index].audio_id = undefined;
				list[index].audio_name = undefined;
				setDialog(list);
				toast(t('dashboard.notification.audio_removed'));
				setUploading(false);
			}
		} catch (error) {
			setUploading(false);
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	// End Handle Video/Image/Video

	const deleteDialog = async ({ index, id }) => {
		console.log(`-- => lessonDialog deleteDialog`);
		const cloneData = JSON.parse(JSON.stringify([...dialog]));
		if (id) {
			setLoadingSpinning(true);
			try {
				const response = await deleteDialogByLessonID(id);
				if (response) {
					cloneData.splice(index, 1);
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			} finally {
				setLoadingSpinning(false);
			}
		} else {
			cloneData.splice(index, 1);
		}

		setDialog(cloneData);
	};

	const addCharacter = async () => {
		console.log(`-- => lessonDialog addCharacter`);
		const list = [...dialog];
		let charaList = [...characters];

		try {
			const response = await postCharacter({ ...newChara, gender: 'MALE', index: undefined });
			if (response) {
				charaList.push(newChara);
				setCharacters(charaList);
				list[newChara.index].characterId = newChara.id;
				setNewChara({ name: '', age: '', gender: '', occupation: '' });
				setDialog(list);
				setVisibleCharacter(false);
			}
		} catch (error) {
			console.log(`ERROR: \n\n addchar ${JSON.stringify(error, null, 2)}`);
			//toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const setDialogLine = (index, value) => {
		console.log(`-- => lessonDialog setDialogLine`);
		console.log(`setDialogLine ${index} ${value}`);
		const list = [...dialog];
		list[index].line = value;
		setDialog(list);
	};

	const setDialogChara = ({ index, value }) => {
		console.log(`-- => lessonDialog setDialogChara`);
		const list = [...dialog];
		list[index].characterId = value;
		setDialog(list);
	};

	const handleAudioMydrive = (audio, audioConfig) => {
		console.log(`-- => lessonDialog handleAudioMydrive`);
		setUploading(true);
		if (isUploadAudioContextForSlide) {
			audioContext.current = {
				id: audioConfig.id,
				audio: audio,
				name: audioConfig.name,
			};
		} else {
			let index = newChara.index;
			let list = [...dialog];
			list[index].audio = audio;
			list[index].audio_id = audioConfig.id;
			list[index].audio_name = audioConfig.name;
			setDialog(list);
		}
		setUploading(false);
	};

	const mergedConfig = {
		dataSource: {
			tags,
			languages,
			voiceList,
			levels,
			allInstructors,
			voiceLanList,
		},
		myValue: {
			values,
			user,
			courses,
			lessons,
			uploading,
			characters,
			dialog,
			newChara,
			characters,
			visibleCharacter,
			visibleAddAudio,
			image,
			video,
			previewCourse,
			currentVoice,
			loadingSpinning,
			valuesErr,
			listImageSlideDialog,
			audioContext,
			isUploadAudioContextForSlide,
			showSlideOrVideo,
		},
		actions: {
			setValues,
			deleteDialog,
			handleSubmit,
			handleImage,
			handleImageRemove,
			setDialog,
			setNewChara,
			setCharacters,
			setVisibleCharacter,
			setVisibleAddAudio,
			getLessons,
			loadDialog,
			setDialogLine,
			setDialogChara,
			addCharacter,
			handleAudio,
			handleRemoveAudio,
			handleVideo,
			handleVideoRemove,
			setPreviewCourse,
			setCurrentVoice,
			loadVoiceList,
			generateAIAudio,
			handleAudioMydrive,
			setValuesErr,
			setSubmitNext,
			handleChangeMedia,
			setListImageSlideDialog,
			setIsUploadAudioContextForSlide,
			setShowSlideOrVideo,
		},
	};

	return (
		<DashboardRoute>
			<div className="animated fadeIn">
				<BrowserView>
					<div className="section-head mb-4">
						<div className="d-flex align-items-center justify-content-between">
							<Col xs={24} sm={16} className="pe-4 d-flex align-items-center">
								<h3 className="page-title float-left mb-0">{t('dashboard.title.build_lesson_dialog')}</h3>
								<ModalViewPlayer
									url="https://player.vimeo.com/video/840554115?badge=0&autopause=0&player_id=0&app_id=58479"
									label="Tutorial"
								/>
							</Col>
							<Col xs={24} sm={8}>
								{userStore.currentUser &&
									(userStore.currentUser.role === ROLE_TYPE.SUBDOMAIN_ADMIN ||
										userStore.currentUser.role === ROLE_TYPE.INSTRUCTOR) && (
										<Button
											size="large"
											onClick={() => {
												router.push({
													pathname: `${RouterConstants.DASHBOARD_COURSE_IMPORT_STEP_2.path}`,
													query: {
														courseId: values.course,
													},
												});
											}}
											className={`tw-w-full tw-rounded-md tw-px-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-bg-lightGray tw-mt-4`}
											disabled={values.course === undefined}
										>
											Import CSV
										</Button>
									)}
							</Col>
						</div>
					</div>

					<Col xs={24} sm={16} className="pe-4">
						<p>{t('dashboard.label.course_description')}</p>
					</Col>
				</BrowserView>

				<div className="md:tw-py-4 -tw-mx-[20px] md:tw-mx-0">
					<Spin spinning={loadingSpinning || false}>
						<BrowserView>
							<DialogLessonCreateForm {...mergedConfig} />
						</BrowserView>
						<MobileView>
							<MobileDialogLessonCreateForm {...mergedConfig} />
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

export default LessonDialogueIndex;
