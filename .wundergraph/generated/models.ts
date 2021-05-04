

export interface GraphQLError {
	message: string;
	path?: ReadonlyArray<string | number>;
}

export interface DragonsResponse {
	data?: {
		dragons?: {
			id?: string;
			name?: string;
			active?: boolean;
			crew_capacity?: number;
		}[];
	};
	errors?: ReadonlyArray<GraphQLError>;
}
