import { Carousel, Modal, UploadFile } from 'antd';
import { useTranslation } from 'next-i18next';

interface IReviewBannerModalProps {
	isOpenModal: boolean;
	setIsOpenModal: (value: boolean) => void;
	listOfBanner: UploadFile[];
}

const ReviewBannerModal = (props: IReviewBannerModalProps) => {
	const { t } = useTranslation();
	const { isOpenModal, setIsOpenModal, listOfBanner } = props;

	return (
		<>
			<Modal
				open={isOpenModal}
				centered
				title={<div className="tw-font-bold tw-text-xl">{t('dashboard.modal.review_banner')}</div>}
				onOk={() => setIsOpenModal(false)}
				footer={<></>}
        width={1000}
				onCancel={() => setIsOpenModal(false)}
			>
				<div className="custom-carousel">
					<Carousel>
						{listOfBanner.map((item) => {
							return (
								<div className="tw-w-full">
									<img src={item.url} className='tw-w-full'/>
								</div>
							);
						})}
					</Carousel>
				</div>
			</Modal>
		</>
	);
};

export default ReviewBannerModal;
