import React from 'react';
import UserAvatar from './UserAvatar';

interface ITutoringPlanHeader {
	courseName: string;
	instructorName: string;
	tutorName: string;
  instructorAvatar: string;
	tutorAvatar: string;
}

const HeaderEditTutoringPlan = (props: ITutoringPlanHeader) => {
	const { courseName, instructorName, tutorName,instructorAvatar,tutorAvatar, } = props;
	return (
		<div>
			<div className="tw-text-2xl tw-font-bold">{`Tutoring plan > Edit`}</div>
			<div className="tw-py-4 tw-text-base">
				Your own tutoring plan can be added to each and every lesson of the course that has been assigned to your class.
				You have the option to share some or all of the resources in this tutoring plan with your students.
			</div>
			<div className="tw-text-4xl tw-font-bold tw-border color-theme-6 tw-border-solid tw-rounded-md tw-p-2">
				{courseName}
			</div>
			<div className="tw-py-6 tw-flex tw-justify-between tw-items-center">
				<div className="tw-text-base tw-flex tw-items-center">
					Instructor:
					<UserAvatar
						avatarUrl={instructorAvatar}
						userName={instructorName}
					/>
				</div>
				<div className="tw-text-base tw-flex tw-items-center">
					Tutor:
					<UserAvatar
						avatarUrl={tutorAvatar}
						userName={tutorName}
					/>
				</div>
			</div>
		</div>
	);
};

export default HeaderEditTutoringPlan;
