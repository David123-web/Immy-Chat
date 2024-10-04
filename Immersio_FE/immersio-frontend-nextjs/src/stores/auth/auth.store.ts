import { makeAutoObservable } from 'mobx';

interface IInstructorRegisterData {
	email: string;
	password: string;
}

export class AuthStore {
	instructorRegisterData: IInstructorRegisterData | null = null; 
	isLoginSuccess: boolean = false
	constructor() {
		makeAutoObservable(this);
	}
	async setIsLoginSuccess(isLoginSuccess: boolean) {
		return (this.isLoginSuccess = isLoginSuccess);
	}
	async setInstructorRegisterData(data: IInstructorRegisterData) {
		return (this.instructorRegisterData = data);
	}
}

export const authStore = new AuthStore();
