import { TAILWIND_CLASS } from '@/constants';
import { Button, Modal, ModalProps, Typography } from 'antd';

interface INotiModal extends ModalProps {
	open: boolean;
	msg: string;
	title: string;
}

const NotiModal = (props: INotiModal) => {
	const { open, onCancel, msg, title, ...othersProps } = props;

	return (
		<>
			<Modal
				{...othersProps}
				onCancel={onCancel}
				open={open}
				title={<div className="tw-font-bold tw-text-xl">{title}</div>}
				footer={
					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md !tw-w-1/3`}
						size="large"
						onClick={onCancel}
					>
						Close
					</Button>
				}
			>
				<div className="tw-mb-6 tw-text-center tw-px-3 tw-font-medium tw-text-base">
					<Typography>{msg}</Typography>
				</div>
				<div className="tw-flex tw-w-full tw-justify-center"> </div>
			</Modal>
		</>
	);
};

export default NotiModal;
