import {
  CloudUploadOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
  LeftOutlined, PlusCircleFilled, RightOutlined
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Collapse,
  Input, Modal,
  Row,
  Select,
  Spin, Tabs,
  Upload
} from "antd";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { RouterConstants } from "../../../../constants/router";
import FolderContentMydrive from "../../components/folderContent/FolderContentMydrive";
import { ControlUploadTabsStyle } from '../../styled/ControlUploadTabs.style';
import DragAndDrop, { TooltipDragAndDrop } from "../../tools/DragAndDrop";
import CustomCKEditorCourse from "../CustomCKEditorCourse";

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const MobileDialogLessonCreateForm = ({ dataSource, myValue, actions }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [activePanels, setActivePanels] = useState([0]);

  useEffect(() => {
    setActivePanels([myValue.dialog.length]);
  }, [myValue.dialog]);

  const reorder = (list, startIndex, endIndex) => {
    const result = JSON.parse(JSON.stringify(list));
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      myValue.dialog,
      result.source.index,
      result.destination.index
    );
    if (JSON.stringify(items) !== JSON.stringify(myValue.dialog)) {
      actions.setDialog(items);
    }
  };

  const genExtra = ({ index, id }) => (
    <div className="d-flex align-items-center">
      <div
        className="me-3 d-flex align-items-center"
        onClick={(event) => {
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: t('dashboard.modal.please_ensure_data'),
            onOKText: t('dashboard.button.save'),
            onCancelText: t('dashboard.button.cancel'),
            onOk() {
              event.stopPropagation();
              actions.deleteDialog({ index, id });
            },
          })
        }}
      >
        <DeleteFilled className="icon-custom-style" />
      </div>
      <TooltipDragAndDrop title="" />
    </div>
  );

  const handleChara = (e) => {
    actions.setNewChara({
      ...myValue.newChara,
      [e.target.name]: e.target.value,
    });
  };

  const addDialog = () => {
    let list = [...myValue.dialog];
    list.push({ name: "", line: "", audio: undefined });
    actions.setDialog(list);
    setActivePanels([list.length]);
  };

  return (
    <>
      <div className='tw-px-5 tw-pb-2 tw-sticky tw-top-[80px] tw-left-0 tw-right-0 tw-z-50 bg-theme-7'>
        <h4>Add a course</h4>
        <div className='tw-mt-2 tw-flex tw-items-center'>
          <Link href={RouterConstants.DASHBOARD_PREVIEW_COURSE.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px]'>Syllabus</a>
          </Link>
          <Link href={RouterConstants.DASHBOARD_COURSE_LESSON_DIALOGUE.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px] bg-theme-2 color-theme-7'>Dialogue</a>
          </Link>
          <Link href={RouterConstants.DASHBOARD_COURSE_LESSON_INPUT.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px]'>Input</a>
          </Link>
        </div>
      </div>

      <form onSubmit={actions.handleSubmit}>
        <div className='bg-theme-6 tw-rounded-t-[30px] tw-p-5 tw-mt-5 tw-min-h-[calc(100vh_-_175px)]'>
          <div className='tw-flex tw-items-center tw-justify-between tw-mb-4'>
            <div>
              <b>
                {step === 1 ? 'Dialogue info' : ''}
                {step === 2 ? 'Dialogue builder' : ''}
              </b>
            </div>
            <div>
              <Button
                disabled={step === 1}
                type="link"
                className='tw-flex tw-items-center tw-pr-0 color-theme-1'
                onClick={() => setStep(step - 1)}
              >
                <LeftOutlined />
                <span>Back</span>
              </Button>
            </div>
          </div>

          <Row>
            {step === 1 ? (
              <Col xs={24}>
                <div className="control-hooks-input position-relative mb-3">
                  <Select
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    size="large"
                    value={myValue.values.course}
                    placeholder="Select a course"
                    className="w-100"
                    onChange={(v) => {
                      actions.setValues({
                        ...myValue.values,
                        course: v,
                        lesson: "",
                      });
                      actions.getLessons(v, myValue.courses);
                    }}
                  >
                    {myValue.courses.map((course, index) => (
                      <Option key={index} value={course.id} label={course.title}>{course.title}</Option>
                    ))}
                  </Select>
                </div>

                <div className="control-hooks-group position-relative mb-3">
                  <Select
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    size="large"
                    value={myValue.values.lesson}
                    placeholder="Select a lesson"
                    className="w-100 custom-select"
                    onChange={(v) => {
                      actions.setValues({ ...myValue.values, lesson: v });
                      actions.loadDialog(v);
                    }}
                  >
                    {myValue.lessons.map((lesson, index) => (
                      <Option key={index} value={lesson.id} label={lesson.title}>{lesson.title}</Option>
                    ))}
                  </Select>
                </div>

                <div className="control-hooks-group position-relative mb-3">
                  <CustomCKEditorCourse
                      placeholder="In this space, outline the specific goals and objectives that learners will achieve upon completing the course. What knowledge will they have gained? What skills will they have developed? Be specific and measurable in your descriptions to give learners a clear sense of what they can expect to achieve."
                      value={myValue.values.introduction}
                      onChange={(value) => {
                        actions.setValues({
                          ...myValue.values,
                          introduction: value,
                        })
                      }}
                    />
                </div>

                <div className="control-hooks-group position-relative mb-3">
                  <CustomCKEditorCourse
                    placeholder="In this section, please provide a concise and informative overview of the course. Describe the main topics, concepts, and skills that will be covered. Aim to give potential learners a clear understanding of what the course entails and its relevance."
                    value={myValue.values.context}
                    onChange={(value) => actions.setValues({ ...myValue.values, context: value })}
                  />
                </div>

                {/* <div className="control-hooks-upload position-relative mb-3">
                  <div className="form-group">
                    <span>Lesson image <span className="error-text">*</span></span>
                    <div className="form-row mt-2">
                      <div className="mt-2">
                        {myValue.image ? (
                          <Badge
                            count="X"
                            onClick={actions.handleImageRemove}
                            className="pointer"
                          >
                            <img
                              src={myValue.image}
                              style={{ width: "100%", height: "100%" }}
                            />
                          </Badge>
                        ) : (
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            className={`section-uploader [&>.ant-upload]:!tw-mr-0 ${myValue.valuesErr.previewID ? 'section-uploader-error' : ''}`}
                            showUploadList={false}
                            beforeUpload={() => false}
                            accept="image/*"
                            onChange={(info) => {
                              actions.handleImage(info)
                              actions.setValuesErr({ ...myValue.valuesErr, previewID: false })
                            }}
                          >
                            <div className="d-flex flex-column w-100">
                              <>
                                <CloudUploadOutlined style={{ fontSize: 30 }} />
                                <span className="mt-2">
                                  Click here to upload your file
                                </span>
                              </>
                            </div>
                          </Upload>
                        )}
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="control-hooks-upload position-relative mb-3">
                  <div className="form-group">
                    <span>Lesson Introduction video <span className="error-text">*</span></span>
                    <div className="form-row mt-2">
                      <Input
                        status={myValue.valuesErr.previewVideoID ? 'error' : ''}
                        size="medium"
                        placeholder="Video url or embed code"
                        name="video"
                        onChange={(e) => actions.handleChangeMedia(e)}
                      />
                      <div className="mt-3">
                        {myValue.video ? (
                          <Badge
                            count="X"
                            onClick={actions.handleVideoRemove}
                            className="pointer w-100"
                          >
                            <div className="d-flex flex-column w-100">
                              <ReactPlayer
                                url={myValue.video}
                                width="100%"
                                height="250px"
                                controls
                                config={{
                                  file: {
                                    attributes: {
                                      controlsList: 'nodownload',
                                    }
                                  }
                                }}
                              />
                            </div>
                          </Badge>
                        ) : (
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            className={`section-uploader [&>.ant-upload]:!tw-mr-0 ${myValue.valuesErr.previewVideoID ? 'section-uploader-error' : ''}`}
                            showUploadList={false}
                            beforeUpload={() => false}
                            accept="video/*"
                            onChange={(info) => {
                              actions.handleVideo(info)
                              actions.setValuesErr({ ...myValue.valuesErr, previewVideoID: false })
                            }}
                          >
                            <div className="d-flex flex-column w-100">
                              <>
                                <CloudUploadOutlined style={{ fontSize: 30 }} />
                                <span className="mt-2">
                                  Click here to upload your file
                                </span>
                              </>
                            </div>
                          </Upload>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ) : null}

            {step === 2 ? (
              <div className='mb-4 tw-w-full'>
                <DragAndDrop sourceState={myValue.dialog} onDragEnd={onDragEnd}>
                  {({ index, item }) => (
                    <>
                      <Collapse
                        expandIconPosition={"left"}
                        className="bg-theme-7 mb-3"
                        defaultActiveKey={[myValue.dialog.length]}
                        activeKey={activePanels}
                        onChange={(key) => setActivePanels(key)}
                      >
                        <Panel
                          header={myValue && myValue.characters && myValue.characters.filter((s) => s.id === item.characterId)?.length ? myValue.characters.filter((s) => s.id === item.characterId)[0].name : ''}
                          key={index + 1}
                          extra={genExtra({ index, id: item.id })}
                        >
                          <Row>
                            <Col xs={24}>
                              <div className="control-hooks-select position-relative">
                                <Select
                                  placeholder="Select or create a character"
                                  value={item.characterId}
                                  onChange={(value) => {
                                    actions.setDialogChara({ index, value })
                                  }}
                                  tokenSeparators={[,]}
                                  size="large"
                                  className="w-100"
                                >
                                  {myValue &&
                                    myValue.characters &&
                                    myValue.characters.map((chara, idx) => (
                                      <Option key={idx} value={chara.id}>
                                        {chara.name}
                                      </Option>
                                    ))}
                                </Select>
                                <a
                                  className="btn"
                                  onClick={() => {
                                    actions.setVisibleCharacter(true);
                                    actions.setNewChara({ index: index });
                                  }}
                                >
                                  <PlusCircleFilled className="icon-custom-style icon-circle-add" />
                                </a>
                              </div>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col xs={24}>
                              <div className="dialog-line d-flex align-items-center justify-content-between">
                                <Input
                                  placeholder="Dialogue line"
                                  value={item.line}
                                  onChange={({ target: { value } }) =>
                                    actions.setDialogLine({ index, value })
                                  }
                                />
                                {item.audio ? (
                                  <div
                                    className="me-2 d-flex align-items-center"
                                    onClick={(event) => {
                                      Modal.confirm({
                                        icon: <ExclamationCircleOutlined />,
                                        content: t('dashboard.modal.please_ensure_data'),
                                        onOKText: t('dashboard.button.save'),
                                        onCancelText: t('dashboard.button.cancel'),
                                        onOk() {
                                          event.stopPropagation();
                                          actions.handleRemoveAudio({ index });
                                        },
                                      })
                                    }}
                                  >
                                    <DeleteFilled className="icon-custom-style" />
                                  </div>
                                ) : null}
                                <div
                                    className="me-3 d-flex align-items-center text-nowrap"
                                    onClick={() => {
                                        actions.setNewChara({ index: index });
                                        actions.setVisibleAddAudio(true);
                                      }
                                    }
                                >
                                    <PlusCircleFilled className="dialog-line-add" />
                                    <span className="ms-2">Add media</span>
                                </div>
                                {/*<Upload
                                  disabled={item.audio}
                                  maxCount={1}
                                  showUploadList={false}
                                  accept="audio/*"
                                  beforeUpload={() => false}
                                  onChange={({ fileList }) =>
                                    actions.handleAudio({ fileList, index })
                                  }
                                >
                                  <div
                                    className="me-3 d-flex align-items-center text-nowrap"
                                                                      onClick={() => console.log()}
                                    //() => actions.setVisibleAddAudio(false)
                                  >
                                    <PlusCircleFilled className="dialog-line-add" />
                                    <span className="ms-2">Add media</span>
                                  </div>
                                </Upload>*/}
                              </div>
                              {item.audio && (
                                <div className="dialog-line d-flex align-items-center justify-content-between">
                                  <audio
                                    src={item.audio}
                                    controls
                                  ></audio>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </Panel>
                      </Collapse>
                    </>
                  )}
                </DragAndDrop>

                <div
                  className="d-flex align-items-center mt-3 new-section"
                  style={{ cursor: "pointer", textAlign: "center" }}
                  onClick={() => addDialog()}
                >
                  <PlusCircleFilled
                    className="icon-circle-add"
                    style={{ color: "#25A5AA" }}
                  />
                  <span className="ms-2">Add to dialogue</span>
                </div>
              </div>
            ) : null}

            <div className='tw-flex tw-justify-between tw-w-full'>
              <Button
                type="link"
                size="large"
                htmlType="submit"
                onClick={(e) => {
                  e.preventDefault();
                  actions.handleSubmit(e);
                }}
                loading={myValue.uploading}
                disabled={myValue.loadingSpinning || myValue.uploading}
                className='tw-pl-0 color-theme-2'
              >
                {myValue.loadingSpinning ? "Saving..." : "Save"}
              </Button>

              <div className='tw-space-y-6 tw-flex tw-flex-col tw-items-end'>
                <Button
                  type="primary"
                  size="large"
                  htmlType="button"
                  disabled={step === 2}
                  className='bg-theme-2 border-theme-2 tw-px-10 tw-flex tw-items-center tw-justify-center'
                  onClick={() => setStep(step + 1)}
                >
                  <span>Next</span>
                  <RightOutlined />
                </Button>
              </div>
            </div>
          </Row>
        </div>
      </form>

      <Modal
        title="Create a new character"
        centered
        visible={myValue.visibleCharacter}
        onCancel={() => actions.setVisibleCharacter(false)}
        footer={null}
      >
        <div
          className="col-sm focus-visible"
          style={{ marginTop: -15 }}
          contentEditable="true"
          spellCheck={false}
          suppressContentEditableWarning={true}
        >
          <Row>
            <Col xs={24}>
              <Input
                placeholder="Name of the character"
                name="name"
                value={myValue.newChara.name}
                onChange={(v) => handleChara(v)}
              />
            </Col>
          </Row>
          <Row gutter={[8, 0]} className="mt-2">
            <Col xs={8}>
              <Input
                placeholder="Age"
                name="age"
                value={myValue.newChara.age}
                onChange={(v) => handleChara(v)}
              />
            </Col>
            <Col xs={8}>
              <Select
                placeholder="Gender"
                value={myValue.newChara.gender}
                onChange={(v) =>
                  actions.setNewChara({ ...myValue.newChara, gender: v })
                }
                className="w-100"
              >
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Col>
            <Col xs={8}>
              <Input
                placeholder="Occupation"
                name="occupation"
                value={myValue.newChara.occupation}
                onChange={(v) => handleChara(v)}
              />
            </Col>
          </Row>
          <Button
            type="primary"
            size="large"
            style={{
              border: "none",
              width: 200,
              marginTop: 15,
            }}
            className="w-100 bg-theme-5"
            onClick={actions.addCharacter}
          >
            Add Character
          </Button>
        </div>
      </Modal>

      <Modal
        title="Add audio"
        centered
        visible={myValue.visibleAddAudio}
        onCancel={() => {
          actions.setVisibleAddAudio(false)
          actions.setNewChara({
            ...myValue.newChara,
            index: undefined
          });
        }}
        footer={null}
      >
        <style jsx global>{ControlUploadTabsStyle}</style>
        <Tabs className="control-upload-tabs" type="card">
          <TabPane tab="From my computer" key="1">
            <div className="d-flex flex-column align-items-center justify-content-center">
              {myValue?.newChara?.index >= 0 && myValue.dialog[myValue?.newChara?.index].audio && (myValue.uploading === false || !myValue.uploading) ? (
                <div className="d-flex align-items-center justify-content-between">
                  <audio
                    src={myValue.dialog[myValue?.newChara?.index].audio}
                    controls
                  ></audio>
                </div>
              ) : null}

              <Upload
                className='control-upload-tabs-upload'
                showUploadList={false}
                accept="audio/*"
                beforeUpload={() => false}
                onChange={({ fileList }) =>
                  actions.handleAudio({ fileList })
                }
              >
                <div className="mt-20">
                  {myValue.uploading ? <Spin /> : (
                    <div className="control-upload-tabs-placeholder">
                      <div className="input-placeholder">
                        {myValue?.newChara?.index >= 0 && myValue.dialog[myValue?.newChara?.index].audio && (myValue.uploading === false || !myValue.uploading) ? (
                          <span className="name">{myValue.dialog[myValue?.newChara?.index].audio_name}</span>
                        ) : (
                          <>
                            <div>Choose file</div>
                            <span>No file chosen</span>
                          </>
                        )}
                      </div>
                      <p>
                        Upload audio of this dialogue line (max file size 20MB)
                      </p>
                    </div>
                  )}
                </div>
              </Upload>
            </div>
          </TabPane>
          <TabPane tab="From Mydrive" key="2">
            <div className="d-flex flex-column align-items-center justify-content-center mb-20">
              {myValue?.newChara?.index >= 0 && myValue.dialog[myValue?.newChara?.index].audio && (myValue.uploading === false || !myValue.uploading) ? (
                <div className="d-flex align-items-center justify-content-between">
                  <audio
                    src={myValue.dialog[myValue?.newChara?.index].audio}
                    controls
                  ></audio>
                </div>
              ) : null}
            </div>

            <FolderContentMydrive fileType='Audio' onSave={actions.handleAudioMydrive}/>
          </TabPane>
          <TabPane tab="From AI Library" key="3">
            <div className="d-flex flex-column align-items-center justify-content-center mb-20">
              {myValue?.newChara?.index >= 0 && myValue.dialog[myValue?.newChara?.index].audio && (myValue.uploading === false || !myValue.uploading) ? (
                <div className="d-flex align-items-center justify-content-between">
                  <audio
                    src={myValue.dialog[myValue?.newChara?.index].audio}
                    controls
                  ></audio>
                </div>
              ) : null}
            </div>

            <Select
              placeholder="Language"
              onChange={(v) => {
                actions.loadVoiceList(v);
              }}
              className="w-100 mb-15"
            >
              {dataSource.voiceLanList.map((language) => (
                <Option key={language.code} value={language.code}>{language.language}</Option>
              ))}
            </Select>
            <Select
              placeholder="Voice"
              value={myValue.newChara.voice}
              onChange={(v) => {
                console.log(dataSource.voiceList[v]);
                actions.setNewChara({
                  ...myValue.newChara,
                  voice: dataSource.voiceList[v].Id,
                  languageCode: dataSource.voiceList[v].LanguageCode,
                  engine: dataSource.voiceList[v].SupportedEngines[0]
                })
              }}
              className="w-100 mb-15"
            >
              {dataSource.voiceList.map((voice, idx) => (
                <Option key={idx} value={idx} >{voice.Name + ' ('+voice.Gender+')'}</Option>
              ))}
            </Select>

            {myValue.newChara.voice !== '' && (
              <Button
                className="generate-audio"
                onClick={() => {
                  actions.generateAIAudio(myValue.newChara, myValue.newChara.index)
                }}
              >
                Generate Audio
              </Button> 
            )}
          </TabPane>
        </Tabs>

        <Button
          className="control-upload-tabs-btn"
					type='primary'
					shape='round'
          onClick={() => {
            actions.setVisibleAddAudio(false)
            actions.setNewChara({
              ...myValue.newChara,
              index: undefined
            });
          }}
        >
          Save & proceed
        </Button>
      </Modal>
    </>
  );
};

export default MobileDialogLessonCreateForm;
