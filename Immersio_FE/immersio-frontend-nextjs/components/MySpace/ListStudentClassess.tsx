import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import {
  BOOKING_CONFIRMATION,
  GetTutorInfoResponse,
  ITutorClass
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { globalStore } from '@/src/stores/global/global.store';
import { Avatar, Button, Empty, Form, Select } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import BookingTutorModal from '../TutorMatch/BookingTutorModal';
import TutorInforModal from '../TutorMatch/TutorInforModal';

interface IListStudentClasses {
	hasFilter?: boolean;
	data?: ITutorClass[];
	refetchData?: () => void;
}

const ListStudentClassess = (props: IListStudentClasses) => {
	const [isOpenBookingTutorModal, setIsOpenBookingTutorModal] = useState<boolean>(false);
	const [isOpenTutorInforModal, setIsOpenTutorInforModal] = useState<boolean>(false);
	const { hasFilter = false, data = [], refetchData } = props;
	const currentTutorInfo = useRef<GetTutorInfoResponse>(null);
	const currentClassId = useRef<number>(null);
	const router = useRouter();

	const renderActionButton = (section: ITutorClass) => {
		console.log('section', section);
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
			case null:
				return (
					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded `}
						onClick={() => {
							if (section.tutor) {
								currentTutorInfo.current = section.tutor;
							}
							currentClassId.current = section.id;
							setIsOpenBookingTutorModal(true);
						}}
					>
						Book now
					</Button>
				);
		}
	};

  const renderCourses = (data: ITutorClass[]) => {
		return data.map((section, i) => {
			console.log('section', section);
			return (
				<div className="tw-w-full tw-flex tw-rounded-lg tw-shadow-[0_3px_6px_#00000029] tw-py-2 tw-px-3 tw-gap-4 tw-border-[0.5px] tw-border-[#F1F3F5] tw-border-solid">
					<div className="tw-flex tw-w-[26%] tw-flex-col tw-text-center tw-justify-end ">
						<h5>{dayjs(section.startTime).format('DD MMM YYYY')}</h5>
						<div>{section.spaceAvailable} spaces available</div>
						<div className="color-theme-7 bg-theme-4 tw-px-2 tw-rounded-md">
							{dayjs(section.startTime).format('hh:mm A')}{' '}
							{globalStore.timezone.find((x) => x.value === section.timezoneAbbr).text.match(/\((.*?)\)/)[0]}
						</div>
					</div>
					<div className="tw-h-auto tw-w-0 tw-border-[0.5px] tw-border-gray tw-border-solid tw-border-opacity-30"></div>
					<div className="tw-flex tw-w-3/4 tw-flex-col tw-gap-2">
						<div>
							{globalStore.courseLanguages.find((x) => x.id === section.plan.courseLanguageId).name} |{' '}
							{section.plan.title}
						</div>
						<h5>{section.topic}</h5>
						<div
							className="tw-flex tw-gap-2 tw-items-center tw-cursor-pointer"
							onClick={() => setIsOpenTutorInforModal(true)}
						>
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
								? dayjs(section.finishTime).diff(dayjs(section.startTime), 'hour') *
								  section.studentChargeRateHour
								: 0}
						</h5>
						<div>{dayjs(section.finishTime).diff(dayjs(section.startTime), 'hour')} hours</div>
						{renderActionButton(section)}
					</div>
				</div>
			);
		});
	};
	return data.length === 0 ? (
		<Empty className="tw-mt-10 tw-w-full" />
	) : (
		<div className="tw-flex tw-items-start tw-gap-8">
			<div className="tw-flex tw-grow tw-flex-col tw-gap-4 tw-w-4/5">{renderCourses(data)}</div>
			{hasFilter && (
				<div className="tw-w-1/5">
					<h5>Filter</h5>
					<Form className="tw-m-auto" layout="vertical">
						<Form.Item name="tutor" label="Tutor">
							<Select
								className="tw-w-full"
								showSearch
								placeholder="Select a tutor"
								filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
								options={globalStore.courseLanguages.map((la) => ({
									value: la.id,
									label: la.name,
								}))}
							/>
						</Form.Item>
						<Form.Item name="classStatus" label="Class status">
							<Select
								className="tw-w-full"
								showSearch
								placeholder="Select status"
								filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
								options={globalStore.courseLanguages.map((la) => ({
									value: la.id,
									label: la.name,
								}))}
							/>
						</Form.Item>
						<Form.Item name="location" label="Location">
							<Select
								className="tw-w-full"
								showSearch
								placeholder="Select a location"
								filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
								options={globalStore.courseLanguages.map((la) => ({
									value: la.id,
									label: la.name,
								}))}
							/>
						</Form.Item>
					</Form>
				</div>
			)}
			{currentTutorInfo.current && currentClassId.current && (
				<BookingTutorModal
					data={{ tutorInfo: currentTutorInfo.current, classId: currentClassId.current }}
					isOpenModal={isOpenBookingTutorModal}
					setIsOpenModal={setIsOpenBookingTutorModal}
					setIsOpenTutorInforModal={setIsOpenTutorInforModal}
					refetchListClass={refetchData}
				/>
			)}
			{currentTutorInfo.current && (
				<TutorInforModal
					tutorInfor={currentTutorInfo.current}
					isOpenModal={isOpenTutorInforModal}
					setIsOpenModal={setIsOpenTutorInforModal}
				/>
			)}
		</div>
	);
};

export default ListStudentClassess;
