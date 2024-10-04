import { ICurrentCourseEdit } from '@/src/interfaces/user/user.activity.interface';
import { makeAutoObservable, reaction } from 'mobx';
import { toJS } from 'mobx';

export class UserActivityStore {
	currentCourseEdit: ICurrentCourseEdit | null = null;
	storeKey: string = 'userStore';

	constructor() {
		makeAutoObservable(this);
		if (typeof window !== 'undefined') {
			this.retrieveCourseEditFromLocal();
		}
		reaction(
			() => this.currentCourseEdit,
			(currentCourseEdit) => {
				console.log(`Saving to local ${JSON.stringify(this.currentCourseEdit.title)}`);
				this.saveStoreToLocal();
			}
		);
	}

	async saveStoreToLocal() {
		const plainUserStore = toJS(this);
		localStorage.setItem(this.storeKey, JSON.stringify(plainUserStore));
	}

	async retrieveCourseEditFromLocal() {
		const fromLocal = localStorage.getItem(this.storeKey);
		if (fromLocal) {
			this.resetCourseEdit(fromLocal);
		}
	}

	async resetCourseEdit(initialState: string) {
		const json = JSON.parse(initialState);
		await this.setCurrentCourseEdit(json.currentCourseEdit);
	}

	async setCurrentCourseEdit(current: ICurrentCourseEdit) {
		this.currentCourseEdit = current;
	}
}

export const userActivityStore = new UserActivityStore();
