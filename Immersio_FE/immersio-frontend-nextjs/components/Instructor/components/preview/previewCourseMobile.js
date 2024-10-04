import { DesktopOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import ReactPlayer from 'react-player';
import CurriculumTimeline from '../../../CurriculumTimeline';
const { TabPane } = Tabs;

const PreviewCourseMobile = ({ values, onSwitchToDesktopView }) => {
	return (
		<div className='pl-20 pr-20 pt-20 pb-20 remove-bg-tabs' style={{ backgroundColor: '#F8F8FF' }}>
			<p>This is how it looks like on the mobile screen</p>
			<h3 className='mb-20'>{values.title}</h3>

			<Tabs className="control-hooks-tabs" type="card">
				<TabPane tab="Course info" key="1">
					<ReactPlayer
						url={values?.previewVideo}
						width='100%'
						height='400px'
            controls
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                }
              }
            }}
					/>
					<p className='mt-20 mb-20' dangerouslySetInnerHTML={{ __html: values.description }} />
					<h4>Learning outcome</h4>
					<p className='mt-20 mb-20' dangerouslySetInnerHTML={{ __html: values.learningOutcome }} />
					<h4>Requirement</h4>
					<p className='mt-20 mb-20' dangerouslySetInnerHTML={{ __html: values.requirement }} />
				</TabPane>

				<TabPane tab="Lesson List" key="2">
					<CurriculumTimeline data={values} />
				</TabPane>

				<TabPane tab="Tutors" key="3">Tutors</TabPane>
			</Tabs>

			<div
				onClick={() => onSwitchToDesktopView('desktop')}
				className='desktop-preview text-center mt-20'
				style={{ cursor: 'pointer' }}
			>
				<DesktopOutlined style={{ fontSize: 26 }} />
				<p className='mt-5'>
					<b style={{ fontSize: 16 }}>Preview on desktop</b>
				</p>
			</div>
		</div>
	)
}

export default PreviewCourseMobile