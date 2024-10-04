import { TAILWIND_CLASS } from '@/constants';
import { IAddDrillForm, IDrillData, IPlanDrill, TUTOR_DRILL_TYPE } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { CheckSquareOutlined, EyeFilled, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import TutorPlanDrillModal from './TutorPlanDrillModal';

interface ITutorPlanDrillItem {
	drill: IPlanDrill;
	onOpenEditDrill: (isOpenModal: boolean) => void;
	onOpenPreviewDrill: (isOpenModal: boolean) => void;
	onDeleteDrill: () => void;
}

const TutorPlanDrillItem = (props: ITutorPlanDrillItem) => {
	const { drill, onOpenEditDrill, onDeleteDrill, onOpenPreviewDrill } = props;

	return (
		<>
			<div className="tw-h-12 tw-w-full tw-flex tw-items-center tw-justify-between tw-bg-zinc-100 tw-pl-6 tw-pr-4 tw-mb-2">
				<div className="tw-flex tw-items-center">
					<CheckSquareOutlined className="color-theme-5 tw-text-2xl" />
					<span className="tw-font-medium tw-text-lg tw-ml-4">{drill.type}</span>
				</div>

				<div>
				  {drill.type != TUTOR_DRILL_TYPE.SORT_THE_PARAGRAPH &&
					<EyeFilled
						className="color-theme-7 bg-theme-3 tw-text-xl tw-px-2 tw-py-[1px] tw-mr-3 tw-rounded tw-cursor-pointer"
						onClick={() => onOpenPreviewDrill(true)}
					/>}
					<Button
						onClick={() => onOpenEditDrill(true)}
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-md tw-mr-4`}
					>
						Edit
					</Button>
					<DeleteOutlined onClick={() => onDeleteDrill()} className="color-theme-1 tw-text-2xl" />
				</div>
			</div>
		</>
	);
};

export default TutorPlanDrillItem;
