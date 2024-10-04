import CustomTable from '@/components/common/CustomTable';
import { PAGE_SIZE } from '@/constants';
import { useQuery } from '@/hooks/useQuery';
import { IGetMailLogsResponse, columnMailLogs } from '@/src/interfaces/settings/settings.interfaces';
import { getEmailLogs } from '@/src/services/settings/apiSettings';
import { Pagination } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from 'react-toastify';

const EmailLogsTab = () => {
	const [currentPage, setCurrentPage] = useState(1);

		/* --------------------------- GET EMAIL TEMPLATES -------------------------- */
		const [mailLogs, setMailLogs] = useState<IGetMailLogsResponse>({
			total: 0,
			data: [],
		});
		const getTemplateQuery = useQuery<any, IGetMailLogsResponse>(
			['IGetMailLogsResponse', currentPage],
			() => getEmailLogs({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1)
			}
				),
			{
				onSuccess: (res) => {
					console.log(res);
					setMailLogs(res.data);
				},
				onError: (err) => {
					toast.error(err.data?.message);
				}
			}
		)

	return (
		<>
			{/* <HeaderTable
				tableName={`${getRoleName(role)}s`}
				form={formSearch}
				searchOptions={searchUserOptions}
				onAdd={() => onPushCreateUserRoute()}
				onGetSearchKey={(searchKey) => {
					setSearchKey(searchKey ?? '');
					getUserByRoleQuery.refetch();
				}}
			/> */}
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columnMailLogs}
				isLoading={getTemplateQuery.isFetching}
				data={mailLogs.data.map((item) => ({
					...item,
					timeStamp: dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss'),
					
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={mailLogs.total}
				pageSize={PAGE_SIZE}
				current={currentPage}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>
		</>
	);
};

export default EmailLogsTab;
