import { ArrowRightOutlined, SendOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Col, Input, Modal, Row, Select, Spin } from 'antd'
import React, { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import useRecorder from '../../../hooks/useRecorder'
import { getAllCourses, getCourseByID } from '../../../src/services/courses/apiCourses'
import { getLesson } from '../../../src/services/lessons/apiLessons'
import AudioPlayRecord from '../../PreviewLesson/components/audioPlayRecord'
import LoadingAudioOrImage from '../../v2/LoadingAudioOrImage'
import ChatBody from './Body'
import { useTranslation } from 'next-i18next'
import { postLessonRolePlay } from '../../../src/services/communityChat/apiChat'
const { Option } = Select

const ImmyChat = ({ actions }) => {
	let [audioURL, isRecording, startRecording, stopRecording] = useRecorder()
	const { t } = useTranslation();
	const [userMessage, setUserMessage] = useState('')
	const [messages, setMessages] = useState([])
	const [messagesHistory, setMessagesHistory] = useState([])
	const [language, setLanguage] = useState('English')
	const [file, setFile] = useState()
	const [buttonText, setButtonText] = useState('Start recording') //Can be deleted later
	const [openModal, setOpenModal] = useState(false)
	const [warningModal, setWarningModal] = useState(false)
  const [rolePlayingMode, setRolePlayingMode] = useState(false)
  const [currentLessonTitle, setCurrentLessonTitle] = useState("")

	/** USEFUL SOURCE FOR AUDIO PLAYING
	* https://apiko.com/blog/how-to-work-with-sound-java-script/
	* **/
	useEffect(async () => {
		if (audioURL) {
			try {
				let messList = [...messages]
				//First print our message
				messList.push({ role: 'user', content: audioURL.transcription })
				messagesHistory.push({ 'role': 'user', 'content': audioURL.transcription })

				if (audioURL.transcription == '') return
				var arrayBuffer = new Uint8Array(audioURL.audio.AudioStream.data);
				//console.log(arrayBuffer)
				const blob = new Blob([arrayBuffer], { type: "audio/wav" });
				var audio = new Audio()
				audio.src = window.URL.createObjectURL(blob);
				audio.play()

				/*const blob = new Blob([audioURL.audio], { type: "audio/wav" });
				var audio = new Audio(audioURL.audio);
				audio.play();*/
				messList.push({ role: 'assistant', content: audioURL.answer })
				messagesHistory.push({ 'role': 'assistant', 'content': audioURL.answer })
				console.log('history=', messList)
				setMessages(messList)
			} catch (err) {
				setWarningModal(true)
				console.log(err)
			}
		}
	}, [audioURL])

	const getAudioContext = () => {
		AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContent = new AudioContext();
		return audioContent;
	}

	const askOpie = async (mess) => {
		let messList = [...messages]
		try {
			setUserMessage('')
			messList.push({ role: 'user', content: mess })
			// 1. Save messages in the chat history
			messagesHistory.push({ 'role': 'user', 'content': mess})
			console.log(messagesHistory);
			// 2. Send message history to the server
			try {
				let data = await actions.sendMsgToOpie(messagesHistory, language)
				console.log('respuesta=', data)
				// 3. Recibir y guardar historial en mess hist
				messagesHistory.push({ 'role': 'assistant', 'content': data.answer })
				// 4. Save message into message history
				messList.push({ role: 'assistant', content: data.answer })

				if (data && data.audio) {
					//console.log(data.audio.AudioStream.data)
					// create audio context
					const audioContext = getAudioContext();
					// create audioBuffer (decode audio file)
					const audioBuffer = await audioContext.decodeAudioData(data.audio.AudioStream)
	
					const source = audioContext.createBufferSource();
					source.buffer = audioBuffer;
					source.connect(audioContext.destination);
					// play audio
					source.start()
				}
			} catch (err) {
				setWarningModal(true)
				console.log(err)
			}

			setMessages(messList)
		} catch (err) {
			console.log('ERROR:', err?.response?.data)
			console.log('ERROR:', err)
			setWarningModal(true)
			toast.error(err?.response?.data)
		}
	}

	const toggleRecording = () => {
		if (buttonText == 'Start recording') {
			setButtonText('Stop recording')
			startRecording()
		} else {
			setButtonText('Start recording')
			stopRecording(messagesHistory, language)
		}
	}

	const [loadingSpinning, setLoadingSpinning] = useState(false);
	const [courses, setCourses] = useState([]);
	const [lessons, setLessons] = useState([]);
  const [values, setValues] = useState({});
	const [dialogs, setDialog] = useState([]);

  useEffect(() => {
    loadCourses()
  }, [])

	const loadCourses = async () => {
    try {
      const response = await getAllCourses('')
      if (response?.data) {
        // @ts-ignore
        setCourses(response.data)
      }
    } catch (err) {
      toast.error(err?.response?.data);
      console.log(err);
    }
	}

  const getLessonAPI = async (lessonId) => {
    try {
      const response = await getLesson(lessonId)
			return response?.data
    } catch (err) {
      return {}
    }
	}

  const getLessons = async (courseId) => {
		setLoadingSpinning(true);

		let less0ns = []
    try {
      const { data: currentCourse } = await getCourseByID(courseId)

      if (currentCourse) {
        // @ts-ignore
        const orderedSections = (currentCourse?.sections || []).sort((a, b) => a.index - b.index)
        orderedSections.forEach((session) => {
          const orderedLessons = (session?.lessons || []).sort((a, b) => a.index - b.index)
          orderedLessons.forEach((item) => {
            less0ns.push(item)
          })
        })
        setLessons(less0ns)
  
        let currentLesson
        if (less0ns.length > 0) {
          currentLesson = less0ns[0]
        }
  
        if (currentLesson) {
          setValues({
            ...values,
            course: courseId,
            lesson: currentLesson.id,
            lessonLabel: currentLesson.title
          })
					setDialog([])
          await getIDDialog(currentLesson.id, courseId)
        }
      }
    } catch (err) {
      toast.error(err?.response?.data);
      console.log(err);
		} finally {
			setLoadingSpinning(false);
		}
	}

  const lessonRolePlay = async (isRolePlaying) => {
    try {
      console.log("posting lessonnnnn");
      console.log(values.lesson);
	  	setLoadingSpinning(true);

    	// Reset chat history when a new lesson is selected
    	setMessages([]);
    	setMessagesHistory([]);
      const lesson = isRolePlaying ? values.lesson : null;
      const response = await postLessonRolePlay(lesson,isRolePlaying);
			console.log(response);
		setLoadingSpinning(false);
    } catch (err) {
		setLoadingSpinning(false);
      return {};
    }
	}

  const handleClickRolePlay = () => {
    if (values && values.lesson) {
      lessonRolePlay(true);
      setRolePlayingMode(true);
      setCurrentLessonTitle(values.lessonLabel);
    }
  }

  const handleClickStopRolePlay = () => {
    lessonRolePlay(false);
    setRolePlayingMode(false);
    setCurrentLessonTitle("");
  }

	const getIDDialog = async (currentLessonID, courseId) => {
    setLoadingSpinning(true);

    const lessonDetail = await getLessonAPI(currentLessonID)
    if (lessonDetail?.dialogs?.length) {
      if (lessonDetail?.dialogs[0]?.lines?.length) {
        let arr = [];
        const dataCompare = lessonDetail.dialogs[0].lines.sort(
          (a, b) => a.index - b.index
        );

        for (let i = 0; i <= dataCompare.length - 1; i++) {
          arr.push({
            id: dataCompare[i].id,
            content: dataCompare[i].content,
            fileId: dataCompare[i].medias ? dataCompare[i].medias[0].id : undefined,
          });
        }

        setDialog(arr);
      }
    }

		setLoadingSpinning(false)
  }
	
	return(
		<>
			<div className="tw-flex tw-items-center tw-justify-center tw-min-w-[530px] tw-m-auto tw-space-x-2.5">
				<p className='tw-m-0'>
					{t('dashboard.label.immy_chat_click')}
				</p>
				<ArrowRightOutlined />
				<Button onClick={() => setOpenModal(true)}>
					{t('dashboard.label.immy_chat_review')}
					
				</Button>
			</div>

      {rolePlayingMode ? 
      <div className="tw-flex tw-items-center tw-justify-center tw-min-w-[530px] tw-m-auto tw-space-x-2.5" style={{ marginTop: "8px" }}>
				<p className='tw-m-0'>
					{`Currently roleplaying: ${currentLessonTitle}`}
				</p>
				<ArrowRightOutlined />
        <Button onClick={handleClickStopRolePlay}>
					{t('dashboard.label.immy_chat_stop_roleplay')}
					
				</Button>
			</div> : null
      }

			<div className="tw-mt-[18px]">
				<div className="opie-cardBody">
					<p>
						{t('dashboard.label.immy_chat_description')}
					</p>
					<Select
						placeholder="Choose Language"
						defaultValue={language}
						value={language}
						tokenSeparators={[,]}
						size='medium'
						onChange={(v) => setLanguage(v)}
						className='tw-w-full'
					>
						<Option key={2} value={'Chinese'}>{'Chinese'}</Option>
						<Option key={1} value={'English'}>{'English'}</Option>
						<Option key={3} value={'French'}>{'French'}</Option>
						<Option key={4} value={'German'}>{'German'}</Option>
						<Option key={6} value={'Korean'}>{'Korean'}</Option>
						<Option key={5} value={'Japanese'}>{'Japanese'}</Option>
					</Select>

					<ChatBody messages={messages} />
					<audio controls hidden>
						<source src={file} type="audio/mpeg" />
					</audio>

					<Input
						placeholder="Type your message here"
						size='large'
						className='opie-input'
						value={userMessage}
						suffix={<SendOutlined />} 
						onChange={(e) => setUserMessage(e.target.value)}
						onKeyDown={(e) => (e.keyCode == 13 ? askOpie(e.target.value) : '')}
					/>

					{language && !(language == 'Latin' || language == 'Greek' || language == 'Hebrew' || language == 'Aramaic') &&
						<div onClick={toggleRecording} className='tw-w-full tw-h-[66px]'>
							<div>
								{isRecording === false &&
									<div className="tw-flex tw-justify-center tw-w-[66px] tw-h-[66px] tw-rounded-full bg-theme-4 tw-m-auto">
										<img
											style={{ fontFamily: 'Font Awesome 5 Free', fontWeight: '900', width: '40px', filter: 'brightness(0) invert(1)' }}
											src="/assets/img/chat/idle_mic.svg"
											alt=""
											className='tw-cursor-pointer'
										/>
									</div>
								}

								{isRecording === true &&
									<div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', height: 66 }}>
										<div className="waves" style={{ backgroundColor: '#03676f', marginLeft: '-16px' }}></div>
										<div className="waves" style={{ backgroundColor: '#f98866', marginLeft: '2px' }}></div>
										<div className="waves" style={{ backgroundColor: '#03676f', marginLeft: '18px' }}></div>
										<div className="waves" style={{ backgroundColor: '#f98866', marginLeft: '36px' }}></div>
									</div>
								}
							</div>
						</div>
					}
				</div>
			</div>

			<Modal
				centered
				title=""
				width={420}
				onCancel={() => setWarningModal(false)}
				open={warningModal}
				footer={null}
			>
				<ExclamationCircleOutlined style={{ color: '#eed202', fontSize: '30px', display: 'flex', justifyContent: 'center', marginTop: '7px' }} />
				<p style={{ textAlign: 'center', marginTop: '5px' }} >Immy is not available.<br />Please, retry later or contact the administration.</p>
			</Modal>

			<Modal
				centered
				title=""
				width={580}
				onCancel={() => setOpenModal(false)}
				open={openModal}
				footer={null}
			>
				<Spin spinning={loadingSpinning}>
					<div className='tw-space-y-[26px]'>
						<div>
							<p className='tw-text-[20px] tw-m-0 tw-text-center color-theme-1'>Lesson Dialogue Review</p>
						</div>
						
						<div>
							<Row gutter={15} className='tw-w-full !tw-m-0'>
								<Col xs={12}>
									<Select
										showSearch
										filterOption={(input, option) =>
											String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										size="large"
										value={values.course}
										placeholder="Select a course"
										className="w-100"
										onChange={(v) => {
											setValues({
												...values,
												course: v,
												lesson: "",
											});
											getLessons(v);
										}}
									>
										{courses.map((course, index) => (
											<Select.Option key={index} value={course.id} label={course.title}>{course.title}</Select.Option>
										))}
									</Select>
								</Col>
								<Col xs={12}>
									<Select
										showSearch
										filterOption={(input, option) =>
											String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										size="large"
										value={values.lesson}
										placeholder="Select a lesson"
										className="w-100 custom-select"
										onChange={(v) => {
											setValues({ ...values, lesson: v, lessonLabel: lessons.find((lesson) => lesson.id === v).title});
											setDialog([])
											getIDDialog(v, values.course);
										}}
									>
										{lessons.map((lesson, index) => (
											<Select.Option key={index} value={lesson.id} label={lesson.title}>{lesson.title}</Select.Option>
										))}
									</Select>
								</Col>
							</Row>
						</div>

            {dialogs?.length ? (
              <div style={{ display: 'grid', gridTemplateRows: '1fr auto' }}>
                <div className='tw-space-y-2'>
                  {dialogs.map((dialog, index) => (
                    <div key={index} className='tw-flex tw-items-center'>
                      <p className='tw-m-0'>- {dialog.content}</p>
                      {dialog.fileId ? (
                        <LoadingAudioOrImage width={50} height={40} src={dialog.fileId}>
                          {({ srcState }) => (
                            <AudioPlayRecord size={40} src={srcState} index={1} />
                          )}
                        </LoadingAudioOrImage>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Button onClick={handleClickRolePlay}>
                    {t('dashboard.label.immy_chat_lesson_roleplay')}
                  </Button>
                </div>
              </div>
						) : null}
					</div>
				</Spin>
    	</Modal>
		</>
	)
}

export default ImmyChat