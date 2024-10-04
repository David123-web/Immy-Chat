import { PAGE_SIZE } from '@/constants';
import { useQuery } from '@/hooks/useQuery';
import { IGetListTutorResponse } from '@/src/interfaces/user/user.interface';
import { getTutors } from '@/src/services/user/apiUser';
import { Select, Space, Spin } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface IAssignTutors {
	setValueTutorIds: (ids: number[]) => void;
	initialList: any[];
}

interface ISelectTutorOption {
	total: number;
	tutors: {
		id: number;
		firstName: string;
		lastName: string;
	}[];
}

const AssignTutors = (props: IAssignTutors) => {
	const { setValueTutorIds, initialList } = props;
	const [currentPage, setCurrentPage] = useState(1);
	/* ----------------------------- GET LIST TUTOR ----------------------------- */
	const [listOptions, setListOptions] = useState<ISelectTutorOption>({
		total: 0,
		tutors: [...initialList?.map(tutor => {
      return {
        id: tutor.id,
        firstName: tutor.profile.firstName,
        lastName: tutor.profile.lastName,
      };
    })],
	});

	const getListTutorQuery = useQuery<IGetListTutorResponse>(
		['IListUserByRoleResponse'],
		() =>
			getTutors({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
			}),
		{
			onSuccess: (res) => {
				setListOptions({
					total: res.data.total,
					tutors: listOptions.tutors
						.concat(
							...res.data.tutors.map((tutor) => {
								return {
									id: tutor.id,
									firstName: tutor.profile.firstName,
									lastName: tutor.profile.lastName,
								};
							})
						)
						.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id))
            .sort((a,b) => a.id - b.id),
				});
				if (res.data.tutors.length === 0) {
					setCurrentPage(1);
				} else {
					setCurrentPage(currentPage + 1);
				}
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	const onLoadingTutor = (event: any) => {
		const target = event.target;
		if (target.scrollTop + target.offsetHeight === target.scrollHeight && listOptions.total > listOptions.tutors.length) {
			getListTutorQuery.refetch();
		}
	};

	return (
		<>
			<div className="tw-w-full">
				<Select
					className="tw-w-full"
					showSearch
          defaultValue={initialList.map(x => x.id)}
					placeholder="Assign tutors"
					filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
					dropdownRender={(menu) => (
						<>
							{menu}
							{getListTutorQuery.isFetching || getListTutorQuery.isRefetching ? (
								<Space style={{ padding: '0 4px', justifyContent: 'center', width: '100%' }}>
									<Spin size="default" />
								</Space>
							) : null}
						</>
					)}
					options={listOptions.tutors.map((tutor) => ({
						value: tutor.id,
						label: `${tutor.firstName} - ${tutor.lastName}`,
					}))}
					mode="multiple"
					onPopupScroll={onLoadingTutor}
					onChange={(opt) => {
						setValueTutorIds(opt);
					}}
				/>
			</div>
		</>
	);
};

export default AssignTutors;
