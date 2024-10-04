import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Modal } from "antd";
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import DragAndDropDemo from "../DragAndDrop/DragAndDropDemo";
import styles from "./DrillPage.module.css";
import { LeftOutlined, EyeOutlined, RightOutlined, CheckSquareOutlined, CloseCircleFilled } from "@ant-design/icons";
import { DataContext1, DataContext2, DataContext3 } from "../../../../../src/pages/dashboard/course/lesson/lessonInput";

const DragAndDropPage = ({ drillId, words, setWords, groupNumber }) => {
  if (!useContext(DataContext1) && !useContext(DataContext2) && !useContext(DataContext3)) return null;
  let contextArray = [DataContext1, DataContext2, DataContext3];
  const { drillData, setDrillData } = useContext(contextArray[groupNumber]);

  const demoRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [title, setTitle] = useState(drillData[drillId] ? drillData[drillId].instruction || "" : "");
  const [images, setImages] = useState(drillData[drillId] ? drillData[drillId].images || [] : []);
  const [oldWords, setOldWords] = useState(words);
  const [oldImages, setOldImages] = useState(images);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [counter, setCounter] = useState(words?.length ? Math.floor(words.length / 4) + 1 : 0);
  const [wordsArray, setWordsArray] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(drillData[drillId] ? drillData[drillId] : {});

  // divide the image-word pairs into multiple sections for preview page
  useEffect(() => {
    if ((drillData[drillId] === undefined || drillData[drillId].words === undefined || drillData[drillId].images) === undefined) {
      setLoaded(true);
      return;
    }
    let emptyWordsArray = [];
    let emptyImagesArray = [];
    let lastWordsGroup = [];
    let lastImagesGroup = [];
    const groupSize = 4;
    const length = words.length;
    let quotient = 0;
    if (length > groupSize) {
      quotient = Math.floor(length / groupSize);
      let remainder = length % groupSize;
      if (remainder === 1) {
        for (let i = 0; i < quotient - 1; i++) {
          emptyWordsArray.push([
            words[i * groupSize],
            words[i * groupSize + 1],
            words[i * groupSize + 2],
            words[i * groupSize + 3],
          ]);
          emptyImagesArray.push([
            images[i * groupSize],
            images[i * groupSize + 1],
            images[i * groupSize + 2],
            images[i * groupSize + 3],
          ]);
        }
        let secondLastWordsGroup = [];
        let secondLastImagesGroup = [];
        for (
          let j = (quotient - 1) * groupSize;
          j < quotient * groupSize - 1;
          j++
        ) {
          secondLastWordsGroup.push(words[j]);
          secondLastImagesGroup.push(images[j]);
        }
        for (let k = length - 2; k < length; k++) {
          lastWordsGroup.push(words[k]);
          lastImagesGroup.push(images[k]);
        }
        emptyWordsArray.push(secondLastWordsGroup);
        emptyWordsArray.push(lastWordsGroup);
        emptyImagesArray.push(secondLastImagesGroup);
        emptyImagesArray.push(lastImagesGroup);
      } else {
        for (let i = 0; i < quotient; i++) {
          emptyWordsArray.push([
            words[i * groupSize],
            words[i * groupSize + 1],
            words[i * groupSize + 2],
            words[i * groupSize + 3],
          ]);
          emptyImagesArray.push([
            images[i * groupSize],
            images[i * groupSize + 1],
            images[i * groupSize + 2],
            images[i * groupSize + 3],
          ]);
        }
        for (let j = quotient * groupSize; j < length; j++) {
          lastWordsGroup.push(words[j]);
          lastImagesGroup.push(images[j]);
        }
        emptyWordsArray.push(lastWordsGroup);
        emptyImagesArray.push(lastImagesGroup);
      }
      setWordsArray(emptyWordsArray);
      setImagesArray(emptyImagesArray);
    } else {
      setWordsArray([words.slice()]);
      setImagesArray([images.slice()]);
    }
    setLoaded(true);
  }, [])

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
    if (sectionIndex < counter - 1) setSectionIndex(sectionIndex + 1);
  };

  const prevSection = () => {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  
  // divide the image-word pairs into multiple sections for preview page
  const handleOk = () => {
    const titleText = document.querySelector("#dragAndDropTitle").value;
    setTitle(titleText);
    setOldImages(images.slice());
    setOldWords(words.slice());
    let emptyWordsArray = [];
    let emptyImagesArray = [];
    let lastWordsGroup = [];
    let lastImagesGroup = [];
    const groupSize = 4;
    const length = words.length;
    let quotient = 0;
    if (length > groupSize) {
      quotient = Math.floor(length / groupSize);
      let remainder = length % groupSize;
      if (remainder === 1) {
        for (let i = 0; i < quotient - 1; i++) {
          emptyWordsArray.push([
            words[i * groupSize],
            words[i * groupSize + 1],
            words[i * groupSize + 2],
            words[i * groupSize + 3],
          ]);
          emptyImagesArray.push([
            images[i * groupSize],
            images[i * groupSize + 1],
            images[i * groupSize + 2],
            images[i * groupSize + 3],
          ]);
        }
        let secondLastWordsGroup = [];
        let secondLastImagesGroup = [];
        for (
          let j = (quotient - 1) * groupSize;
          j < quotient * groupSize - 1;
          j++
        ) {
          secondLastWordsGroup.push(words[j]);
          secondLastImagesGroup.push(images[j]);
        }
        for (let k = length - 2; k < length; k++) {
          lastWordsGroup.push(words[k]);
          lastImagesGroup.push(images[k]);
        }
        emptyWordsArray.push(secondLastWordsGroup);
        emptyWordsArray.push(lastWordsGroup);
        emptyImagesArray.push(secondLastImagesGroup);
        emptyImagesArray.push(lastImagesGroup);
      } else {
        for (let i = 0; i < quotient; i++) {
          emptyWordsArray.push([
            words[i * groupSize],
            words[i * groupSize + 1],
            words[i * groupSize + 2],
            words[i * groupSize + 3],
          ]);
          emptyImagesArray.push([
            images[i * groupSize],
            images[i * groupSize + 1],
            images[i * groupSize + 2],
            images[i * groupSize + 3],
          ]);
        }
        for (let j = quotient * groupSize; j < length; j++) {
          lastWordsGroup.push(words[j]);
          lastImagesGroup.push(images[j]);
        }
        emptyWordsArray.push(lastWordsGroup);
        emptyImagesArray.push(lastImagesGroup);
      }
      setWordsArray(emptyWordsArray);
      setImagesArray(emptyImagesArray);
    } else {
      setWordsArray([words.slice()]);
      setImagesArray([images.slice()]);
    }
    setCounter(quotient + 1);

    const params = {
      ...drillData[drillId],
      drillId: drillId,
      drillType: 'dragNdrop',
      instruction: titleText,
      images: images,
      answers: words,
      touched: true
    }
    const cloneData = JSON.parse(JSON.stringify(drillData));
    cloneData[drillId] = params
    setDrillData(cloneData)
    setData(params)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImages(oldImages.slice());
    setWords(oldWords.slice());
  };

  const checkArray = (array) => {
    if (array === undefined || array.length === 0) return false;
    const checkForValue = (array.every((ele, i) => (ele !== null && ele !== undefined && ele !== "")));
    const checkForEmpty = [...Array(words.length).keys()].every(ele => ele in array);
    return (checkForEmpty && checkForValue);
  }

  // for any missing fields, block opening preview and show an error popup
  const showPreview = () => {
    if (!(title !== "" && checkArray(images))) {
      Modal.error({ title: "There are some unfilled fields in this drill", content: "Check the drill and fill them out" })
      return;
    }
    setIsPreviewVisible(true);
  };
  const handleOkPreview = () => {
    setIsPreviewVisible(false);
  };

  const handleCancelPreview = () => {
    setIsPreviewVisible(false);
  };

  const headerWrapper = (
    <div className={styles.headerWrapper}>
      <input
        bordered={false}
        style={{ border: "2px dotted gray" }}
        placeholder="Enter an instruction for this Drag and Drop drill"
        defaultValue={title}
        id="dragAndDropTitle"
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

  return (
    <>
      <CheckSquareOutlined className={styles.checkMarkBtn + " " + "me-2"} />
      <span className={styles.text}>Drag and Drop</span>
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
        onCancel={handleCancel}
        title={headerWrapper}
        visible={isModalVisible}
        footer={[footerWrapper]}
        className="drillModal"
      >
        {loaded &&
          <DragAndDrop
            words={words}
            setWords={setWords}
            oldWords={oldWords}
            setOldWords={setOldWords}
            images={images}
            setImages={setImages}
            oldImages={oldImages}
            setOldImages={setOldImages}
            handleUpdateDrillData={({cloneImages, cloneWords}) => {
              const cloneData = JSON.parse(JSON.stringify(drillData));
              cloneData[drillId].images = cloneImages
              cloneData[drillId].answers = cloneWords
              setDrillData(cloneData)
            }}
          />
        }
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
          {
            loaded &&
            <DragAndDropDemo
              demoRef={demoRef}
              key={sectionIndex}
              words={wordsArray[sectionIndex]}
              images={imagesArray[sectionIndex]}
            />
          }

        </div>
      </Modal>
    </>
  );
};

export default DragAndDropPage;
