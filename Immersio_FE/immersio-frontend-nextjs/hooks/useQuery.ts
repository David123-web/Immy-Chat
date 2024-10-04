import { AxiosResponse } from 'axios';
import {
	QueryKey,
	useQuery as useQueryLib,
	UseQueryOptions,
	UseQueryResult
} from 'react-query';

export function useQuery<TData = any, TQueryFnData = any, TQueryKey extends QueryKey = QueryKey>(
	queryKey: TQueryKey,
	queryFn: any,
	options?: Omit<
		UseQueryOptions<TQueryFnData, AxiosResponse<any>, AxiosResponse<TData>, TQueryKey>,
		'queryKey' | 'queryFn'
	>
): UseQueryResult<AxiosResponse<TData>, AxiosResponse<any>> {
	return useQueryLib(queryKey, queryFn, options);
}


export const QUERY_KEYS = {
	GET_ME : 'GET_ME',
	GET_LIST_FILE: 'GET_LIST_FILE',
}
