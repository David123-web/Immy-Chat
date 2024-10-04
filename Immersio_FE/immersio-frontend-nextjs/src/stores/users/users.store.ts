import { ICurrentUser } from "@/src/interfaces/user/user.interface";
import { makeAutoObservable } from "mobx";

export class UserStore {
    currentUser: ICurrentUser | null = null;


  constructor() {
    makeAutoObservable(this);
  }

  async setCurrentUser(user: ICurrentUser) {
    return (this.currentUser = user);
  }
}

export const userStore = new UserStore();
