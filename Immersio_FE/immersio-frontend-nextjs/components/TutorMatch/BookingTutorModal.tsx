import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { IBookingClassRequest, ITutorInfo } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { bookingClass } from '@/src/services/tutorMatch/apiTutorMatch';
import { MessageFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Modal, Rate } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { toast } from 'react-toastify';

interface IBookingTutorModal {
	setIsOpenModal: (value: boolean) => void;
	isOpenModal: boolean;
	setIsOpenTutorInforModal: (value: boolean) => void;
	data:{tutorInfo: ITutorInfo, classId: number};
	refetchListClass: () => void
}

const BookingTutorModal = (props: IBookingTutorModal) => {
	const { isOpenModal, setIsOpenModal, setIsOpenTutorInforModal, data, refetchListClass } = props;

	const onFinish=  (formData) => {
		console.log(formData)
		const bookingRequest: IBookingClassRequest = {
			...formData,
			classBookingId: data.classId,
			tutorId: data.tutorInfo.id
		}
		bookingClassMutation.mutate(bookingRequest);
	}
	/* ------------------------------ BOOKING CLASS ----------------------------- */
	const bookingClassMutation = useMutation<any, IBookingClassRequest>(bookingClass,{
		onSuccess: () => {
			setIsOpenModal(false);
			refetchListClass();
			toast.success('Booking class successfully');
		},
		onError:(err) => {
			toast.error(err.data?.message);
		}
	})
	return (
		<>
			<Modal
				width={600}
				open={isOpenModal}
				footer={null}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenModal(false);
				}}
			>
				<div className="tw-flex tw-flex-col tw-w-full tw-gap-3">
					<h4>{data.tutorInfo.profile.firstName + ' ' + data.tutorInfo.profile.lastName}</h4>
					<div>Please enter your details below to enquire about tutoring with {data.tutorInfo.profile.firstName + ' ' + data.tutorInfo.profile.lastName}</div>
					<div className="tw-flex tw-gap-5">
						<div className="tw-w-3/4">
							<Form className="tw-m-auto" layout="vertical" onFinish={onFinish}>
								<Form.Item
									name="trialSession"
									label="Preferred Free Trial Session"
									rules={[
										{
											required: true,
										},
									]}
								>
									<DatePicker showTime className="tw-w-full" />
								</Form.Item>
								<Form.Item
									name="name"
									label="Name"
									rules={[
										{
											required: true,
										},
									]}
								>
									<Input placeholder="Enter your name" />
								</Form.Item>
								<Form.Item name="email" label="Email">
									<Input placeholder="Enter your email" />
								</Form.Item>
								<Form.Item
									name="phoneNumber"
									label="Phone Number"
									rules={[
										{
											pattern: /^[0-9]*$/,
											message: 'This is not valid phone number',
										},
										{
											max: 12,
											message: 'This is not valid phone number',
										},
									]}
								>
									<Input placeholder="Enter your phone number" />
								</Form.Item>
								<Form.Item name="aboutStudent" label="Tell us about yourself">
									<TextArea placeholder="Enter your message" rows={4} />
								</Form.Item>
								<Button htmlType="submit" className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-fit tw-rounded`} onClick={() => {}}>
									Send
								</Button>
							</Form>
						</div>
						<div className="tw-flex tw-w-1/4 tw-flex-col tw-items-center tw-gap-4">
							<img
								className="tw-object-cover tw-rounded-lg tw-w-full tw-aspect-square tw-cursor-pointer"
								src={data.tutorInfo.profile.avatarUrl}
								alt=""
							/>
							<Rate className="custom-rate" style={{ fontSize: '12px' }} disabled value={5} />
							<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-fit tw-rounded`} onClick={() => {setIsOpenTutorInforModal(true)}}>
								Show profile
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default BookingTutorModal;
