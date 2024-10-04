import React, { useEffect, useRef, useState } from 'react';

import { ReloadOutlined } from '@ant-design/icons';
import DragAndDrop from '../../../Instructor/tools/DragAndDrop';
import { DrillRow } from './DrillRow/DrillRow';

//props.questionPage is used to set the page and "set" of questions
export const SortParagraphDrill = (props) => {
    const [questionSets, setQuestionSets] = useState([]);
    const [originalOrder, setOriginalOrder] = useState([]);
    const [numOfCorrectAnswers, setNumOfCorrectAnswers] = useState(null);
    const [showResultText, setShowResultText] = useState(false);
    const questionSetRef = useRef(questionSets);

    useEffect(() => {
        initialize()
    }, []);

    const initialize = () => {
        props.checkAnswer.current = checkAnswer;
        const filteredSet = filterEmptiesAndSetCorrectDefault(props.items[props.questionPage]);
        setQuestionSets(shuffleArray(filteredSet));
        setOriginalOrder(filteredSet);
        setShowResultText(false);
    }

    useEffect(() => {
        questionSetRef.current = questionSets;
        props.checkAnswer.current = checkAnswer;
    },[questionSets]);

    useEffect(() => {
        const filteredSet = filterEmptiesAndSetCorrectDefault(props.items[props.questionPage]);
        setShowResultText(false);
        setQuestionSets(shuffleArray(filteredSet));
        setOriginalOrder(filteredSet);
    },[props.questionPage]);

    const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
		const items = reorder(questionSets, result.source.index, result.destination.index);
        setQuestionSets(items);
	}

    const filterEmptiesAndSetCorrectDefault = (arr) => {
        if (arr == undefined) return;
        const newArr = arr.filter(a => a).map(item => {
            return {
                text: item,
                correct: "default",
            }
        })
        return newArr;
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = list;
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	}

    const shuffleArray = (array) => {
        if (array == undefined) return;
        if (array.length === 1 || array.length === 0) return;

        let shuffledArr = array
            .map(val => ({ val, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ val }) => val);
            
        //If our shuffled array is the same as the original, reshuffle
        if (compareIfArrayIdentical(shuffledArr, array)) {
            shuffledArr = shuffleArray(array);
        }
        return shuffledArr;
    }

    const compareIfArrayIdentical = (arr1, arr2) => {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    const checkAnswer = () => {
        if (originalOrder.length) {
            const items = [...questionSetRef.current];
            let counter = 0;
            for (let i = 0; i < items.length; i ++) {
                if (items[i].text == originalOrder[i].text) {
                    items[i].correct = true;
                    counter++;
                } else {
                    items[i].correct = false;
                }
            }
            setNumOfCorrectAnswers(counter);
            setQuestionSets(items.slice());
            setShowResultText(true);
    
            console.log('wrong 8');
            if (counter === items.length) {
                const correctAudio = document.getElementById("yourAudio-correct")
                if (correctAudio) {
                  correctAudio.play()
                }
              } else {
                const wrongAudio = document.getElementById("yourAudio-wrong")

                if (wrongAudio) {
                  wrongAudio.play()
                }
              }
        }
    }

    const resultTextStyle = {
        color: '#d77f1a',
        fontWeight: 'bold',
        marginLeft: 'auto', 
        marginRight: 'auto',
        "margin-top": '0px',
    }

    return (
        <div className='tw-px-[15px]'>
            <DragAndDrop 
                sourceState={questionSets || []}
                onDragEnd={onDragEnd}
            >
                {(item) => {
                    return <DrillRow content={item.item.text} correct={item.item.correct} />;
                }}
            </DragAndDrop>
            {showResultText ? 
                <>
                    <div style={{display: 'flex'}}>
                        <p style={{
                            fontWeight: 'bold', 
                            marginLeft: 'auto', 
                            marginRight: 'auto'}}
                        >
                            {numOfCorrectAnswers + "/" + originalOrder.length}
                        </p>
                    </div>
                    <div style={{display: 'flex'}}>
                        {numOfCorrectAnswers == originalOrder.length ? <p style={resultTextStyle}>Congratulations!</p>
                            :<p style={resultTextStyle}>Try again</p>
                        }
                    </div>
                </>
            : <></>}
            <ReloadOutlined
                className="tw-font-bold tw-text-[28px] reload-drill"
                onClick={()=>{
                    setQuestionSets([]);
                    setOriginalOrder([]);
                    setNumOfCorrectAnswers(null);
                    setShowResultText(false);

                    setTimeout(() => {
                        initialize();
                        props.resetDrillProgress && props.resetDrillProgress();
                    }, 0);
                }}
            />
        </div>
    );
}
