import {
	IGetListCountriesResponse,
	IGetProficiencyLevelsResponse,
	ITimeZone,
} from '@/src/interfaces/common/common.interface';
import { IGetCourseLanguagesResponse } from '@/src/interfaces/course/course.interface';
import { makeAutoObservable } from 'mobx';

export class GlobalStore {
	constructor() {
		makeAutoObservable(this);
	}

	courseLanguages: IGetCourseLanguagesResponse[] = [];
	openKeysMenu: string[] = [];
	triggerGetNotifications: number = 0;
	listCountries: IGetListCountriesResponse[] = [];
	proficiencyLevels: IGetProficiencyLevelsResponse[] = [];
	timezone: ITimeZone[] = [];
	listDrills: any[] = [];
	listDrillsIds: any[] = [];
	currentRewarding: {
		currentGems: number;
		currentDrillHealthPoint: number;
	} = {
		currentGems: 0,
		currentDrillHealthPoint: 100,
	};
	disableNextDrills: boolean = false;
	disableCheckAnswerAgain: boolean = false;
  currencySubdomain: string = '';

  async setCurrencySubdomain(currencySubdomain: string) {
    return (this.currencySubdomain = currencySubdomain);
  }

  async setListDrillsIds(listDrillsIds: any[]) {
		return (this.listDrillsIds = listDrillsIds);
	}

	async setDisableCheckAnswerAgain(disableCheckAnswerAgain: boolean) {
		return (this.disableCheckAnswerAgain = disableCheckAnswerAgain);
	}
	
	async setDisableNextDrills(disableNextDrills: boolean) {
		return (this.disableNextDrills = disableNextDrills);
	}

	async setListDrills(listDrills: any[]) {
		return (this.listDrills = listDrills);
	}
	async setCurrentRewarding(currentRewarding: { currentGems: number; currentDrillHealthPoint: number }) {
		return (this.currentRewarding = currentRewarding);
	}

	async setOpenKeysMenu(openKeysMenu: string[]) {
		return (this.openKeysMenu = openKeysMenu);
	}

	async setCourseLanguages(courseLanguages: IGetCourseLanguagesResponse[]) {
		return (this.courseLanguages = courseLanguages.sort((a, b) => a.name.localeCompare(b.name)));
	}

	async setTriggerGetNotifications() {
		return (this.triggerGetNotifications = this.triggerGetNotifications + 1);
	}

	async setListCountries(listCountries: IGetListCountriesResponse[]) {
		return (this.listCountries = listCountries);
	}

	async setProficiencyLevels(proficiencyLevels: IGetProficiencyLevelsResponse[]) {
		return (this.proficiencyLevels = proficiencyLevels);
	}

	async setTimezone(timezone: ITimeZone[]) {
		return (this.timezone = timezone);
	}
}

export const globalStore = new GlobalStore();
