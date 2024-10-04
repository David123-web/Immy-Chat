import { CloseCircleFilled, CloudUploadOutlined, DeleteFilled, ExclamationCircleOutlined, EyeOutlined, LeftOutlined, PlusCircleFilled, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Collapse, Input, Modal, Row, Select, Upload } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { RouterConstants } from '../../../../constants/router';
import { useMobXStores } from "../../../../src/stores";
import NewCourseDetailsWrapper from '../../../CourseDetails/NewCourseDetailsWrapper';
import AssignTutors from '../../components/assignTutors/AssignTutors';
import DragAndDrop, { TooltipDragAndDrop } from '../../tools/DragAndDrop';
import CustomCKEditorCourse from '../CustomCKEditorCourse';

const { Option } = Select;
const { Panel } = Collapse;

const MobileCourseCreateForm = ({handleSubmit, handleImage, values, setValues, preview, previewVideo,
  handleImageRemove, handleVideo, handleVideoRemove, uploading, renderInput, 
  addLessonTitle, updateLessonTitle, deleteLessonTitle, addSectionTitle, deleteSectionTitle,
  lessons, setLessons, languages, handleChangeMedia,
  levels, user, tags, allInstructors, previewCourse, setPreviewCourse, loadingSpinning,
  valuesErr, setValuesErr, tutors, setValueTutorIds, courses, getCourse, isEdit
}) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const {userStore} = useMobXStores()

  const reorder = (list, startIndex, endIndex) => {
    const result = JSON.parse(JSON.stringify(list))
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const items = reorder(lessons, result.source.index, result.destination.index)
    if (JSON.stringify(items) !== JSON.stringify(lessons)) {
      setLessons(items)
    }
  }

  const onDragEndSubItem = (result, index) => {
    if (!result.destination) {
      return
    }

    const cloneData = JSON.parse(JSON.stringify(lessons))
    const items = reorder(cloneData[index].lessons, result.source.index, result.destination.index)
    if (JSON.stringify(items) !== JSON.stringify(cloneData[index].lessons)) {
      cloneData[index].lessons = items
      setLessons(cloneData)
    }
  }

  const genExtra = (item, index) => (
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
              event.stopPropagation()
              deleteSectionTitle(item, index)
            },
          })
        }}
      >
        <DeleteFilled className="icon-custom-style" />
      </div>
      <TooltipDragAndDrop title="" />
    </div>
  )
  
  return (
    <>
      <div className='tw-px-5 tw-pb-2 tw-sticky tw-top-[80px] tw-left-0 tw-right-0 tw-z-50 bg-theme-7'>
        <h4>Add a course</h4>
        <div className='tw-mt-2 tw-flex tw-items-center'>
          <Link href={RouterConstants.DASHBOARD_PREVIEW_COURSE.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px] bg-theme-2 color-theme-7'>Syllabus</a>
          </Link>
          <Link href={RouterConstants.DASHBOARD_COURSE_LESSON_DIALOGUE.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px]'>Dialogue</a>
          </Link>
          <Link href={RouterConstants.DASHBOARD_COURSE_LESSON_INPUT.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px]'>Input</a>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='bg-theme-6 tw-rounded-t-[30px] tw-p-5 tw-mt-5 tw-min-h-[calc(100vh_-_175px)]'>
          <div className='tw-flex tw-items-center tw-justify-between tw-mb-4'>
            <div>
              <b>
                {step === 1 ? 'Course info' : ''}
                {step === 2 ? 'Lesson List' : ''}
                {step === 3 ? 'Tutors' : ''}
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
                {isEdit ? (
                  <div className="control-hooks-input position-relative mb-3">
                    <Select
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      size="large"
                      placeholder="Select a course"
                      className="w-100"
                      onChange={(v) => {
                        getCourse(v);
                      }}
                    >
                      {courses.map((course, index) => (
                        <Option key={index} value={course.id} label={course.title}>{course.title}</Option>
                      ))}
                    </Select>
                  </div>
                ) : (
                  <div className="control-hooks-select position-relative mb-3">
                    <Input
                      size='large'
                      defaultValue={values.title}
                      name='title'
                      value={values.title}
                      placeholder='Your course title here...'
                      onChange={({ target: { value } }) => setValues({ ...values, title: value })}
                    />
                  </div>
                )}

                <div className="control-hooks-select position-relative mb-3">
                  {/* Course tags */}
                  <Select
                    mode='multiple'
                    placeholder="Course tags"
                    defaultValue={values.tags}
                    value={values.tags}
                    onChange={(v) => setValues({ ...values, tags: v })}
                    tokenSeparators={[,]}
                    size='large'
                    className='w-100'
                  >
                    {tags && tags.map((tag, index) => {
                      return(
                        <Option key={index} value={tag.id}>{tag.name}</Option>
                      )}
                    )}
                  </Select>
                </div>

                <div className="control-hooks-select position-relative mb-3">
                  <Select
                    placeholder="Course Premium Status*"
                    required
                    defaultValue={true}
                    value={values.isFree}
                    onChange={(v) => {
                      setValues({ ...values, isFree: v })
                      setValuesErr({ ...valuesErr, isFree: false })
                    }}
                    size='large'
                    className='w-100'
                    status={valuesErr.isFree ? 'error' : ''}
                  >
                    <Option value={true}>Free</Option>
                    <Option value={false}>Premium</Option>
                  </Select>
                </div>

                <div className="control-hooks-select position-relative mb-3">
                  <Select
                    placeholder="Choose Language*"
                    required
                    defaultValue={values.language}
                    value={values.language}
                    onChange={(v) => {
                      setValues({ ...values, language: v })
                      setValuesErr({ ...valuesErr, language: false })
                    }}
                    tokenSeparators={[,]}
                    size='large'
                    className='w-100'
                    status={valuesErr.language ? 'error' : ''}
                  >
                    {languages && languages.map((language, index) => {
                      return (
                        <Option key={index} value={language.id}>{language.name}</Option>
                      )}
                    )}
                  </Select>
                </div>

                <div className="control-hooks-select position-relative mb-3">
                  <Select
                    placeholder="Choose level*"
                    required
                    defaultValue={values.level}
                    value={values.level}
                    onChange={(v) => {
                      setValues({ ...values, level: v })
                      setValuesErr({ ...valuesErr, level: false })
                    }}
                    tokenSeparators={[,]}
                    size='large'
                    className='w-100'
                    status={valuesErr.level ? 'error' : ''}
                  >
                    {levels && levels.map((level, index) => {
                      return (
                        <Option key={index} value={level.id}>{level.name}</Option>
                      )}
                    )}
                  </Select>
                </div>

                <div className="control-hooks-select position-relative mb-3">
                  <Select
                    mode='multiple'
                    required
                    size='large'
                    value={!!values.coInstructors?.find((item) => item.profile.instructorId === userStore.currentUser?.profile?.instructorId) ? [] : values.coAuthor}
                    status={valuesErr.coAuthor ? "error" : ""}
                    defaultValue={values.coAuthor || []}
                    className="w-100"
                    onChange={(v) => {
                      setValues({ ...values, coAuthor: v })
                      setValuesErr({ ...valuesErr, coAuthor: '' })
                    }}
                    disabled={!!values.coInstructors?.find((item) => item.profile.instructorId === userStore.currentUser?.profile?.instructorId)}
                    placeholder={values.coInstructors?.find((item) => item.profile.instructorId === userStore.currentUser?.profile?.instructorId) ? 'Your are co-instructor' : 'Invite co-instructor'}
                  >
                    {allInstructors.filter((data) => data.profile?.instructorId !== userStore.currentUser?.profile?.instructorId).map((item, index) => (
                      <Option key={index} value={item.id}>{item?.profile?.firstName + ' ' + item?.profile?.lastName}</Option>
                    ))}
                  </Select>
                  {valuesErr.coAuthor ? <span style={{ color: 'red' }}>{valuesErr.coAuthor}</span> : null}
                </div>

                <div className="control-hooks-select position-relative mb-3">
                  <CustomCKEditorCourse
                    placeholder="In this section, please provide a concise and informative overview of the course. Describe the main topics, concepts, and skills that will be covered. Aim to give potential learners a clear understanding of what the course entails and its relevance."
                    value={values.description}
                    onChange={(value) => setValues({ ...values, description: value })}
                  />
                </div>

                <div className="control-hooks-select position-relative mb-3">
                  <CustomCKEditorCourse
                    placeholder="In this space, outline the specific goals and objectives that learners will achieve upon completing the course. What knowledge will they have gained? What skills will they have developed? Be specific and measurable in your descriptions to give learners a clear sense of what they can expect to achieve."
                    value={values.learningOutcome}
                    onChange={(value) => setValues({ ...values, learningOutcome: value })}
                  />
                </div>

                <div className="control-hooks-select position-relative mb-3">
                  <CustomCKEditorCourse
                    placeholder="Use this area to list any prerequisites or requirements for enrolling in the course. These could include prior knowledge, skills, materials, or tools that learners should possess or be familiar with before starting the course. Providing accurate requirements will help learners determine if the course is suitable for their level of expertise."
                    value={values.requirement}
                    onChange={(value) => setValues({ ...values, requirement: value })}
                  />
                </div>

                <div className="control-hooks-upload position-relative mb-3">
                  <div className='form-group'>
                    <span>Course image <span className="error-text">*</span></span>
                    <div className='form-row mt-2'>
                      <div className='mt-2'>
                        { preview ? (
                            <Badge count='X' onClick={handleImageRemove} className='pointer'>
                              <img src={preview} style={{ width: '100%', height: '100%' }} />
                            </Badge>
                          ) : (
                            <Upload
                              status="error"
                              name="avatar"
                              listType="picture-card"
                              className={`section-uploader [&>.ant-upload]:!tw-mr-0 ${valuesErr.previewID ? 'section-uploader-error' : ''}`}
                              showUploadList={false}
                              accept="image/*"
                              beforeUpload={() => false}
                              onChange={(info) => {
                                handleImage(info)
                                setValuesErr({ ...valuesErr, previewID: false })
                              }}>
                                <div className="d-flex flex-column w-100">
                                  <CloudUploadOutlined style={{ fontSize: 30 }} />
                                  <span className="mt-2 d-bl">Click here to upload your file</span>
                                </div>
                            </Upload>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="control-hooks-upload position-relative mb-3">
                  <div className='form-group'>
                    <span>Course Introduction video <span className="error-text">*</span></span>
                    <div className='form-row mt-2'>
                      <Input
                        status={valuesErr.previewVideoID ? 'error' : ''}
                        size="medium"
                        placeholder="Video url or embed code"
                        name='video'
                        onChange={(e)=>{handleChangeMedia(e)}}
                      />
                      <div className='mt-3'>
                        { previewVideo ? (
                          <Badge count='X' onClick={handleVideoRemove} className='pointer w-100'>
                            <div className="d-flex flex-column w-100">
                              <ReactPlayer
                                url={previewVideo}
                                width='100%'
                                height='250px'
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
                            className={`section-uploader [&>.ant-upload]:!tw-mr-0 ${valuesErr.previewVideoID ? 'section-uploader-error' : ''}`}
                            showUploadList={false}
                            beforeUpload={() => false}
                            accept="video/*"
                            onChange={(info) => {
                              handleVideo(info)
                              setValuesErr({ ...valuesErr, previewVideoID: false })
                            }}>
                              <div className="d-flex flex-column w-100">
                                <CloudUploadOutlined style={{ fontSize: 30 }} />
                                <span className="mt-2">Click here to upload your file</span>
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
                <DragAndDrop
                  sourceState={lessons}
                  onDragEnd={onDragEnd}>
                  {({ index, item }) => (
                    <>
                      <Collapse expandIconPosition={'left'} className="bg-theme-7 mb-3" defaultActiveKey={['1']}>
                        <Panel header={item.section || `Section ${index + 1}`} key="1" extra={genExtra(item, index)}>
                          <div className="col-sm focus-visible" contentEditable="true" spellCheck={false} suppressContentEditableWarning={true}>
                            <div className='section-input-not-required tw-mb-4'>
                              <Input
                                defaultValue={item.section}
                                onChange={({ target: { value } }) => addSectionTitle({ index, value })}
                                placeholder="Section title (not required)"
                              />
                            </div>

                            <DragAndDrop
                              sourceState={item.lessons || []}
                              onDragEnd={(result) => onDragEndSubItem(result, index)}>
                              {({ index: subIndex, item: subItem }) => (
                                <div className="d-flex align-items-center mb-2" style={{ backgroundColor: '#ebebeb', padding: '6px 12px', borderRadius: '2px' }}>
                                  <TooltipDragAndDrop title="" />
                                  <div contentEditable="true" spellCheck={false} suppressContentEditableWarning={true} className="focus-visible flex-fill ms-3">
                                    <div className="d-flex align-items-center">
                                      <div className="circle-lesson" />
                                      <div className="flex-fill">
                                        <Input
                                          placeholder="Lesson title"
                                          value={subItem.title}
                                          onChange={(e) => updateLessonTitle(e, index, subIndex)}
                                          style={{ border: '0 none', backgroundColor: 'transparent' }}
                                        />
                                      </div>
                                      <div className='d-flex'>
                                        <div className="me-3 d-flex align-items-center">
                                        </div>
                                        <div className="d-flex align-items-center" onClick={() => {
                                          Modal.confirm({
                                            icon: <ExclamationCircleOutlined />,
                                            content: t('dashboard.modal.please_ensure_data'),
                                            onOKText: t('dashboard.button.save'),
                                            onCancelText: t('dashboard.button.cancel'),
                                            onOk() {
                                              deleteLessonTitle({ index, subIndex, id: subItem.id })
                                            },
                                          })
                                        }}>
                                          <DeleteFilled className="icon-custom-style" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DragAndDrop>

                            <div className='form-group add-lesson tw-mt-4'>
                              <Input
                                size="large"
                                placeholder="Enter Lesson title"
                                suffix={<PlusOutlined />}
                                onKeyDown={(e) => (e.keyCode == 13 ? addLessonTitle(e, index) :'')}
                              />
                            </div>
                          </div> 
                        </Panel>
                      </Collapse>
                    </>
                  )}
                </DragAndDrop>

                <div className='d-flex align-items-center mt-3 ant-input ant-input-lg' onClick={renderInput} style={{ cursor: 'pointer' }}>
                  <PlusCircleFilled className="icon-circle-add icon-custom-style" />
                  <span className="ms-2">NEW SECTION</span>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className='mb-4 tw-w-full'>
                <AssignTutors initialList={tutors} setValueTutorIds={setValueTutorIds}/>
              </div>
            ) : null}

            <div className='tw-flex tw-justify-between tw-w-full'>
              <Button type="link" size="large" htmlType="submit" loading={uploading} disabled={loadingSpinning || uploading} className='tw-pl-0 color-theme-2'>
                {loadingSpinning ? "Saving..." : "Save"}
              </Button>

              <div className='tw-space-y-6 tw-flex tw-flex-col tw-items-end'>
                <Button
                  type="primary"
                  size="large"
                  htmlType="button"
                  disabled={step === 3}
                  className='bg-theme-2 border-theme-2 tw-px-10 tw-flex tw-items-center'
                  onClick={() => setStep(step + 1)}
                >
                  <span>Next</span>
                  <RightOutlined />
                </Button>

                <Button
                  type="link"
                  size="large"
                  htmlType="button"
                  className='tw-pr-0 color-theme-2 tw-flex tw-items-center'
                  onClick={() => setPreviewCourse('desktop')}
                >
                  <EyeOutlined />
                  <span>Preview</span>
                </Button>
              </div>
            </div>

            {previewCourse === 'desktop' ? (
              <>
                <div style={{ position: 'fixed', top: 60,left: 0, zIndex: 100, right: 0, 'overflow-y': 'auto', height: '100vh', background: 'white' }}>
                  <NewCourseDetailsWrapper
                    isPreviewAdmin
                    dataSource={{ allInstructors, languages, levels, tags }}
                    values={{ ...values, fieldMedia: { previewVideo: previewVideo }, sections: lessons }}
                  />
                </div>
                <span
                  onClick={() => setPreviewCourse('')}
                  style={{ position: 'fixed', top: 90,left: 30, zIndex: 2223, color: '#A0A0A0', fontSize: 30, cursor: 'pointer' }}
                >
                  <CloseCircleFilled />
                </span>
              </>
            ) : null}
          </Row>
        </div>
      </form>
    </>
  )
}

export default MobileCourseCreateForm