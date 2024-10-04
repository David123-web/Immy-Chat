import { TAILWIND_CLASS } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import { Course } from '@/src/interfaces/course/course.interface';
import { IPurchaseWithCreditRequest, PaymentMethod, ProductType } from '@/src/interfaces/payment/payment.interface';
import { getAllCourses, getAllCoursesPublish, getListPaidCourses } from '@/src/services/courses/apiCourses';
import { purchaseWithCredit } from '@/src/services/payment/apiPayment';
import { useMobXStores } from '@/src/stores';
import { CreditCardOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmModal from '../MyDrive/ComfirmModal';
import LoadingImage from '../v2/LoadingImage';

const ListPaymentCourses = () => {
	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
	const selectedCourseId = useRef<number>();
	const { globalStore, userStore } = useMobXStores();
	/* ---------------------------- GET LIST COURSES ---------------------------- */
	const [listCourse, setListCourse] = useState<Course[]>([]);
	const getListCourse = useQuery<{ data: Course[]; total: number }>(['Course'], () => getAllCoursesPublish(null), {
		onSuccess: (res) => {
			console.log(globalStore);
			setListCourse(res.data.data.filter((x) => !x.isFree));
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* -------------------------- GET LIST PAID COURSE -------------------------- */
	const [listPaidCourse, setListPaidCourse] = useState<Course[]>([]);
	const getListPaidCourse = useQuery<{ data: Course[]; total: number }>(
		['PaidCourse'],
		() => getListPaidCourses(null),
		{
			onSuccess: (res) => {
				console.log(globalStore);
				setListPaidCourse(res.data.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* -------------------------- PURCHASE WITH CREDIT -------------------------- */
	const purchaseWithCreditMutation = useMutation<any, IPurchaseWithCreditRequest>(purchaseWithCredit, {
		onSuccess: (res) => {
			toast.success('Purchase course successfully!');
      setIsOpenConfirmModal(false);
      getListPaidCourse.refetch();
      getListCourse.refetch();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const handlePurchaseWithCredit = () => {
		const selectedCourse = listCourse.find((x) => x.id == selectedCourseId.current);
		const request: IPurchaseWithCreditRequest = {
			subdomainId: userStore.currentUser.subdomainId,
			purchaserId: userStore.currentUser.id,
			userId: userStore.currentUser.id,
			totalCreditsSpent: selectedCourse.price,
			payFromCredit: true,
			paymentMethod: PaymentMethod.IMMERSIO_CREDIT,
			products: [
				{
					productId: selectedCourseId.current,
					unitCount: 1,
					productType: ProductType.COURSE,
					creditProcessingComplete: false,
					creditProcessingMessage: '',
					creditsSpent: selectedCourse.price,
				},
			],
		};
		purchaseWithCreditMutation.mutate(request);
	};

	const renderCourses = (data: Course[]) => {
		return data.map((course, i) => {
			return (
				<Col span={6}>
					<div className="tw-w-full">
						<Card
							hoverable
							cover={<LoadingImage thumbnailId={course.thumbnailId} />}
							className={'tw-shadow-lg tw-border-solid tw-border-gray tw-border-opacity-30 tw-rounded-sm'}
						>
							<h4>{course.title}</h4>
							<h2>{course.price} {globalStore.currencySubdomain}</h2>
							<div className={'tw-flex tw-w-full tw-gap-2'}>
								{listPaidCourse.map((x) => x.id).includes(course.id) ? (
									<Button onClick={() => {}} className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg tw-w-1/2`}>
										Play
									</Button>
								) : (
									<>
										<Button onClick={() => {}} className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg tw-w-1/2`}>
											Purchase
										</Button>
										<Button
											onClick={() => {
												setIsOpenConfirmModal(true);
												selectedCourseId.current = course.id;
											}}
											className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg tw-w-1/2`}
										>
											Credit
										</Button>
									</>
								)}
							</div>
						</Card>
					</div>
				</Col>
			);
		});
	};

	return (
		<>
			<Row gutter={[16, 16]}>{renderCourses(listCourse)}</Row>
			<ConfirmModal
				label="Purchase with credit"
				description="Do you want to purchase this course with credit?"
				confirmBtnLabel="Yes"
				isOpen={isOpenConfirmModal}
				onClose={() => setIsOpenConfirmModal(false)}
				onConfirm={() => {
					handlePurchaseWithCredit();
				}}
			/>
		</>
	);
};

export default ListPaymentCourses;
