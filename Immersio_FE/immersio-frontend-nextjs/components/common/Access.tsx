import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { useMobXStores } from '@/src/stores';
import React from 'react';

export interface IAccess {
	roles?: ROLE_TYPE[];
	permissions?: string[];

}

interface IAccessProps extends IAccess {
	children: React.ReactElement;
}

const Access = (props: IAccessProps) => {
	const { children, permissions, roles } = props;
	const { userStore } = useMobXStores();
	if (
		userStore.currentUser &&
		(roles?.includes(userStore.currentUser.role) || permissions?.includes(userStore.currentUser.role)) // NOTE
	) {
		return children;
	}
	return null;
};

export default Access;
