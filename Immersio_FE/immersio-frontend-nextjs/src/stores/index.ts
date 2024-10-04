import { createContext, useContext } from 'react';
import { authStore } from './auth/auth.store';
import { globalStore } from './global/global.store';
import { myDriveStore } from './mydrive/mydrive.store';
import { subdomainStore } from './subdomain/subdomain.store';
import { userStore } from './users/users.store';
import { userActivityStore } from './users/useractivity.store';

export const stores = {
	myDriveStore,
	userStore,
	userActivityStore,
	authStore,
	subdomainStore,
	globalStore,
};

const StoreContext = createContext(stores);

export const StoreProvider = StoreContext.Provider;

export const useMobXStores = () => useContext(StoreContext);
