export const encodeQueryData = (data: any) => {
    const ret = [];
    for (const d in data) if (data[d]) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.length > 0 ? `?${ret.join('&')}` : '';
};

export const getValueByPath = (obj: object, path: string) => {
    return path.split('.').reduce((o: any, key: string) => {
        return o && o[key] ? o[key] : undefined;
    }, obj);
};

export const searchWithKeys = (keys: string[], contains: string, mode: 'insensitive' | 'default' = 'default') => {
    return keys.map((key) => ({
        [key]: {
            contains, mode 
        } 
    }));
};

export const removeEmpty = (obj) => {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
    );
};
