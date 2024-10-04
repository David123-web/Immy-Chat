import { TAILWIND_CLASS } from '@/constants'
import { CheckSquareOutlined, DeleteColumnOutlined, DeleteFilled, DeleteOutlined, EyeFilled } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

interface ITutorPlanMaterial {
	fileId: string,
  title: string,
  onDeleteMaterial: () => void
	onEditMaterial: () => void;
}

const TutorPlanMaterial = (props: ITutorPlanMaterial) => {
  const {fileId, title, onDeleteMaterial, onEditMaterial} = props 
  return (
    <div className='tw-h-12 tw-w-full tw-flex tw-items-center tw-justify-between tw-bg-zinc-100 tw-pl-6 tw-pr-4 tw-mb-2'>
      <div className='tw-flex tw-items-center'>
        <CheckSquareOutlined className='color-theme-5 tw-text-2xl'/>
        <span className='tw-font-medium tw-text-lg tw-ml-4'>{title}</span>
      </div>

      <div>
        {/* <EyeFilled className='color-theme-7 bg-theme-3 tw-text-xl tw-px-2 tw-py-[1px] tw-mr-3 tw-rounded' /> */}
				<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-md tw-mr-4`} onClick={onEditMaterial}>
					Edit
				</Button>
        <DeleteOutlined className='color-theme-1 tw-text-2xl tw-cursor-pointer' onClick={onDeleteMaterial}/>
			</div>
    </div>
  )
}

export default TutorPlanMaterial