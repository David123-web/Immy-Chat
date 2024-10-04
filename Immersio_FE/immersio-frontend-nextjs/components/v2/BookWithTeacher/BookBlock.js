import { getAllTutors } from '@/src/services/user/apiUser';
import { LoadingOutlined } from '@ant-design/icons';
import { Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { DateRangePicker } from 'react-dates';
import { BrowserView, MobileView } from "react-device-detect";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLoadCommonCourse } from "../../../hooks/useLoadCommonCourse";
import { fiterInstructor } from "../../../redux/features/instructorSlice";

SwiperCore.use([Pagination]);

const BookBlock = ({ showRedirect }) => {
  const [startDate, setStart] = useState(null);
  const [endDate, setEnd] = useState(null);
  const [focusedInput, setFocused] = useState(null);
  const [isShowTimer, setShowTimer] = useState(false);

  const [timerDay, setTimerDay] = useState([]);
  const [timeOfDayTimer, setTimeOfDayTimer] = useState([])

  const currency = '$';

  const dispatch = useDispatch()

  const {
    languages: allCourseLanguage,
  } = useLoadCommonCourse({ isPublic: true, isFree: true })

  const [loading, setLoading] = useState(true);
  const [allTutors, setAllTutors] = useState([]);
  useEffect(() => {
   loadAllTutors()
 }, [])

  const loadAllTutors = async() => {
     try {
      const response = await getAllTutors()
      if (response?.data) {
        setAllTutors(response.data)
      }
     } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
     } finally {
      setLoading(false)
     }
  }

  const handleLanguageFilter = (e) => {
    dispatch(fiterInstructor({ data: e.target.value, type: 'language' }))
  }

  const handleDayFilter = (e) => {
    const { nodeName, textContent } = e.target;
    const value = e.target.getAttribute('value')
    if (nodeName === 'SPAN') {
      var data = [...timerDay]
      var index = data.findIndex(i => i.value === value)

      if (index === -1) {
        data = [...timerDay, { value: value, text: textContent }]
        setTimerDay(data)
        dispatch(fiterInstructor({ data: data, type: 'dayTimer' }))
      }
    }
  }

  const handleTimeOfDate = (obj) => {
    var data = [...timeOfDayTimer]
    var index = data.findIndex(i => i.id === obj.id)
    if (index === -1) {
      data = [...timeOfDayTimer, obj]
      setTimeOfDayTimer(data)
      dispatch(fiterInstructor({ data: data, type: 'timeOfDayTimer' }))
    }
  }

  const preventDefault = (e, obj) => {
    e.preventDefault();
    var data = [...timerDay]
    var index = data.findIndex(i => i.value === obj.value)
    if (index !== -1) {
      setTimerDay(
        data.filter(item => item.value !== obj.value)
      )
      dispatch(fiterInstructor({ data: data.filter(item => item.value !== obj.value), type: 'dayTimer' }))
    };
  }

  const preventDefault1 = (e, value) => {
    e.preventDefault();
    var data = [...timeOfDayTimer]
    var index = data.findIndex(i => i.timeStart === value.timeStart && i.timeEnd === value.timeEnd)
    if (index !== -1) {
      setTimeOfDayTimer(
        data.filter(item => item.id != value.id)
      )
      dispatch(fiterInstructor({
        data: data.filter(item => item.id != value.id), type: 'timeOfDayTimer'
      }))
    };
  }

  if (loading) {
    return <Container className='mb-60 text-center'>
       <LoadingOutlined style={{ fontSize: 30 }} />
    </Container>
 }

  return (
    <>
      <Form className="book-block-filter d-flex align-items-center">
        <div className="book-block-filter__select">
          <Form.Select aria-label="Language" onChange={handleLanguageFilter}>
            <option value={9999999}>Language</option>
            {(allCourseLanguage || []).map((item, index) => (
              <option value={item.id} key={index + 1}>{item.name}</option>
            ))}
          </Form.Select>
        </div>
        <div className="book-block-filter__time-picker">
          <div className="item d-flex align-items-center" onClick={() => setShowTimer(!isShowTimer)}>
            <div className={`flex-fill ${isShowTimer ? 'default-color' : 'placeholder-color'}`}>
              {
                ((timerDay.length > 0 || timeOfDayTimer.length > 0) ? timerDay?.map((item, index) =>
                  <Tag key={index} closable onClose={event => preventDefault(event, item)}>{item.text}</Tag>
                ) : <>Timer</>)

              }
              {
                ((timeOfDayTimer.length > 0) && timeOfDayTimer?.map((item, index) =>
                  <Tag key={index} color="red" closable onClose={event => preventDefault1(event, item)}>{item.timeStart + '-' + item.timeEnd}</Tag>
                ))
              }
            </div>
            <Image src="/assets/img/open-speak/ios-timer.svg" width={18} height={18} />
          </div>
          <div className={`box ${isShowTimer ? 'block' : 'hide'}`}>
            <div className="days-of-week mb-20">
              <span>Days of the week</span>
              <div className="box-days d-flex align-items-center w-100 mt-5" onClick={handleDayFilter}>
                <span value='0'>Sun</span>
                <span value='1'>Mon</span>
                <span value='2'>Tue</span>
                <span value='3'>Wed</span>
                <span value='4'>Thu</span>
                <span value='5'>Fri</span>
                <span value='6'>Sat</span>
              </div>
            </div>
            <div className="time-of-day">
              <span>Time of the day, in your time zone</span>
              <div className="box-time d-flex flex-wrap mt-5"  >
                <style jsx>{`
                  .box-time-item:hover{
                    background-color : #ddd
                  }
                  .box-time-item{
                    cursor: pointer;
                    z-index : 99
                  }
                `}</style>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 1, timeStart: 6, timeEnd: 9 })} >
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time" >6 - 9</div>
                  <div className="box-time-item__range-zone">Morning</div>
                </div>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 2, timeStart: 9, timeEnd: 12 })} >
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time" >9 - 12</div>
                  <div className="box-time-item__range-zone">Late morning</div>
                </div>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 3, timeStart: 12, timeEnd: 15 })}>
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time">12 - 15</div>
                  <div className="box-time-item__range-zone">Afternoon</div>
                </div>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 4, timeStart: 15, timeEnd: 18 })}>
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time">15 - 18</div>
                  <div className="box-time-item__range-zone">Late afternoon</div>
                </div>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 5, timeStart: 18, timeEnd: 21 })}>
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time">18 - 21</div>
                  <div className="box-time-item__range-zone">Evening</div>
                </div>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 6, timeStart: 21, timeEnd: 24 })}>
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time">21 - 24</div>
                  <div className="box-time-item__range-zone">Late evening</div>
                </div>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 7, timeStart: 0, timeEnd: 3 })}>
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time">0 - 3</div>
                  <div className="box-time-item__range-zone">Night</div>
                </div>
                <div className="box-time-item" onClick={event => handleTimeOfDate({ id: 8, timeStart: 3, timeEnd: 6 })}>
                  <div className="box-time-item__icon" />
                  <div className="box-time-item__range-time">3 - 6</div>
                  <div className="box-time-item__range-zone">Late night</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="book-block-filter__date-range">
          <DateRangePicker
            startDate={startDate} // momentPropTypes.momentObj or null,
            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
            endDate={endDate} // momentPropTypes.momentObj or null,
            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
            onDatesChange={({ startDate, endDate }) => {
              setStart(startDate);
              setEnd(endDate);
            }} // PropTypes.func.isRequired,
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={focusedInput => setFocused(focusedInput)} // PropTypes.func.isRequired,
          />
        </div>
        <div className="book-block-filter__search">
          <Button variant="primary" type="submit">
            <i className="fa fa-search"></i>
          </Button>
        </div>
      </Form>

      <BrowserView>
        {allTutors?.tutors?.length ? (
          <section className="book-block-wrapper pt-50 pb-50">
            <Swiper
              slidesPerView={4}
              className='swiper-wrapper'
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000 }}
              modules={[Pagination]}
            >
              {(allTutors.tutors || []).map(block => (
                <SwiperSlide key={block.id} className="postbox__slider-item swiper-slide">
                  <div className="book-block-wrapper__item desktop">
                    <div className="photo">
                      <img src={block?.profile?.avatarUrl || "/assets/img/open-speak/no-image.jpg"} alt={block?.profile?.firstName} />
                    </div>
                    <div className="info">
                      <b className="info__name">
                        <Link href={`tools/open-speak/${block.id}`}>
                          <a>
                            {block?.profile?.firstName + ' ' + block?.profile?.lastName}
                          </a>
                        </Link>
                      </b>
                      <p className="info__address">{block?.profile?.address}</p>
                      {/* <div className="info__lesson">
                        {`Specialized language: ${block?.tutor?.teachLanguages[0]?.name} | ${block?.tutor?.hourRate} lessons`}
                      </div> */}
                      <p className="info__about">{block?.profile?.description}</p>
                    </div>
                    <div className="actions">
                      <div className="actions__rating-price d-flex align-items-center justify-content-between">
                        <div className="book-rating">
                          <div className="ratings">
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star"></i>
                            <span className="pl-5">{block?.rating?.score}</span>
                          </div>
                          <label className="review-count">{block?.rating?.total_review} Reviews</label>
                        </div>
                        {/* <div className="book-price">
                          <span>{`${currency} ${block?.tutor?.hourRate}`}</span>
                          <p>per hour</p>
                        </div> */}
                      </div>
                      {/* <div className="actions__message">
                        <Button variant="primary" className="open-speak-second-btn btn">Message</Button>
                      </div>
                      <div className="actions__book">
                        <Link href={`tools/open-speak/${block.id}`}>
                          <Button className="open-speak-default-btn btn">Book Now</Button>
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        ) : <section className="book-block-wrapper pt-50 pb-50"><h4 className="text-center">Tutor list will be updated soon.</h4></section>}
      </BrowserView>

      <MobileView>
        {allTutors?.tutors?.length ? (
          <section className="book-block-wrapper pt-50 pb-50">
            <Swiper
              slidesPerView={1}
              className='swiper-wrapper swiper-wrapper-mobile'
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000 }}
              modules={[Pagination]}
            >
              {(allTutors.tutors || []).map(block => (
                <SwiperSlide key={block.id} className="postbox__slider-item swiper-slide swiper-slide-mobile">
                  <div className="book-block-wrapper__item">
                    <div className="d-flex align-items-center">
                      <div className="photo">
                        <img src={block?.profile?.avatarUrl || "/assets/img/open-speak/no-image.jpg"} alt={block?.profile?.firstName} />
                      </div>
                      <div className="info">
                        <b className="info__name">
                          <Link href={`tools/open-speak/${block.id}`}>
                            <a>
                              {block?.profile?.firstName + ' ' + block?.profile?.lastName}
                            </a>
                          </Link>
                        </b>
                        <p className="info__address">{block?.profile?.address}</p>
                        <div className="info__lesson">
                          {`Specialized language: ${block?.tutor?.teachLanguages[0]?.name} | ${block?.tutor?.hourRate} lessons`}
                        </div>
                        <p className="info__about">{block?.profile?.description}</p>
                      </div>
                    </div>
                    <div className="actions flex-fill w-100 mt-20">
                      <div className="actions__rating-price d-flex align-items-center justify-content-between">
                        <div className="book-rating">
                          <div className="ratings">
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star rating-color"></i>
                            <i className="fa fa-star"></i>
                            <span className="pl-5">{block?.rating?.score}</span>
                          </div>
                          <label className="review-count">{block?.rating?.total_review} Reviews</label>
                        </div>
                        <div className="book-price">
                          <span>{`${currency} ${block?.tutor?.hourRate}`}</span>
                          <p>per hour</p>
                        </div>
                      </div>
                      <div className="actions__message">
                        <Button variant="primary" className="open-speak-second-btn btn">Message</Button>
                      </div>
                      <div className="actions__book">
                        <Link href={`tools/open-speak/${block.id}`}>
                          <Button className="open-speak-default-btn btn">Book Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        ) : <section className="book-block-wrapper pt-50 pb-50"><h4 className="text-center">Tutor list will be updated soon.</h4></section>}
      </MobileView>

      {allTutors?.tutors?.length ? (
        <div className="pb-100 d-flex align-items-center justify-content-center">
          <a target="_blank" href="https://forms.gle/nqAgH2LJsZjJSWzT7">
            <Button className="open-speak-default-btn btn">BECOME A TUTOR</Button>
          </a>
        </div>
      ) : <div className="pb-100 d-flex align-items-center justify-content-center" />}
    </>
  )
}

export default BookBlock