import { EventCalendarType } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { Checkbox } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';
import {
	Components,
	EventProps,
	NavigateAction,
	Calendar as ReactBigCalendar,
	View,
	Views,
	dayjsLocalizer,
} from 'react-big-calendar';
import ToolbarCalendar from '../TutorMatch/ToolbarCalendar';
import AvailabilityRecurrenceModal from './AvailabilityRecurrenceModal';
import {
	AvailableTime,
	AvailableTimeRepeat,
	IGetAvailableTimesResponse,
} from '@/src/interfaces/people/people.interface';
import { FormInstance } from 'antd/es/form/Form';
import utc from 'dayjs/plugin/utc';
import { useQuery } from '@/hooks/useQuery';
import { getAvailabilityTimes } from '@/src/services/people/apiPeople';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { UseQueryResult } from 'react-query';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'next-i18next';

dayjs.extend(utc);

export interface AvailableEventCalendar {
	id: number;
	allDay?: boolean;
	start: Date;
	end: Date;
	type: EventCalendarType;
}

type AvailabilityPickerProps = {
	form?: FormInstance<any>;
	listAvailableTime?: AvailableTime[];
	setListAvailableTime?: Dispatch<SetStateAction<AvailableTime[]>>;
	listAvailableTimeChecked?: AvailableTime[];
	setListAvailableTimeChecked?: Dispatch<SetStateAction<AvailableTime[]>>;
	deleteIds?: number[];
	setDeleteIds?: Dispatch<SetStateAction<number[]>>;
	currentDay: dayjs.Dayjs;
	setCurrentDay?: Dispatch<SetStateAction<dayjs.Dayjs>>;
	getAvailabilityTimesQuery?: UseQueryResult<any,any>;
};

