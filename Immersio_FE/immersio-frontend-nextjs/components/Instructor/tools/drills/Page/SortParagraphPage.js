import { LeftOutlined, RightOutlined, EyeOutlined, CheckSquareOutlined, CloseCircleFilled, ConsoleSqlOutlined } from "@ant-design/icons";
import { DataContext1, DataContext2, DataContext3 } from "../../../../../src/pages/dashboard/course/lesson/lessonInput";
import { TextInputRow } from '../EditDrillModal/components/TextInputRow/TextInputRow';
import { ModalCard } from '../EditDrillModal/components/ModalCard/ModalCard';
import { SortParagraphDrill } from '../SortParagraphDrill/SortParagraphDrill';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { EditDrillModal } from '../EditDrillModal/EditDrillModal';
import styles from './DrillPage.module.css';
import { Modal } from "antd";

export const SortParagraphPage = (props) => {
    const { drillId, groupNumber } = props;
    const defaultQuestionText = "Enter a text question";
    const defaultAnswerText = "Enter a sentence of the paragraph in the correct order";
 
    if (!useContext(DataContext1) && !useContext(DataContext2) && !useContext(DataContext3)) return null;
    let contextArray = [DataContext1, DataContext2, DataContext3];
    const { drillData, setDrillData } = useContext(contextArray[groupNumber]);

    const [tempFormData, setTempFormData] = useState({});
    const [formData, setFormData] = useState([]);
    const [questionData, setQuestionData] = useState([]); // [ q1, q2, ]
    const [sentenceData, setSentenceData] = useState([]); // [ [answer1, answer2, answer3], [answer1, answer2] ]
    const [tempQuestionData, setTempQuestionData] = useState([]);
    const [tempSentenceData, setTempSentenceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [questionPage, setQuestionPage] = useState(0);
    const [cards, setCards] = useState([]);
    const [data, setData] = useState({});

    const tempFormDataRef = useRef(tempFormData);
    const questionRef = useRef(questionData);
    const sentenceRef = useRef(sentenceData);
    const checkAnswer = useRef();

    //FETCH DATA FROM DB IF IT EXISTS, SET THE STATES TO THAT
    useEffect(() => {
        if (!drillData[drillId] || !drillData[drillId].questions || !drillData[drillId].array_of_answers) return;
        if (drillData[drillId].questions.length !== 0 && drillData[drillId].array_of_answers !== 0) {
            const loadData = drillData[drillId];
            if (!loadData.questions || !loadData.array_of_answers[0]) return;
            if (loadData.array_of_answers[0] == "") return;

            const loadFormData = [loadData.questions, loadData.array_of_answers];
            setQuestionData(loadData.questions.slice());
            setTempQuestionData(loadData.questions.slice());
            setSentenceData(loadData.array_of_answers.slice());
            setTempSentenceData(loadData.array_of_answers.slice());
            setFormData(loadFormData.slice());
            setTempFormData(loadFormData.slice());
            setCardsParagraphDrill(loadFormData);

            const params = {
                ...drillData[drillId],
                drillId: drillId,
                drillType: 'sort',
                questions: loadData.questions.slice(),
                array_of_answers: loadData.array_of_answers.slice(),
                touched: true,
            }
            const cloneData = JSON.parse(JSON.stringify(drillData));
            cloneData[drillId] = params
            setDrillData(cloneData)
            setData(params);
        }
    }, []);

    const showModal = () => {
        setIsVisible(true);
    }

    const handleCancel = () => {
        setIsVisible(false);
    }

    const prevSet = () => {
        if (questionPage > 0) setQuestionPage(questionPage - 1);
    }

    const nextSet = () => {
        if (questionPage < questionRef.current.length - 1) setQuestionPage(questionPage + 1);
    }

    const incrementQuestionPage = () => {
        if (questionPage < questionRef.current.length - 1) setQuestionPage(questionPage + 1);
    }

    useEffect(() => {
        tempFormDataRef.current = tempFormData;
    }, [tempFormData]);

    useEffect(() => {
        questionRef.current = tempQuestionData;
    }, [tempQuestionData]);

    useEffect(() => {
        sentenceRef.current = tempSentenceData;
    }, [tempSentenceData]);

    const saveData = (title) => {
        const existingData = [];
        if (tempQuestionData.length == 0) return;
        if (sentenceRef.current.length == 0) return;
        existingData.push(tempQuestionData);
        existingData.push(sentenceRef.current);

        setFormData(existingData.slice());
        setQuestionData(tempQuestionData);
        setSentenceData(sentenceRef.current);
        setCardsParagraphDrill(existingData);

        const params = {
            ...drillData[drillId],
            drillId: drillId,
            drillType: 'sort',
            questions: tempQuestionData,
            array_of_answers: sentenceRef.current,
        }
        const cloneData = JSON.parse(JSON.stringify(drillData));
        cloneData[drillId] = params
        setDrillData(cloneData)
        setData(params);
    }

    const inputRowOnChange = (e, id) => {
        const updatedValue = {};
        updatedValue[id] = e.target.value;
        const splitId = id.split('-');
        const index = splitId[0];
        const row = splitId[1];

        if (row == 0) {
            const dataArr = [...tempQuestionData];
            dataArr[index] = e.target.value;
            setTempQuestionData(dataArr.slice());
        } else {
            const dataArr = [...sentenceRef.current];
            //Check if the index already have data
            if (dataArr[index]) {
                dataArr[index][row - 1] = e.target.value;
            } else {
                dataArr[index] = [];
                dataArr[index][row - 1] = e.target.value;
            }
            setTempSentenceData(dataArr.slice());
        }

        setTempFormData(form => ({
            ...form,
            ...updatedValue
        }));
    }

    //First splice out the question and sentences from index
    //Then rebuild cards using that modified data
    //Need to rebuild otherwise the inputs don't hold state and existing data wiped
    const onCardDeleteHandler = (index) => {
        const existingData = [];

        const questions = [...questionRef.current];
        const sentences = [...sentenceRef.current];

        if (questions[index] !== undefined && sentences[index] !== undefined) {
            questions.splice(index, 1);
            sentences.splice(index, 1);
        }
        setTempQuestionData(questions.slice());
        setTempSentenceData(sentences.slice());
        existingData.push(questions);
        existingData.push(sentences);

        //REBUILD THE CARDS 
        setCardsParagraphDrill(existingData);
    }

    //count number of modalcards
    //count number of data rows per modal card
    // formData = [ [titles], [questions]]
    // formData =  [ [ "q1", "q2" ], [ ['a1' , 'a2'], ['next a1'] ]
    const setCardsParagraphDrill = (formData) => {
        if (formData[0].length === 0) return;
        const questions = formData[0];
        const answers = formData[1];

        const cardDeck = [];
        let cardCounter = 0;

        for (let i = 0; i < questions.length; i++) {
            const cardContent = [];
            const qRow =
                <TextInputRow
                    placeholder={defaultQuestionText}
                    inputRowOnChange={inputRowOnChange}
                    key={"row" + cardCounter}
                    id={cardCounter + "-" + i}
                    value={questions[i]}
                />;
            cardContent.push(qRow);
            for (let j = 0; j < answers[i].length; j++) {
                if (!answers[i][j]) continue;
                const aRow =
                    <TextInputRow
                        placeholder="Write a question"
                        inputRowOnChange={inputRowOnChange}
                        key={"row" + cardCounter}
                        id={cardCounter + "-" + j}
                        value={answers[i][j]}
                    />;
                cardContent.push(aRow);

            }
            const newModalCard =
                <ModalCard
                    title="Paragraph"
                    deleteB
                    cardContent={cardContent}
                    key={"modalCard" + cardCounter}
                    index={cardCounter}
                />;

            cardCounter++;
            cardDeck.push(newModalCard);
        }

        setCards(cardDeck.slice());
    }

    const paragraphSortDefaultContent = [
        <TextInputRow placeholder={defaultQuestionText} inputRowOnChange={inputRowOnChange} key="row0" id="0-0" />,
        <TextInputRow placeholder={defaultAnswerText} inputRowOnChange={inputRowOnChange} key="row1" id="0-1" />,
        <TextInputRow placeholder={defaultAnswerText} inputRowOnChange={inputRowOnChange} key="row2" id="0-2" />,
    ];

    const defaultModalCard = (
        <ModalCard
            title="Paragraph"
            cardContent={paragraphSortDefaultContent}
            key="card0"
            index="0"
        />
    );

    const previewModalTitle = (
        <div style={{ display: 'flex' }}>
            <p style={{ marginLeft: 'auto', marginRight: 'auto', }}>{questionData[questionPage]}</p>
        </div>
    )

    return (
        <>
            <CheckSquareOutlined className={styles.checkMarkBtn + " " + "me-2"} />
            <span className={styles.text}>Sort the paragraph</span>

            <EditDrillModal
                saveData={saveData}
                addRowText="Add a new question?"
                onCardDeleteHandler={onCardDeleteHandler}
                existingData={formData}
                cards={cards}
            >
                {defaultModalCard}
            </EditDrillModal>

            {data.drillId !== undefined ? <EyeOutlined className={styles.previewBtn} onClick={showModal} style={{ height: '32px' }} />
                : <></>
            }
            <Modal
                closeIcon={<CloseCircleFilled />}
                className="drillModal"
                destroyOnClose={true}
                title={previewModalTitle}
                visible={isVisible}
                onCancel={handleCancel}
                footer={[
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                    >
                        <LeftOutlined
                            onClick={prevSet}
                            style={{ fontSize: '150%' }}
                        />
                        <EyeOutlined
                            onClick={() => checkAnswer.current()}
                            style={{ fontSize: '150%' }}
                        />
                        <RightOutlined
                            onClick={nextSet}
                            style={{ fontSize: '150%' }}
                        />
                    </div>
                ]}
            >
                <SortParagraphDrill
                    key="0"
                    items={sentenceData}
                    setQuestionPage={incrementQuestionPage}
                    checkAnswer={checkAnswer}
                    questionPage={questionPage}
                />
            </Modal>
        </>
    );
}
