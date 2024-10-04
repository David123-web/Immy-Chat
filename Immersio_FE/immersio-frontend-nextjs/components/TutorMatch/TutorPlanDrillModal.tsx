import { TAILWIND_CLASS } from '@/constants';
import {
	IAddDrillForm,
	IAddDrillRequest,
	IDrillData,
	IPlanDrill,
	IUpdateDrillRequest,
	TUTOR_DRILL_TYPE,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { Button, Input, Modal } from 'antd';
import React, { useRef } from 'react';
import DragAndDropDrill from './DragAndDropDrill';
import DragTheWordsDrill from './DragTheWordsDrill';
import FlashCardDrill from './FlashCardDrill';
import ListenAndFillInTheBlanksDrill from './ListenAndFillInTheBlanksDrill';
import MultipleChoiceDrill from './MultipleChoiceDrill';
import SortTheParagraphDrill from './SortTheParagraphDrill';
import FlashCardDrillReview from './FlashCardDrillReview';
import DragTheWordsDrillReview from './DragTheWordsDrillReview';
import DragAndDropDrillReview from './DragAndDropDrillReview';
import MultipleChoiceDrillReview from './MultipleChoiceDrillReview';
import ListenAndFillInTheBlanksDrillReview from './ListenAndFillInTheBlanksDrillReview';
import { useMutation } from '@/hooks/useMutation';
import { createPlanDrill, updatePlanDrill } from '@/src/services/tutorMatch/apiTutorMatch';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface ITutorPlanDrillModal {
	drill: IPlanDrill;
	onSaveDrill: (drill: IPlanDrill) => void;
	onClose: () => void;
	isOpenDrillModal: boolean;
	setIsOpenDrillModal: (isOpenAddMaterial: boolean) => void;
	isOpenDrillReviewModal: boolean;
	setIsOpenDrillReviewModal: (isOpenDrillReviewModal: boolean) => void;
}

const TutorPlanDrillModal = (props: ITutorPlanDrillModal) => {
	const router = useRouter();
	const {
		onSaveDrill,
		drill,
		isOpenDrillModal,
		setIsOpenDrillModal,
		isOpenDrillReviewModal,
		setIsOpenDrillReviewModal,
		onClose,
	} = props;
	const drillInstruction = useRef<string>(drill.instruction);
	/* ------------------------------ CREATE DRILL ------------------------------ */
	const createDrillMutation = useMutation<any, { planId: string; data: IAddDrillRequest }>(createPlanDrill, {
		onSuccess: (res) => {
			setIsOpenDrillModal(false);
			onSaveDrill(res.data);
			toast.success('Add new drill successfully!');
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ------------------------------ UPDATE DRILL ------------------------------ */
	const updateDrillMutation = useMutation<any, { drillId: string; data: IUpdateDrillRequest }>(updatePlanDrill, {
		onSuccess: (res) => {
			setIsOpenDrillModal(false);
			onSaveDrill(res.data);
			toast.success('Update drill successfully!');
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onSave = (drillData: IDrillData[]) => {
		if (drill.id == null) {
			const newDrill: IAddDrillRequest = {
				instruction: drillInstruction.current,
				lessonId: drill.lessonId,
				index: drill.index,
				sectionType: drill.sectionType,
				data: drillData,
				type: drill.type,
				parentId: ""
			};
			createDrillMutation.mutate({ planId: router.query.id as string, data: newDrill });
		} else {
			const udpatedDrill: IUpdateDrillRequest = {
				instruction: drillInstruction.current,
				lessonId: drill.lessonId,
				index: drill.index,
				sectionType: drill.sectionType,
				data: drillData,
				type: drill.type,
				parentId: ""
			};
			updateDrillMutation.mutate({ drillId: drill.id, data: udpatedDrill });
		}
	};

	const renderDrill = (drillType: TUTOR_DRILL_TYPE) => {
		switch (drillType) {
			case TUTOR_DRILL_TYPE.FLASH_CARD:
				return (
					<FlashCardDrill
						drillData={drill.data}
						onCancel={() => {
							setIsOpenDrillModal(false);
						}}
						onSave={onSave}
					/>
				);
			case TUTOR_DRILL_TYPE.DRAG_AND_DROP:
				return (
					<DragAndDropDrill
						drillData={drill.data}
						onCancel={() => {
							setIsOpenDrillModal(false);
						}}
						onSave={onSave}
					/>
				);
			case TUTOR_DRILL_TYPE.DRAG_THE_WORDS:
				return (
					<DragTheWordsDrill
						drillData={drill.data}
						onCancel={() => {
							setIsOpenDrillModal(false);
						}}
						onSave={onSave}
					/>
				);
			case TUTOR_DRILL_TYPE.MULTIPLE_CHOICES:
				return (
					<MultipleChoiceDrill
						drillData={drill.data}
						onCancel={() => {
							setIsOpenDrillModal(false);
						}}
						onSave={onSave}
					/>
				);
			case TUTOR_DRILL_TYPE.SORT_THE_PARAGRAPH:
				return (
					<SortTheParagraphDrill
						drillData={drill.data}
						onCancel={() => {
							setIsOpenDrillModal(false);
						}}
						onSave={onSave}
					/>
				);
			case TUTOR_DRILL_TYPE.LISTEN_AND_FILL_BLANKS:
				return (
					<ListenAndFillInTheBlanksDrill
						drillData={drill.data}
						onCancel={() => {
							setIsOpenDrillModal(false);
						}}
						onSave={onSave}
					/>
				);
			default:
				return null;
		}
	};

	const renderDrillReview = (drillType: TUTOR_DRILL_TYPE) => {
		switch (drillType) {
			case TUTOR_DRILL_TYPE.FLASH_CARD:
				return (
					<FlashCardDrillReview
						drill={drill}
						isOpenDrillReviewModal={isOpenDrillReviewModal}
						setIsOpenDrillReviewModal={setIsOpenDrillReviewModal}
					/>
				);
			case TUTOR_DRILL_TYPE.DRAG_AND_DROP:
				return (
					<DragAndDropDrillReview
						drill={drill}
						isOpenDrillReviewModal={isOpenDrillReviewModal}
						setIsOpenDrillReviewModal={setIsOpenDrillReviewModal}
					/>
				);
			case TUTOR_DRILL_TYPE.DRAG_THE_WORDS:
				return (
					<DragTheWordsDrillReview
						drill={drill}
						isOpenDrillReviewModal={isOpenDrillReviewModal}
						setIsOpenDrillReviewModal={setIsOpenDrillReviewModal}
					/>
				);
			case TUTOR_DRILL_TYPE.MULTIPLE_CHOICES:
				return (
					<MultipleChoiceDrillReview
						drill={drill}
						isOpenDrillReviewModal={isOpenDrillReviewModal}
						setIsOpenDrillReviewModal={setIsOpenDrillReviewModal}
					/>
				);
			case TUTOR_DRILL_TYPE.LISTEN_AND_FILL_BLANKS:
				return (
					<ListenAndFillInTheBlanksDrillReview
						drill={drill}
						isOpenDrillReviewModal={isOpenDrillReviewModal}
						setIsOpenDrillReviewModal={setIsOpenDrillReviewModal}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Modal
				title={
					<Input
						defaultValue={drillInstruction.current}
						onChange={(e) => {
							drillInstruction.current = e.target.value;
						}}
						className="tw-w-full tw-border-dashed border-theme-6 tw-border-2 tw-px-4 tw-py-2"
						placeholder={`Enter an instruction for this ${drill.type} drill`}
						id="dragAndDropTitle"
					/>
				}
				width={600}
				open={isOpenDrillModal}
				footer={null}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenDrillModal(false);
				}}
				afterClose={()=> {drillInstruction.current = null; onClose()}}
			>
				{renderDrill(props.drill.type)}
			</Modal>
			{drill.data.length > 0 && renderDrillReview(props.drill.type)}
		</>
	);
};

export default TutorPlanDrillModal;
