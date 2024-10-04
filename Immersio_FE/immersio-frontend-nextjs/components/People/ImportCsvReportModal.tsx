import { PAGE_SIZE } from '@/constants';
import { ReportItem } from '@/src/interfaces/people/people.interface';
import { Button, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React from 'react';

interface IImportCsvReportModal {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
  reportItems: ReportItem[];
}

const ImportCsvReportModal = (props: IImportCsvReportModal) => {
	const { isOpen, setIsOpen, reportItems } = props;

	const columns: ColumnsType<ReportItem> = [
		{
			title: 'Record',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Error fieldd',
			dataIndex: 'errors',
			render: (_, record) => (
				<div>{record.errors.join(', ')}</div>
			),
		},
	];

	return (
		<Modal
			title="Import report"
			open={isOpen}
			onCancel={() => setIsOpen(false)}
			width={1000}
			closable={false}
			footer={[
				<Button
					onClick={() => {
						setIsOpen(false);
					}}
				>
					Cancel
				</Button>,
			]}
		>
			<Table dataSource={reportItems} columns={columns} pagination={{hideOnSinglePage: true}}/>
		</Modal>
	);
};

export default ImportCsvReportModal;
