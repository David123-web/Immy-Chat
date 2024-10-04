import ToolbarCalendar from '@/components/TutorMatch/ToolbarCalendar';
import TutorClassesLayout from '@/components/TutorMatch/layout/TutorClasses';
import { eventColorsThemeDemo } from '@/constants';
import { withTranslationsProps } from '@/src/next/with-app';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Calendar, Form, Select } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import {
	Components,
	EventProps,
	NavigateAction,
	Calendar as ReactBigCalendar,
	View,
	Views,
	dayjsLocalizer,
} from 'react-big-calendar';
import {
	CalendarClass,
	EventCalendarType,
	IGetClassCalendarRequest,
} from '../../../../../interfaces/tutorMatch/tutorMatch.interface';
import { getCalendarClass } from '@/src/services/tutorMatch/apiTutorMatch';
import { toast } from 'react-toastify';
import { useQuery } from '@/hooks/useQuery';
import { AvailableEventCalendar } from '@/components/People/AvailabilityPicker';
import { userStore } from '@/src/stores/users/users.store';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import EventDetailModal from './EventDetailModal';
import { RepeatType } from '@/src/interfaces/people/people.interface';

const currentDayTemp = new Date().getDate();

export interface EventCalendar {
	id: number;
	title: string;
	allDay?: boolean;
	start: Date;
	end: Date;
	type: EventCalendarType;
	teacherName: string;
	color: string;
	isRepeat: boolean;
	repeatType: RepeatType;
	repeatUntilDate: Date;
	teachingLanguageId : number;
	price: number;
	topic: string;
	spaceAvailable: number;
}
const testEvents: EventCalendar[] = [
	// {
	// 	id: 0,
	// 	title: 'All Day Event very long title',
	// 	allDay: false,
	// 	start: new Date(2023, 8, currentDayTemp, 9, 0),
	// 	end: new Date(2023, 8, currentDayTemp, 11, 0),
	// 	type: EventCalendarType.Meeting,
	// 	teacherName: 'David Sigrist',
	// 	color: '#26a69a',
	// },
	// {
	// 	id: 1,
	// 	title: 'All Day Event very long title',
	// 	allDay: false,
	// 	start: new Date(2023, 7, currentDayTemp, 7, 0),
	// 	end: new Date(2023, 7, currentDayTemp, 9, 0),
	// 	type: EventCalendarType.Holiday,
	// 	teacherName: 'Julia Fernandez',
	// 	color: '#26a69a',
	// },
	// {
	// 	id: 2,
	// 	title: 'All Day Event very long title',
	// 	allDay: false,
	// 	start: new Date(2023, 8, currentDayTemp, 13, 0),
	// 	end: new Date(2023, 8, currentDayTemp, 15, 0),
	// 	type: EventCalendarType.Birthday,
	// 	teacherName: 'Julia Fernandez',
	// 	color: '#26a69a',
	// },
];

