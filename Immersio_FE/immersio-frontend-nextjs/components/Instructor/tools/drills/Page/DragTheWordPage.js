import React, { useState, useRef, useEffect, useContext } from "react";
import { Button, Modal, Collapse, Space, Row } from "antd";
import styles from "./DrillPage.module.css";
import DragTheWordDemo from "../DragTheWord/DragTheWordDemo";
import { EyeOutlined, LeftOutlined, RightOutlined, DeleteOutlined, PlusCircleFilled, CheckSquareOutlined, CloseCircleFilled } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { DataContext1, DataContext2, DataContext3 } from "../../../../../src/pages/dashboard/course/lesson/lessonInput";

const DragTheWordPage = ({ drillId, groupNumber }) => {
  if (!useContext(DataContext1) && !useContext(DataContext2) && !useContext(DataContext3)) return null;
  let contextArray = [DataContext1, DataContext2, DataContext3];
  const { drillData, setDrillData } = useContext(contextArray[groupNumber]);
  const demoRef = useRef(null);
  const { Panel } = Collapse;
  const [statements, setStatements] = useState(drillData[drillId] ? drillData[drillId].statements || [] : []);
  const [fragments, setFragments] = useState(drillData[drillId] ? drillData[drillId].fragments || [] : []);
  const [words, setWords] = useState(drillData[drillId] ? drillData[drillId].words || [] : []);
  const [oldStatements, setOldStatements] = useState(statements);
  const [oldFragments, setOldFragments] = useState(fragments);
  const [oldWords, setOldWords] = useState(words);
  const [data, setData] = useState(drillData[drillId] ? drillData[drillId] : {});
  const [counter, setCounter] = useState(statements.length + 1);
  const [total, setTotal] = useState(drillData[drillId] && drillData[drillId].id ? statements.length : 1);

  const [indexArray, setIndexArray] = useState([...Array(total).keys()]);
  const [oldCounter, setOldCounter] = useState(counter);
  const [oldTotal, setOldTotal] = useState(total);
  const [oldIndexArray, setOldIndexArray] = useState(indexArray);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const [title, setTitle] = useState(drillData[drillId] ? drillData[drillId].instruction || "" : "");

  const [sectionIndex, setSectionIndex] = useState(0);
  const [activePanels, setActivePanels] = useState([0])

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

  useEffect(() => {
    if (total) {
      let startingFragments = [];
      let startingWords = [];
      for (let i = 0; i < total; i++) {
        const statement = statements[i];
        let arrayOfFragments = [];
        let arrayOfWords = [];
        let splitString = statement !== undefined ? statement.split("*") : [];
        if (splitString.length % 2 === 0) {
          let lastTwo = splitString.slice(splitString.length - 2);
          let combinedString = lastTwo.join("*");
          splitString.splice(splitString.length - 2, 2, combinedString);
        }
        for (let j = 0; j < splitString.length; j++) {
          j % 2 == 1
            ? arrayOfWords.push(splitString[j])
            : arrayOfFragments.push(splitString[j]);
        }
        startingFragments.push(arrayOfFragments);
        startingWords.push(arrayOfWords);
      }
      setWords(startingWords);
      setFragments(startingFragments);
    }
  }, [])

  const nextSection = () => {
    if (sectionIndex < total - 1) setSectionIndex(sectionIndex + 1);
  };

  const prevSection = () => {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  // process each statement into split up draggable words and sentences with blanks for the drill preview
  const handleOk = () => {
    let startingFragments = [];
    let startingWords = [];
    let titleText = document.querySelector("#dragTheWordTitle").value;
    setTitle(titleText);
    for (let i = 0; i < total; i++) {
      const statement = statements[i];
      let arrayOfFragments = [];
      let arrayOfWords = [];
      let splitString = statement !== undefined ? statement.split("*") : [];
      if (splitString.length % 2 === 0) {
        let lastTwo = splitString.slice(splitString.length - 2);
        let combinedString = lastTwo.join("*");
        splitString.splice(splitString.length - 2, 2, combinedString);
      }
      for (let j = 0; j < splitString.length; j++) {
        j % 2 == 1
          ? arrayOfWords.push(splitString[j])
          : arrayOfFragments.push(splitString[j]);
      }
      startingFragments.push(arrayOfFragments);
      startingWords.push(arrayOfWords);
    }
    setWords(startingWords);
    setFragments(startingFragments);
    setOldCounter(counter);
    setOldTotal(total);
    setOldIndexArray(indexArray.slice());
    setOldStatements(statements.slice());
    setOldFragments(startingFragments);
    setOldWords(startingWords);

    const params = {
      ...drillData[drillId],
      drillId: drillId,
      drillType: 'dragWords',
      instruction: titleText,
      statements: statements,
      fragments: startingFragments,
      words: startingWords,
      touched: true
    }
    const cloneData = JSON.parse(JSON.stringify(drillData));
    cloneData[drillId] = params
    setDrillData(cloneData)
    setData(params)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setCounter(oldCounter);
    setTotal(oldTotal);
    setIndexArray(oldIndexArray.slice());
    setWords(JSON.parse(JSON.stringify(oldWords)));
    setFragments(JSON.parse(JSON.stringify(oldFragments)));
    setStatements(oldStatements.slice());
    setIsModalVisible(false);
  };

  const checkArray = (array) => {
    if (array === undefined || array.length === 0) return false;
    const checkForValue = (array.every((ele, i) => (ele !== null && ele !== undefined && ele !== "")));
    const checkForEmpty = [...Array(total).keys()].every(ele => ele in array);
    return (checkForEmpty && checkForValue);
  }

  const checkNestedArray = (array) => {
    if (array === undefined || array.length === 0) return false;
    const checkForEmpty = [...Array(total).keys()].every(ele => ele in array);
    return checkForEmpty;
  }

  // for any missing fields, block opening preview and show an error popup
  const showPreview = () => {
    if (!(title !== "" && checkArray(statements) && checkNestedArray(words) && checkNestedArray(fragments))) {
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

  // add another section
  const addNewBox = () => {
    let temp = indexArray.slice();
    temp.push(counter);
    let size = temp.length-1
    setActivePanels([size])
    setIndexArray(temp);
    setCounter(counter + 1);
    setTotal(total + 1);
  };

  // delete a section
  const deleteBtnClick = (i) => {
    setTotal(total - 1);
    let foundIndex = indexArray.findIndex((ele) => ele === i);
    let tempIndexArray = indexArray.slice();
    let tempStatements = statements.slice();
    let tempFragments = JSON.parse(JSON.stringify(fragments));
    let tempWords = JSON.parse(JSON.stringify(words));
    tempIndexArray.splice(foundIndex, 1);
    tempFragments.splice(foundIndex, 1);
    tempStatements.splice(foundIndex, 1);
    tempWords.splice(foundIndex, 1);

    let tam = tempIndexArray.length-1
    console.log(tam)
    setActivePanels([tam])

    setIndexArray(tempIndexArray);
    setWords(tempWords);
    setFragments(tempFragments);
    setStatements(tempStatements);
  }

  const headerWrapper = (
    <div className={styles.headerWrapper}>
      <input
        bordered={false}
        style={{ border: "2px dotted gray" }}
        placeholder="Enter an instruction for this Drag the words drill"
        defaultValue={title}
        id="dragTheWordTitle"
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

  const titleWrapper = (ele, i) =>
  (
    <>
      <div className={styles.titleWrapper}>
        <h4 className={styles.cardTitle}>{"Box " + (i + 1)}</h4>
      </div>

      <div className={styles.iconWrapper}>
        <DeleteOutlined className={styles.icon} onClick={() => deleteBtnClick(ele)} />
      </div>
    </>
  );

  const addRow = (
    <>
      <Row align="middle" className={styles.itemStyle} onClick={addNewBox} >
        <Space>
          <PlusCircleFilled className={styles.iconStyle} />
          <p className={styles.paragraphStyle}>{"New box"}</p>
        </Space>
      </Row>
    </>
  )

  const updateText = (e, i) => {
    let tempStatements = statements.slice();
    tempStatements[i] = e.target.value;
    setStatements(tempStatements);
  }


  return (
    <>
      <CheckSquareOutlined className={styles.checkMarkBtn + " " + "me-2"} />
      <span className={styles.text}>Drag the Word</span>
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
                <div className={styles.paragraphWrapper}>
                  <TextArea
                    onChange={(e) => updateText(e, i)}
                    id={"statement" + i}
                    placeholder={
                      "Enter your No." + (i + 1) + " statement. Note that Droppable words are added with an asterisk (*) in front and behind the correct word/phrase."}
                    value={statements[i]}
                    className={styles.paragraph} />
                </div>

              </Panel>
            </Collapse>
          );
        })}
        {addRow}
      </Modal>
      <Modal
        transitionName="ant-fade"
        closeIcon={<CloseCircleFilled />}
        className="drillModal dragdroppreviewmodal"
        destroyOnClose={true}
        title={title}
        visible={isPreviewVisible}
        onOk={handleOkPreview}
        onCancel={handleCancelPreview}
        footer={[
          <div className={styles.footerButtons}>
            <LeftOutlined style={{ fontSize: '150%' }} onClick={prevSection} />
            <EyeOutlined style={{ fontSize: '150%' }} onClick={() => demoRef.current()} />
            <RightOutlined style={{ fontSize: '150%' }} onClick={nextSection} />
          </div>,
        ]}
      >
        <div>
          <DragTheWordDemo
            demoRef={demoRef}
            key={sectionIndex}
            words={words[sectionIndex]}
            fragments={fragments[sectionIndex]}
          />
        </div>
      </Modal>
    </>
  );
};

export default DragTheWordPage;
