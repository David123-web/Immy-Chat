import { DependencyList, useCallback, useEffect } from "react";

export const useDebounceEffect = (effect: any, deps: DependencyList, delay: number) => {
	const callback = useCallback(effect, deps);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			callback();
		}, delay);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [callback, delay]);
};