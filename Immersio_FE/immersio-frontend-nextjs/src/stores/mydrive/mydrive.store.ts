import { makeAutoObservable } from "mobx";

export class MyDriveStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export const myDriveStore = new MyDriveStore();
