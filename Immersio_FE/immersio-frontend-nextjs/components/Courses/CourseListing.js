import { Col, Select } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { toast } from 'react-toastify';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLoadCommonCourse } from '../../hooks/useLoadCommonCourse';
import { getAllCoursesPublic } from '../../src/services/courses/apiCourses';
import LoadingImage from '../v2/LoadingImage';

SwiperCore.use([Pagination]);

const CourseListing = ({ items = 3 }) => {
  const {
    languages,
    allInstructors
  } = useLoadCommonCourse()

	const [courses, setCourses] = useState([])
  const [displayCourses, setDisplayCourses] = useState([])
	useEffect(() => {
		loadCourses();
	}, []);

	const loadCourses = async () => {
		try {
			const response = await getAllCoursesPublic();
			if (response?.data?.length) {
				let arr = [];
				for (let i = 0; i <= response.data.length - 1; i++) {
					const getField = response.data[i];
          arr.push(getField);
				}

				setCourses(arr);
        setDisplayCourses(arr);
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

  return (
    <>
      <section className="course-listing-section course__area pt-110 pb-30">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12 col-xl-12 col-lg-12">
              <div className="section__title-wrapper-2 text-center mb-20">
                <h3 className="section__title-2">Unlock ancient wisdom with beginner, intermediate,<br/>and advanced content</h3>
              </div>
            </div>
            <div className="col-xxl-12 col-xl-12 col-lg-12">
              <div className="book-with-teacher__wrapper text-center mb-65">
                <p>From A1 to C2 courses across all language skills, our courses immerse you in the ancient world and give you “121” <br /> access to language experts to personalize your learning so you can achieve your specific learning goals.</p>
              </div>
            </div>
          </div>

          <div className="row modify-margin-mobile mb-30">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 w-100">
              <Select
                placeholder="Choose a language (Latin, Greek, Hebrew, Aramaic)"
                size='large'
                className='w-100'
                aria-label="Choose a language"
                onChange={(value) => {
                  if (value !== 999999) {
                    setDisplayCourses(courses.filter(course => course.courseLanguageId === value))
                  } else {
                    setDisplayCourses(courses)
                  }
                }}
              >
                <Select.Option value={999999}>All</Select.Option>
                {(languages || []).map((language, index) => {
                  return (
                    <Select.Option key={index} value={language.id}>{language.name}</Select.Option>
                  )}
                )}
              </Select>
            </div>
          </div>

          <BrowserView>
            <div className="row">
              <div className="col-xxl-12">
                <div className="course__tab-wrapper tw-px-0 :md:tw-px-[12px]">
                  {displayCourses?.length ? (
                    <div className="row">
                      {(displayCourses || []).map((session, index) => {
                        const filterLanguage = languages.filter(
                          (s) => s?.id?.toString() === session?.courseLanguageId?.toString()
                        );
                        const filterIntructor = allInstructors.filter(
                          (s) => s?.id?.toString() === session?.instructorId?.toString()
                        );
                        const isFreeCourse = session.isFree

                        return (
                          <Col xs={24} sm={6} key={index} className="mb-20">
                            <Link href={`/courses/${session.slug}-c${session.id}`}>
                              <a className='tw-relative'>
                                <LoadingImage thumbnailId={session.thumbnailId} />
                                {isFreeCourse && (
                                  <div className='ribbon-course'><span>Free</span></div>
                                )}
                              </a>
                            </Link>
                            <div className="mb-10">
                              <a>{filterLanguage?.length && filterLanguage[0].name}</a> |{' '}
                              {filterIntructor?.length && (
                                <>
                                  {filterIntructor[0]?.profile?.firstName} {filterIntructor[0]?.profile?.lastName}
                                </>
                              )}
                            </div>
                            <h4>
                              <Link href={`/courses/${session.slug}-c${session.id}`}>
                                {session.title}
                              </Link>
                            </h4>
                          </Col>
                        );
                      })}
                    </div>
                  ) : <div className="mt-60"><h4 className="text-center">Courses are being developed, will be published shortly</h4></div>}
                </div>
              </div>
            </div>
          </BrowserView>
          <MobileView>
            <div className="row">
              <div className="col-xxl-12">
                {displayCourses?.length ? (
                  <div className="course__tab-wrapper tw-px-0 :md:tw-px-[12px]">
                    <Swiper
                      slidesPerView={1}
                      className='swiper-wrapper swiper-wrapper-mobile'
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 6000 }}
                      modules={[Pagination]}
                    >
                      {
                        (displayCourses || []).map((session, index) => {
                          const filterLanguage = languages.filter(
                            (s) => s?.id?.toString() === session?.courseLanguageId?.toString()
                          );
                          const filterIntructor = allInstructors.filter(
                            (s) => s?.id?.toString() === session?.instructorId?.toString()
                          );
                          const isFreeCourse = session.isFree

                          return (
                            <SwiperSlide key={session.id} className="postbox__slider-item swiper-slide swiper-slide-mobile">
                              <Col xs={24} sm={6} key={index}>
                                <Link href={`/courses/${session.slug}-c${session.id}`}>
                                  <a className='tw-relative'>
                                    <LoadingImage thumbnailId={session.thumbnailId} />
                                    {isFreeCourse && (
                                      <div className='ribbon-course'><span>Free</span></div>
                                    )}
                                  </a>
                                </Link>
                                <div className="mb-10 tw-px-[12px]">
                                  <a>{filterLanguage?.length && filterLanguage[0].name}</a> |{' '}
                                  {filterIntructor?.length && (
                                    <>
                                      {filterIntructor[0]?.profile?.firstName} {filterIntructor[0]?.profile?.lastName}
                                    </>
                                  )}
                                </div>
                                <h4>
                                  <Link href={`/courses/${session.slug}-c${session.id}`}>
                                    {session.title}
                                  </Link>
                                </h4>
                              </Col>
                            </SwiperSlide>
                          )
                        })
                      }
                    </Swiper>
                  </div>
                ) : <h4 className="text-center">Courses are being developed, will be published shortly</h4>}
              </div>
            </div>
          </MobileView>
        </div>
      </section>
    </>
  );
};

export default CourseListing;