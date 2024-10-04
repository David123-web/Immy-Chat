import { TAILWIND_CLASS } from "@/constants";
import { useMutation } from "@/hooks/useMutation";
import { getQueryParams } from "@/src/helpers/getQueryParams";
import { ICreateFolderRequest } from "@/src/interfaces/mydrive/mydrive.interface";
import { createFolder } from "@/src/services/folders/apiFolders";
import { Button, Form, Modal } from "antd";
import { toast } from "react-toastify";

interface ICreateFolderModal {
  onClose: () => void;
  onRefetchFolderList: () => void
  isOpen: boolean
}

const CreateFolderModal = (props: ICreateFolderModal) => {
  const { onClose, onRefetchFolderList, isOpen } = props;

  const createFolderMutation = useMutation(createFolder, {
    onSuccess: (res) => {
      onRefetchFolderList();
      onClose();
      toast.success("Create new folder successfully");
    },
    onError: (err) => {
      toast.error(err.data?.message);
    },
  });

  const onCreateFolder = (data: {folderName: string}) => {
    const body : ICreateFolderRequest = {
      name: data.folderName,
      parentFolderId: getQueryParams('parentFolderId') ?? null,
      public: true
    }
    createFolderMutation.mutate(body)
  };

  return (
    <Modal
			width={400}
			open={isOpen}
			footer={[
					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
						loading={false}
            htmlType="submit"
						form="createFolder"
					>
						OK
					</Button>,
					<Button onClick={onClose}>Cancel</Button>
      ]
			}
			destroyOnClose
			maskClosable={false}
			keyboard
      onCancel={onClose}
		>
        <p className="tw-text-xl tw-my-2 tw-mx-6 tw-font-semibold tw-text-center">
          Enter Folder Name
        </p>
        <Form id="createFolder" onFinish={onCreateFolder} layout="vertical">
          <Form.Item
            name="folderName"
            rules={[
              {
                required: true,
                message: "Please input folder name!",
              },
            ]}
          >
            <input className="tw-h-10 tw-text-base tw-box-border tw-rounded-sm tw-w-full tw-px-3 tw-border-solid tw-border-[1px] tw-border-[#d9d9d9] focus:tw-border-[#b4dbed] focus:tw-outline-0 focus:tw-shadow-[0_0_3px_#c4e6f5] " />
          </Form.Item>
        </Form>
    </Modal>
    
  );
};

export default CreateFolderModal;
