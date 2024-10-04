import { TAILWIND_CLASS } from '@/constants';
import { AvailableTime, AvailableTimeRepeat, DayOfWeek, RepeatType } from '@/src/interfaces/people/people.interface';
import { Button, Checkbox, DatePicker, Form, InputNumber, Modal, Radio, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction, useState } from 'react';

interface IAvailabilityRecurrenceModal {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	dateRepeated: string;
	setDateRepeated: (dateRepeated: string) => void;
	listAvailableTimeChecked?: AvailableTime[];
	setListAvailableTimeChecked?: Dispatch<SetStateAction<AvailableTime[]>>;
}

enum EndType {
	Never = 'never',
	On = 'on',
	After = 'after',
	Clear = 'clear',
}

const AvailabilityRecurrenceModal = (props: IAvailabilityRecurrenceModal) => {
	const { t } = useTranslation()
	const [form] = useForm<AvailableTimeRepeat>();
	const { isOpen, setIsOpen, dateRepeated, setDateRepeated, listAvailableTimeChecked, setListAvailableTimeChecked } =
		props;
	const [showRecurrence, setShowRecurrence] = useState(false);
	const [endType, setEndType] = useState(EndType.Never);

	const disabledPastDate = (current: any): boolean => {
		return current && current.valueOf() < dayjs(dateRepeated).unix() * 1000;
	};

	const onFinish = (data: AvailableTimeRepeat) => {
		const dto: AvailableTime = {
			start: dateRepeated,
			repeat:
				endType === EndType.Clear
					? null
					: {
							amount: data.type === RepeatType.WEEK ? data.amount * 7 : data.amount,
							dateExceptions: [],
							dayOfWeeks: data.type === RepeatType.DAY || data.type === RepeatType.MONTH ? [] : data.dayOfWeeks,
							end:
								endType === EndType.Never || endType === EndType.After ? null : dayjs(data.end).utc(true).toISOString(),
							occurrence: endType === EndType.After ? data.occurrence : null,
							type: data.type,
					  },
		};
		const availableTimeExistChecked = listAvailableTimeChecked.find((item) => item.start === dateRepeated);
		if (availableTimeExistChecked) {
			const assignData = Object.assign(availableTimeExistChecked, dto);
			setListAvailableTimeChecked([
				...listAvailableTimeChecked.filter((item) => item.start !== dateRepeated),
				assignData,
			]);
		} else {
			setListAvailableTimeChecked([...listAvailableTimeChecked, dto]);
		}
		setIsOpen(false);
	};

	return (
		<Modal
			title={t('dashboard.title.custom_recurrence')}
			open={isOpen}
			onCancel={() => setIsOpen(false)}
			className="drillModal"
			width={460}
			closable={false}
			footer={[
				<Button
					onClick={() => {
						setDateRepeated('');
						setIsOpen(false);
					}}
				>
					{t('dashboard.button.cancel')}
				</Button>,
				<Button
					onClick={() => {
						form.submit();
					}}
					className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
				>
					{t('dashboard.button.add')}
				</Button>,
			]}
		>
			<Form onFinish={onFinish} form={form}>
				<div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
					<div>
						<span className="tw-mr-2">{t('dashboard.label.repeat_every')}</span>
						<Form.Item name="amount" className="tw-mb-0" initialValue={1}>
							<InputNumber defaultValue={1} min={1} style={{ width: '100px' }} />
						</Form.Item>
					</div>
					<Form.Item name="type" className="tw-mb-0 tw-mt-6" initialValue={RepeatType.DAY}>
						<Radio.Group defaultValue={RepeatType.DAY} buttonStyle="solid" className="tw-flex tw-gap-2">
							<Radio.Button value={RepeatType.DAY} onClick={() => setShowRecurrence(false)}>
								{t('dashboard.calendar.day')}
							</Radio.Button>
							<Radio.Button value={RepeatType.WEEK} onClick={() => setShowRecurrence(true)}>
								{t('dashboard.calendar.week')}
							</Radio.Button>
							<Radio.Button value={RepeatType.MONTH} onClick={() => setShowRecurrence(false)}>
								{t('dashboard.calendar.month')}
							</Radio.Button>
						</Radio.Group>
					</Form.Item>
				</div>
				{showRecurrence && (
					<div className="tw-flex tw-justify-start tw-items-center tw-mb-4">
						<div className="tw-mr-6">{t('dashboard.label.repeat_on')}</div>
						<Form.Item
							name="dayOfWeeks"
							className="tw-mb-0"
							initialValue={[dayjs(dateRepeated).format('ddd').toUpperCase()]}
						>
							<Checkbox.Group
								defaultValue={[dayjs(dateRepeated).format('ddd').toUpperCase()]}
								className="recurrence-checkbox"
							>
								<Checkbox
									value={DayOfWeek.SUN}
									disabled={dayjs(dateRepeated).format('ddd').toUpperCase() === DayOfWeek.SUN}
								>
									{t('dashboard.calendar.sun')}
								</Checkbox>
								<Checkbox
									value={DayOfWeek.MON}
									disabled={dayjs(dateRepeated).format('ddd').toUpperCase() === DayOfWeek.MON}
								>
									{t('dashboard.calendar.mon')}
								</Checkbox>
								<Checkbox
									value={DayOfWeek.TUE}
									disabled={dayjs(dateRepeated).format('ddd').toUpperCase() === DayOfWeek.TUE}
								>
									{t('dashboard.calendar.tue')}
								</Checkbox>
								<Checkbox
									value={DayOfWeek.WED}
									disabled={dayjs(dateRepeated).format('ddd').toUpperCase() === DayOfWeek.WED}
									>
									{t('dashboard.calendar.wed')}
								</Checkbox>
								<Checkbox
									value={DayOfWeek.THU}
									disabled={dayjs(dateRepeated).format('ddd').toUpperCase() === DayOfWeek.THU}
								>
									{t('dashboard.calendar.thu')}
								</Checkbox>
								<Checkbox
									value={DayOfWeek.FRI}
									disabled={dayjs(dateRepeated).format('ddd').toUpperCase() === DayOfWeek.FRI}
								>
									{t('dashboard.calendar.fri')}
								</Checkbox>
								<Checkbox
									value={DayOfWeek.SAT}
									disabled={dayjs(dateRepeated).format('ddd').toUpperCase() === DayOfWeek.SAT}
								>
									{t('dashboard.calendar.sat')}
								</Checkbox>
							</Checkbox.Group>
						</Form.Item>
					</div>
				)}
				<div className="tw-flex tw-justify-start tw-items-start">
					<div className="tw-mr-14">{t('dashboard.label.ends')}</div>
					<Radio.Group defaultValue={EndType.Never} onChange={(e) => setEndType(e.target.value)}>
						<Space direction="vertical">
							<Radio value={EndType.Never}>{t('dashboard.option.never')}</Radio>
							<Radio value={EndType.On} className="tw-flex tw-items-center">
								<span className="tw-flex tw-items-center">
									<span className="tw-mr-6 tw-mt-1.5">{t('dashboard.option.on')}</span>
									<Form.Item
										name="end"
										className="tw-mb-0"
										rules={[{ required: endType === EndType.On, message: t('dashboard.notification.end_date_is_required') }]}
									>
										<DatePicker suffixIcon={null} style={{ width: '150px' }} disabledDate={disabledPastDate} />
									</Form.Item>
								</span>
							</Radio>
							<Radio value={EndType.After}>
								<span className="tw-flex tw-items-center">
									<span className="tw-mr-3">
										{t('dashboard.label.after')}
									</span>
									<Form.Item name="occurrence" className="tw-mb-0" initialValue={0}>
										<InputNumber
											defaultValue={0}
											min={0}
											formatter={(value) => `${value} occurrence(s)`}
											style={{ width: '150px' }}
										/>
									</Form.Item>
								</span>
							</Radio>
							<Radio value={EndType.Clear}>
								<span className="tw-flex tw-items-center">
									{t('dashboard.button.clear_all_recurrence')}
								</span>
							</Radio>
						</Space>
					</Radio.Group>
				</div>
			</Form>
		</Modal>
	);
};

export default AvailabilityRecurrenceModal;
