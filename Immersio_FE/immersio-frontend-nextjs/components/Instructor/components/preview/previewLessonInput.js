import { useState } from 'react';
import PreviewTab from '../../../../src/pages/student/myCourses/lesson/previewTab';
import { LessonContext } from '../../../PreviewLesson';

const PreviewLessonInput = ({ activeKey, values }) => {
	const [type, setType] = useState(activeKey);
	const [indexStep, setIndexStep] = useState(1);
	const [isCompletedStep, setComplete] = useState(false);
	const {
		vocabulary, grammar, phrases,
		drillData0: vocabularyDrills,
		drillData1: phrasesDrills,
		drillData2: grammarDrills,
		dialogs,
	} = values

	return (
		<>
			<style jsx global>
				{`
					.preview-lesson-input div[class*="style_actions"] {
						position: relative !important;
						background: transparent !important;
					}
				`}
			</style>

			<div className='pl-20 pr-20 pt-20 pb-20 remove-bg-tabs preview-lesson-input' style={{ backgroundColor: '#F8F8FF' }}>
				<p>This is how it looks like on the screen</p>
				<h3 className='mb-20'>{values.title}</h3>

				<LessonContext.Provider value={{ vocabulary, grammar, phrases, vocabularyDrills, phrasesDrills, grammarDrills, dialogs, isAdmin: true }}>
					<PreviewTab
						type={type}
						setType={setType}
						indexStep={indexStep}
						setIndexStep={setIndexStep}
						isCompletedStep={isCompletedStep}
						setComplete={setComplete}
					/>
				</LessonContext.Provider>
			</div>
		</>
	)
}

export default PreviewLessonInput