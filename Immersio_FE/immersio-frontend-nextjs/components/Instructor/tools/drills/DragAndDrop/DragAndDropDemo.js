import interact from "interactjs";
import React, { useEffect, useState, useRef } from "react";
import styles from "./DragAndDrop.module.css";
import { Button } from "antd";
import { CheckOutlined, CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";

const DragAndDropDemo = ({ words, images, demoRef }) => {
  try {
    const [numOfCorrect, setNumOfCorrect] = useState("0/" + words.length);
    const [clicked, setClicked] = useState(false);
    const [correctArray, setCorrectArray] = useState(new Array(words.length).fill(null));
    const [shuffledWords, setShuffledWords] = useState([]);
    const [shuffledImages, setShuffledImages] = useState([]);
    const shuffledRef = useRef(shuffledWords);
    const shuffledImgRef = useRef(shuffledImages);
    class wordCard {
      constructor(index, word) {
        this.index = index;
        this.word = word;
      }
    }
    class imageCard {
      constructor(index, image) {
        this.index = index;
        this.image = image;
      }
    }
    let wordArray = [];
    let imageArray = [];
    words.forEach((ele, index) => {
      wordArray.push(new wordCard(index, ele));
    });

    images.forEach((ele, index) => {
      imageArray.push(new imageCard(index, ele));
    });

    // shuffle words and images to random order
    let shuffled = wordArray
      .map((val) => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ val }) => val);
    let shuffledImgs = imageArray
      .map((val) => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ val }) => val);

    // check if words were dropped to the correct images by checking their coordinates
    const checkAnswer = () => {
      setClicked(true);
      let counter = 0;
      let tempArray = [];
      shuffledRef.current.forEach((ele, index) => {
        let leftCoorWord = document
          ?.querySelector("#wordDiv" + index)
          ?.getBoundingClientRect().left + window.scrollX;
        let topCoorWord = document
          ?.querySelector("#wordDiv" + index)
          ?.getBoundingClientRect().top + window.scrollY;
        let leftCoorDrop = document
          ?.querySelector("#imageDiv" + index)
          ?.getBoundingClientRect().left + window.scrollX;
        let topCoorDrop = document
          ?.querySelector("#imageDiv" + index)
          ?.getBoundingClientRect().top + window.scrollY + document
            ?.querySelector("#imageDiv" + index)?.clientHeight - document
              ?.querySelector("#wordDiv" + index)?.clientHeight + 10;
        if (
          Math.abs(leftCoorDrop - leftCoorWord) < 5 &&
          Math.abs(topCoorDrop - topCoorWord) < 5
        ) {
          counter++;
          tempArray.push(true);
        } else {
          tempArray.push(false);
        }
      })
      let processedArray = [];

      shuffledRef.current.forEach((ele, i) => {
        processedArray.push(tempArray[ele.index] === true);
      })

      setCorrectArray(processedArray);
      setNumOfCorrect(counter + "/" + words.length);
    };

    useEffect(() => {
      shuffledRef.current = shuffled;
      shuffledImgRef.current = shuffledImgs;
      setShuffledWords(shuffled);
      setShuffledImages(shuffledImgs);
      demoRef.current = checkAnswer
      setTimeout(() => {
        setSnapCoordinates();
        // load the images uploaded for this drill
        shuffledImgRef.current.map((ele) => {
          if (typeof (ele.image) === "string") {
            let image = document?.querySelector("#image" + ele.index);
            if (image) {
              image.src = ele.image;
            }
          } else {
            let reader = new FileReader();
            reader.onload = function (e2) {
              // finished reading file data.
              let image = document?.querySelector("#image" + ele.index);
              image.src = e2.target.result;
            };
  
            reader.readAsDataURL(ele.image);
          }
        });
      }, 0);

    }, []);

    // Set up all the draggable elements (words pieces) and where they are allowed to be dropped to (below images) by coordinates
    // They are snapped either to the allowed dropzones or if too far from any, snapped to their original spots
    // Draggable elements are restricted to only move in the content zone (not outside the modal)
    const setSnapCoordinates = () => {
      let wordArrayDropCoordinates = [];
      wordArray.forEach((ele, index) => {
        let leftCoordinate = document
          ?.querySelector("#imageDiv" + index)
          ?.getBoundingClientRect().left + window.scrollX;
        let topCoordinate =
          document?.querySelector("#imageDiv" + index)?.getBoundingClientRect().top + window.scrollY + document
            ?.querySelector("#imageDiv" + index)?.clientHeight - document
              ?.querySelector("#wordDiv" + index)?.clientHeight + 10;
        let wordCoordinateObj = { x: leftCoordinate, y: topCoordinate };
        wordArrayDropCoordinates.push(wordCoordinateObj);
      });

      shuffledRef.current.forEach((e, index) => {
        const position = { x: 0, y: 0 };

        let selfLeftCoor = document
          ?.querySelector("#wordDiv" + index)
          ?.getBoundingClientRect().left + window.scrollX;
        let selfTopCoor = document
          ?.querySelector("#wordDiv" + index)
          ?.getBoundingClientRect().top + window.scrollY;

        let startingPos = {
          x: selfLeftCoor,
          y: selfTopCoor,
          range: Infinity,
        }

        interact("#wordDiv" + index).draggable({
          listeners: {
            start(event) {
            },
            move(event) {
              position.x += event.dx;
              position.y += event.dy;
              event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
            },
          },
          modifiers: [
            interact.modifiers.snap({
              targets: [function (x, y, interaction) {
                let foundIndex = wordArrayDropCoordinates.findIndex(
                  (ele) =>
                    Math.abs(x - ele.x) <= 50 &&
                    Math.abs(y - ele.y) <= 50 &&
                    !Array.from(document?.querySelectorAll(".wordCards")).some(
                      (item) =>
                      (Math.abs(item?.getBoundingClientRect().left + window.scrollX - ele.x) <= 1 &&
                        Math.abs(item?.getBoundingClientRect().top + window.scrollY - ele.y) <= 1 &&
                        item !== interaction.element)
                    )
                )
                if (foundIndex !== -1) {
                  return { x: wordArrayDropCoordinates[foundIndex].x, y: wordArrayDropCoordinates[foundIndex].y, range: Infinity };
                } else {
                  return startingPos;
                }
              }],
              relativePoints: [
                { x: 0, y: 0 }, // snap relative to the element's top-left,
              ],
              range: 100,
              endOnly: true,
            }),
            interact.modifiers.restrictRect({
              restriction: "parent",
              endOnly: false,
            }),
          ],
        });
      });
    };
    return (
      <>
        <div className={styles.parentBox}>
          {shuffledImages.map((ele) => {
            return (
              <div
                order={ele.index}
                className={[styles.imageBox, "imageCards"].join(" ")}
                id={"imageDiv" + ele.index}
              >
                <img id={"image" + ele.index}></img>
              </div>
            );
          })}
          <br></br>
          {shuffledWords.map((ele, i) => {
            return (
              <div
                order={ele.index}
                className={[styles.wordBox, "wordCards", "draggable",
                correctArray[i] === true ? styles.correct : correctArray[i] === false ? styles.wrong : styles.no].join(" ")}
                key={ele.index}
                id={"wordDiv" + ele.index}
              >
                {ele.word || "\u00A0"}
                {correctArray[i] === true ? <CheckOutlined /> : correctArray[i] === false ? <CloseOutlined /> : null}
              </div>
            );
          })}
          <br></br>
          <h2 className={clicked ? styles.correctCount : styles.hide}>{numOfCorrect}</h2>
        </div>
      </>
    );
  } catch {
    return (<>
      <h5><CloseCircleOutlined style={{ "color": "red" }} /> There are some unfilled fields in this drill</h5><h6>Check the drill and fill them out</h6>
    </>)
  }
};

export default DragAndDropDemo;
