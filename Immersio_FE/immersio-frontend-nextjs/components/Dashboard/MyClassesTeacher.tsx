import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useQuery } from '@/hooks/useQuery';
import {
	BOOKING_CONFIRMATION,
	IListTutorClassResponse,
	ITutorClass,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { getClasses } from '@/src/services/tutorMatch/apiTutorMatch';
import { globalStore } from '@/src/stores/global/global.store';
import { Avatar, Button } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import router from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';

const MyClassesTeacher = () => {
	/* ----------------------------- GET TUTOR CLASS ---------------------------- */
	const [listTutorClasses, setListTutorClasses] = useState<IListTutorClassResponse>({
		total: 0,
		data: [],
	});

	const getListClassQuery = useQuery<IListTutorClassResponse>(['IListStudentClassResponse'], () => getClasses(), {
		onSuccess: (res) => {
			setListTutorClasses(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const renderActionButton = (section: ITutorClass) => {
		if (section.spaceAvailable === 0) {
			return <Button className={`${TAILWIND_CLASS.BUTTON_SECONDARY_ANTD} tw-w-full tw-rounded `}>Full</Button>;
		}
		switch (section.confirmation) {
			case BOOKING_CONFIRMATION.PENDING:
				return (
					<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded `}>Waiting for confirmation</Button>
				);
			case BOOKING_CONFIRMATION.CONFIRMED:
				return (
					<Button
						onClick={() => router.push(`${RouterConstants.DASHBOARD_TUTOR_MATCH_CLASS_ENVIRONMENT.path}/${section.id}`)}
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded `}
					>
						Enter class
					</Button>
				);
			case BOOKING_CONFIRMATION.REJECTED:
				return <Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded `}>Rejected</Button>;
			default:
				return null;
		}
	};

	const renderCourses = (data: ITutorClass[]) => {
		return data.map((section, i) => {
			const timezone = globalStore.timezone.find((x) => x.value === section.timezoneAbbr);
			return (
				<div className="tw-mb-4 tw-w-full tw-flex tw-rounded-lg tw-shadow-[0_3px_6px_#00000029] tw-py-2 tw-px-3 tw-gap-4 tw-border-[0.5px] tw-border-[#F1F3F5] tw-border-solid">
					<div className="tw-flex tw-w-[26%] tw-flex-col tw-text-center tw-justify-end ">
						<h5>{dayjs(section.startTime).format('DD MMM YYYY')}</h5>
						<div>{section.spaceAvailable} spaces available</div>
						<div className="color-theme-7 bg-theme-4 tw-px-2 tw-rounded-md">
							{dayjs(section.startTime).format('hh:mm A')} {timezone && timezone.text.match(/\((.*?)\)/)[0]}
						</div>
					</div>
					<div className="tw-h-auto tw-w-0 tw-border-[0.5px] tw-border-gray tw-border-solid tw-border-opacity-30"></div>
					<div className="tw-flex tw-w-3/4 tw-flex-col tw-gap-2">
						<div>
							{globalStore.courseLanguages.find((x) => x.id === section.plan.courseLanguageId).name} |{' '}
							{section.plan.title}
						</div>
						<h5>{section.topic}</h5>
						<div className="tw-flex tw-gap-2 tw-items-center">
							{section.tutor && (
								<>
									<Avatar src={section.tutor.profile.avatarUrl} />
									<div>
										{[
											section.tutor.profile.firstName + ' ' + section.tutor.profile.lastName,
											section.tutor.profile.city,
											section.tutor.profile.state,
											section.tutor.profile.country,
										]
											.filter((item) => item !== null)
											.join(', ')}
									</div>
								</>
							)}
						</div>
					</div>
					<div className="tw-flex tw-flex-col tw-items-end tw-justify-center tw-w-[26%]">
						<h5>
							$
							{section.spaceAvailable > 0
								? dayjs(section.finishTime).diff(dayjs(section.startTime), 'hour') * section.studentChargeRateHour
								: 0}
						</h5>
						<div>{dayjs(section.finishTime).diff(dayjs(section.startTime), 'hour')} hours</div>
						{renderActionButton(section)}
					</div>
				</div>
			);
		});
	};

	return (
		<div className="col-md-12 col-12 mb-60">
			<h3 className="tw-mb-[30px]">My Classes</h3>
			{renderCourses(listTutorClasses.data)}
		</div>
	);
};

export default observer(MyClassesTeacher);
