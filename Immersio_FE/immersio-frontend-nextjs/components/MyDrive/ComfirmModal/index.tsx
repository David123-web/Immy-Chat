import { TAILWIND_CLASS } from '@/constants';
import { Button, Modal } from 'antd';

interface IConfirmModal {
	label: string;
	description: string;
	confirmBtnLabel: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading?: boolean;
	disabled?: boolean;
}

const ConfirmModal = (props: IConfirmModal) => {
	const { label, description, onClose, confirmBtnLabel, onConfirm, isOpen, loading = false, disabled = false } = props;
	return (
		<Modal
			width={400}
			open={isOpen}
			footer={[
				<Button className={`${TAILWIND_CLASS.BUTTON_ANTD}`} loading={loading} onClick={onConfirm} disabled={disabled}>
					{confirmBtnLabel}
				</Button>,
				<Button onClick={onClose} loading={loading} disabled={disabled}>
					Cancel
				</Button>,
			]}
			destroyOnClose
			maskClosable={false}
			keyboard
			onCancel={onClose}
		>
			<p className="tw-text-xl tw-my-2 tw-mx-6 tw-font-bold tw-text-center">{label}</p>
			<p className="tw-text-sm tw-my-2 tw-mx-6 tw-font-light tw-text-center">{description}</p>
		</Modal>
	);
};

export default ConfirmModal;
