import { AxiosResponse } from 'axios';
import {
	useMutation as useMutationLib,
	UseMutationOptions,
	UseMutationResult,
} from 'react-query';

export function useMutation<TData = any, TVariables = any, TContext = unknown>(
	mutationFn: any,
	options?: Omit<
		UseMutationOptions<AxiosResponse<TData>, AxiosResponse<any>, TVariables, TContext>,
		'mutationFn'
	>
): UseMutationResult<AxiosResponse<TData>, AxiosResponse<any>, TVariables, TContext> {
	return useMutationLib(mutationFn, options);
}