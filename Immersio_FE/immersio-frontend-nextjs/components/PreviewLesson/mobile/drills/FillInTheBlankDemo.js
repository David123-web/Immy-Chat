import interact from "interactjs";
import React, { useEffect, useState, useRef } from "react";
import styles from "./FillInTheBlank.module.css";
import { CheckOutlined, CloseOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const FillInTheBlankDemo = ({ words, fragments, audio, demoRef, resetDrillProgress }) => {
  try {
    const [numOfCorrect, setNumOfCorrect] = useState("0/" + words.length);
    const [clicked, setClicked] = useState(false);
    const [correctArray, setCorrectArray] = useState(new Array(words.length).fill(null));
    const [shuffledWords, setShuffledWords] = useState([]);
    const [modal, setModal] = useState({
      show: false,
      index: undefined,
    })
    const shuffledRef = useRef(shuffledWords);
    const [dropZoneCoordinatesRef, setDropZoneCoordinatesRef] = useState([])
    class wordChoice {
      constructor(index, word) {
        this.index = index;
        this.word = word;
      }
    }
    class dropZone {
      constructor(index) {
        this.index = index;
      }
    }
    let wordArray = [];
    let dropArray = [];
    words.forEach((ele, index) => {
      wordArray.push(new wordChoice(index, ele));
      dropArray.push(new dropZone(index));
    });

    // shuffle the words to a random order
    let shuffled = wordArray
      .map((val) => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ val }) => val);

    // check if words were dropped to the correct spots by checking their coordinates
    const checkAnswer = () => {
      setClicked(true);
      let counter = 0;
      let tempArray = [];
      dropArray.forEach((ele, index) => {
        let leftCoorWord = document
          ?.querySelector("#wordPiece" + index)?.getBoundingClientRect().left + window.scrollX;
        let topCoorWord = document
          ?.querySelector("#wordPiece" + index)?.getBoundingClientRect().top + window.scrollY;
        let leftCoorDrop = document
          ?.querySelector("#dropArea" + index)?.getBoundingClientRect().left + window.scrollX;
        let topCoorDrop = document
          ?.querySelector("#dropArea" + index)?.getBoundingClientRect().top + window.scrollY;
        if (
          Math.abs(leftCoorDrop - leftCoorWord) < 5 &&
          Math.abs(topCoorDrop - topCoorWord) < 5
        ) {
          counter++;
          tempArray.push(true);
        } else {
          tempArray.push(false);
        }
      });
      let processedArray = [];
      shuffledRef.current.forEach((ele, i) => {
        processedArray.push(tempArray[ele.index] === true);
      })
      setCorrectArray(processedArray);
      setNumOfCorrect(counter + "/" + words.length);

      console.log('wrong 5');
      if (counter === words.length) {
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
    };

    // Set up all the draggable elements (words pieces) and where they are allowed to be dropped to (blank space in the paragraph) by coordinates
    // They are snapped either to the allowed dropzones or if too far from any, snapped to their original spots
    // Draggable elements are restricted to only move in the content zone (not outside the modal)
    useEffect(() => {
      initialize();

      if (document && document.getElementsByClassName('step-mobile-scroll')) {
        const getElement = document.getElementsByClassName('step-mobile-scroll')[0]
        getElement.addEventListener("scroll", initialize);

        return () => {
          getElement.removeEventListener("scroll", initialize);
        };
      }
    }, []);

    const initialize = () => {
      shuffledRef.current = shuffled;
      setShuffledWords(shuffled);
      demoRef.current = checkAnswer;
      setTimeout(() => {
        let dropZoneCoordinates = [];
        let dropZoneCoordinatesModal = [];
        dropArray.forEach((ele, index) => {
          let leftCoordinate = document
            ?.querySelector("#dropArea" + index)?.getBoundingClientRect().left + window.scrollX;
          let topCoordinate = document
            ?.querySelector("#dropArea" + index)?.getBoundingClientRect().top + window.scrollY;
          let topCoordinateModal = document
            ?.querySelector("#dropArea" + index)?.getBoundingClientRect().top + document.getElementsByClassName('step-mobile-scroll')?.[0]?.scrollTop;

          let dropZoneObj = { x: leftCoordinate, y: topCoordinate };
          dropZoneCoordinates.push(dropZoneObj);

          let dropZoneObjModal = { x: leftCoordinate, y: topCoordinateModal };
          dropZoneCoordinatesModal.push(dropZoneObjModal);
        });

        setDropZoneCoordinatesRef(dropZoneCoordinatesModal)

        shuffledRef.current.forEach((e, index) => {
          const position = { x: 0, y: 0 };

          let selfLeftCoor = document
            ?.querySelector("#wordPiece" + index)?.getBoundingClientRect().left + window.scrollX;
          let selfTopCoor = document
            ?.querySelector("#wordPiece" + index)?.getBoundingClientRect().top + window.scrollY;

          const startingPos = { x: selfLeftCoor, y: selfTopCoor, range: Infinity };

          interact("#wordPiece" + index).draggable({
            listeners: {
              start(event) {
                event.target.style.position = '';
                event.target.style.top = '';
                event.target.style.left = '';
              },
              move(event) {
                position.x += event.dx;
                position.y += event.dy;
              },
            },
            modifiers: [
              interact.modifiers.snap({
                targets: [
                  function (x, y, interaction) {
                    let foundIndex = dropZoneCoordinates.findIndex(
                      (ele) =>
                        Math.abs(x - ele.x) <= 50 &&
                        Math.abs(y - ele.y) <= 50 &&
                        !Array.from(
                          document?.querySelectorAll(".wordPieceObj")
                        ).some(
                          (item) =>
                            Math.abs(item?.getBoundingClientRect().left + window.scrollX - ele.x) <=
                            1 &&
                            Math.abs(item?.getBoundingClientRect().top + window.scrollY - ele.y) <=
                            1 &&
                            item !== interaction.element
                        )
                    );
                    if (foundIndex !== -1) {
                      return {
                        x: dropZoneCoordinates[foundIndex].x,
                        y: dropZoneCoordinates[foundIndex].y,
                        range: Infinity,
                      };
                    } else {
                      return startingPos;
                    }
                  },
                ],
                relativePoints: [
                  { x: 0, y: 0 }, // snap relative to the element's top-left,
                ],
                range: 100,
                endOnly: true,
              }),

              interact.modifiers.restrictRect({
                restriction: document?.querySelector("#outerDiv"),
                endOnly: false,
              }),
            ],
          });
        });
      }, 0);
    }

    return (
      <>
        <div className={styles.audioDiv}>
          <audio src={typeof (audio) === "string" ? audio : URL.createObjectURL(audio)} id="player" controls />
        </div>
        <div id="outerDiv" className={styles.outerDiv}>
          <div className={styles.parentDiv}>
            <div className={styles.fragmentsDiv}>
              <div className={styles.fragmentsContainer}>
                {fragments.map((ele, index) => {
                  if (index !== fragments.length - 1) {
                    return (
                      <span key={index}>
                        <span>{ele}</span>
                        <div
                          id={"dropArea" + index}
                          className={styles.emptyBox}
                          onClick={() => {
                            setModal({
                              show: true,
                              index
                            })
                          }}
                        />
                      </span>
                    );
                  } else {
                    return <span key={index}>{ele}</span>;
                  }
                })}
              </div>
            </div>
            <div className={styles.wordsDiv}>
            {shuffledWords.map((ele, index) => {
              return (
                <>
                  <div
                    order={ele.index}
                    className={[
                      styles.wordPiece,
                      "wordPieceObj",
                      "draggable",
                      correctArray[index] === true ? styles.correct : correctArray[index] === false ? styles.wrong : styles.no
                    ].join(" ")}
                    key={index}
                    id={"wordPiece" + ele.index}
                    style={{ pointerEvents: 'none' }}
                  >
                    {ele.word || "\u00A0"}
                    {correctArray[index] === true ? <CheckOutlined /> : correctArray[index] === false ? <CloseOutlined /> : null}
                  </div>
                </>
              );
            })}
          </div>
            <h2 className={clicked ? styles.correctCount : styles.hide}>{numOfCorrect}</h2>
            <ReloadOutlined
              className="tw-font-bold tw-text-[28px] reload-drill"
              onClick={()=>{
                setClicked(false);
                setShuffledWords([]);
                setCorrectArray(new Array(words.length).fill(null));
  
                setTimeout(() => {
                  initialize();
                  resetDrillProgress && resetDrillProgress();
                }, 0);
              }}
            />
          </div>
        </div>

        <Modal
          open={modal.show}
          centered
          footer={<></>}
          width="100%"
          onCancel={() => setModal({ show: false, index: undefined })}
        >
          <div className={styles.wordsDiv}>
            {shuffledWords.map((ele, index) => {
              return (
                <>
                  <div
                    order={ele.index}
                    className={[
                      styles.wordPiece,
                      "wordPieceObj",
                      "draggable",
                      correctArray[index] === true ? styles.correct : correctArray[index] === false ? styles.wrong : styles.no,
                      styles.full
                    ].join(" ")}
                    key={index}
                    onClick={() => {
                      const elm = document?.querySelector("#wordPiece" + ele.index)
                      if (elm) {
                        elm.style.position = 'absolute';
                        elm.style.top = `${dropZoneCoordinatesRef[modal.index].y - 120}px`;
                        elm.style.left = `${dropZoneCoordinatesRef[modal.index].x - 5}px`;
                        setModal({ show: false, index: undefined })
                      }
                    }}
                  >
                    {ele.word || "\u00A0"}
                  </div>
                </>
              );
            })}
          </div>
        </Modal>
      </>
    );
  } catch {
    return (<>
      <h5><CloseCircleOutlined style={{ "color": "red" }} /> There are some unfilled fields in this drill</h5><h6>Check the drill and fill them out</h6>
    </>)
  }
};

export default FillInTheBlankDemo;
