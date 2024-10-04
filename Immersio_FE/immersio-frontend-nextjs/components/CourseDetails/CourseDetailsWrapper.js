import DetailsTabItems from './DetailsTabItems';
import moment from 'moment';
import ReactPlayer from 'react-player';
import { Button } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import ModalPreviewLesson from './ModalPreviewLesson';
import { RouterConstants } from '../../constants/router';
import Link from 'next/link';
const CourseDetailsWrapper = ({
  dataSource = { allInstructors: [], languages: [], levels: [], tags: [] }, courseData,
  isPreviewAdmin = false,
  user, handleShow, paymentInformation, addToCart, onOpenModal
}) => {
  const {query} = useRouter()

  const [isShowPreviewLesson, setIsShowPreviewLesson] = useState(false)
  const filterCoAuthor = dataSource.allInstructors.filter((session) => session?.id === (courseData?.coAuthor || courseData?.instructorId))
  const filterLevel = (dataSource?.levels || []).filter((s) => s?.id?.toString() === courseData?.level?.toString())
  const filterLanguage = (dataSource?.languages || []).filter((s) => s?.id?.toString() === courseData?.language?.toString())
  let totalLessons = 0
  if (courseData?.sections?.length) {
    for (let i = 0; i <= courseData.sections.length - 1; i++) {
      const getField = courseData.sections[i]
      totalLessons += getField?.lessons?.length
    }
  }
  let arrTags = []
  if (courseData?.tags?.length) {
    for (let i = 0; i <= courseData.tags.length - 1; i++) {
      const getField = courseData.tags[i]
      const filter = dataSource.tags.filter((session) => session.id === getField)
      if (filter?.length) {
        arrTags.push(filter[0].name)
      }
    }
  }

  return (
    <>
      <style jsx global>{`
        .max-h-100-vh {
          max-height: 100vh;
        }
      `}</style>
      {isShowPreviewLesson && isPreviewAdmin && query.course_id && query.lesson_id && <ModalPreviewLesson setIsShowPreviewLesson={setIsShowPreviewLesson} />}
      <section className={`course course-details-section ${isShowPreviewLesson && isPreviewAdmin && query.course_id && query.lesson_id ? 'overflow-hidden max-h-100-vh' : ''}`}>
        <div className="course-details-top-info">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-12 d-flex d-flex-mobile">
                <div className="course__banner-left col-xs-12 col-md-8  pr-20">
                  <span className='course_detail_title'>{courseData.title || 'Greetings and Introduction'}</span><br />
                  <span className='course_detail__sub_title' dangerouslySetInnerHTML={{ __html: courseData?.description }} />
                  <div className="course_detail__top_info d-sm-flex align-items-center">
                    <div className="course__teacher-3 d-flex align-items-center mr-70">
                      <div className="course__teacher-thumb-3 mr-15">
                        <img src={courseData?.userArray?.avatar ? courseData?.userArray?.avatar : "/assets/img/open-speak/no-image.jpg"} alt="" />
                      </div>
                      <div className="course__teacher-info-3">
                        <h5>Instructor</h5>
                        {filterCoAuthor?.length ? (
                          <p><a href="#">{filterCoAuthor[0].profile?.firstName + ' ' + filterCoAuthor[0].profile?.lastName}</a></p>
                        ) : null}
                      </div>
                    </div>
                    {courseData?.updatedAt ? (
                      <div className="course__update mr-80">
                        <h5>Last Update:</h5>
                        <p>{moment(new Date(courseData?.updatedAt)).format('MMMM Do YYYY, HH:mm')}</p>
                      </div>
                    ) : null}
                    <div className="course__rating-2">
                      <h5>Review:</h5>
                      <div className="course__rating-inner d-flex align-items-center">
                        <ul>
                          <li><a href="#"><i className="fa-solid fa-star color-star-rating"></i></a></li>
                          <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                          <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                          <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                          <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                        </ul>
                        <p>5.0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {courseData?.previewVideo ? (
                  <div className="col-xs-12 col-md-4">
                    <ReactPlayer
                      url={courseData?.previewVideo}
                      width='100%'
                      height='500px'
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
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <section className="course__area tw-pt-[30px] md:tw-pt-[60px] pb-80 tw-max-w-[1320px] tw-mx-auto">
          <div className="container tw-px-5 md:tw-px-[12px]">
            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-8">
                <div className="course__wrapper">
                  <DetailsTabItems isPreviewAdmin={isPreviewAdmin} setIsShowPreviewLesson={setIsShowPreviewLesson} dataSource={dataSource} dynamicPage={true} data={courseData} />
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-4">
                <div className="course__sidebar pl-10 p-relative">
                  <div className="course__shape">
                    <img className="course-dot" src={"/" + "assets/img/course/course-dot.png"} alt="" />
                  </div>
                  <div className="course__sidebar-widget-2 bg-theme-7 mb-20">
                    <div className="course__video">
                      <Button disabled={isPreviewAdmin} className='w-100 start__now_btn'>
                        Start Now
                      </Button>
                      <Link href={RouterConstants.DASHBOARD_HOME.path}>
                        <Button disabled={isPreviewAdmin} className='w-100 try__different__btn'>
                          TRY A DIFFERENT COURSE
                        </Button>
                      </Link>

                      {/* <div className="course__enroll-btn">
                      {
                        user?.email && !(paymentInformation?.status === 1) ? <button onClick={handleShow} type="button" className="tp-btn w-100 text-center">Enroll
                          <i className="far fa-arrow-right ms-3"></i>
                        </button> : (paymentInformation?.status === 1) ? <button type="button" className="tp-btn w-100 text-center">
                          Already Enrolled </button>
                          : <Link href="/login">
                            <a>
                              <button type="button" className="tp-btn w-100 text-center">Login To Buy
                                <i className="far fa-arrow-right ms-3"></i>
                              </button>
                            </a>
                          </Link>
                      }
                    </div> */}

                      {/* <button onClick={() => addToCart(courseData)} type="button" className="tp-btn w-100 text-center my-3">Add To Cart <i className="fa-solid fa-cart-shopping ms-3"></i> </button> */}

                      <div className="course__video-content mt-15">
                        <div className="course__rating-3">
                          <ul>
                            <li><a href="#"><i className="fa-solid fa-star color-star-rating"></i></a></li>
                            <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                            <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                            <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                            <li><a href="#"><i className="fa-solid fa-star color-star-rating ml-1"></i></a></li>
                          </ul>
                          <p className='count__label_enrolled'>245 enrolled</p>
                        </div>
                        <ul>
                          {filterCoAuthor?.length ? (
                            <li className="d-flex align-items-center">
                              <div className="course__video-info">
                                <span>Created by: </span><b>{filterCoAuthor[0].profile?.firstName + ' ' + filterCoAuthor[0].profile?.lastName}</b>
                              </div>
                            </li>
                          ) : null}
                          {totalLessons ? (
                            <li className="d-flex align-items-center">
                              <div className="course__video-info">
                                <span>Lessons: </span><b>{totalLessons}</b>
                              </div>
                            </li>
                          ) : null}
                          {arrTags?.length ? (
                            <li className="d-flex align-items-center">
                              <div className="course__video-info">
                                <span>Tags: </span><b>{(arrTags || []).map((name) => name).join(', ')}</b>
                              </div>
                            </li>
                          ) : null}
                          {filterLevel?.length ? (
                            <li className="d-flex align-items-center">
                              <div className="course__video-info">
                                <span>Level: </span><b>{filterLevel.length ? filterLevel[0].name : undefined}</b>
                              </div>
                            </li>
                          ) : null}
                          {filterLanguage?.length ? (
                            <li className="d-flex align-items-center">
                              <div className="course__video-info">
                                <span>Language: </span><b>{filterLanguage.length ? filterLanguage[0].name : undefined}</b>
                              </div>
                            </li>
                          ) : null}
                          {courseData?.updatedAt ? (
                            <li className="d-flex align-items-center">
                              <div className="course__video-info">
                                <span>Last Update: </span><b>{moment(new Date(courseData?.updatedAt)).format('MMMM Do YYYY, HH:mm')}</b>
                              </div>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
   
  );
};

export default CourseDetailsWrapper;