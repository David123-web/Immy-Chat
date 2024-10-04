import { useState } from 'react';
import PreviewTabMobile from './PreviewTabMobile';

const PreviewMobile = ({ values, process }) => {
	const [type, setType] = useState("introduction");

	return (
		<div className="lesson-preview">
			<PreviewTabMobile
				values={values}
				type={type}
				setType={setType}
				indexStep={process.indexStep}
				setIndexStep={process.setIndexStep}
				isCompletedStep={process.isCompletedStep}
				setComplete={process.setComplete}
			/>
		</div>
	)
}

export default PreviewMobile