import Image from "next/image"
import Link from "next/link"
import { Button } from "react-bootstrap"
// #03676F
const CourseIntroduction = () => {
    return (
      <section className="course-introduction__area pb-120 pt-100 p-relative">
        <div className="container">
          <div className="row">
            <div className="col-xxl-5 col-xl-5 col-lg-5">
              <div className="course-introduction__thumb-wrapper d-sm-flex mr-20 p-relative video-popup-wrapper">
                {/* <Image src="/assets/img/open-speak/dump/hello.png" width={568} height={379} alt="hello-bg" /> */}
                <img src="/assets/img/open-speak/doctor-bg-new.png" width={500} />
                <div className="course__video-play">
                  <button className="play-btn popup-video">
                    <i className="fas fa-play"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7">
              <div className="course-introduction__content pl-70 pr-25">
                <div className="section__title-wrapper mb-15">
                  <h2 className="section__title">Want to be able to read with ease and think in an ancient language?</h2>
                </div>

                <div className="course-introduction__list mb-40">
                  <ul>
                    <li>
                      <p>
                        Try one of our conversational courses available in 4 different languages, and growing
                      </p>
                    </li>
                    <li>
                      <p>
                        Pay for the language you want to master
                      </p>
                    </li>
                    <li>
                      <p>
                        Learn 100% online at your own pace
                      </p>
                    </li>
                    <li>
                      <p>
                        Practice speaking with our AI chatbot, anytime, anywhere
                      </p>
                    </li>
                    <li>
                      <p>
                        Join a unique, global community
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="course-introduction__btn">
                  <Link href="/try-now">
                    <Button className="open-speak-default-btn btn">TRY NOW</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default CourseIntroduction