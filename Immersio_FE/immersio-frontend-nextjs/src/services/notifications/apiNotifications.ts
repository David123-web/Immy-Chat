import { http } from '../axiosService';
import {
	IGetListNotificationsRequest,
	IRegisterNotificationsRequest,
	ISeenNotificationRequest,
} from './../../interfaces/notifications/notification.interface';

export async function registerNotifications(body: IRegisterNotificationsRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/notifications/register`, body);
}

export async function getListNotifications(body?: IGetListNotificationsRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/notifications`, body);
}

export async function seenNotifications(body: ISeenNotificationRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/notifications`, body.listId);
}

export async function deleteNotification(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/notifications/${id}`,);
}