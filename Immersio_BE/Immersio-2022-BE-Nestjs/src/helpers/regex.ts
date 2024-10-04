export const RegexHelper = {
    replaceNonAscii: (str: string) => str.replace(/[^A-Za-z 0-9]/g, '')
};
