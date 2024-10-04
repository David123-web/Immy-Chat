import getFileExtension from './get-extension';

const pdfChecker = (filename: string) => {
    const ext = getFileExtension(filename);
    if (!ext) return false;
    return ext === 'pdf';
};

export default pdfChecker;
