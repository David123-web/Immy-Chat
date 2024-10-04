import React, { useState, useRef } from "react";
import { Switch, Space, Row } from "antd";
import styles from "./MultipleChoice.module.css";
import Input from "antd/lib/input/Input";
import { PlusCircleFilled, DeleteOutlined } from "@ant-design/icons";

const MultipleChoiceContent = (props) => {
  const {
    index,
    questions,
    answers,
    correctIndices,
    setCorrectIndices,
    answerCount,
    setAnswerCount,
    setQuestions,
    setAnswers,
  } = props;
  const [counter, setCounter] = useState(
    answerCount[index] || answerCount[index] === 0 ? answerCount[index] : 1
  );

  const [indexArray, setIndexArray] = useState(
    answerCount[index] ? [...Array(answerCount[index]).keys()] : []
  );

  const [total, setTotal] = useState(
    answerCount[index] || answerCount[index] === 0 ? answerCount[index] : index === 0 ? 1 : 0
  );

  const [correctAnswer, setCorrectAnswer] = useState(
    correctIndices[index] || correctIndices[index] === 0
      ? correctIndices[index]
      : null
  );

  const questionsRef = useRef(questions[index] || "");
  const answersRef = useRef(answers[index] || []);
  const correctIndexRef = useRef(correctIndices[index] || null);
  const answerCountRef = useRef(answerCount);

  useState(() => {
    answerCountRef.current = answerCount;
  }, [answerCount])

  // change the toggle indicating which answer is correct, and set a number indicating so
  const toggleInput = (checked, ele, i) => {
    if (checked) {
      let tempCopy = correctIndices;
      tempCopy[index] = i;
      setCorrectIndices(tempCopy);
      correctIndexRef.current = ele;
      setCorrectAnswer(ele);
    } else {
      let tempCopy = correctIndices;
      tempCopy[index] = null;
      setCorrectIndices(tempCopy);
      correctIndexRef.current = null;
      setCorrectAnswer(null);
    }
  };

  // add another answer row
  const addNewAnswer = () => {
    let temp = indexArray.slice();
    temp.push(counter);
    setIndexArray(temp);
    setCounter(counter + 1);
    let tempCopy = answerCountRef.current;
    tempCopy[index] = total + 1;
    answerCountRef.current = tempCopy;
    setAnswerCount(tempCopy);
    setTotal(total + 1);
  };

  const updateQuestion = (e) => {
    let tempQuestions = questions.slice();
    tempQuestions[index] = e.target.value;
    questionsRef.current = tempQuestions[index];
    setQuestions(tempQuestions);
  };

  const updateAnswer = (e, i) => {
    let tempAnswers = JSON.parse(JSON.stringify(answers));
    let temp = tempAnswers[index].slice();
    temp[i] = e.target.value;
    answersRef.current = temp;
    tempAnswers[index] = temp;
    setAnswers(tempAnswers);
  };

  const addRow = (
    <div className={styles.fullLineWrapper}>
      <Row align="middle" className={styles.itemStyle} onClick={addNewAnswer}>
        <Space>
          <PlusCircleFilled className={styles.iconStyle} />
          <p className={styles.paragraphStyle}>{"New alternative answer"}</p>
        </Space>
      </Row>
    </div>
  );

  // delete an answer. if it is the correct answer, set correct answer to null
  const deleteBtnClick = (element, i) => {
    let tempAnswerCount = answerCountRef.current;
    tempAnswerCount[index] = total - 1;
    answerCountRef.current = answerCount;

    setAnswerCount(tempAnswerCount);
    setTotal(total - 1);

    let foundIndex = indexArray.findIndex((ele) => ele === element);
    let tempIndexArray = indexArray.slice();
    let tempAnswers = JSON.parse(JSON.stringify(answers));
    tempIndexArray.splice(foundIndex, 1);
    tempAnswers[index].splice(foundIndex, 1);

    setIndexArray(tempIndexArray);
    setAnswers(tempAnswers);

    let tempCopy = correctIndices.slice();
    if (correctIndices[index] === i) {
      setCorrectAnswer(null);
      correctIndexRef.current = null;
      tempCopy[index] = null;
    } else if (correctAnswer || correctAnswer === 0) {
      tempCopy[index] = tempIndexArray.findIndex(
        (ele) => ele === correctAnswer
      );
    }
    setCorrectIndices(tempCopy);
  };
  return (
    <>
      <div>
        <div className={styles.fullLineWrapper}>
          <Input
            placeholder="Enter a text question"
            id={"q" + index}
            value={questionsRef.current}
            className={styles.input}
            onChange={(e) => updateQuestion(e)}
          />
        </div>
        {indexArray.map((ele, i) => {
          return (
            <div className={styles.inputLineWrapper}>
              <div
                key={"container" + i}
                id={"q" + index + "a" + i + "div"}
                className={styles.fullLine}
              >
                <Input
                  key={i}
                  placeholder={"Enter the No." + (i + 1) + " alternative answer"}
                  id={"q" + index + "a" + i}
                  className={styles.inputAnswer}
                  value={answers[index] ? answersRef.current[i] : ""}
                  onChange={(e) => updateAnswer(e, i)}
                />

                <div className={styles.iconDiv}>
                  <h4>Correct</h4>

                  <Switch
                    key={"switch" + i}
                    onChange={(checked) => toggleInput(checked, ele, i)}
                    checked={correctAnswer === ele}
                    className={styles.switch}
                  />

                  <DeleteOutlined
                    className={styles.icon}
                    onClick={() => deleteBtnClick(ele, i)}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {addRow}
      </div>
    </>
  );
};

export default MultipleChoiceContent;
