export const getQueryParams = (paramsName: string) => {
	if (typeof window !== 'undefined') {
		const query = new URLSearchParams(decodeURIComponent(window.location.search));
		query.get(paramsName);
		return query.get(paramsName);
	}
};