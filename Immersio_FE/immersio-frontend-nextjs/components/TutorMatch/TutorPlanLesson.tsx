import { TAILWIND_CLASS } from '@/constants';
import { Button } from 'antd';
import React from 'react';

interface ITutoringPlanLesson {
	lessonName: string;
	onAddMaterial: () => void;
	onAddDrill: () => void;
}

const TutorPlanLesson = (props: ITutoringPlanLesson) => {
	const { lessonName, onAddMaterial, onAddDrill } = props;
	return (
		<div className="tw-h-12 tw-w-full tw-flex tw-items-center tw-justify-between tw-bg-zinc-200 tw-pl-6 tw-pr-14 tw-mt-2">
			<div className="tw-flex tw-items-center tw-mt-1">
				<div className="tw-w-6 tw-h-6 bg-theme-4 tw-rounded-full"></div>
				<div className="tw-font-bold tw-text-lg tw-ml-4">{lessonName}</div>
			</div>
			<div>
				<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-md`} onClick={onAddMaterial}>
					Add material
				</Button>
				<Button
					className="bg-theme-4 color-theme-7 !tw-border-none !tw-ml-4 tw-rounded-md"
					onClick={onAddDrill}
				>
					Add drill
				</Button>
			</div>
		</div>
	);
};

export default TutorPlanLesson;
