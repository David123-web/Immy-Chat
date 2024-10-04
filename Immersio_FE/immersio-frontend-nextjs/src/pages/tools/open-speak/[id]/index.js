import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-responsive-modal';
import Swal from 'sweetalert2';
import SwiperCore, { Pagination } from 'swiper';
import DetailsTabItems from '../../../../../components/CourseDetails/DetailsTabItems';
import CourseTiming from '../../../../../components/Student/components/bookings/courseTiming';
import { singleInstructor } from '../../../../../redux/features/instructorSlice';
import DefaultLayout from '../../../../layouts';
import { withTranslationsProps } from '../../../../next/with-app';

SwiperCore.use([Pagination])


const OpenSpeakDetails = () => {
  //sidebar show
  const [show, setShow] = useState(false);
  //sidebar handleShow
  const handleShow = () => setShow(true);
  // paymentInformation
  const [paymentInformation, setPaymentInformation] = useState({});
  // instructor
  // const courseData = useSelector(state => state.courses.course);
  const instructorData = useSelector(state => state.instructors.instructor);
  // dispatch
  const dispatch = useDispatch();
  // router
  const router = useRouter();
  // query id
  // const id = router.query.slug;
  const [id, setId] = useState(router.query?.id)

  // user
  const user = useSelector(state => state.auth.login.currentUser?.user)
  // video popup
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  // distructure data
  // const { _id, teacher_img, tutor_name, img_bg, date, title, category, review, price, enrolled,
  //   lectures, duration } = courseData;
  // dispatch singleCourse
  useEffect(() => {
    console.log(id)
    if (!id) {
    }
    else {
      dispatch(singleInstructor(id))
    }
  }, [id, dispatch])
  // query payment info
  useEffect(() => {
    if (instructorData?.id && user?.email) {
      fetch(`/api/booking/checkIsBookedOneToOne`
        , {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ instructor_Id: instructorData?.id, type: 1 })
        }
      )
        .then(res => res.json())
        .then(data => {
          setPaymentInformation(data.booking)
        })
    }
  }, [user?.email, instructorData?.id])

  const handleBooking = async (event) => {
    event.preventDefault();
    const elementsHour = document.getElementById('courseTiming').getElementsByClassName("available-hour selected-calendar-hour")
    const elementsTimeZone = document.getElementById('scheduleTimeZone').getElementsByClassName("ant-select-selection-item")

    const arrTime = [];
    if (elementsHour.length === 0) {
      Swal.fire({
        position: 'top-center',
        icon: 'warning',
        title: 'Chosse time you want to book',
        timer: 3000
      })
      return false;
    }
    else {
      for (let i = 0; i < elementsHour.length; i++) {
        let hour = elementsHour[i].innerHTML.split(':')[0]
        let date = new Date(elementsHour[i].getAttribute('date'))
        let fullDate = { time: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, 0, 0) }
        arrTime = [...arrTime, fullDate]
      }
    }

    const booking = {
      instructor_Id: instructorData.id,
      type: 1,
      booking: arrTime,
      timeZone: (elementsTimeZone.length > 0 && elementsTimeZone[0].getAttribute('title'))
    }

    Swal.fire({
      position: 'top-center',
      icon: 'success',
      title: 'Your payment processed successfully',
      timer: 1500
    })
    const url = `/api/booking/createBooking/`
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(booking)
    })
      .then(res => res.json())
      .then(data => setPaymentInformation(data.booking))
  }

  return (
    <>
      <Head>
        <title>Course Details Page</title>
      </Head>

      <Modal
        open={open}
        onClose={onCloseModal}
        styles={{
          modal: {
            maxWidth: "unset",
            width: "70%",
            padding: "unset"
          },
          overlay: {
            background: "rgba(0, 0, 0, 0.5)"
          },
          closeButton: {
            background: "yellow"
          }
        }}
        center
      >
        <ReactPlayer
          url="https://youtu.be/XBoZPCgdnm8"
          width="100%"
          height="calc(100vh - 100px)"
          controls
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
              }
            }
          }}
        />
      </Modal>

      <DefaultLayout>
        <>
          <section className='course course-details-section'>
            <section className="course__area pt-140 pb-200">
              <div className="container">
                <div className="row">
                  <div className="col-xxl-8 col-xl-8 col-lg-8">
                    <section className="detail-book-block-wrapper">
                      <div className="detail-book-block-wrapper__item">
                        <div className="photo">
                          <img src={instructorData?.userArray?.avatar ? instructorData?.userArray?.avatar : "/assets/img/open-speak/no-image.jpg"} alt='' height={"100%"} />
                        </div>
                        <div className="info">
                          <div>
                            <b className="info__name">{instructorData?.firstName + ' ' + instructorData?.lastName}</b>
                            <p className="info__address">{instructorData?.selfDescription}</p>
                            <div className="info__lesson">
                              {`Specialized language: ${instructorData && instructorData?.languageArray?.languageName} | ${instructorData && instructorData?.hourRate} lessons`}
                            </div>
                          </div>
                          <div className="book-rating">
                            <div className="ratings">
                              <i className="fa fa-star rating-color mr-5"></i>
                              <i className="fa fa-star rating-color mr-5"></i>
                              <i className="fa fa-star rating-color mr-5"></i>
                              <i className="fa fa-star rating-color mr-5"></i>
                              <i className="fa fa-star"></i>
                              <span className="pl-5"></span>
                            </div>
                            <label className="review-count"> Reviews</label>
                          </div>
                        </div>
                      </div>
                    </section>
                    <div className="course__wrapper mt-30">
                      <DetailsTabItems dynamicPage={true} data={instructorData} />
                    </div>
                    <div className="course__wrapper mt-30" id="courseTiming">
                      <CourseTiming setScheduleVisible={handleBooking} data={instructorData}> </CourseTiming>
                    </div>
                  </div>

                  <div className="col-xxl-4 col-xl-4 col-lg-4">
                    <div className="course__sidebar pl-10 p-relative">
                      <div className="course__shape">
                        <img className="course-dot" src={"/" + "assets/img/course/course-dot.png"} alt="" />
                      </div>
                      <div className="course__sidebar-widget-2 bg-theme-7 mb-20">
                        <div className="course__video">
                          <div className="course__video-thumb w-img mb-25">
                            <img src={"/" + "assets/img/course/video/course-video.jpg"} alt="" />
                            <div className="course__video-play">
                              <button onClick={onOpenModal} className="play-btn popup-video">
                                <i className="fas fa-play"></i> </button>
                            </div>
                          </div>
                          <div className="course__video-meta mb-10 d-flex align-items-center justify-content-center">
                            <div className="course__video-price w-100 d-flex justify-content-between">
                              <h5>$69.99</h5>
                              <span>245 students</span>
                            </div>
                          </div>

                          <button type="button" className="tp-btn w-100 text-center my-3">
                            {
                              user?.email && !(paymentInformation?.status === 1) ? <button onClick={handleBooking} type="button" className="tp-btn w-100 text-center">Book now
                                <i className="far fa-arrow-right ms-3"></i>
                              </button> : (paymentInformation?.status === 1) ? <button type="button" className="tp-btn w-100 text-center">
                                Already booking </button>
                                : <Link href="/login">
                                  <a>
                                    <button type="button" className="tp-btn w-100 text-center">Login To booking
                                      <i className="far fa-arrow-right ms-3"></i>
                                    </button>
                                  </a>
                                </Link>
                            }
                            <i className="fa-solid fa-cart-shopping ms-3"></i> </button>

                          <button type="button" className="tp-btn tp-btn-border w-100 text-center mb-3">
                            <span>Message</span>
                          </button>
                          <button type="button" className="tp-btn tp-btn-border w-100 text-center">
                            <span>Send to favourite</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </>
      </DefaultLayout>
    </>
  );
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default OpenSpeakDetails;