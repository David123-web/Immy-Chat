import { TAILWIND_CLASS } from '@/constants';
import { globalStore } from '@/src/stores/global/global.store';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { ToolbarProps, View } from 'react-big-calendar';

interface IToolbarCalendar extends ToolbarProps {
	setCurrentView: Dispatch<SetStateAction<View>>;
	currentView: View;
	changeView: boolean;
	timeZone: boolean;
	onCustomNavigate?: () => void;
}

const ToolbarCalendar = ({
	label,
	onNavigate,
	onView,
	currentView,
	setCurrentView,
	changeView,
	timeZone,
	onCustomNavigate,
}: IToolbarCalendar) => {
	return (
		<div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
			<div className="tw-flex tw-items-center">
				{changeView && (
					<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-mr-2`} onClick={() => onNavigate('TODAY')}>
						Today
					</Button>
				)}
				<Button
					className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-2 tw-mr-0.5`}
					onClick={() => {
						onNavigate('PREV');
						onCustomNavigate && onCustomNavigate();
					}}
				>
					<LeftOutlined />
				</Button>
				<Button
					className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-2 tw-mr-2`}
					onClick={() => {
						onNavigate('NEXT');
						onCustomNavigate && onCustomNavigate();
					}}
				>
					<RightOutlined />
				</Button>
				<div>{label}</div>
			</div>
			{changeView && (
				<div className="tw-flex tw-items-center tw-gap-x-2">
					<Button
						className={`!tw-text-white !tw-border-none ${
							currentView === 'day' ? 'bg-theme-4' : '!tw-bg-[#bebebe]'
						}`}
						onClick={() => {
							onView('day');
							setCurrentView('day');
						}}
					>
						Day
					</Button>
					<Button
						className={`!tw-text-white !tw-border-none ${
							currentView === 'week' ? 'bg-theme-4' : '!tw-bg-[#bebebe]'
						}`}
						onClick={() => {
							onView('week');
							setCurrentView('week');
						}}
					>
						Weeks
					</Button>
					<Button
						className={`!tw-text-white !tw-border-none ${
							currentView === 'agenda' ? 'bg-theme-4' : '!tw-bg-[#bebebe]'
						}`}
						onClick={() => {
							onView('agenda');
							setCurrentView('agenda');
						}}
					>
						Agenda
					</Button>
				</div>
			)}
			{timeZone && (
				<div className="tw-w-1/3">
					<Form.Item name="timezone" initialValue={globalStore.timezone[0].offset}>
						<Select
							className="tw-w-full"
							options={globalStore.timezone.map((item) => ({
								label: item.text,
								value: item.offset,
							}))}
							defaultValue={globalStore.timezone[0].value}
						/>
					</Form.Item>
				</div>
			)}
		</div>
	);
};

export default ToolbarCalendar;