const TutorCalendar = () => {
	const localizer = dayjsLocalizer(dayjs);
	const [currentView, setCurrentView] = useState<View>(Views.DAY);
	const [events, setEvents] = useState<EventCalendar[]>([]);
	const [currentDay, setCurrentDay] = useState(dayjs());
	const [isOpenEventDetailModal, setIsOpenEventDetailModal] = useState<boolean>(false);
	const selectedEvent = useRef<EventCalendar>(null);

	/* ------------------------- GET LIST STUDENT CLASS ------------------------- */
	const getListStudentClassQuery = useQuery<CalendarClass[], IGetClassCalendarRequest>(
		['IGetClassCalendarRequest', currentDay],
		() =>
			getCalendarClass({
				startDate: currentDay.startOf('week').utc(true).toISOString(),
				endDate: currentDay.endOf('week').utc(true).toISOString(),
			}),
		{
			enabled: userStore.currentUser.role === ROLE_TYPE.STUDENT,
			onSuccess: (res) => {
				setEvents(
					res.data.map((x) => {
						return {
							id: x.id,
							title: x.plan.title,
							teacherName:x.classBookingRequests.tutor.profile.firstName + ' ' + x.classBookingRequests.tutor.profile.lastName,
							allDay: false,
							start: new Date(x.startTime),
							end: new Date(x.finishTime),
							type: EventCalendarType.Meeting,
							color: x.plan.calendarColour,
							isRepeat: x.isRepeat,
							repeatType: x.repeatType,
							repeatUntilDate: x.repeatUntilDate,
							teachingLanguageId : x.plan.courseLanguageId,
							price: dayjs(x.finishTime).diff(dayjs(x.startTime), 'hour') *
							x.studentChargeRateHour,
							topic: x.topic,
							spaceAvailable: x.spaceAvailable,
						};
					})
				);
			},
			onError: (err) => {
				toast.error('Get list student class failed');
			},
		}
	);

	const CurrentGTM = () => {
		return (
			<div className="tw-text-center tw-h-full tw-flex tw-flex-col tw-justify-center">
				<div>GMT</div>
				<div>{dayjs().format('Z')}</div>
			</div>
		);
	};

	const HeaderDay = ({ date }: { date?: Date }) => {
		const sameDayMonthYear = dayjs(date).format('YYYY-MM-DD') === dayjs(new Date()).format('YYYY-MM-DD');
		return (
			<div className="tw-text-center tw-ml-2">
				<div className={`tw-text-sm ${sameDayMonthYear ? 'color-theme-4' : 'color-theme-1'}`}>
					{dayjs(date).format('ddd')}
				</div>
				<div
					className={`tw-text-2xl tw-font-medium ${
						sameDayMonthYear ? 'color-theme-7 bg-theme-4' : 'color-theme-1'
					} tw-px-1.5 tw-py-1`}
				>
					{dayjs(date).format('DD')}
				</div>
			</div>
		);
	};

	const eventPropGetter = (event: EventCalendar) => {
		const bgColor = eventColorsThemeDemo[event.type];
		return {
			style: {
				backgroundColor: event.color,
				color: '#fff',
			},
		};
	};

	const customEvent = (props: EventProps<EventCalendar>) => {
		return (
			<div className="tw-p-1 tw-flex tw-flex-col tw-gap-y-2 tw-justify-center tw-h-full">
				<div>{props.event.title}</div>
				<div>{props.event.teacherName}</div>
				<div>
					{dayjs(props.event.start).format('HH:mm')} - {dayjs(props.event.end).format('HH:mm')}
				</div>
			</div>
		);
	};

	const components: Components<EventCalendar, object> = {
		toolbar: (props) => (
			<ToolbarCalendar
				{...props}
				currentView={currentView}
				setCurrentView={setCurrentView}
				changeView={true}
				timeZone={false}
			/>
		),
		timeGutterHeader: CurrentGTM,
		week: {
			header: ({ date }) => <HeaderDay date={date} />,
		},
		event: customEvent,
	};

	return (
		<TutorClassesLayout>
			<div className="tw-flex tw-gap-4 tw-w-full">
				<div className="tw-flex-1">
					<ReactBigCalendar
						className="tw-w-full tutor-calendar"
						eventPropGetter={eventPropGetter}
						dayLayoutAlgorithm={'no-overlap'}
						defaultView={Views.WEEK}
						events={events}
						localizer={{
							...localizer,
							format: localizer.format,
							formats: {
								...localizer.formats,
								dayHeaderFormat: 'ddd DD-MM, YYYY',
								dayRangeHeaderFormat: (range) => {
									return `${dayjs(range.start).format('MMM DD')} - ${dayjs(range.end).format('MMM DD')}`;
								},
							},
						}}
						onSelectEvent={(event) => {
							selectedEvent.current = event;
							setIsOpenEventDetailModal(true);
						}}
						onSelectSlot={() => {}}
						selectable
						onNavigate={(date: Date, view: View, action: NavigateAction) => {
							setCurrentDay(dayjs(date));
						}}
						style={{
							height: '100vh',
						}}
						views={['day', 'week']}
						components={components}
					/>
				</div>
				{selectedEvent.current && (
					<EventDetailModal
						eventDetail={selectedEvent.current}
						isOpenDetailsModal={isOpenEventDetailModal}
						setIsOpenDetailsModal={setIsOpenEventDetailModal}
					/>
				)}
				<div className="tw-w-96">
					<div className="tw-w-full tw-flex tw-flex-col">
						<Button
							className="bg-theme-3 color-theme-7 !tw-border-none tw-rounded-md tw-w-full tw-h-10 tw-flex tw-items-center tw-justify-center"
							icon={<PlusCircleOutlined />}
						>
							Add a new class
						</Button>
						<div className="tw-font-bold tw-my-4">Filters</div>
						<Form layout="vertical">
							<Form.Item name="tutors" label="Tutor">
								<Select
									showSearch
									placeholder="Select a tutor"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={[]}
								/>
							</Form.Item>
							<Form.Item name="students" label="Students">
								<Select
									showSearch
									placeholder="Select a student"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={[]}
								/>
							</Form.Item>
							<Form.Item name="plan" label="Plan">
								<Select
									showSearch
									placeholder="Select a course plan"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={[]}
								/>
							</Form.Item>
							<Form.Item name="classStatus" label="Class status">
								<Select
									showSearch
									placeholder="All"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={[]}
								/>
							</Form.Item>
							<Form.Item name="location" label="Location">
								<Select
									showSearch
									placeholder="All"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={[]}
								/>
							</Form.Item>
						</Form>
						<Button className="bg-theme-6 color-theme-1 !tw-border-none tw-rounded-md tw-w-full tw-h-10 tw-flex tw-items-center tw-justify-center tw-mb-4">
							Add to google calendar
						</Button>
						<div
							style={
								{
									// border: `1px solid ${token.colorBorderSecondary}`,
									// borderRadius: token.borderRadiusLG,
								}
							}
						>
							<Calendar fullscreen={false} />
						</div>
					</div>
				</div>
			</div>
		</TutorClassesLayout>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default TutorCalendar;
