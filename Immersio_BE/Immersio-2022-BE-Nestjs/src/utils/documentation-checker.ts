import getFileExtension from './get-extension';

const documentationChecker = (filename: string) => {
    const ext = getFileExtension(filename);
    if (!ext) return false;
    return ['doc', 'docx', 'odt', 'rtf', 'tex', 'txt', 'wpd'].includes(ext);
};

export default documentationChecker;