const oneHour = 60 * 60 * 1000;
const AvailabilityPicker = (props: AvailabilityPickerProps) => {
	const { t } = useTranslation()
	const router = useRouter();
	const {
		listAvailableTime,
		setListAvailableTime,
		setDeleteIds,
		listAvailableTimeChecked,
		setListAvailableTimeChecked,
		currentDay,
		setCurrentDay,
		getAvailabilityTimesQuery
	} = props;
	
	const localizer = dayjsLocalizer(dayjs);
	const [currentView, setCurrentView] = useState<View>(Views.WORK_WEEK);
	const [events, setEvents] = useState<AvailableEventCalendar[]>(genListEvents(new Date()));
	const [isOpenAvailabilityRecurrenceModal, setIsOpenAvailabilityRecurrenceModal] = useState<boolean>(false);
	const [dateRepeated, setDateRepeated] = useState<string>('');


	function genListEvents(currentDate: Date): AvailableEventCalendar[] {
		currentDate.setHours(0, 0, 0, 0);
		const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
		const endOfWeek = new Date(startOfWeek.getTime());
		endOfWeek.setDate(endOfWeek.getDate() + 6);
		const events: AvailableEventCalendar[] = [];
		for (let start = startOfWeek; start <= endOfWeek; start.setDate(start.getDate() + 1)) {
			for (let hour = 0; hour < 24; hour++) {
				const eventStart = new Date(start.getTime() + hour * oneHour);
				events.push({
					id: start.getTime() + hour,
					allDay: false,
					start: eventStart,
					end: new Date(eventStart.getTime() + oneHour),
					type: EventCalendarType.Meeting,
				});
			}
		}
		return events;
	}

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
				<div className={`tw-text-sm ${sameDayMonthYear ? 'bg-theme-4' : 'tw-text-black'}`}>
					{dayjs(date).format('ddd')}
				</div>
				<div
					className={`tw-text-2xl tw-font-medium ${
						sameDayMonthYear ? 'tw-text-white bg-theme-4' : 'tw-text-black'
					} tw-px-1.5 tw-py-1`}
				>
					{dayjs(date).format('DD')}
				</div>
			</div>
		);
	};
	console.log('listAvailableTime', listAvailableTime) // DB => 31 32
	console.log('listAvailableTimeChecked', listAvailableTimeChecked) // Lưu lại những record mình check
	const AvailabilityEvent = (props: EventProps<AvailableEventCalendar>) => {
		return (
			<div className="tw-p-1 tw-flex tw-gap-x-2 tw-items-center tw-justify-center tw-h-full hover-color-theme-4">
				<Checkbox
					checked={
						!!listAvailableTime
							.concat(listAvailableTimeChecked)
							.find((item) => item.start === dayjs(props.event.start).utc(true).toISOString())
					}
					onChange={(e) => {
						// uncheck behavior
						const availableTimeExistInDB = listAvailableTime.find(
							(item) => item.start === dayjs(props.event.start).utc(true).toISOString()
						);
						const isUnCheck = !e.target.checked;
						if (isUnCheck) {
							if (availableTimeExistInDB) {
								setDeleteIds((prev) => {
									return [
										...prev,
										getAvailabilityTimesQuery.data.data.availableTimes ?
										getAvailabilityTimesQuery.data.data.availableTimes.find(
											(item) => item.start === dayjs(props.event.start).utc(true).toISOString()
										).id:
										getAvailabilityTimesQuery.data.data.find(
											(item) => item.start === dayjs(props.event.start).utc(true).toISOString()
										).id
									];
								});
								setListAvailableTime((prev) => {
									return prev.filter((item) => item.start !== dayjs(props.event.start).utc(true).toISOString());
								});
							} else {
								setListAvailableTimeChecked((prev) => {
									return prev.filter((item) => item.start !== dayjs(props.event.start).utc(true).toISOString());
								});
							}
						} else {
							setListAvailableTimeChecked((prev) => {
								return [
									...prev,
									{
										repeat: null,
										start: dayjs(props.event.start).utc(true).toISOString(),
									},
								];
							});
						}
					}}
				/>
				<div
					className="tw-cursor-pointer"
					onClick={() => {
						setIsOpenAvailabilityRecurrenceModal(true);
						setDateRepeated(dayjs(props.event.start).utc(true).toISOString());
					}}
				>
					Repeat
				</div>
			</div>
		);
	};

	const components: Components<AvailableEventCalendar, object> = {
		toolbar: (props) => (
			<ToolbarCalendar
				{...props}
				currentView={currentView}
				setCurrentView={setCurrentView}
				changeView={false}
				timeZone={false}
			/>
		),
		timeGutterHeader: CurrentGTM,
		week: {
			header: ({ date }) => <HeaderDay date={date} />,
			event: AvailabilityEvent,
		},
	};

	return (
		<>
			<ReactBigCalendar
				className="tw-w-full availability-calendar"
				dayLayoutAlgorithm={'no-overlap'}
				defaultView={Views.WEEK}
				events={events}
				localizer={{
					...localizer,
					format: localizer.format,
					formats: {
						...localizer.formats,
						dayHeaderFormat: 'dddd MM, YYYY',
						dayRangeHeaderFormat: (range) => {
							return `${dayjs(range.start).format('MMM DD')} - ${dayjs(range.end).format('MMM DD')}`;
						},
					},
				}}
				onNavigate={(date: Date, view: View, action: NavigateAction) => {
					setCurrentDay(dayjs(date));
					setEvents(genListEvents(date));
				}}
				onSelectEvent={() => {}}
				onSelectSlot={() => {}}
				selectable
				style={{
					height: '60vh',
				}}
				views={['week']}
				components={components}
			/>
			<AvailabilityRecurrenceModal
				isOpen={isOpenAvailabilityRecurrenceModal}
				setIsOpen={setIsOpenAvailabilityRecurrenceModal}
				dateRepeated={dateRepeated}
				setDateRepeated={setDateRepeated}
				listAvailableTimeChecked={listAvailableTimeChecked}
				setListAvailableTimeChecked={setListAvailableTimeChecked}
			/>
		</>
	);
};

export default AvailabilityPicker;
