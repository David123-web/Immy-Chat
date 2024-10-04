import { RouterConstants } from '@/constants/router';
import { jwtValidate } from '@/src/helpers/auth';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { useMobXStores } from '@/src/stores';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useCheckRole = () => {
	const { userStore } = useMobXStores();
	const router = useRouter();

	useEffect(() => {
		if (jwtValidate() && userStore.currentUser) {
			switch (userStore.currentUser.role) {
				// case ROLE_TYPE.SUPER_ADMIN:
				// case ROLE_TYPE.SUBDOMAIN_ADMIN:
				case ROLE_TYPE.INSTRUCTOR:
				case ROLE_TYPE.TUTOR:
					if (userStore.currentUser.roleProfile?.id) {
						return router.push(RouterConstants.DASHBOARD.path);
					} else {
						return router.push(RouterConstants.TEACHER_APPLICATION.path);
					}
				case ROLE_TYPE.STUDENT:
					return router.push(RouterConstants.DASHBOARD_MY_SPACE.path);
				default:
					return router.push(RouterConstants.DASHBOARD.path);
			}
		}
	}, [JSON.stringify(userStore.currentUser)]);
};
