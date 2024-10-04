import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { useMobXStores } from '@/src/stores';

// roles?: ROLE_TYPE[] permissions?: string[]
// export const useAccess = ({ roles, permissions }: { roles?: ROLE_TYPE[]; permissions?: string[] }) => {
// 	const { userStore } = useMobXStores();

// 	return (
// 		userStore.currentUser &&
// 		(roles?.includes(userStore.currentUser.role) ||
// 			permissions?.includes(userStore.currentUser.role))
// 	);
// };

export {}