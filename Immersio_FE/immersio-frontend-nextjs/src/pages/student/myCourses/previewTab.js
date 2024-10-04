import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'
import Image from "next/image"
import { useContext, useEffect, useRef, useState } from 'react'
import AudioPlay from '../../../../components/PreviewLesson/components/audioPlay'
import IMAGE_LESSON_FLOW from '../../../../constants/lessons-icon'
import { LessonContext } from './index'
import DrillPreview from './lesson/drills/index'
import styles from './style.module.css'
import Rewarding from '../../../../components/PreviewLesson/components/Rewarding'

const { Option } = Select;
const { Search } = Input;
const LessonPreviewIndex = ({ type, setType }) => {
    if (!useContext(LessonContext)) return null;

    const cardTypes = ["vocabulary", "phrases", "grammar"];

    const demoRef = useRef(null);

    const { vocabulary, phrases, grammar, vocabularyDrills, phrasesDrills, grammarDrills } = useContext(LessonContext);
    const [progress, setProgress] = useState({
        id: 0,
        step: 1 // maximum is 3
    })
    const [value, setValue] = useState([]);
    const [drillProgress, setDrillProgress] = useState({
        id: 0,
        step: 1
    });
    const [drillSectionIndex, setDrillSectionIndex] = useState(0);
    let counter = 0;

    useEffect(() => {
        setDrillProgress({
            id: drillProgress.id,
            step: 1
        })
    }, [drillSectionIndex]);
    const nextSection = () => {
        let element = value[drillProgress.id];
        counter = element.drillType === 'dragWords' || element.drillType === 'fillBlank' || element.drillType === 'dragNdrop' ? element.words.length :
            element.drillType === 'multipleChoice' || element.drillType === 'flashcards' || element.drillType === 'sort' ? element.questions.length :
                0;
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

    const processDragAndDrop = (element, vocabs) => {
        const words = vocabs ? vocabs.map((element) => { return element.input }) : [];
        const images = element.images;
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
        element.images = images.length === words.length ? processedImages : images.slice();
        element.words = processedWords;
        return element;
    }

    const handleChangeProgress = () => {
        if (cardTypes.indexOf(type) !== -1) {
            if (progress.step !== 3) {
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
            counter = element.drillType === 'dragWords' || element.drillType === 'fillBlank' || element.drillType === 'dragNdrop' ? element.words.length :
                element.drillType === 'multipleChoice' || element.drillType === 'flashcards' || element.drillType === 'sort' ? element.questions.length : 0;
        }
        if (changeType === 'next') {
            if ((cardTypes.indexOf(type) !== -1 && progress.id === value.length - 1)
                || (cardTypes.indexOf(type) === -1 && counter - 1 === drillSectionIndex && drillProgress.id === value.length - 1)) {
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
        }
    }

    useEffect(() => {
        // if (type === "vocabulary") setValue(vocabulary.map((element, index) => { return { ...element, id: index } }))
        // if (type === "phrases") setValue(phrases.map((element, index) => { return { ...element, id: index } }))
        // if (type === "grammar") setValue(grammar.map((element, index) => { return { ...element, id: index } }))
        // if (type === "vocabularyDrills") setValue(vocabularyDrills.map((element, index) => { return { ...element, id: index } }))
        // if (type === "phrasesDrills") setValue(phrasesDrills.map((element, index) => { return { ...element, id: index } }))
        // if (type === "grammarDrills") setValue(grammarDrills.map((element, index) => { return { ...element, id: index } }))

    }, [type, vocabulary, phrases, grammar, vocabularyDrills, phrasesDrills, grammarDrills])

    return (
        <div className={styles.lessonPreview}>
            <div className="animated fadeIn">


                <div className={styles.step}>
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
                                        <>
                                            {progress.step !== 3 ? <div className={styles.stepCardOverlay} /> : null}
                                            <div className={styles.stepCardItem}>
                                                {progress.step >= 2 ? <div className={styles.titleTrans}>{session.video ? <video className={styles.video} src={session.video.Location} controls controlsList="nodownload"></video> : session.image ? <img className={styles.image} src={session.image.Location}></img> : null}</div> : null}
                                                <div className={[styles.title, progress.step >= 2 ? styles.custom : null].join(' ')}>{session.input}</div>
                                                <div className={styles.sound}>
                                                    <AudioPlay index={type + index} src={session.audio ? session.audio.Location : undefined} />
                                                </div>
                                            </div>
                                            {progress.step === 3 ? <div className={styles.stepCardExplain} dangerouslySetInnerHTML={{ __html: session.explanation }} /> : null}
                                        </>
                                    )
                                })}
                            </div>
                        </>
                    ) :
                        <>
                            <div className={styles.stepTabs}>
                                {value.map(session => (
                                    <div key={`list-drill-tab-${session.id}`} className={[styles.stepTabItem, session.id === drillProgress.id ? styles.active : null].join(' ')} />
                                ))}
                            </div>
                            <div className={styles.stepCards}>
                                {value.map((element, index) => {
                                    if (!element.drillType || element.id !== drillProgress.id) return null
                                    let drillValue = element;
                                    if (element.drillType === 'dragNdrop' && element.id === drillProgress.id) {
                                        drillValue = processDragAndDrop(element, vocabulary);
                                    }
                                    return (
                                        <DrillPreview drillProgress={drillProgress} value={drillValue} demoRef={demoRef} sectionIndex={drillSectionIndex} setDrillProgress={setDrillProgress} />
                                    )
                                })}
                            </div>

                        </>
                    }

                    <div className={styles.actions}>
                        <div className={[styles.arrowLeft, (type === "vocabulary" && progress.id === 0) ||
                            (cardTypes.indexOf(type) !== -1 && progress.step != 3) || (cardTypes.indexOf(type) === -1 && drillProgress.step != 2)
                            ? styles.disabled : undefined].join(' ')}
                            onClick={() => handleNextPrevProgress('prev')}>
                            <LeftOutlined />
                        </div>
                        <div className={[styles.nextProgress, ((cardTypes.indexOf(type) !== -1 && progress.step >= 2) || (cardTypes.indexOf(type) === -1 && drillProgress.step === 2))
                            ? styles.changeColor : null].join(' ')} onClick={handleChangeProgress}>
                            {(cardTypes.indexOf(type) !== -1 && progress.step === 1) ||
                                (cardTypes.indexOf(type) === -1 && drillProgress.step === 1) ? <Image src={IMAGE_LESSON_FLOW.eyelash} width={40} height={40} /> : null}
                            {(cardTypes.indexOf(type) !== -1 && progress.step === 2) ? <Image src={IMAGE_LESSON_FLOW.eyeopen} width={40} height={40} /> : null}
                            {(cardTypes.indexOf(type) !== -1 && progress.step === 3) ||
                                (cardTypes.indexOf(type) === -1 && drillProgress.step === 2) ? <Image src={IMAGE_LESSON_FLOW.eyeopen_large} width={40} height={40} /> : null}
                        </div>
                        <div className={[styles.arrowRight, (type === "grammarDrills" && drillProgress.id === value.length - 1 && (drillSectionIndex + 1)
                            === (value[drillProgress.id].drillType === 'dragWords' || value[drillProgress.id].drillType === 'fillBlank' || value[drillProgress.id].drillType === 'dragNdrop' ? value[drillProgress.id].words.length :
                                value[drillProgress.id].drillType === 'multipleChoice' || value[drillProgress.id].drillType === 'flashcards' || value[drillProgress.id].drillType === 'sort' ? value[drillProgress.id].questions.length :
                                    0)) ||
                            (cardTypes.indexOf(type) !== -1 && progress.step != 3) || (cardTypes.indexOf(type) === -1 && drillProgress.step != 2)
                            ? styles.disabled : undefined].join(' ')} onClick={() => handleNextPrevProgress('next')}>
                            <RightOutlined />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonPreviewIndex