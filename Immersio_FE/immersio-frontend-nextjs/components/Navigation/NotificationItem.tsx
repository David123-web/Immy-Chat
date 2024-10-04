import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { checkObjectEmpty } from '@/src/helpers/strings';
import { IAcceptRejectNotificationRequest } from '@/src/interfaces/course/course.interface';
import {
	IGetListNotificationsResponse,
	IInviteAsCointructorMetaData,
	ISeenNotificationRequest,
	ISubmitBookingRequestMetaData,
	NOTIFICATION_TYPE,
} from '@/src/interfaces/notifications/notification.interface';
import { HandleBookingRequest } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { acceptInviteCoInstructor, rejectInviteCoInstructor } from '@/src/services/courses/apiCourses';
import { seenNotifications } from '@/src/services/notifications/apiNotifications';
import { acceptBookingRequest, rejectBookingRequest } from '@/src/services/tutorMatch/apiTutorMatch';
import { useMobXStores } from '@/src/stores';
import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface INotificationItem {
	data: IGetListNotificationsResponse;
	setNumberUnreadNotifications: React.Dispatch<React.SetStateAction<number>>;
	isMarkAllRead: boolean;
	onDelete: (item: IGetListNotificationsResponse) => void;
}

const NotificationItem = (props: INotificationItem) => {
	const { globalStore } = useMobXStores();
	const { setNumberUnreadNotifications, data, isMarkAllRead, onDelete } = props;
	const { seen, id, createdAt, metadata, type, disabled } = data;
	const router = useRouter();
	const [isReadNotification, setIsReadNotification] = useState(false);

	/* ---------------------------------- SEEN ---------------------------------- */
	const seenNotificationsMutation = useMutation<any, ISeenNotificationRequest>(seenNotifications, {
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});
	/* -------------------------- INVITE CO-INSTRUCTOR -------------------------- */
	/* --------------------------------- ACCEPT --------------------------------- */
	const acceptInviteMutation = useMutation<boolean, IAcceptRejectNotificationRequest>(acceptInviteCoInstructor, {
		onSuccess: () => {
			toast.success('Accept invitation co-instructor successfully!');
			globalStore.setTriggerGetNotifications();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* --------------------------------- REJECT --------------------------------- */
	const rejectInviteMutation = useMutation<boolean, IAcceptRejectNotificationRequest>(rejectInviteCoInstructor, {
		onSuccess: () => {
			toast.success('Reject invitation co-instructor successfully!');
			globalStore.setTriggerGetNotifications();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ----------------------------- BOOKING REQUEST ---------------------------- */
	/* --------------------------------- ACCEPT --------------------------------- */
	
	const accepBookingMutation = useMutation<boolean, HandleBookingRequest>(acceptBookingRequest, {
		onSuccess: () => {
			toast.success('Accept booking request successfully!');
			globalStore.setTriggerGetNotifications();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* --------------------------------- REJECT --------------------------------- */
	const rejectBookingMutation = useMutation<boolean, HandleBookingRequest>(rejectBookingRequest, {
		onSuccess: () => {
			toast.success('Reject booking request successfully!');
			globalStore.setTriggerGetNotifications();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const rederNotiItem = (metadata: IInviteAsCointructorMetaData | ISubmitBookingRequestMetaData) => {
		switch (type) {
			case NOTIFICATION_TYPE.INVITE_AS_COINSTRUCTOR:
				const inviteData = metadata as IInviteAsCointructorMetaData;
				return (
					<>
						<div className="tw-flex tw-justify-center tw-items-center">
							<div className="tw-w-14 tw-h-10">
								{inviteData.profile.avatarUrl ? (
									<img src={inviteData.profile.avatarUrl} className="tw-w-full tw-h-full tw-object-cover" />
								) : (
									<UserOutlined className="!tw-w-full !tw-h-full" />
								)}
							</div>
							<div className="tw-px-2">
								<span className="tw-font-bold">
									{inviteData.profile.firstName} {inviteData.profile.lastName}{' '}
								</span>
								{getContentNotification()}
								<span className="tw-font-bold"> {inviteData.courseId.name}</span>
							</div>
							<div className="tw-flex tw-flex-col tw-gap-y-2 tw-px-2 tw-justify-center tw-items-center">
								<div className="-tw-mt-2 tw-mr-0.5 tw-font-bold" onClick={() => onDelete(data)}>
									x
								</div>
								<div
									className={`tw-w-3 tw-h-[0.7rem] tw-rounded-full tw-border tw-border-solid ${
										isMarkAllRead || seen || isReadNotification ? 'tw-border-slate-400' : 'border-theme-3 bg-theme-3'
									}`}
								></div>
							</div>
						</div>
						<div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-pt-4 tw-pb-2">
							<div className="tw-text-slate-400 tw-text-xs tw-ml-11">
								{dayjs(createdAt).format('MMM DD')} at {dayjs(createdAt).format('hh:mm A')}
							</div>
							<div className="tw-flex tw-justify-center tw-items-center tw-gap-x-2 tw-ml-auto">
								<Button
									size="small"
									className={
										!disabled &&
										`bg-theme-7 color-theme-3 !tw-border border-theme-3
						hover:border-theme-3 hover:bg-theme-3 hover:color-theme-7`
									}
									onClick={() =>
										acceptInviteMutation.mutate({
											token: inviteData.token,
										})
									}
									disabled={disabled || acceptInviteMutation.isLoading}
									loading={acceptInviteMutation.isLoading}
								>
									Accept
								</Button>
								<Button
									size="small"
									className={
										!disabled &&
										`bg-theme-7 color-theme-3 !tw-border border-theme-3
						hover:border-theme-3 hover:bg-theme-3 hover:color-theme-7`
									}
									onClick={() =>
										rejectInviteMutation.mutate({
											token: inviteData.token,
										})
									}
									disabled={disabled || rejectInviteMutation.isLoading}
									loading={rejectInviteMutation.isLoading}
								>
									Reject
								</Button>
								<Button
									size="small"
									className="bg-theme-7 color-theme-3 !tw-border border-theme-3
						 hover:border-theme-3 hover:bg-theme-3 hover:color-theme-7"
									onClick={() => router.push(`${RouterConstants.DASHBOARD_COURSE.path}/${inviteData.courseId.id}`)}
								>
									View course
								</Button>
							</div>
						</div>
					</>
				);
			case NOTIFICATION_TYPE.SUBMIT_BOOKING_REQUEST:
				const bookingData = metadata as ISubmitBookingRequestMetaData;
				return (
					<>
						<div className="tw-flex tw-justify-center tw-items-center">
							<div className="tw-w-14 tw-h-10">
								{bookingData.student.profile.avatarUrl ? (
									<img src={bookingData.student.profile.avatarUrl} className="tw-w-full tw-h-full tw-object-cover" />
								) : (
									<UserOutlined className="!tw-w-full !tw-h-full" />
								)}
							</div>
							<div className="tw-px-2">
								<span className="tw-font-bold">
									{bookingData.student.profile.firstName} {bookingData.student.profile.lastName}{' '}
								</span>
								{getContentNotification()}
							</div>
							<div className="tw-flex tw-flex-col tw-gap-y-2 tw-px-2 tw-justify-center tw-items-center">
								<div className="-tw-mt-2 tw-mr-0.5 tw-font-bold" onClick={() => onDelete(data)}>
									x
								</div>
								<div
									className={`tw-w-3 tw-h-[0.7rem] tw-rounded-full tw-border tw-border-solid ${
										isMarkAllRead || seen || isReadNotification ? 'tw-border-slate-400' : 'border-theme-3 bg-theme-3'
									}`}
								></div>
							</div>
						</div>
						<div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-pt-4 tw-pb-2">
							<div className="tw-text-slate-400 tw-text-xs tw-ml-11">
								{dayjs(createdAt).format('MMM DD')} at {dayjs(createdAt).format('hh:mm A')}
							</div>
							<div className="tw-flex tw-justify-center tw-items-center tw-gap-x-2 tw-ml-auto">
								<Button
									size="small"
									className={
										!disabled &&
										`bg-theme-7 color-theme-3 !tw-border border-theme-3
						hover:border-theme-3 hover:bg-theme-3 hover:color-theme-7`
									}
									onClick={() =>
										accepBookingMutation.mutate({
											requestId: bookingData.bookingRequestId
										})
									}
									disabled={disabled || accepBookingMutation.isLoading}
									loading={accepBookingMutation.isLoading}
								>
									Accept
								</Button>
								<Button
									size="small"
									className={
										!disabled &&
										`bg-theme-7 color-theme-3 !tw-border border-theme-3
						hover:border-theme-3 hover:bg-theme-3 hover:color-theme-7`
									}
									onClick={() =>
										rejectBookingMutation.mutate({
											requestId: bookingData.bookingRequestId
										})
									}
									disabled={disabled || rejectBookingMutation.isLoading}
									loading={rejectBookingMutation.isLoading}
								>
									Reject
								</Button>
							</div>
						</div>
					</>
				);
			default:
				return <></>;
		}
	};

	const getContentNotification = () => {
		switch (type) {
			case NOTIFICATION_TYPE.INVITE_AS_COINSTRUCTOR:
				return 'has sent you an invitation to be a co-creator of the course';
			case NOTIFICATION_TYPE.SUBMIT_BOOKING_REQUEST:
				return 'has sent you an booking request to be assigned to your class';
			default:
				return 'has sent you an invitation to be a co-creator of the course';
		}
	};

	return checkObjectEmpty(metadata) ? (
		<div
			className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-sm tw-py-2 tw-border-b tw-border-x-0 tw-border-t-0 tw-border-solid border-theme-6"
			onClick={(e) => {
				e.stopPropagation();
				setIsReadNotification(true);
				setNumberUnreadNotifications((prev) => {
					if (prev) {
						return prev - 1;
					}
				});
				!seen &&
					seenNotificationsMutation.mutate({
						listId: [id],
					});
			}}
		>
			{rederNotiItem(metadata)}
		</div>
	) : (
		<></>
	);
};

export default NotificationItem;
