import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';

export const beforeUpload = (file: RcFile) => {
	const isLt20M = file.size / 1024 / 1024 < 20;
	return isLt20M;
};

export const beforeUploadAvatar = (file: RcFile) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
	if (!isJpgOrPng) {
		message.error('dashboard.notification.you_can_only_upload_jpg_ico');
	}
	const isLt20M = file.size / 1024 / 1024 < 20;
	if (!isLt20M) {
		message.error('dashboard.notification.image_must_smaller_20MB');
	}
	return isJpgOrPng && isLt20M;
};

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
};

export const convertToSlug = (string = '') => {
	if (string === '') return string;
	return string
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '');
};

export const formatSumDrills = (values) => {
	let sumDrills = 0;
	if (values?.length) {
		values.forEach((item) => {
			if (item.drillType === 'multipleChoice' || item.drillType === 'sort') {
				sumDrills += item?.array_of_answers?.length;
			} else if (item.drillType === 'flashcards') {
				sumDrills += item?.questions?.length;
			} else if (item.drillType === 'dragWords') {
				sumDrills += item?.words?.length;
			} else {
				sumDrills += 1;
			}
		});
	}

	return sumDrills;
};

export const uuidv4 = () => {
	// @ts-ignore
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}