import getFileExtension from './get-extension';

const sheetChecker = (filename: string) => {
    const ext = getFileExtension(filename);
    if (!ext) return false;
    return ['ods', 'xls', 'xlsm', 'xlsx'].includes(ext);
};

export default sheetChecker;
