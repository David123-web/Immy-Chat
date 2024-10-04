import { IGetSubdomainConfigResponse } from '@/src/interfaces/subdomain/subdomain.interface';
import { makeAutoObservable } from 'mobx';

export class SubdomainStore {
	subdomain?: IGetSubdomainConfigResponse;

	constructor() {
		makeAutoObservable(this);
	}

	async setSubdomain(subdomain: IGetSubdomainConfigResponse) {
		return (this.subdomain = subdomain);
	}
}

export const subdomainStore = new SubdomainStore();
