

import getFileExtension from './get-extension';

const audioExtList = ['aac','aiff','ape','au','flac','gsm','it','m3u','m4a','mid','mod','mp3','mpa','pls','ra','s3m','sid','wav','wma','xm'];

const audioChecker = (filename: string) => {
    const ext = getFileExtension(filename);
    if (!ext) return false;
    return audioExtList.includes(ext);
};

export default audioChecker;
