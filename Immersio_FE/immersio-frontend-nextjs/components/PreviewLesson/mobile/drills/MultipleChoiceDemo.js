import React, { useEffect, useState, useRef } from "react";
import styles from "./MultipleChoice.module.css";
import { CheckOutlined, CloseOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";

const MultipleChoiceDemo = (props) => {
  try {
    const { index, question, answers, correctAnswer, drillProgress, setDrillProgress, resetDrillProgress } = props;
    const [answerList, setAnswerList] = useState([])

    const [ansIcon, setAnsIcon] = useState(new Array(answers ? answers.length : 1).fill(null));
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

    const checkAnswer = (index) => {
      let list = [...answerList]
      list.forEach((answ, i) => {
        if(index == i) {
          answ.answered = true
        } else {
          answ.answered = false
        }
      })

      console.log('wrong 7');
      if (list[index]) {
        if (list[index].correct) {
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

      //list[index].answered = true
      setAnswerList(list)
      setDrillProgress({
        id: drillProgress.id,
        step: 2,
      })
    }

    const reShuffle = (list) => {
      //shuffling answers
      let shf = []
      while(list && list.length > 0) {
        let rand = Math.floor((Math.random() * list.length));
        shf.push(list.splice(rand,1)[0])
      }
      setAnswerList(shf)
    }

    const [clicked, setClicked] = useState(0);

    return (
      <div className={styles.parentCard}>
        <div className={styles.question}>{question}</div>
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
          <ReloadOutlined
            className="tw-font-bold tw-text-[28px] reload-drill"
            onClick={()=>{
              checkAnswer(-1);
              reShuffle(answerList);
              resetDrillProgress && resetDrillProgress();
            }}
          />
        </div>
      </div>
    );
  } catch(err) {
    console.log("Drill error:", err)
    return (<>
      <h5><CloseCircleOutlined style={{ "color": "red" }} /> There are some unfilled fields in this drill</h5><h6>Check the drill and fill them out</h6>
    </>)
  }
}

export default MultipleChoiceDemo;
