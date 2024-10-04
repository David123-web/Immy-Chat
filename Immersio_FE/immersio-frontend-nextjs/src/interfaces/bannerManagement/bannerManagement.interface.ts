/* --------------------------------- BANNERS -------------------------------- */
export enum BANNER_STATUS {
  ACTIVE = 'Active',
  NOT_ACTIVE = 'Not Active',
}

export interface IBannersTable {
	imgUrl: string;
  text: string;
  status: BANNER_STATUS;
  order: number;
}