import { useState } from 'react'
import CurriculumTimeline from '../../../CurriculumTimeline'

const IntroductionCurriculum = ({ values, tracking }) => {
  return <CurriculumTimeline tracking={tracking} data={values} />
}

export default IntroductionCurriculum