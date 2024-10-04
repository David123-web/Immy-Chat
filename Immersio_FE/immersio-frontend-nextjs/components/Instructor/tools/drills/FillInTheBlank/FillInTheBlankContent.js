import { CloseCircleFilled, CloudUploadOutlined, DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import styles from "./FillInTheBlank.module.css";
const fileTypes = ["MP3", "WAV", "MP4"];

const FillInTheBlankContent = ({
  index,
  audios,
  setAudios,
  oldAudios,
}) => {
  const audioDiv = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [audioSrc, setAudioSrc] = useState(audios[index] || "");

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    let tempCopy = audios;
    tempCopy[index] = oldAudios[index];
    setAudios(tempCopy);
  };

  // load new audio source on upload
  const handleChange = (file) => {
    let tempCopy = audios;
    tempCopy[index] = file;

    setAudios(tempCopy);
    setAudioSrc(
      typeof (file) === "string"
        ? file
        : URL.createObjectURL(file)
    );

    if (document.querySelector("#player" + index)) {
      document.querySelector("#player" + index).src = typeof (file) === "string" ? file : URL.createObjectURL(
        file
      );
    }
  };

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

    // load audio on mount, if one is already saved
    useEffect(() => {
      if (audios && audios[index]) {
        setAudioSrc(audios[index]);
      }
    }, []);

  return (
    <>
      <div className={styles.mediaWrapper} onClick={showModal}>
        {/* {audios[index] ? <SoundFilled className={styles.iconStyle} /> : null} */}
        <PlusCircleFilled className={styles.iconStyle} />
        <p className={styles.mediaButton}>Add media</p>
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
          onTypeError={() => Modal.error({ title: "This file type is not accepted", content: "Upload a mp3/wav file" })}
          onSizeError={() => Modal.error({ title: "File is too large", content: "Upload a smaller file (max 5 MB)" })}
          classes={styles.uploadParent}
          children={(
            <>
              {audioSrc ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div
                    id={"audioPreview" + index}
                    className={styles.audioDiv}
                    ref={audioDiv}
                  >
                    <audio
                      src={audioSrc}
                      controls
                      id={"player" + index}
                    />
                  </div>
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
        {audioSrc ? (
          <div className="mt-20">
            <div className="control-upload-tabs-placeholder tw-text-center">
              <div className="input-placeholder">
                  <span className="name">
                    <span className="tw-truncate">Audio Name</span>
                    <DeleteFilled className="icon-custom-style cur-pointer pointer" />
                  </span>
              </div>
              <p>
                Upload an audio for this input (max file size 20MB)
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default FillInTheBlankContent;
