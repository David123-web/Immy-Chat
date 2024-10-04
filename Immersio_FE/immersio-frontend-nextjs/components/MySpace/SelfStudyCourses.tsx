import { TAILWIND_CLASS } from '@/constants';
import { Section } from '@/src/interfaces/course/course.interface';
import { Button, Col, Progress, Row } from 'antd';
import Link from 'next/link';
import React from 'react';

const SelfStudyCourses = () => {
	const renderCourses = (data: any[]) => {
		return data
			.sort((x, y) => x.index - y.index)
			.map((section, i) => {
				const progress = Math.floor(Math.random() * 101);
				return (
					<Col span={6}>
						<div className="tw-w-full">
							<Link href={``}>
								<a className="tw-relative">
									<img src={'https://picsum.photos/200/150'} className="tw-w-full tw-object-cover" />
								</a>
							</Link>
							<div className="mb-10">{`Moose Cree | Ricki Lynn`}</div>
							<h4>
								<Link href={``}>Greetings and Introduction</Link>
							</h4>
							<Progress percent={progress} showInfo={false} />
							<div>{progress}% completed</div>
							{progress === 100 && (
								<Button onClick={() => {}} className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg tw-w-full`}>
									Download Certificate
								</Button>
							)}
						</div>
					</Col>
				);
			});
	};
	return (
		<div className="tw-pb-6">
			<h3>My Self Study Courses</h3>
			<Row gutter={[16, 16]}>{renderCourses([...Array(4)])}</Row>
		</div>
	);
};

export default SelfStudyCourses;
