import { useEffect, useState } from 'react';
//import { useSelector } from 'react-redux';
import { Col } from 'antd';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';
import { BrowserView, MobileView } from 'react-device-detect';
import { toast } from 'react-toastify';
import SwiperCore, { Pagination } from 'swiper';
import { useLoadCommonCourse } from '../../hooks/useLoadCommonCourse';
import { getAllCoursesPublish } from '../../src/services/courses/apiCourses';
import LoadingImage from '../v2/LoadingImage';

SwiperCore.use([Pagination]);

const AllCourseBrowser = ({ isAdmin = false }) => {
  const { t } = useTranslation();
  const {
    languages,
    allInstructors
  } = useLoadCommonCourse({ isPublic: true, isFree: true })

	const [courses, setCourses] = useState([])
  const [displayCourses, setDisplayCourses] = useState([])
  const [tagActive, setTagActive] = useState(999999)
	useEffect(() => {
		loadCourses();
	}, []);

	const loadCourses = async () => {
		try {
			const response = await getAllCoursesPublish();
			if (response?.data?.length) {
				let arr = [];
				for (let i = 0; i <= response.data.length - 1; i++) {
					const getField = response.data[i];
					arr.push(getField);
				}

        setCourses(arr)
        setDisplayCourses(arr)
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

  return (
    <>
      <section className={isAdmin === false ? 'course__area tw-pt-[60px] md:tw-pt-[80px] tw-pb-10' : 'course__area tw-pb-10'}>
        <div className="container">
          <div className="row modify-margin-mobile tw-overflow-auto">
            <div className="tw-flex tw-space-x-3 tw-w-screen">
              <div
                className={`hover:bg-theme-3 hover:color-theme-7 ${tagActive === 999999 ? 'bg-theme-3 color-theme-7' : 'bg-theme-6'} tw-transition-all tw-rounded-[10px] tw-py-1 md:tw-py-2 tw-px-2 md:tw-px-4 tw-text-sm md:tw-text-[16px] tw-cursor-pointer tw-mb-3`}
                onClick={() => {
                  setDisplayCourses(courses)
                  setTagActive(999999)
                }}
              >
                {t('home.tag_all')}
              </div>
              {(languages || []).map((language, index) => {
                return (
                  <div
                    key={index}
                    className={`hover:bg-theme-3 hover:color-theme-7 ${tagActive === language.id ? 'bg-theme-3 color-theme-7' : 'bg-theme-6'} tw-whitespace-nowrap tw-text-center tw-transition-all tw-rounded-[10px] tw-py-1 md:tw-py-2 tw-px-2 md:tw-px-4 tw-text-sm md:tw-text-[16px] tw-cursor-pointer tw-mb-3 tw-max-h-[36px]`}
                    onClick={() => {
                      setDisplayCourses(courses.filter(course => course.courseLanguageId === language.id))
                      setTagActive(language.id)
                    }}
                  >
                    {language.name}
                  </div>
                )}
              )}
            </div>
          </div>

          <BrowserView>
            <div className='tw-my-8'>
              <Carousel className="">
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/assets/img/v2/home-blank-01.png"
                    alt="Home banner 01"
                  />
                  <Carousel.Caption
                    style={{
                      top: 0,
                      right: '10%',
                      width: '32%',
                      left: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      bottom: 0
                    }}
                  >
                    <h3 className='tw-mb-0 color-theme-7 tw-text-[32px]'>
                      {t('home.banner_1')}
                    </h3>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/assets/img/v2/home-blank-02.png"
                    alt="Home banner 02"
                  />

                  <Carousel.Caption
                    style={{
                      top: 0,
                      right: '0%',
                      width: '42%',
                      left: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      bottom: 0
                    }}
                  >
                    <h3 className='tw-mb-0 tw-text-[#ee4d41] tw-text-[32px]'>
                      {t('home.banner_2')}
                    </h3>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/assets/img/v2/home-blank-03.png"
                    alt="Home banner 03"
                  />

                  <Carousel.Caption
                    style={{
                      top: '20px',
                      right: 'inherit',
                      width: '30%',
                      left: '17%',
                      display: 'flex',
                      alignItems: 'center',
                      bottom: 0
                    }}
                  >
                    <h3 className='tw-mb-0 tw-text-[#ee4d41] tw-text-[32px]'>
                      {t('home.banner_3')}
                    </h3>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          
            <div className="row">
              <div className="col-xxl-12">
                <div className="course__tab-wrapper tw-px-0 :md:tw-px-[12px]">
                  <div className="row">
                    {displayCourses?.length ? (
                      <>
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
                      </>
                    ) : <h4 className="text-center">{t('course.empty')}</h4>}
                  </div>
                </div>
              </div>
            </div>
          </BrowserView>
          <MobileView>
            <div className="row">
                <div className="course__tab-wrapper tw-px-0 :md:tw-px-[12px]">
                  {displayCourses?.length ? (
                    <>
                      {(displayCourses || []).map((session, index) => {
                        const filterLanguage = languages.filter(
                          (s) => s?.id?.toString() === session?.courseLanguageId?.toString()
                        );
                        const filterIntructor = allInstructors.filter(
                          (s) => s?.id?.toString() === session?.instructorId?.toString()
                        );
                        const isFreeCourse = session.isFree
                       
                        return (
                          <div key={index} className="postbox__slider-item tw-mb-4">
                            <Link href={`/courses/${session.slug}-c${session.id}`}>
                              <a className='tw-relative'>
                                <LoadingImage thumbnailId={session.thumbnailId} />
                                {isFreeCourse && (
                                  <div className='ribbon-course'><span>Free</span></div>
                                )}
                              </a>
                            </Link>
                            <div className="tw-flex tw-items-start tw-mt-2 tw-px-[12px]">
                              <div className="tw-w-10 tw-mr-2 tw-rounded-full tw-overflow-hidden">
                                  <img width={"100%"} src={filterIntructor[0]?.profile.avatarUrl} />
                              </div>
                              <div>
                                <h4 className="tw-mb-1">
                                  <Link href={`/courses/${session.slug}-c${session.id}`}>
                                    {session.title}
                                  </Link>
                                </h4>
                                <div className="mb-10">
                                  <a>{filterLanguage?.length && filterLanguage[0].name}</a> |{' '}
                                  {filterIntructor?.length && (
                                    <>
                                      {filterIntructor[0]?.profile?.firstName} {filterIntructor[0]?.profile?.lastName}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          
                          </div>
                        )
                      })}
                    </>
                  ) : <h4 className="text-center">{t('course.empty')}</h4>}
                </div>
            </div>
          </MobileView>
        </div>
      </section>
    </>
  );
};

export default AllCourseBrowser;