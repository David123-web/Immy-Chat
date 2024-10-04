import 'firebase/messaging';
import firebase from 'firebase/app';
import { globalStore } from '../stores/global/global.store';

const firebaseCloudMessaging = {
	init: async () => {
		if (!firebase?.apps?.length) {
			// Initialize the Firebase app with the credentials
			firebase?.initializeApp({
				//AN TRAN
				// apiKey: "AIzaSyCqgx7DtihhRd22p79sunqia75uDw4j2TY",
				// authDomain: "fir-fcm-88172.firebaseapp.com",
				// projectId: "fir-fcm-88172",
				// storageBucket: "fir-fcm-88172.appspot.com",
				// messagingSenderId: "1077512019744",
				// appId: "1:1077512019744:web:24a48132ffd368f1ea0145"
				//IMMERSIO
				apiKey: 'AIzaSyCls3Ownx7PsLZDi3-K-KTfVgSrqvzlb3A',
				authDomain: 'oauth-immersio.firebaseapp.com',
				projectId: 'oauth-immersio',
				storageBucket: 'oauth-immersio.appspot.com',
				messagingSenderId: '667199024418',
				appId: '1:667199024418:web:211b9b5c963ffb63a4497b',
				measurementId: 'G-P309L1EZ7C',
			});

			try {
				const messaging = firebase.messaging();

				// Request the push notification permission from browser
				const status = await Notification.requestPermission();
				if (status && status === 'granted') {
					// Get new token from Firebase
					const fcm_token = await messaging.getToken({
						vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
					});
					// Foreground message received
					messaging.onMessage((payload) => {
						console.log('Foreground message received:', payload);
						globalStore.setTriggerGetNotifications();
						// Do something with the payload here
					});

					if (fcm_token) {
						return fcm_token;
					}
				}
			} catch (error) {
				console.error(error);
				return null;
			}
		}
	},
};
export { firebaseCloudMessaging };
