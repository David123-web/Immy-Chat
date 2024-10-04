import getFileExtension from './get-extension';

const presentationChecker = (filename: string) => {
    const ext = getFileExtension(filename);
    if (!ext) return false;
    return ['key', 'odp', 'pps', 'ppt', 'pptx'].includes(ext);
};

export default presentationChecker;
