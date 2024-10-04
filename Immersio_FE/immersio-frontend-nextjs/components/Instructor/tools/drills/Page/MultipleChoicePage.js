import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Collapse, Space, Row } from "antd";
import styles from "./DrillPage.module.css";
import MultipleChoiceDemo from "../MultipleChoice/MultipleChoiceDemo";
import MultipleChoiceContent from '../MultipleChoice/MultipleChoiceContent'
import { LeftOutlined, RightOutlined, DeleteOutlined, PlusCircleFilled, CheckSquareOutlined, EyeOutlined, CloseCircleFilled } from "@ant-design/icons";
import { DataContext1, DataContext2, DataContext3 } from "../../../../../src/pages/dashboard/course/lesson/lessonInput";

const MultipleChoicePage = ({ drillId, groupNumber }) => {
  if (!useContext(DataContext1) && !useContext(DataContext2) && !useContext(DataContext3)) return null;
  let contextArray = [DataContext1, DataContext2, DataContext3];
  const { drillData, setDrillData } = useContext(contextArray[groupNumber]);
  const [activePanels, setActivePanels] = useState([0])
  const { Panel } = Collapse;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [title, setTitle] = useState(drillData[drillId] ? drillData[drillId].instruction || "" : "");
  const [questions, setQuestions] = useState(drillData[drillId] ? drillData[drillId].questions || [] : []);
  const [oldQuestions, setOldQuestions] = useState(questions);
  const [answers, setAnswers] = useState(drillData[drillId] ? drillData[drillId].array_of_answers || [[""]] : [[""]]);
  const [oldAnswers, setOldAnswers] = useState(JSON.parse(JSON.stringify(answers)));
  const [correctIndices, setCorrectIndices] = useState(drillData[drillId] ? drillData[drillId].correct_answers || [] : []);
  const [oldCorrectIndices, setOldCorrectIndices] = useState(correctIndices);

  const [answerCount, setAnswerCount] = useState(() => {
    let startArr = [];
    answers.forEach(ele => startArr.push(ele.length))
    return startArr;
  });

  const [oldAnswerCount, setOldAnswerCount] = useState(answerCount);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [counter, setCounter] = useState(questions.length + 1);
  const [total, setTotal] = useState(drillData[drillId] && drillData[drillId].id ? questions.length : 1);
  const [indexArray, setIndexArray] = useState([...Array(total).keys()]);
  const [oldCounter, setOldCounter] = useState(counter);
  const [oldTotal, setOldTotal] = useState(total);
  const [oldIndexArray, setOldIndexArray] = useState(indexArray);
  const [data, setData] = useState(drillData[drillId] ? drillData[drillId] : {});

  // useEffect(() => {
  //   if (Object.keys(data).length === 0) return;
  //   let temp = drillData.slice();
  //   let foundIndex = temp.findIndex((ele) => ele.drillId === drillId);
  //   if (foundIndex !== -1) {
  //     temp.splice(foundIndex, 1, data)
  //   } else {
  //     temp.push(data);
  //   }
  //   setDrillData(temp);
  // }, [data]);

  const nextSection = () => {
    if (sectionIndex < total - 1) setSectionIndex(sectionIndex + 1);
  };

  const prevSection = () => {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    const titleText = document.querySelector("#multipleChoiceTitle").value;
    setTitle(titleText);
    setOldAnswers(JSON.parse(JSON.stringify(answers)));
    setOldQuestions(questions.slice());
    setOldCorrectIndices(correctIndices.slice());
    setOldAnswerCount(answerCount.slice());
    setOldCounter(counter);
    setOldTotal(total);
    setOldIndexArray(indexArray.slice());

    const params = {
      ...drillData[drillId],
      drillId: drillId,
      drillType: 'multipleChoice',
      instruction: titleText,
      questions: questions,
      array_of_answers: answers,
      correct_answers: correctIndices,
      touched: true,
    }
    const cloneData = JSON.parse(JSON.stringify(drillData));
    cloneData[drillId] = params
    setDrillData(cloneData)
    setData(params)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setCorrectIndices(oldCorrectIndices.slice());
    setAnswerCount(oldAnswerCount.slice());
    setCounter(oldCounter);
    setTotal(oldTotal);
    setIndexArray(oldIndexArray.slice());
    setQuestions(oldQuestions.slice());
    setAnswers(JSON.parse(JSON.stringify(oldAnswers)));
    setIsModalVisible(false);
  };

  const checkArray = (array, size) => {
    if (array === undefined || array.length === 0) return false;
    const checkForValue = (array.every((ele, i) => (ele !== null && ele !== undefined && ele !== "")));
    const checkForEmpty = [...Array(size).keys()].every(ele => ele in array);
    return (checkForEmpty && checkForValue);
  }
  const checkNestedArray = (array) => {
    if (array === undefined || array.length === 0) return false;
    const checkForEmpty = [...Array(total).keys()].every(ele => ele in array);
    if (!checkForEmpty) return false;
    const checkForValue = array.every((ele, i) => checkArray(ele, answerCount[i]));
    return checkForValue;
  }

  // for any missing fields, block opening preview and show an error popup
  const showPreview = () => {
    if (!(title !== "" & checkArray(questions, total) && checkArray(correctIndices, total) && checkNestedArray(answers))) {
      Modal.error({ title: "There are some unfilled fields in this drill", content: "Check the drill and fill them out" })
      return;
    }
    setSectionIndex(0);
    setIsPreviewVisible(true);
  };
  const handleOkPreview = () => {
    setIsPreviewVisible(false);
  };

  const handleCancelPreview = () => {
    setIsPreviewVisible(false);
  };

  // add a drill section
  const addNewBox = () => {
    let temp = indexArray.slice();
    temp.push(counter);
    let size = temp.length-1
    setActivePanels([size])
    setIndexArray(temp);
    setCounter(counter + 1);
    setTotal(total + 1);
    let tempAnswer = JSON.parse(JSON.stringify(answers));
    tempAnswer.push([""]);
    setAnswers(tempAnswer);
  };

  // delete a drill section
  const deleteBtnClick = (i) => {
    setTotal(total - 1);
    let foundIndex = indexArray.findIndex((ele) => ele === i);
    let tempIndexArray = indexArray.slice();
    let tempQuestions = questions.slice();
    let tempAnswers = JSON.parse(JSON.stringify(answers));
    let tempCorrectIndicies = correctIndices.slice();
    let tempAnswerCount = answerCount.slice();
    tempIndexArray.splice(foundIndex, 1);
    tempQuestions.splice(foundIndex, 1);
    tempAnswers.splice(foundIndex, 1);
    tempCorrectIndicies.splice(foundIndex, 1);
    tempAnswerCount.splice(foundIndex, 1);

    let tam = tempIndexArray.length-1
    console.log(tam)
    setActivePanels([tam])

    setIndexArray(tempIndexArray);
    setQuestions(tempQuestions);
    setAnswers(tempAnswers);
    setCorrectIndices(tempCorrectIndicies);
    setAnswerCount(tempAnswerCount);
  };

  const headerWrapper = (
    <div className={styles.headerWrapper}>
      <input
        bordered={false}
        style={{ border: "2px dotted gray" }}
        placeholder="Enter an instruction for this Multiple choice drill"
        defaultValue={title}
        id="multipleChoiceTitle"
        className={styles.input}
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
    <>
      <div className={styles.titleWrapper}>
        <h4 className={styles.cardTitle}>{"Question " + (i + 1)}</h4>
      </div>

      <div className={styles.iconWrapper}>
        <DeleteOutlined
          className={styles.icon}
          onClick={() => deleteBtnClick(ele)}
        />
      </div>
    </>
  );

  const addRow = (
    <>
      <Row align="middle" className={styles.itemStyle} onClick={addNewBox}>
        <Space>
          <PlusCircleFilled className={styles.iconStyle} />
          <p className={styles.paragraphStyle}>{"New question"}</p>
        </Space>
      </Row>
    </>
  );


  return (
    <>
      <CheckSquareOutlined className={styles.checkMarkBtn + " " + "me-2"} />
      <span className={styles.text}>Multiple Choice</span>
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
            <Collapse accordion defaultActiveKey={activePanels} activeKey={activePanels} onChange={(key) => {setActivePanels([key])}}>
              <Panel forceRender={true} header={titleWrapper(ele, i)} key={i}>
                <MultipleChoiceContent
                  index={i}
                  questions={questions}
                  answers={answers}
                  correctIndices={correctIndices}
                  answerCount={answerCount}
                  setQuestions={setQuestions}
                  setAnswers={setAnswers}
                  setCorrectIndices={setCorrectIndices}
                  setAnswerCount={setAnswerCount}
                />
              </Panel>
            </Collapse>
          );
        })}
        {addRow}
      </Modal>
      <Modal
        closeIcon={<CloseCircleFilled />}
        className="drillModal"
        destroyOnClose={true}
        title={title}
        visible={isPreviewVisible}
        onOk={handleOkPreview}
        onCancel={handleCancelPreview}
        footer={[
          <div className={styles.footerButtons}>
            <LeftOutlined style={{ fontSize: '150%' }} onClick={prevSection} />
            <RightOutlined style={{ fontSize: '150%' }} onClick={nextSection} />
          </div>,
        ]}
      >
        <div>
          <MultipleChoiceDemo
            key={sectionIndex}
            question={questions[sectionIndex]}
            answers={answers[sectionIndex]}
            correctAnswer={correctIndices[sectionIndex]}
          />
        </div>
      </Modal>

    </>
  );
};

export default MultipleChoicePage;
