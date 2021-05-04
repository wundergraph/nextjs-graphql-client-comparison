import { DragonsResponse } from "./models";

export interface appMockConfig {
	queries?: {
		Dragons?: () => DragonsResponse | undefined;
	};
	mutations?: {};
	subscriptions?: {};
}

export const appMock = (config: appMockConfig) => {
	return {
		queries: config.queries as { [name: string]: (input: Object) => Object | undefined },
		mutations: config.mutations as { [name: string]: (input: Object) => Object | undefined },
		subscriptions: config.subscriptions as {
			[name: string]: { pollingIntervalMillis: number; resolver: (input: Object) => Object | undefined };
		},
	};
};
