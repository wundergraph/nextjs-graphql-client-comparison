import { useCallback, useContext, useEffect, useState } from "react";
import { WunderGraphContext } from "./provider";
import { RequestOptions, MutateRequestOptions, Response } from "./client";
import { DragonsResponse } from "./models";

export const useWunderGraph = () => {
	const ctx = useContext(WunderGraphContext);
	if (ctx === undefined) {
		throw new Error("WunderGraphContext missing, make sure to put WunderGraphProvider at the root of your app");
	}
	return {
		client: ctx.client,
		user: ctx.user,
		initialized: ctx.initialized,
		initializing: ctx.initializing,
		onWindowFocus: ctx.onWindowFocus,
		onWindowBlur: ctx.onWindowBlur,
		refetchMountedQueries: ctx.refetchMountedQueries,
		setRefetchMountedQueries: ctx.setRefetchMountedQueries,
		queryCache: ctx.queryCache,
	};
};

interface InternalOptions {
	requiresAuthentication: boolean;
}

const Query = <R extends {}, I extends {}>(
	promiseFactory: (options: RequestOptions<I, R>) => Promise<Response<R>>,
	internalOptions: InternalOptions,
	options?: RequestOptions<I, R>
) => {
	const { user, initialized, onWindowFocus, refetchMountedQueries, queryCache } = useWunderGraph();
	const [_options, _setOptions] = useState<MutateRequestOptions<I>>(options);
	const [shouldFetch, setShouldFetch] = useState<boolean>(options === undefined || options.initialState === undefined);
	const refetch = useCallback((options?: RequestOptions<I, R>) => {
		if (options !== undefined) {
			_setOptions(options);
		}
		setShouldFetch(true);
	}, []);
	useEffect(() => {
		if (options && options.refetchOnWindowFocus === true) {
			setShouldFetch(true);
		}
	}, [onWindowFocus]);
	const [response, setResponse] = useState<Response<R>>(
		options !== undefined && options.initialState !== undefined
			? {
					status: "ok",
					body: options.initialState,
			  }
			: { status: "loading" }
	);
	useEffect(() => {
		if (!initialized) {
			return;
		}
		if (internalOptions.requiresAuthentication && user === undefined) {
			setResponse({ status: "requiresAuthentication" });
			return;
		}
		if (!shouldFetch) {
			return;
		}
		const abortController = new AbortController();
		if (response.status === "ok") {
			setResponse({ status: "ok", refetching: true, body: response.body });
		}
		const cacheKey = JSON.stringify(_options);
		const cached = queryCache[cacheKey];
		if (response.status !== "ok" && cached) {
			setResponse({
				status: "cached",
				body: cached as R,
			});
		}
		(async () => {
			const result = await promiseFactory({
				..._options,
				abortSignal: abortController.signal,
			});
			if (abortController.signal.aborted) {
				setResponse({ status: "aborted" });
				return;
			}
			if (result.status === "ok") {
				queryCache[cacheKey] = result.body;
			}
			setResponse(result);
			setShouldFetch(false);
		})();
		return () => {
			abortController.abort();
		};
	}, [user, initialized, shouldFetch, _options, promiseFactory]);
	useEffect(() => setShouldFetch(true), [user, refetchMountedQueries]);
	return {
		response,
		refetch,
	};
};

export const useQuery = {
	Dragons: (options?: RequestOptions<never, DragonsResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.Dragons, { requiresAuthentication: false }, options);
	},
};
