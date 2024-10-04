import { CloseCircleFilled, CloudUploadOutlined, DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import styles from './DragAndDrop.module.css';
const fileTypes = ["JPG", "PNG", "GIF"];

const DragAndDropContent = ({
  index,
  word,
  images,
  setImages,
  oldImages,
  handleUpdate,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(images[index] || "");
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);

    let tempCopy = images;
    tempCopy[index] = oldImages[index];
    setImages(tempCopy);

  };

  // load images on upload
  const handleChange = (file) => {
    let tempCopy = images;
    tempCopy[index] = file;
    setImages(tempCopy);
    let reader = new FileReader();
    reader.onload = function (e2) {
      setImageSrc(e2.target.result);
    };

    reader.readAsDataURL(images[index]);
  };

  // load images on mount, if one is already saved
  useEffect(() => {
    if (images[index] && imageSrc === '') {
      if (typeof (images[index]) === "string") {
        setImageSrc(images[index]);
      } else {
        let reader = new FileReader();
        reader.onload = function (e2) {
          setImageSrc(e2.target.result);
        };

        reader.readAsDataURL(images[index]);
      }
    }
  }, [isModalVisible]);

  const footerWrapper = (
    <div className={styles.footerWrapper}>
      <Button
        shape="round"
        type="primary"
        onClick={handleOk}
        className={styles.save}
        style={{ background: "#27AA9B" }}
      >
        Save
      </Button>
    </div>
  )

  return (
    <>
      <div>
        <div className={styles.fullLine}>
          <Input
            value={word}
            bordered={false}
            placeholder='Enter a text for the corresponding media'
            onChange={(e) => handleUpdate && handleUpdate({ item: e.target.value, index })}
          />
          <div onClick={showModal} className='tw-whitespace-nowrap'>
            <PlusCircleFilled className={styles.iconStyle} />
            <p className={styles.mediaButton}>Add media</p>
          </div>
        </div>
        <Modal
          closeIcon={<CloseCircleFilled />}
          destroyOnClose={true}
          title="Add Media"
          visible={isModalVisible}
          onCancel={handleCancel}
          className="drillModal"
          footer={footerWrapper}
        >
          <FileUploader
            maxSize={5}
            onTypeError={() => Modal.error({ title: "This file type is not accepted", content: "Upload a jpg/png/gif file" })}
            onSizeError={() => Modal.error({ title: "File is too large", content: "Upload a smaller file (max 5 MB)" })}
            classes={styles.uploadParent}
            children={(
              <>
                {imageSrc ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <img src={imageSrc} style={{ width: '240px' }} />
                  </div>
                ) : (
                  <div className={styles.uploadZone}>
                    <CloudUploadOutlined className={styles.uploadIcon} />
                    <p>Drag and drop a file here or click</p>
                  </div>
                )}
              </>
            )}
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
          {imageSrc ? (
            <div className="mt-20">
              <div className="control-upload-tabs-placeholder tw-text-center">
                <div className="input-placeholder">
                    <span className="name">
                      <span className="tw-truncate">{imageSrc}</span>
                      <DeleteFilled
                        className="icon-custom-style tw-cursor-pointer"
                        onClick={() => setImageSrc('')}
                      />
                    </span>
                </div>
                <p>
                  Upload an image for this input (max file size 20MB)
                </p>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </>
  );
};

export default DragAndDropContent;
