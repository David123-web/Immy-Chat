export const strToNumber = (str: string) => {
    if (!str) return;
    let _str = str.trim();
    const dotPos = _str.lastIndexOf('.');
    const commaPos = _str.lastIndexOf(',');
    if (dotPos < 0 || (commaPos > 0 && dotPos > commaPos)) {
        _str = _str.replace(/\,/g, '');
    } else if ((dotPos > 0 && dotPos < commaPos) || dotPos < 0) {
        _str = str.replace(/\./g, '').replace(/\,/g, '.');
    }

    return parseFloat(_str);
};

export const isNumber = (str: string) => {
    if (!str) return false;
    const regex = /^[0-9]*(?:[.,]\d+)*$/;
    return regex.test(str.trim());
};

export const average = (...args: number[]) => {
    return args.reduce((a, b) => a + b, 0) / (args.length + Number.EPSILON);
};