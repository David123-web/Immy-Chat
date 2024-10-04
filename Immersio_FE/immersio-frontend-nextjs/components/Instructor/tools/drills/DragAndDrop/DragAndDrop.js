import React from "react";
import { Collapse, Input } from "antd";
import DragAndDropContent from "./DragAndDropContent";
import styles from './DragAndDrop.module.css';
import { DeleteOutlined, PlusCircleFilled } from "@ant-design/icons";

const DragAndDrop = ({
  words,
  setWords,
  oldWords,
  setOldWords,
  images,
  setImages,
  oldImages,
  setOldImages,
  handleUpdateDrillData
  
}) => {
  const { Panel } = Collapse;

  const header = (index) => (
    <h4 className={styles.cardTitle}>{"Box " + (index + 1)}</h4>
  )

  const handleDelete = ({ index }) => {
    const cloneWords = JSON.parse(JSON.stringify(words));
    const cloneImages = JSON.parse(JSON.stringify(images));
    cloneWords.splice(index, 1);
    cloneImages.splice(index, 1);

    handleUpdateDrillData && handleUpdateDrillData({ cloneImages, cloneWords });
    setWords(cloneWords);
    setImages(cloneImages);
  }

  const handleAdd = () => {
    const cloneWords = JSON.parse(JSON.stringify(words));
    const cloneImages = JSON.parse(JSON.stringify(images));
    cloneWords.push('');
    cloneImages.push('');

    setWords(cloneWords);
    setImages(cloneImages);
  }

  const handleUpdate = ({ item, index}) => {
    const cloneWords = JSON.parse(JSON.stringify(words));
    cloneWords[index] = item;

    setWords(cloneWords);
  }

  return (
    <>
      <style jsx global>{`.Collapse-Custom {border: 1px solid #d9d9d9 !important}`}</style>
      <div>
        <Collapse className="Collapse-Custom" defaultActiveKey={["0"]}>
          {words.map((item, index) => {
            return (
              <Panel header={(
                <div className="tw-flex tw-items-center">
                  <span className="tw-flex-1">{header(index)}</span>
                  {index ? (
                    <DeleteOutlined
                      onClick={() => handleDelete({ index })}
                      className='d-flex align-items-center tw-text-[18px]'
                    />
                  ) : null}
                </div>
              )} key={index}>
                <DragAndDropContent
                  index={index}
                  word={item}
                  oldWords={oldWords}
                  images={images}
                  setImages={setImages}
                  oldImages={oldImages}
                  handleUpdate={handleUpdate}
                />
              </Panel>
            );
          })}
        </Collapse>
        <div
          className='d-flex align-items-center mt-3 new-section tw-cursor-pointer'
          onClick={handleAdd}
        >
          <PlusCircleFilled className="icon-circle-add tw-text-[21px]" style={{ color:'#25A5AA' }} />
          <span className="ms-2 tw-text-[15px]">Add new</span>
        </div>
      </div>
    </>
  );
};

export default DragAndDrop;
