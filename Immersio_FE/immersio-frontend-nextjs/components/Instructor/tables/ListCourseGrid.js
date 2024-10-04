import {
	CloseOutlined,
	DeleteFilled,
	EditFilled,
	ExclamationCircleOutlined,
	EyeFilled,
	UpOutlined,
} from '@ant-design/icons';
import { Col, Modal, Row, Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import { RouterConstants } from '../../../constants/router';
import LoadingImage from '../../v2/LoadingImage';
import { useMobXStores } from '@/src/stores';

const { confirm } = Modal;

const ListCourseGrid = ({ items, dataSource, actions }) => {
	const { t } = useTranslation();
	const { userActivityStore } = useMobXStores();

	const handleEditClick = async (session) => {
		userActivityStore.setCurrentCourseEdit({
			id: session.id,
			title: session.title,
		});
		console.log(`id is ${userActivityStore.currentCourseEdit.id}`);
		console.log(`course is ${userActivityStore.currentCourseEdit.title}`);
		await userActivityStore.saveStoreToLocal();
		return `${RouterConstants.DASHBOARD_COURSE.path}/${session.id}`;
	};

	return (
		<Row gutter={20} xs={24} sm={24}>
			{(items || []).map((session, index) => {
				const filterLanguage = (dataSource.languages || []).filter(
					(s) => s?.id?.toString() === session?.courseLanguageId?.toString()
				);
				const filterInstructor = (dataSource.allInstructors || []).filter(
					(s) => s?.id?.toString() === session?.instructorId?.toString()
				);
				const isFreeCourse = session.isFree;

				return (
					<Col xs={24} sm={6} key={index} className="mb-20">
						<a className="tw-relative">
							<LoadingImage thumbnailId={session.thumbnailId} />
							{isFreeCourse && (
								<div className="ribbon-course">
									<span>{t('dashboard.option.free')}</span>
								</div>
							)}
						</a>
						<div className="mb-10">
							<a>{filterLanguage?.length && filterLanguage[0].name}</a> |{' '}
							{filterInstructor?.length && (
								<>
									{filterInstructor[0]?.profile?.firstName} {filterInstructor[0]?.profile?.lastName}
								</>
							)}
						</div>
						<h4>{session.title}</h4>
						<div className="d-flex align-items-center mt-10">
							<Tooltip title={t('dashboard.label.view_course')}>
								<a onClick={() => actions.getCourse(session.id)} className="btn btn-sm btn-primary mb-1 mr-5">
									<EyeFilled
										style={{ display: 'inline-block', verticalAlign: 'middle', color: '#fff', fontSize: 15 }}
									/>
								</a>
							</Tooltip>

							<Tooltip title={t('dashboard.label.edit_course')}>
								<a
									onClick={async (e) => {
										e.preventDefault(); // Prevent default anchor behavior
										const url = await handleEditClick(session);
										window.location.href = url; // Navigate to the URL
									}}
									className="btn btn-sm btn-info mb-1 mr-5"
								>
									<EditFilled
										style={{ display: 'inline-block', verticalAlign: 'middle', color: '#fff', fontSize: 15 }}
									/>
								</a>
							</Tooltip>

							<Tooltip title={t('dashboard.label.delete_course')}>
								<a
									className="btn btn-sm btn-danger mb-1 mr-5"
									onClick={() => {
										confirm({
											icon: <ExclamationCircleOutlined />,
											content: t('dashboard.modal.are_you_sure_delete'),
											onOk() {
												actions.handleDeleteCourse(session.id);
											},
										});
									}}
								>
									<DeleteFilled
										style={{ display: 'inline-block', color: '#fff', verticalAlign: 'middle', fontSize: 15 }}
									/>
								</a>
							</Tooltip>

							{session.isPublished ? (
								<Tooltip title={t('dashboard.label.unpublish_course')}>
									<a
										className="btn btn-sm btn-dark mb-1 pointer text-danger mr-5"
										onClick={() => {
											confirm({
												icon: <ExclamationCircleOutlined />,
												content: t('dashboard.modal.once_you_unpublish_your_course'),
												onOk() {
													actions.handleUpdateCourse({ id: session.id, field: 'isPublished', checked: false });
												},
											});
										}}
									>
										<CloseOutlined
											style={{ display: 'inline-block', verticalAlign: 'middle', color: '#fff', fontSize: 15 }}
										/>
									</a>
								</Tooltip>
							) : (
								<Tooltip title={t('dashboard.label.publish_course')}>
									<a
										className="btn btn-sm btn-dark mb-1 pointer text-success mr-5"
										onClick={() => {
											confirm({
												icon: <ExclamationCircleOutlined />,
												content: t('dashboard.modal.once_you_publish_your_course'),
												onOk() {
													actions.handleUpdateCourse({ id: session.id, field: 'isPublished', checked: true });
												},
											});
										}}
									>
										<UpOutlined
											style={{ display: 'inline-block', verticalAlign: 'middle', color: '#fff', fontSize: 15 }}
										/>
									</a>
								</Tooltip>
							)}
						</div>
					</Col>
				);
			})}
		</Row>
	);
};

export default ListCourseGrid;
