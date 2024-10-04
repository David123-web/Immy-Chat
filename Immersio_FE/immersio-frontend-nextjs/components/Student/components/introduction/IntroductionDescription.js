import { useTranslation } from "next-i18next";
import ReactPlayer from "react-player";

const IntroductionDescription = ({ values }) => {
  const { t } = useTranslation();
  return (
    <div className="course__wrapper">
      {values?.fieldMedia?.previewVideo ? (
        <div className="col-xs-12 col-md-12">
          <ReactPlayer
            url={values.fieldMedia.previewVideo}
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

      <div className="course__description pt-40">
        <h3>{t('course.course_overview')}</h3>
        <p dangerouslySetInnerHTML={{ __html: values?.description }} />
        <h3>{t('course.learning_outcome')}</h3>
        <p className='mt-20 mb-20' dangerouslySetInnerHTML={{ __html: values?.learningOutcome }} />
        <h3>{t('course.requirement')}</h3>
        <p className='mt-20 mb-20' dangerouslySetInnerHTML={{ __html: values?.requirement }} />
      </div>
    </div>
  )
}

export default IntroductionDescription