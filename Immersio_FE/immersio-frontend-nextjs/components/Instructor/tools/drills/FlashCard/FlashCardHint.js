import React, { useEffect, useState, useRef } from "react";
import styles from "./FlashCard.module.css";
import { Row } from "antd";

const FlashCardHint = (props) => {
    const { questions, answers, images, } = props;
    const questionsRef = useRef(questions);
    const answersRef = useRef(answers);
    const imagesRef = useRef(images);


    useEffect(() => {
        questionsRef.current = props.questions;
        answersRef.current = props.answers;
        imagesRef.current = props.images;
    }, [props])

    // load the images on mount
    useEffect(() => {
     images.forEach((ele, i) => {
        let imgElement = document.querySelector("#hint" + i);
        if (typeof (ele) === "string") {
            imgElement.src = ele;
          } else {
            let reader = new FileReader();
            reader.onload = function (e) {
              imgElement.src = e.target.result;
            };
    
            reader.readAsDataURL(ele);
        }
     })

      
    }, []);

    return (
        <>
            {images.map((ele, i) => {
                return (
                    <Row><img id={"hint" + i} height="100"></img> <div className={styles.hintText}><h6>Q: {questions[i]}</h6><br></br><h6>A: {answers[i]}</h6></div></Row>
                )
            })}
        </>
    );
  
};

export default FlashCardHint;
