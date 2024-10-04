import React, { useState } from 'react';

import ShieldIcon from '@/public/assets/img/my-space/Shield.svg';
import DiamondIcon from '@/public/assets/img/my-space/Diamond.svg';
import { Button, Modal } from 'antd';
import { TAILWIND_CLASS } from '@/constants';
import CustomTable from '../common/CustomTable';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';

interface ICertificateTable {
	course: string;
	finishedDate: string;
}

const dummyData: ICertificateTable[] = [
	{
		course: 'Moose Cree | Ricki Lynn',
		finishedDate: '03/02/2022',
	},
	{
		course: 'Moose Cree | Ricki Lynn',
		finishedDate: '03/02/2022',
	},
	{
		course: 'Moose Cree | Ricki Lynn',
		finishedDate: '03/02/2022',
	},
	{
		course: 'Moose Cree | Ricki Lynn',
		finishedDate: '03/02/2022',
	},
	{
		course: 'Moose Cree | Ricki Lynn',
		finishedDate: '03/02/2022',
	},
	{
		course: 'Moose Cree | Ricki Lynn',
		finishedDate: '03/02/2022',
	},
];

const columns: IHeaderTable<ICertificateTable & { tools: string }>[] = [
	{
		label: 'Course',
		key: 'course',
		widthGrid: '2fr',
	},
	{
		label: 'Finished date',
		key: 'finishedDate',
		widthGrid: '1fr',
	},
	{
		label: 'Certificate',
		key: 'tools',
		widthGrid: '1fr',
	},
];

const Achievement = () => {
	const [isOpenCertificateModal, setIsOpenCertificateModal] = useState(false);
	return (
		<>
			<div className="tw-pb-6">
				<h3>My Achievement</h3>
				<div className="tw-flex tw-w-full tw-gap-4">
					<div className="tw-flex tw-w-1/2 tw-border-2 tw-rounded-md border-theme-2 tw-border-solid tw-py-4 tw-items-center tw-justify-between tw-px-6">
						<div className="tw-text-2xl tw-font-semibold color-theme-2 ">
							<ShieldIcon style={{ width: '50px', height: '50px', fill: '#fff' }} /> 02 Courses
						</div>
						<Button onClick={() => {setIsOpenCertificateModal(true);}} className={`bg-theme-4 border-theme-4 color-theme-7 tw-rounded-lg`}>
							Show Certificate
						</Button>
					</div>
					<div className="tw-flex tw-w-1/2 tw-border-2 tw-rounded-md border-theme-2 tw-border-solid tw-py-4 tw-items-center tw-justify-between tw-px-6">
						<div className="tw-text-2xl tw-font-semibold color-theme-2 ">
							<DiamondIcon style={{ width: '50px', height: '50px', fill: '#fff' }} /> 25 Linguistic Gems
						</div>
						<Button onClick={() => {}} className={`bg-theme-4 border-theme-4 color-theme-7 tw-rounded-lg`}>
							Claim
						</Button>
					</div>
				</div>
			</div>

			<Modal
				width={800}
				open={isOpenCertificateModal}
				footer={null}
				destroyOnClose
				maskClosable={false}
				keyboard
        title='Course Certificate'
				onCancel={() => {
					setIsOpenCertificateModal(false);
				}}
			>
				<CustomTable
					className=""
					columns={columns}
					isLoading={false}
					data={dummyData.map((item) => ({
            ...item,
						tools: (
							<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded`} onClick={() => {}}>
								Download
							</Button>
						),
					}))}
				/>
			</Modal>
		</>
	);
};

export default Achievement;
