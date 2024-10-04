import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import Image from "next/image"
import { useContext, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import IMAGE_LESSON_FLOW from '../../../constants/lessons-icon'
import { getTrackingCourseAndLessonID, updateTrackingCourseByID } from '../../../src/services/courses/apiCourses'
import { formatSumDrills } from '../../../src/utilities/helper'
import DialogPreviewType from '../components/DialogPreviewType'
import AudioPlay from '../components/audioPlay'
import { LessonContext } from '../index'
import DrillPreview from './drills/index'
import styles from './style.module.css'
import { useMobXStores } from '../../../src/stores'

const PreviewTabMobile = ({ values = {}, type, setType, indexStep, setIndexStep, isCompletedStep, setComplete }) => {
    if (!useContext(LessonContext)) return null;
    const {globalStore} = useMobXStores()
    // get data from context
    const {
        vocabulary,
        phrases,
        grammar,
        vocabularyDrills,
        phrasesDrills,
        grammarDrills,
        dialogs,
        lesson_id,
        course_id,
        isAdmin,
        configNextLesson,
    } = useContext(LessonContext);

    const cardTypes = ["vocabulary", "phrases", "grammar"];
    const demoRef = useRef(null);
    const [progress, setProgress] = useState({
        id: 0,
        step: 1 // maximum is 2
    })
    const [value, setValue] = useState([]);
    const [drillProgress, setDrillProgress] = useState({
        id: 0,
        step: 1
    });
    const [drillSectionIndex, setDrillSectionIndex] = useState(0);

    let sumDrills = 0
    sumDrills += formatSumDrills(vocabularyDrills)
    sumDrills += formatSumDrills(phrasesDrills)
    sumDrills += formatSumDrills(grammarDrills)
    const sumTotal = vocabulary?.length + phrases?.length + grammar?.length + sumDrills + dialogs?.length

    const isDisabledAllBtn = 
        (cardTypes.indexOf(type) !== -1 && progress.step !== 2) ||
        (cardTypes.indexOf(type) === -1 && drillProgress.step !== 2)
    const isDisabledBtnNext = (indexStep === sumTotal) || isDisabledAllBtn
    const isDisabledBtnPrev = (type === "vocabulary" && progress.id === 0)

    let counter = 0;

    // setup for dialogs
    const [isDialogType, setIsDialogType] = useState(false)
    const [dialogProcess, setDialogProcess] = useState(1)

    useEffect(() => {
        setDrillProgress({
            id: drillProgress.id,
            step: 1
        })
    }, [drillSectionIndex]);

    const handleUpdateProgress = () => {
        if (lesson_id && course_id && !isCompletedStep) {
            updateTrackingCourseByID({
                lessonId: lesson_id ? Number(lesson_id) : undefined,
                courseId: course_id ? Number(course_id) : undefined,
                indexStep,
                isCompleted: indexStep === sumTotal
            })
        }
	}

    // const [loop, setLoop] = useState();
    // useEffect(() => {
    //     if (isAdmin === false) {
    //         setLoop(
    //           setInterval(() => {
    //             handleUpdateProgress()
    //           }, 600000)
    //         );
    
    //         getTracking()
    //     }

    //     return function cleanup() {
    //       clearInterval(loop);
    //     };
    // }, []);

    const getTracking = async () => {
        /*
        * @Function - Move to current step
        * @Description
        * - Base on field `indexStep` to exactly know the last step user study
        * - For Example: If sumTotal (all of data of course is 23 and data of vocabulary is 9)
        * -              and indexStep (get from API) is 10. What mean we need to move user to
        * -              1. If we have vocabularyDrills -> move to
        * -              2. If not have vocabularyDrills -> move to phrases
        * -              3. ...
        */

        if (lesson_id && course_id) {
            const response = await getTrackingCourseAndLessonID({
                lessonId: lesson_id ? Number(lesson_id) : undefined,
                courseId: course_id ? Number(course_id) : undefined,
            })

            if (response?.data?.length) {
                const getResponse = response?.data
                const newFormatIndexStep = getResponse[0]?.indexStep ? Number(getResponse[0]?.indexStep) : 1
                setIndexStep(newFormatIndexStep)
                if (getResponse[0]?.isCompleted) {
                    setComplete(true)
                }

                if (newFormatIndexStep >= sumTotal - dialogs?.length) {
                    setIsDialogType(true)
                } else {
                    const formatVocalDrillSum = vocabulary?.length + 1
                    const formatPhraseSum = vocabulary?.length + formatSumDrills(vocabularyDrills) + 1
                    const formatPhraseDrillSum = vocabulary?.length + formatSumDrills(vocabularyDrills) + phrases?.length + 1
                    const formatGrammarSum = vocabulary?.length + formatSumDrills(vocabularyDrills) + phrases?.length + formatSumDrills(phrasesDrills) + 1
                    const formatGrammarDrillSum = vocabulary?.length + formatSumDrills(vocabularyDrills) + phrases?.length + formatSumDrills(phrasesDrills) + grammar?.length + 1

                    if (Array.from({ length: vocabulary?.length }, (_, i) => i + 1).includes(newFormatIndexStep)) {
                        setType("vocabulary")
                        setProgress({
                            id: newFormatIndexStep - 1,
                            step: 1
                        })
                        setDrillSectionIndex(0);
                    } else if (Array.from({ length: formatSumDrills(vocabularyDrills) }, (_, i) => i + formatVocalDrillSum).includes(newFormatIndexStep)) {
                        setType("vocabularyDrills")
                        setDrillProgress({
                            id: newFormatIndexStep - 1 - (formatVocalDrillSum - 1),
                            step: 1
                        })
                        setDrillSectionIndex(0);
                    } else if (Array.from({ length: phrases?.length }, (_, i) => i + formatPhraseSum).includes(newFormatIndexStep)) {
                        setType("phrases")
                        setProgress({
                            id: newFormatIndexStep - 1 - (formatPhraseSum - 1),
                            step: 1
                        })
                        setDrillSectionIndex(0);
                    } else if (Array.from({ length: formatSumDrills(phrasesDrills) }, (_, i) => i + formatPhraseDrillSum).includes(newFormatIndexStep)) {
                        setType("phrasesDrills")
                        setDrillProgress({
                            id: newFormatIndexStep - 1 - (formatPhraseDrillSum - 1),
                            step: 1
                        })
                        setDrillSectionIndex(0);
                    } else if (Array.from({ length: grammar?.length }, (_, i) => i + formatGrammarSum).includes(newFormatIndexStep)) {
                        setType("grammar")
                        setProgress({
                            id: newFormatIndexStep - 1 - (formatGrammarSum - 1),
                            step: 1
                        })
                        setDrillSectionIndex(0);
                    } else if (Array.from({ length: formatSumDrills(grammarDrills) }, (_, i) => i + formatGrammarDrillSum).includes(newFormatIndexStep)) {
                        setType("grammarDrills")
                        setDrillProgress({
                            id: newFormatIndexStep - 1 - (formatGrammarDrillSum - 1),
                            step: 1
                        })
                        setDrillSectionIndex(0);
                    }
                }
            }
        }
    }

    const resetPreview = () => {
        let listDrillsId = []
        globalStore.listDrills.forEach((item) => {
          if (item.type === 'DRAG_AND_DROP') {
            listDrillsId.push(item.data[item.index - 1].id);
          } else {
            item.data.forEach((value) => {
              listDrillsId.push(value.id);
            });
          }
        });
        console.log('listDrillsId',listDrillsId);
        globalStore.setListDrillsIds(listDrillsId)
        setType("introduction");
        setIsDialogType(false);

        setIndexStep(1);
        setProgress({
            id: 0,
            step: 1
        });
        setDrillProgress({
            id: 0,
            step: 1
        });
        setDrillSectionIndex(0);
        setDialogProcess(1);
    }

    const nextSection = () => {
        let element = value[drillProgress.id];
        counter = ['dragNdrop'].includes(element.drillType)
            ? processDragAndDrop(element, vocabulary)?.words?.length
            : ['dragWords', 'fillBlank'].includes(element.drillType)
            ? processDragAndWord(element, vocabulary)?.words?.length
            : ['multipleChoice', 'flashcards', 'sort'].includes(element.drillType)
                ? element?.questions?.length
                : 0;
        if (drillSectionIndex < counter - 1) {
            setDrillSectionIndex(drillSectionIndex + 1)
        } else {
            setDrillProgress({
                id: drillProgress.id + 1,
                step: 1
            });
            setDrillSectionIndex(0);
        }
    };

    const prevSection = () => {
        if (drillSectionIndex > 0) {
            setDrillSectionIndex(drillSectionIndex - 1);
        } else {
            setDrillProgress({
                id: drillProgress.id - 1,
                step: 1
            });
            setDrillSectionIndex(0);
        }
    };

    const processDragAndDrop = (elementParent, vocabs) => {
        const element = JSON.parse(JSON.stringify(elementParent));
        const words = (element?.answers || []).filter(item => item).length
            ? element?.answers
            : (vocabs || []).map((element) => { return element.input })
        const images = element.images || [];

        let processedWords = [];
        let processedImages = [];
        let emptyWordsArray = [];
        let emptyImagesArray = [];
        let lastWordsGroup = [];
        let lastImagesGroup = [];
        const groupSize = 4;
        const length = words.length;
        let quotient = 0;
        if (length > groupSize) {
            quotient = Math.floor(length / groupSize);
            let remainder = length % groupSize;
            if (remainder === 1) {
                for (let i = 0; i < quotient - 1; i++) {
                    emptyWordsArray.push([
                        words[i * groupSize],
                        words[i * groupSize + 1],
                        words[i * groupSize + 2],
                        words[i * groupSize + 3],
                    ]);
                    emptyImagesArray.push([
                        images[i * groupSize],
                        images[i * groupSize + 1],
                        images[i * groupSize + 2],
                        images[i * groupSize + 3],
                    ]);
                }
                let secondLastWordsGroup = [];
                let secondLastImagesGroup = [];
                for (
                    let j = (quotient - 1) * groupSize;
                    j < quotient * groupSize - 1;
                    j++
                ) {
                    secondLastWordsGroup.push(words[j]);
                    secondLastImagesGroup.push(images[j]);
                }
                for (let k = length - 2; k < length; k++) {
                    lastWordsGroup.push(words[k]);
                    lastImagesGroup.push(images[k]);
                }
                emptyWordsArray.push(secondLastWordsGroup);
                emptyWordsArray.push(lastWordsGroup);
                emptyImagesArray.push(secondLastImagesGroup);
                emptyImagesArray.push(lastImagesGroup);
            } else {
                for (let i = 0; i < quotient; i++) {
                    emptyWordsArray.push([
                        words[i * groupSize],
                        words[i * groupSize + 1],
                        words[i * groupSize + 2],
                        words[i * groupSize + 3],
                    ]);
                    emptyImagesArray.push([
                        images[i * groupSize],
                        images[i * groupSize + 1],
                        images[i * groupSize + 2],
                        images[i * groupSize + 3],
                    ]);
                }
                for (let j = quotient * groupSize; j < length; j++) {
                    lastWordsGroup.push(words[j]);
                    lastImagesGroup.push(images[j]);
                }
                emptyWordsArray.push(lastWordsGroup);
                emptyImagesArray.push(lastImagesGroup);
            }
            processedWords = emptyWordsArray;
            processedImages = emptyImagesArray;
        } else {
            processedWords = [words.slice()];
            processedImages = [images.slice()];
        }
        element.images = processedImages;
        element.words = processedWords;

        return element;
    }

    const processDragAndWord = (element) => {
        const cloneEle = JSON.parse(JSON.stringify(element));
        const statements = cloneEle?.statements || [];

        if (statements?.length) {
            let startingFragments = [];
            let startingWords = [];

            for (let i = 0; i < statements.length; i++) {
              const statement = statements[i];
              let arrayOfFragments = [];
              let arrayOfWords = [];
              let splitString = statement !== undefined ? statement.split("*") : [];

              if (splitString.length % 2 === 0) {
                let lastTwo = splitString.slice(splitString.length - 2);
                let combinedString = lastTwo.join("*");
                splitString.splice(splitString.length - 2, 2, combinedString);
              }

              for (let j = 0; j < splitString.length; j++) {
                j % 2 == 1
                  ? arrayOfWords.push(splitString[j])
                  : arrayOfFragments.push(splitString[j]);
              }
              startingFragments.push(arrayOfFragments);
              startingWords.push(arrayOfWords);
            }

            cloneEle.words = startingWords;
            cloneEle.fragments = startingFragments;
        }

        return cloneEle
    }

    const handleChangeProgress = () => {
        if (cardTypes.indexOf(type) !== -1) {
            if (progress.step !== 2) {
                setProgress({
                    id: progress.id,
                    step: progress.step + 1
                })
            }
        } else {
            if (demoRef && demoRef.current !== null) {
                setDrillProgress({
                    id: drillProgress.id,
                    step: 2
                })
                demoRef.current();
            }
        }
    }

    const handleNextPrevProgress = (changeType) => {        
        if (cardTypes.indexOf(type) === -1) {
            let element = value[drillProgress.id];
            counter = ['dragNdrop'].includes(element.drillType)
                ? processDragAndDrop(element, vocabulary)?.words?.length
                : ['dragWords', 'fillBlank'].includes(element.drillType)
                ? processDragAndWord(element, vocabulary)?.words?.length
                : ['multipleChoice', 'flashcards', 'sort'].includes(element.drillType)
                    ? element?.questions?.length
                    : 0;
        }

        if (changeType === 'next') {
            if (indexStep > sumTotal - dialogs?.length) {
                setIsDialogType(true)
                setIndexStep(indexStep + 1)
            } else {
                if (
                    (cardTypes.indexOf(type) !== -1 && progress.id === value.length - 1) ||
                    (cardTypes.indexOf(type) === -1 && counter - 1 === drillSectionIndex && drillProgress.id === value.length - 1)
                ) {
                    switch (type) {
                        case "vocabulary":
                            if (vocabularyDrills && vocabularyDrills.length > 0) {
                                setType("vocabularyDrills")
                                setDrillProgress({
                                    id: 0,
                                    step: 1
                                })
                                setDrillSectionIndex(0);
                            } else {
                                setType("phrases")
                                setProgress({
                                    id: 0,
                                    step: 1
                                })
                                setDrillSectionIndex(0);
                            }
                            break;
                        case "vocabularyDrills":
                            setType("phrases")
                            setProgress({
                                id: 0,
                                step: 1
                            })
                            setDrillSectionIndex(0);
                            break;
                        case "phrases":
                            if (phrasesDrills && phrasesDrills.length > 0) {
                                setType("phrasesDrills")
                                setDrillProgress({
                                    id: 0,
                                    step: 1
                                })
                                setDrillSectionIndex(0);
                            } else {
                                setType("grammar")
                                setProgress({
                                    id: 0,
                                    step: 1
                                })
                                setDrillSectionIndex(0);
                            }
                            break;
                        case "phrasesDrills":
                            setType("grammar")
                            setProgress({
                                id: 0,
                                step: 1
                            })
                            setDrillSectionIndex(0);
                            break;
                        case "grammar":
                            if (grammarDrills && grammarDrills.length > 0) {
                                setType("grammarDrills")
                                setDrillProgress({
                                    id: 0,
                                    step: 1
                                })
                                setDrillSectionIndex(0);
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    if (cardTypes.indexOf(type) !== -1) {
                        setProgress({
                            id: progress.id + 1,
                            step: 1
                        })
                    } else {
                        nextSection();
                        // setDrillProgress({
                        //     id: drillProgress.id + 1,
                        //     step: 1
                        // });
                    }
    
                }
                setIndexStep(indexStep + 1)
            }
        } else {
            if ((cardTypes.indexOf(type) !== -1 && progress.id === 0) || (cardTypes.indexOf(type) === -1 && drillSectionIndex === 0 && drillProgress.id === 0)) {
                switch (type) {
                    case "vocabularyDrills":
                        setType("vocabulary")
                        setProgress({
                            id: vocabulary.length - 1,
                            step: 1
                        })
                        setDrillSectionIndex(0);
                        break;
                    case "phrases":
                        if (vocabularyDrills && vocabularyDrills.length > 0) {
                            setType("vocabularyDrills")
                            setDrillProgress({
                                id: 0,
                                step: 1
                            })
                            setDrillSectionIndex(0);
                        } else {
                            setType("vocabulary")
                            setProgress({
                                id: vocabulary.length - 1,
                                step: 1
                            })
                            setDrillSectionIndex(0);
                        }
                        break;
                    case "phrasesDrills":
                        setType("phrases")
                        setProgress({
                            id: phrases.length - 1,
                            step: 1
                        })
                        setDrillSectionIndex(0);
                        break;
                    case "grammar":
                        if (phrasesDrills && phrasesDrills.length > 0) {
                            setType("phrasesDrills")
                            setDrillProgress({
                                id: 0,
                                step: 1
                            })
                            setDrillSectionIndex(0);
                        } else {
                            setType("phrases")
                            setProgress({
                                id: phrases.length - 1,
                                step: 1
                            })
                            setDrillSectionIndex(0);
                        }
                        break;
                    case "grammarDrills":
                        setType("grammar")
                        setProgress({
                            id: grammar.length - 1,
                            step: 1
                        })
                        setDrillSectionIndex(0);
                        break;
                    default:
                        break;
                }
            } else {
                if (cardTypes.indexOf(type) !== -1) {
                    setProgress({
                        id: progress.id - 1,
                        step: 1
                    })
                } else {
                    prevSection();
                    // setDrillProgress({
                    //     id: drillProgress.id - 1,
                    //     step: 1
                    // });
                }
            }
            setIndexStep(indexStep - 1);
        }
    }

    useEffect(() => {
        switch (type) {
            case "vocabulary":
                if (vocabulary?.length) {
                    setValue(vocabulary.map((element, index) => { return { ...element, id: index } }))
                }
                break;
            case "phrases":
                if (phrases?.length) {
                    setValue(phrases.map((element, index) => { return { ...element, id: index } }))
                }
                break;
            case "grammar":
                if (grammar?.length) {
                    setValue(grammar.map((element, index) => { return { ...element, id: index } }))
                }
                break;
            case "vocabularyDrills":
                if (vocabularyDrills?.length) {
                    setValue(vocabularyDrills.map((element, index) => { return { ...element, id: index } }))
                }
                break;
            case "phrasesDrills":
                if (phrasesDrills?.length) {
                    setValue(phrasesDrills.map((element, index) => { return { ...element, id: index } }))
                }
                break;
            case "grammarDrills":
                if (grammarDrills?.length) {
                    setValue(grammarDrills.map((element, index) => { return { ...element, id: index } }))
                }
                break;
        
            default:
                break;
        }
    }, [type, vocabulary, phrases, grammar, vocabularyDrills, phrasesDrills, grammarDrills])

    return (
        <div className={styles.lessonPreview}>
            <div className="animated fadeIn">
                {isDialogType ? (
                  <DialogPreviewType
                    styles={styles}
                    dialogs={dialogs}
                    dialogProcess={dialogProcess}
                    setIsDialogType={setIsDialogType}
                    setDialogProcess={setDialogProcess}
                    indexStep={indexStep}
                    setIndexStep={setIndexStep}
                    sumTotal={sumTotal}
                    resetPreview={resetPreview}
                    configNextLesson={configNextLesson}
                  />
                ) : (
                    <>
                        {type === 'introduction' ? (
                            <>
                                <div className={`step-custom step-mobile-scroll ${styles.step} ${styles.step02}`}>
                                    <div className={`step02 ${styles.stepVideoWrapper}`} style={{ width: 525, margin: 'auto' }}>
                                        <div className={styles.video}>
                                            {values.video ? (
                                                <ReactPlayer
                                                    url={values.video}
                                                    width='100%'
                                                    height='300px'
                                                    controls
                                                    config={{
                                                    file: {
                                                        attributes: {
                                                        controlsList: 'nodownload',
                                                        }
                                                    }
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                        <div className={`introduction mt-35 ${styles.introduction}`}>
                                            <div className="d-flex align-items-center">
                                                <h3>Dialogue context</h3>
                                            </div>
                                            <p style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: values?.context }} />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <Tooltip
                                        title={vocabulary?.length === 0 ? 'Loading ...' : ''}
                                    >
                                        <div
                                            className={[styles.nextProgress]}
                                            onClick={() => {
                                                if (vocabulary?.length) {
                                                    setType("vocabulary")
                                                }
                                            }}
                                            style={{
                                                opacity: vocabulary?.length === 0 ? 0.3 : 1,
                                            }}
                                        >
                                            <RightOutlined style={{ fontSize: 20 }} />
                                        </div>
                                    </Tooltip>
                                </div>
                            </>
                        ) : (
                            <div className={`step-custom step-mobile-scroll ${styles.step}`}>
                                {value.length && cardTypes.indexOf(type) !== -1 ? (
                                    <>
                                        <div className={styles.stepTabs}>
                                            {value.map(session => (
                                                <div key={`list-tab-${session.id}`} className={[styles.stepTabItem, session.id === progress.id ? styles.active : null].join(' ')} />
                                            ))}
                                        </div>
                                        <div className={styles.stepCards}>
                                            {value.map((session, index) => {
                                                if (session.id !== progress.id) return null
                                                return (
                                                    <div key={index}>
                                                        {progress.step !== 2 ? <div className={styles.stepCardOverlay} /> : null}
                                                        <div className={styles.stepCardItem}>
                                                            <div className={styles.titleTrans}>
                                                                {progress.step === 1
                                                                    ? (
                                                                        <>
                                                                            {session.image ? <img className={styles.image} src={session.image}></img> : null}
                                                                        </>
                                                                    ) : null}
                                                                {progress.step === 2
                                                                    ? (
                                                                        <>
                                                                            {session.video ? <video autoPlay className={styles.video} src={session.video} controls controlsList="nodownload"></video> : session.image ? <img className={styles.image} src={session.image}></img> : null}
                                                                        </>
                                                                    ) : null}
                                                            </div>
                                                            <div className='tw-flex tw-items-center tw-mt-2 tw-w-full tw-relative'>
                                                                <div className={`tw-flex-1 tw-h-[60px] tw-px-[60px] tw-justify-center tw-items-center tw-flex ${[styles.title, progress.step >= 1 ? styles.custom : null].join(' ')}`}>
                                                                    {session.input}
                                                                </div>
                                                                {session.audio ? (
                                                                    <div className={styles.sound}>
                                                                        <AudioPlay index={type + index} src={session.audio} />
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        {progress.step === 2 ? <div className={styles.stepCardExplain} dangerouslySetInnerHTML={{ __html: session.explanation }} /> : null}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.stepTabs}>
                                            {value.map(element => {
                                              if (!element.drillType || element.id !== drillProgress.id) return null
                                              return (
                                                <div key={`list-drill-introduction-${element.id}`} className={styles.stepIntroduction}>
                                                  {element.drillType === "sort" && element.questions?.length
                                                    ? element.questions[drillSectionIndex]
                                                    : (
                                                        <>
                                                            {element.drillType === 'flashcards' && element.questions?.length ? element.questions[drillSectionIndex] : element.instruction}
                                                        </>
                                                    )}
                                                </div>
                                              )
                                            })}
                                        </div>
                                        {/* <div className={styles.stepTabs}>
                                            {value.map(session => (
                                                <div key={`list-drill-tab-${session.id}`} className={[styles.stepTabItem, session.id === drillProgress.id ? styles.active : null].join(' ')} />
                                            ))}
                                        </div> */}
                                        <div className={styles.stepCards}>
                                            {value.map((element, index) => {
                                                if (!element.drillType || element.id !== drillProgress.id) return null
                                                let drillValue = element;
                                                if (element.drillType === 'dragNdrop' && element.id === drillProgress.id) {
                                                    drillValue = processDragAndDrop(element, vocabulary);
                                                }
                                                if (['dragWords', 'fillBlank'].includes(element.drillType) && element.id === drillProgress.id) {
                                                    drillValue = processDragAndWord(element, vocabulary);
                                                }
                                                return (
                                                    <div key={index}>
                                                        <DrillPreview
                                                            drillProgress={drillProgress}
                                                            value={drillValue}
                                                            demoRef={demoRef}
                                                            sectionIndex={drillSectionIndex}
                                                            setDrillProgress={setDrillProgress}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                )}

                                <div className={styles.processWrapper}>
                                    <div className={styles.process} style={{ width: `${(indexStep / sumTotal) * 100}%` }} />
                                </div>
                                <div className={styles.actions}>
                                    <div className={[styles.arrowLeft, isDisabledBtnPrev ? styles.disabled : undefined].join(' ')}
                                        onClick={() => handleNextPrevProgress('prev')}>
                                        <LeftOutlined />
                                    </div>
                                    <div
                                        className={[styles.nextProgress, ((cardTypes.indexOf(type) !== -1 && progress.step >= 2) || (cardTypes.indexOf(type) === -1 && drillProgress.step === 2)) ? styles.changeColor : null].join(' ')}
                                        onClick={handleChangeProgress}
                                    >
                                        {(cardTypes.indexOf(type) !== -1 && progress.step === 1) || (cardTypes.indexOf(type) === -1 && drillProgress.step === 1)
                                            ? <Image src={IMAGE_LESSON_FLOW.eyelash} width={40} height={40} />
                                            : null
                                        }
                                        {(cardTypes.indexOf(type) !== -1 && progress.step === 2) || (cardTypes.indexOf(type) === -1 && drillProgress.step === 2) ? <Image src={IMAGE_LESSON_FLOW.eyeopen} width={40} height={40} /> : null}
                                    </div>
                                    <div className={[styles.arrowRight, isDisabledBtnNext ? styles.disabled : undefined].join(' ')} onClick={() => handleNextPrevProgress('next')}>
                                        <RightOutlined />
                                    </div>
                                </div>
                                <div className={styles.resetPreview} onClick={resetPreview}>
                                    Restart
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <audio id="yourAudio-correct">
                <source src="/assets/audio/correct-sound.mp3" type='audio/mp3' />
            </audio>

            <audio id="yourAudio-wrong">
                <source src="/assets/audio/incorrect-sound.mp3" type='audio/mp3' />
            </audio>
        </div>
    )
}

export default PreviewTabMobile