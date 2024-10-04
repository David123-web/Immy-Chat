import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ImmyChat from '../../../components/Chat/OpieChat';
import DashboardRoute from '../../../components/routes/DashboardRoute';
import { connectWithSocketServer, getSocketConnection, sendMsgToOpie } from '../../../realTimeCommunication/socketConnection';
import { withTranslationsProps } from '../../next/with-app';

const ChatWithImmy = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state?.auth?.login?.currentUser?.user)

	useEffect(() => {
		if (!getSocketConnection()) {
			console.log('conectando...')
			connectWithSocketServer(user?._id, dispatch)
		}
	}, [user])

	return (
		<DashboardRoute>
			<div className="animated fadeIn">
				<ImmyChat
					actions={{
						sendMsgToOpie
					}}
				/>
			</div>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default ChatWithImmy;
