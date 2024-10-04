import Link from "next/link"
import { Button } from "react-bootstrap"

const TutorTab = ({ t }) => {
  return <section className="feature__area feature__area-mobile pb-80 tw-pt-[30px] md:tw-pt-[80px] p-relative">
    <div className="container tw-px-5 md:tw-px-[12px]">
      <div className="row">
        <div className="col-xs-12 col-xxl-6 col-xl-6 col-lg-6">
          <div className="feature__content mb-30-mobile">
            <h3>{t('features.tutor_match.title')}</h3>
            <ul>
              <li>{t('features.tutor_match.content_01')}</li>
              <li>{t('features.tutor_match.content_02')}</li>
              <li>{t('features.tutor_match.content_03')}</li>
            </ul>
            <div className="feature__btn d-flex">
              <Link href="/login">
                <a className="tw-inline-block tw-w-full md:tw-w-auto">
                  <Button className="tw-w-full md:tw-w-auto open-speak-default-btn btn">{t('features.tutor_match.btn')}</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-xxl-6 col-xl-6 col-lg-6 pl-lg-50 algin-self-center">
          <img src="/assets/img/features/tutor-match.png" width="100%" />
        </div>
      </div>
    </div>
  </section>
}

export default TutorTab