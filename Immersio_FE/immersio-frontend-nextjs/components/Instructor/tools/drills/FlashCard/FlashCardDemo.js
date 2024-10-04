import React, { useEffect, useState, useRef } from "react";
import styles from "./FlashCard.module.css";
import { EyeOutlined } from "@ant-design/icons";
import { CheckOutlined, CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";

const FlashCardDemo = (props) => {
  try {
    const { index, answer, image, } = props;
    const letters = answer.toLowerCase().split("");
    const [enteredValue, setEnteredValue] = useState([]);
    const [enteredWord, setEnteredWord] = useState("");
    const keyPerRow = 6;
    const [numOfRow, setNumOfRow] = useState(2);
    const filteredLetters = letters.filter((ele, index) => ele !== ' '
    );

    const [keyArray, setKeyArray] = useState([]);
    const pageRef = useRef(0);
    const [answerRight, setAnswerRight] = useState(null);

    // check if the input word is correct, show a green checkmark or red crossmark over the image for 1 second to indicate the result
    const checkAnswer = () => {
      setAnswerRight(enteredValue.join("").toLowerCase() === answer.toLowerCase());
      setTimeout(() => {
        setAnswerRight(null);
      }, 1000);
    };

    useEffect(() => {
      pageRef.current = props.currentIndex;
      const length = filteredLetters.length;
      if (length > 12) {
        let temp = Math.ceil(length / 6);
        setNumOfRow(temp);
      }
    }, [props])

    useEffect(() => {
      // shuffle the letters for keyboard
      // keyboard contains the letters in the correct answer
      const shuffledLetters = filteredLetters
        .map((val) => ({ val, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ val }) => val);

      // listener to type in letters
      const onKeyPress = (e) => {
        if (pageRef.current !== index) return;
        if (letters.indexOf(e.key) !== -1) { // Only keyboard inputs from original letters allowed. Can be removed if needed.
          const currentValue = enteredValue;
          currentValue.push(e.key);
          setEnteredValue(currentValue);
          setEnteredWord(enteredValue.join(""));
        }
      }
      // listener for backspace
      const onKeyDown = (e) => {
        if (pageRef.current !== index) return;
        if (e.key === "Backspace") {
          const currentValue = enteredValue;
          currentValue.pop();
          setEnteredValue(currentValue);
          setEnteredWord(enteredValue.join(""));
        }
      }
      window.addEventListener("keypress", onKeyPress);
      window.addEventListener("keydown", onKeyDown);
      setKeyArray(shuffledLetters);

      // load the image for this flashcard
      if (typeof (image) === "string") {
        let imgEleAll = document.querySelectorAll(".imageSection");
        let imgArr = Array.from(imgEleAll);
        imgArr.forEach((ele) => {
          if (ele.id === ("imageCard" + index)) ele.src = image;
        })
      } else {
        let reader = new FileReader();
        reader.onload = function (e) {
          // finished reading file data.
          let imgEleAll = document.querySelectorAll(".imageSection");
          let imgArr = Array.from(imgEleAll);
          imgArr.forEach((ele) => {
            if (ele.id === ("imageCard" + index)) ele.src = e.target.result;
          })
        };

        reader.readAsDataURL(image);
      }

      return () => {
        window.removeEventListener("keypress", onKeyPress);
        window.removeEventListener("keydown", onKeyDown);
      }
    }, []);

    const typeLetter = (i) => {
      if (!keyArray[i]) return;
      const currentValue = enteredValue;
      currentValue.push(keyArray[i]);
      setEnteredValue(currentValue);
      setEnteredWord(enteredValue.join(""));
    };

    const typeSpace = () => {
      const currentValue = enteredValue;
      currentValue.push(" ");
      setEnteredValue(currentValue);
      setEnteredWord(enteredValue.join(""));
    };

    const deleteLetter = () => {
      const currentValue = enteredValue;
      currentValue.pop();
      setEnteredValue(currentValue);
      setEnteredWord(enteredValue.join(""));
    };

    return (
      <div className={styles.parentCard}>
        <div className={styles.imageContainer}>
          <img className={[styles.imageCard, "imageSection"].join(" ")} id={"imageCard" + index}></img>
          {answerRight ? <CheckOutlined className={styles.checkMarkRight} /> : answerRight === false ? <CloseOutlined className={styles.checkMarkWrong} /> : null}
        </div>
        <div className={styles.wrapperDiv}>
          <div className={styles.wordCard} id={"wordCard" + index}>
            {enteredWord}
          </div>
          <div className={styles.keyboard} id={"keyboard" + index}>
            {
              [...Array(numOfRow)].map((_, index) => {
                return [...Array(keyPerRow)].map((_, i) => {
                  let prefix = index * keyPerRow + i;
                  return (
                    <div onClick={() => typeLetter(prefix)} className={styles.key}>
                      {keyArray[prefix] ? keyArray[prefix] : "\u00A0"}
                    </div>
                  );
                })
              })
            }
            <div className={styles.fullLine}>
              <div onClick={() => typeSpace()} className={styles.space}>
                {"space"}
              </div>
              <div onClick={() => deleteLetter()} className={styles.key}>
                {"⌫"}
              </div>
            </div>

          </div>
          <EyeOutlined style={{ fontSize: '150%' }} onClick={checkAnswer} />
        </div>
      </div>

    );
  } catch {
    return (<>
      <h5><CloseCircleOutlined style={{ "color": "red" }} /> There are some unfilled fields in this drill</h5><h6>Check the drill and fill them out</h6>
    </>)
  }
};

export default FlashCardDemo;
