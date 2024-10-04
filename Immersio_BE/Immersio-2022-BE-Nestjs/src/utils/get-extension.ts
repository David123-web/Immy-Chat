export default function getFileExtension(filename: string) {
    if (filename.length < 1 || !filename.includes('.')) {
        return null;
    }
    const extSplit = filename.split('.');

    if (extSplit.length <= 1) {
        return null;
    }

    const ext = extSplit[extSplit.length - 1];
    return ext.toLowerCase();
}
