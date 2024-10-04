import ListPaymentCourses from '@/components/PaymentServices/ListPaymentCourses';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { TAILWIND_CLASS } from '@/constants';
import { withTranslationsProps } from '@/src/next/with-app';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Select, Steps, Tabs } from 'antd';
import Head from 'next/head';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

enum PaymentServicesTab {
	COURSES = 'courses',
	SUBSCRIPTIONS = 'subscriptions',
}

const PaymentServices = () => {
	return (
		<>
			<Head>
				<title>Payment Services</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<DashboardRoute>
				<div className="tutor-class-tab -tw-mt-8">
          <h3 className="tw-fixed tw-top-24 tw-right-8 tw-z-40">Credit: 10000</h3>
					<Tabs>
						<Tabs.TabPane tab="Courses" key={PaymentServicesTab.COURSES}>
							<ListPaymentCourses />
						</Tabs.TabPane>
						<Tabs.TabPane tab="Subscriptions" key={PaymentServicesTab.SUBSCRIPTIONS}></Tabs.TabPane>
					</Tabs>
				</div>
			</DashboardRoute>
		</>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default PaymentServices;
