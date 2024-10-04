import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { IUpdateItemNameRequest } from '@/src/interfaces/mydrive/mydrive.interface';
import { updateFileName } from '@/src/services/files/apiFiles';
import { updateFolderName } from '@/src/services/folders/apiFolders';
import { Button, Form, Modal } from 'antd';
import { toast } from 'react-toastify';

interface IRenameItemModal {
	onClose: () => void;
	onRefetch: () => void;
	itemType: 'FILE' | 'FOLDER';
	itemId: string;
	isOpen: boolean;
}

const RenameItemModal = (props: IRenameItemModal) => {
	const { onClose, onRefetch, itemId, itemType, isOpen } = props;
	const updateItemNameMutation = useMutation(itemType == 'FILE' ? updateFileName : updateFolderName, {
		onSuccess: () => {
			onRefetch();
			onClose();
			toast.success('Update  name successfully');
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const onUpdateItemName = (data: { newFileName: string }) => {
		const body: IUpdateItemNameRequest = {
			id: itemId,
			name: data.newFileName,
		};
		updateItemNameMutation.mutate(body);
	};
	return (
		<Modal
			open={isOpen}
			footer={[
				<Button
					className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
					loading={updateItemNameMutation.isLoading}
					disabled={updateItemNameMutation.isLoading}
					htmlType="submit"
					form="renameFile"
				>
					OK
				</Button>,
				<Button
					onClick={onClose}
					loading={updateItemNameMutation.isLoading}
					disabled={updateItemNameMutation.isLoading}
				>
					Cancel
				</Button>,
			]}
			width={400}
			destroyOnClose
			maskClosable={false}
			keyboard
			onCancel={onClose}
		>
			<p className="tw-text-xl tw-my-2 tw-mx-6 tw-font-semibold tw-text-center">Enter A Name</p>
			<Form id="renameFile" onFinish={onUpdateItemName} layout="vertical">
				<Form.Item
					name="newFileName"
					rules={[
						{
							required: true,
							message: 'Please input name!',
						},
					]}
				>
					<input className="tw-h-10 tw-text-base tw-box-border tw-rounded-sm tw-w-full tw-px-3 tw-border-solid tw-border-[1px] tw-border-[#d9d9d9] focus:tw-border-[#b4dbed] focus:tw-outline-0 focus:tw-shadow-[0_0_3px_#c4e6f5] " />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default RenameItemModal;
