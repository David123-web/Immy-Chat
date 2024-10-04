import React, { useState, useRef, useEffect, useContext } from "react";
import { Button, Modal, Collapse, Carousel, Row, Space, Input } from "antd";
import styles from "./DrillPage.module.css";
import FlashCardDemo from "../FlashCard/FlashCardDemo";
import { LeftOutlined, RightOutlined, PlusCircleFilled, DeleteOutlined, CheckSquareOutlined, EyeOutlined, CloseCircleFilled, BulbOutlined } from "@ant-design/icons";
import FlashCardContent from "../FlashCard/FlashCardContent";
import FlashCardHint from '../FlashCard/FlashCardHint';
import { DataContext1, DataContext2, DataContext3 } from "../../../../../src/pages/dashboard/course/lesson/lessonInput";

const FlashCardPage = ({ drillId, groupNumber }) => {
  if (!useContext(DataContext1) && !useContext(DataContext2) && !useContext(DataContext3)) return null;
  let contextArray = [DataContext1, DataContext2, DataContext3];
  const { drillData, setDrillData } = useContext(contextArray[groupNumber]);
  const { Panel } = Collapse;
  const [questions, setQuestions] = useState(drillData[drillId] ? drillData[drillId].questions || [] : []);
  const [oldQuestions, setOldQuestions] = useState(questions);
  const [answers, setAnswers] = useState(drillData[drillId] ? drillData[drillId].answers || [] : []);
  const [oldAnswers, setOldAnswers] = useState(answers);
  const [counter, setCounter] = useState(questions.length + 1);
  const [total, setTotal] = useState(drillData[drillId] && drillData[drillId].id ? questions.length : 1);
  const [indexArray, setIndexArray] = useState([...Array(total).keys()]);
  const [oldCounter, setOldCounter] = useState(counter);
  const [oldTotal, setOldTotal] = useState(total);
  const [oldIndexArray, setOldIndexArray] = useState(indexArray);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);

  const [activePanels, setActivePanels] = useState([0])

  const [title, setTitle] = useState(drillData[drillId] ? drillData[drillId].instruction || "" : "");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [images, setImages] = useState(drillData[drillId] ? drillData[drillId].images || [] : []);
  const [oldImages, setOldImages] = useState(images);
  const indexRef = useRef(0);
  const [data, setData] = useState(drillData[drillId] ? drillData[drillId] : {});



  const onChange = (index) => {
    setSectionIndex(index);
    indexRef.current = index;
  }

  const demoRef = useRef(null);

  const nextSection = () => {
    if (sectionIndex < total - 1) {
      let newIndex = sectionIndex + 1;
      setSectionIndex(newIndex);
      indexRef.current = newIndex;
      if (demoRef && demoRef.current) {
        demoRef.current.next();
      }
    }
  };

  const prevSection = () => {
    if (sectionIndex > 0) {
      let newIndex = sectionIndex - 1;
      setSectionIndex(newIndex);
      indexRef.current = newIndex;
      if (demoRef && demoRef.current) {
        demoRef.current.prev();
      }
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log(`''''' handleOK FlashCardPage`)
    setOldImages(images.slice());
    const titleText = document.querySelector("#flashCardTitle").value;
    setTitle(titleText);
    setOldCounter(counter);
    setOldTotal(total);
    setOldIndexArray(indexArray.slice());
    setOldQuestions(questions.slice());
    setOldAnswers(answers.slice());

    const params = {
      ...drillData[drillId],
      drillId: drillId,
      drillType: 'flashcards',
      instruction: titleText,
      questions: questions,
      answers: answers,
      images: images,
      touched: true,
    }
    const cloneData = JSON.parse(JSON.stringify(drillData));
    cloneData[drillId] = params

    console.log(` ''''' on OK created or updated ${JSON.stringify(cloneData[drillId])}`)
    setDrillData(cloneData)
    console.log(` '''' so drill data is ${cloneData}`)

    setData(params)

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setCounter(oldCounter);
    setTotal(oldTotal);
    setIndexArray(oldIndexArray.slice());
    setQuestions(oldQuestions.slice());
    setAnswers(oldAnswers.slice());
    setImages(oldImages.slice());
    setIsModalVisible(false);
  };

  const checkArray = (array) => {
    if (array === undefined || array.length === 0) return false;
    const checkForValue = (array.every((ele, i) => (ele !== null && ele !== undefined && ele !== "")));
    const checkForEmpty = [...Array(total).keys()].every(ele => ele in array);
    return (checkForEmpty && checkForValue);
  }

  const showHint = () => {
    setIsHintVisible(true);
  }

  // for any missing fields, block opening preview and show an error popup
  const showPreview = () => {
    if (!(title !== "" && checkArray(questions) && checkArray(answers) && checkArray(images))) {
      Modal.error({ title: "There are some unfilled fields in this drill", content: "Check the drill and fill them out" })
      return;
    }
    setSectionIndex(0);
    indexRef.current = 0;
    setIsPreviewVisible(true);
  };
  const handleOkPreview = () => {
    setIsPreviewVisible(false);
  };

  const handleCancelPreview = () => {
    setIsPreviewVisible(false);
  };

  const handleOkHint = () => {
    setIsHintVisible(false);
  }

  const handleCancelHint = () => {
    setIsHintVisible(false);
  }

  // add a drill section
  const addNewBox = () => {
    let temp = indexArray.slice();
    temp.push(counter);
    let size = temp.length-1
    setActivePanels([size])
    setIndexArray(temp);
    setCounter(counter + 1);
    setTotal(total + 1);
  };
  
  // delete a drill section
  const deleteBtnClick = (i) => {
    setTotal(total - 1);
    let foundIndex = indexArray.findIndex((ele) => ele === i);
    let tempIndexArray = indexArray.slice();
    let tempQuestions = questions.slice();
    let tempAnswers = answers.slice();
    let tempImages = images.slice();
    tempIndexArray.splice(foundIndex, 1);
    tempQuestions.splice(foundIndex, 1);
    tempAnswers.splice(foundIndex, 1);
    tempImages.splice(foundIndex, 1);

    let size = tempIndexArray.length-1
    //console.log(size)
    setActivePanels([size])

    setIndexArray(tempIndexArray);
    setImages(tempImages);
    setQuestions(tempQuestions);
    setAnswers(tempAnswers);
  };

  const headerWrapper = (
    <div className={styles.headerWrapper}>
      <input
        bordered={false}
        style={{ border: "2px dotted gray" }}
        className={styles.input}
        placeholder="Enter an instruction for this flashcard drill"
        defaultValue={title}
        id="flashCardTitle"
      />
    </div>
  );

  const footerWrapper = (
    <div className={styles.footerWrapper}>
      <Button
        shape="round"
        type="primary"
        onClick={handleOk}
        style={{ background: "#27AA9B" }}
      >
        Save changes
      </Button>
      <Button
        shape="round"
        type="ghost"
        loading={false}
        onClick={handleCancel}
        style={{
          background: "#9F9F9F",
          color: "white",
          borderColor: "#9F9F9F",
        }}
      >
        Cancel
      </Button>
    </div>
  );

  const titleWrapper = (ele, i) => (
    <div className="tw-flex tw-items-center">
      <div className={styles.titleWrapper}>
        <h4 className={styles.cardTitle}>{"Card " + (i + 1)}</h4>
      </div>
      <div className={styles.iconWrapper}>
        <DeleteOutlined
          className={styles.icon}
          onClick={() => deleteBtnClick(ele)}
        />
      </div>
    </div>
  );

  const addRow = (
    <>
      <Row align="middle" className={styles.itemStyle} onClick={addNewBox}>
        <Space>
          <PlusCircleFilled className={styles.iconStyle} />
          <p className={styles.paragraphStyle}>{"New card"}</p>
        </Space>
      </Row>
    </>
  );

  const updateQuestion = (e, i) => {
    let tempQuestions = questions.slice();
    tempQuestions[i] = e.target.value;
    setQuestions(tempQuestions);
  }

  const updateAnswer = (e, i) => {
    let tempAnswers = answers.slice();
    tempAnswers[i] = e.target.value;
    setAnswers(tempAnswers);
  }

  return (
    <>
      <CheckSquareOutlined className={styles.checkMarkBtn + " " + "me-2"} />
      <span className={styles.text}>Flash Card</span>
      <div className={styles.edit_and_preview_wrapper}>
        <Button onClick={showModal} className={[styles.editBtn, "drillEdit"].join(" ")}>
          Edit Drill
        </Button>
        {data.drillId !== undefined ? <EyeOutlined className={styles.previewBtn} onClick={showPreview} />
          : <></>
        }
      </div>

      <Modal
        closable={false}
        destroyOnClose={true}
        title={headerWrapper}
        visible={isModalVisible}
        footer={[footerWrapper]}
        bodyStyle={{
          backgroundColor: "#EDEDED",
        }}
        className="drillModal"
        onCancel={handleCancel}
      >
        {indexArray.map((ele, i) => {
          return (
            <Collapse accordion defaultActiveKey={[indexArray]} activeKey={[activePanels]} onChange={(key) => setActivePanels(key)}>
              <Panel forceRender={true} header={titleWrapper(ele, i)} key={i}>
                <div className={styles.inputLineWrapper}>
                  <div className={styles.fullLine}>
                    <Input
                      className={styles.inputQuestion}
                      placeholder="Enter a question for this card"
                      value={questions[i]}
                      onChange={(e) => updateQuestion(e, i)}
                      id={"flashCardQuestion" + i} />
                    <FlashCardContent
                      index={i}
                      images={images}
                      setImages={setImages}
                      oldImages={oldImages}
                    />
                  </div>
                </div>
                <div className={styles.paragraphWrapper}>
                  <Input
                    className={styles.input}
                    placeholder="Enter an answer for this card"
                    value={answers[i]}
                    onChange={(e) => updateAnswer(e, i)}
                    id={"flashCardAnswer" + i}
                  />
                </div>
              </Panel>

            </Collapse>
          );
        })}
        {addRow}
      </Modal>
      <Modal
        closeIcon={<CloseCircleFilled />}
        className="drillModal"
        title={title}
        visible={isPreviewVisible}
        onOk={handleOkPreview}
        onCancel={handleCancelPreview}
        destroyOnClose={true}
        footer={[
          <>
            <div className={styles.footerButtons}>
              <LeftOutlined style={{ fontSize: '150%' }} onClick={prevSection} />
              <span>{questions[sectionIndex]}<BulbOutlined className={styles.icon} style={{ fontSize: '150%' }} onClick={showHint} /> </span>
              <RightOutlined style={{ fontSize: '150%' }} onClick={nextSection} />
            </div>
          </>

        ]}
      >
        <Carousel
          ref={demoRef}
          draggable
          afterChange={onChange}
        >
          {[...Array(total)].map((_, i) => {
            return (
              <FlashCardDemo
                currentIndex={indexRef.current}
                answer={answers[i]}
                key={i}
                index={i}
                image={images[i]}
              />
            )

          })}
        </Carousel>
      </Modal>
      <Modal
        closable={false}
        className="drillModal"
        title={title}
        visible={isHintVisible}
        onOk={handleOkHint}
        onCancel={handleCancelHint}
        destroyOnClose={true}
        footer={null}
      >
        <FlashCardHint
          images={images}
          questions={questions}
          answers={answers}
        />
      </Modal>

    </>
  );
};

export default FlashCardPage;
