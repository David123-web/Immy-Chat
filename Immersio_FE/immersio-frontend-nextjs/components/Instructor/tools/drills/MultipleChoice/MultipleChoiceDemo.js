import React, { useEffect, useState, useRef } from "react";
import styles from "./MultipleChoice.module.css";
import { CheckOutlined, CloseOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";

const MultipleChoiceDemo = (props) => {
  try {
    const { index, question, answers, correctAnswer } = props;
    const [answerList, setAnswerList] = useState([])

    const [ansIcon, setAnsIcon] = useState(new Array(answers.length).fill(null));
    const ansRef = useRef(ansIcon);

    useEffect(() => {
      filterAnswers(answers)
    }, [answers])

    const filterAnswers = (answers) => {
      let list = []
      answers.forEach((answ) => {
        list.push({answer: answ, correct: false, answered: false})
      })
      list[correctAnswer].correct = true
      reShuffle(list)
    }

    // check if the clicked answer is the correct one
    /*const checkAnswer = (i) => {
      setClicked(clicked + 1);
      let temp = ansRef.current;
      temp.forEach((_, index) => {
        if (index === i) {
          temp[index] = correctAnswer === i ? true : false;
        } else {
          temp[index] = null;
        }
      })
      ansRef.current = temp;
      setAnsIcon(temp);
    }*/

    const checkAnswer = (index) => {
      let list = [...answerList]
      list.forEach((answ, i) => {
        if(index == i) answ.answered = true
        else answ.answered = false
      })
      //list[index].answered = true
      setAnswerList(list)
    }

    const reShuffle = (list) => {
      //shuffling answers
      let shf = []
      while(list.length > 0) {
        let rand = Math.floor((Math.random() * list.length));
        shf.push(list.splice(rand,1)[0])
      }
      setAnswerList(shf)
    }

    const [clicked, setClicked] = useState(0);

    return (
      <div className={styles.parentCard}>
        <div className={styles.question}>{question}</div>
        {/*<pre>{JSON.stringify(answerList,null,4)}</pre>*/}
        <div className={styles.answerDiv}>
          {
            answerList.map((answer, i) => (
              <div className={[styles.answer, answer.answered ? answer.correct ? styles.right : styles.wrong : styles.no].join(" ")} onClick={() => checkAnswer(i)}>
                {answer.answer}
                {answer.answered ? answer.correct ? <CheckOutlined /> : <CloseOutlined /> : null }
              </div>
            ))
          }
          <br></br>
          <ReloadOutlined className="tw-font-bold tw-text-[28px]" onClick={()=>{checkAnswer(-1);reShuffle(answerList)}} />
          {/*[...Array(answers.length)].map((_, i) => {
            return (
              <>
                <div className={[styles.answer, ansIcon[i] ? styles.right : ansIcon[i] === false ? styles.wrong : styles.no].join(" ")} onClick={() => checkAnswer(i)}>{answers[i]}{ansIcon[i] ? <CheckOutlined /> : (ansIcon[i] === false ? <CloseOutlined /> : null)}</div>
                <br></br>
              </>
            );
          })*/}
        </div>
      </div>
    );
  } catch(err) {
    console.log("Drill error:", err)
    return (<>
      <h5><CloseCircleOutlined style={{ "color": "red" }} /> There are some unfilled fields in this drill</h5><h6>Check the drill and fill them out</h6>
    </>)
  }
};

export default MultipleChoiceDemo;
