export interface LinkDefinition {
	targetType: string;
	targetFieldName: string;
	sourceField: string;
	argumentSources: LinkFieldArgumentSourceDefinition[];
}

export interface LinkFieldArgumentSourceDefinition {
	name: string;
	type: "objectField" | "fieldArgument";
	path: string[];
}

class LinkBuilder<T, R extends {} = {}, TT = {}> {
	// @ts-ignore
	constructor(current: R = {}, sourceField: string, targetType: string, targetField: string) {
		this.current = current;
		this.sourceField = sourceField;
		this.targetType = targetType;
		this.targetField = targetField;
	}

	private readonly sourceField: string;
	private readonly targetType: string;
	private readonly targetField: string;

	// @ts-ignore
	private current: R = {};

	argument<P extends Exclude<keyof T, keyof R>, V extends T[P], S extends "fieldArgument" | "objectField">(
		key: P,
		source: S,
		value: S extends "fieldArgument" ? string : TT,
		...extraPath: string[]
	) {
		const extra: {} = { [key]: { source, path: [value, ...extraPath] } };

		const instance = {
			...(this.current as object),
			...extra,
		} as R & Pick<T, P>;

		return new LinkBuilder<T, R & Pick<T, P>, TT>(instance, this.sourceField, this.targetType, this.targetField);
	}

	build = (): LinkDefinition => {
		const args = this.current as { [key: string]: { path: string[]; source: "fieldArgument" | "objectField" } };
		return {
			argumentSources: Object.keys(args).map((key) => ({
				name: key,
				type: args[key].source,
				path: args[key].path,
			})),
			targetType: this.targetType,
			sourceField: this.sourceField,
			targetFieldName: this.targetField,
		};
	};
}

export const sourceStep = <T extends {}, R extends {}>() => ({
	source: <F extends keyof T>(field: F) => {
		return targetStep<T, F, R>(field);
	},
});

const targetStep = <T, F extends keyof T, R>(field: F) => ({
	target: <r extends keyof R>(targetType: r, targetField: string) => {
		return new LinkBuilder<T[F], {}, R[r]>({}, field as string, targetType as string, targetField);
	},
});

interface TargetTypes {
	users: "id" | "name" | "rocket" | "timestamp" | "twitter";
	users_aggregate: "aggregate" | "nodes";
	users_aggregate_fields: "count" | "max" | "min";
	users_max_fields: "name" | "rocket" | "timestamp" | "twitter";
	users_min_fields: "name" | "rocket" | "timestamp" | "twitter";
	Capsule: "id" | "landings" | "missions" | "original_launch" | "reuse_count" | "status" | "type" | "dragon";
	CapsuleMission: "flight" | "name";
	Dragon:
		| "active"
		| "crew_capacity"
		| "description"
		| "diameter"
		| "dry_mass_kg"
		| "dry_mass_lb"
		| "first_flight"
		| "heat_shield"
		| "height_w_trunk"
		| "id"
		| "launch_payload_mass"
		| "launch_payload_vol"
		| "name"
		| "orbit_duration_yr"
		| "pressurized_capsule"
		| "return_payload_mass"
		| "return_payload_vol"
		| "sidewall_angle_deg"
		| "thrusters"
		| "trunk"
		| "type"
		| "wikipedia";
	Distance: "feet" | "meters";
	DragonHeatShield: "dev_partner" | "material" | "size_meters" | "temp_degrees";
	Mass: "kg" | "lb";
	Volume: "cubic_feet" | "cubic_meters";
	DragonPressurizedCapsule: "payload_volume";
	DragonThrust: "amount" | "fuel_1" | "fuel_2" | "pods" | "thrust" | "type";
	Force: "kN" | "lbf";
	DragonTrunk: "cargo" | "trunk_volume";
	DragonTrunkCargo: "solar_array" | "unpressurized_cargo";
	Info:
		| "ceo"
		| "coo"
		| "cto_propulsion"
		| "cto"
		| "employees"
		| "founded"
		| "founder"
		| "headquarters"
		| "launch_sites"
		| "links"
		| "name"
		| "summary"
		| "test_sites"
		| "valuation"
		| "vehicles";
	Address: "address" | "city" | "state";
	InfoLinks: "elon_twitter" | "flickr" | "twitter" | "website";
	Core:
		| "asds_attempts"
		| "asds_landings"
		| "block"
		| "id"
		| "missions"
		| "original_launch"
		| "reuse_count"
		| "rtls_attempts"
		| "rtls_landings"
		| "status"
		| "water_landing";
	History: "details" | "event_date_unix" | "event_date_utc" | "id" | "links" | "title" | "flight";
	Link: "article" | "reddit" | "wikipedia";
	Launch:
		| "details"
		| "id"
		| "is_tentative"
		| "launch_date_local"
		| "launch_date_unix"
		| "launch_date_utc"
		| "launch_site"
		| "launch_success"
		| "launch_year"
		| "links"
		| "mission_id"
		| "mission_name"
		| "rocket"
		| "static_fire_date_unix"
		| "static_fire_date_utc"
		| "telemetry"
		| "tentative_max_precision"
		| "upcoming"
		| "ships";
	LaunchSite: "site_id" | "site_name_long" | "site_name";
	LaunchLinks:
		| "article_link"
		| "flickr_images"
		| "mission_patch_small"
		| "mission_patch"
		| "presskit"
		| "reddit_campaign"
		| "reddit_launch"
		| "reddit_media"
		| "reddit_recovery"
		| "video_link"
		| "wikipedia";
	LaunchRocket: "fairings" | "first_stage" | "rocket_name" | "rocket_type" | "rocket" | "second_stage";
	LaunchRocketFairings: "recovered" | "recovery_attempt" | "reused" | "ship";
	LaunchRocketFirstStage: "cores";
	LaunchRocketFirstStageCore:
		| "block"
		| "core"
		| "flight"
		| "gridfins"
		| "land_success"
		| "landing_intent"
		| "landing_type"
		| "landing_vehicle"
		| "legs"
		| "reused";
	Rocket:
		| "active"
		| "boosters"
		| "company"
		| "cost_per_launch"
		| "country"
		| "description"
		| "diameter"
		| "engines"
		| "first_flight"
		| "first_stage"
		| "height"
		| "id"
		| "landing_legs"
		| "mass"
		| "name"
		| "payload_weights"
		| "second_stage"
		| "stages"
		| "success_rate_pct"
		| "type"
		| "wikipedia";
	RocketEngines:
		| "number"
		| "type"
		| "version"
		| "layout"
		| "engine_loss_max"
		| "propellant_1"
		| "propellant_2"
		| "thrust_sea_level"
		| "thrust_vacuum"
		| "thrust_to_weight";
	RocketFirstStage:
		| "burn_time_sec"
		| "engines"
		| "fuel_amount_tons"
		| "reusable"
		| "thrust_sea_level"
		| "thrust_vacuum";
	RocketLandingLegs: "number" | "material";
	RocketPayloadWeight: "id" | "kg" | "lb" | "name";
	RocketSecondStage: "burn_time_sec" | "engines" | "fuel_amount_tons" | "payloads" | "thrust";
	RocketSecondStagePayloads: "option_1" | "composite_fairing";
	RocketSecondStagePayloadCompositeFairing: "height" | "diameter";
	LaunchRocketSecondStage: "block" | "payloads";
	Payload:
		| "customers"
		| "id"
		| "manufacturer"
		| "nationality"
		| "norad_id"
		| "orbit_params"
		| "orbit"
		| "payload_mass_kg"
		| "payload_mass_lbs"
		| "payload_type"
		| "reused";
	PayloadOrbitParams:
		| "apoapsis_km"
		| "arg_of_pericenter"
		| "eccentricity"
		| "epoch"
		| "inclination_deg"
		| "lifespan_years"
		| "longitude"
		| "mean_anomaly"
		| "mean_motion"
		| "periapsis_km"
		| "period_min"
		| "raan"
		| "reference_system"
		| "regime"
		| "semi_major_axis_km";
	LaunchTelemetry: "flight_club";
	Ship:
		| "abs"
		| "active"
		| "attempted_landings"
		| "class"
		| "course_deg"
		| "home_port"
		| "id"
		| "image"
		| "imo"
		| "missions"
		| "mmsi"
		| "model"
		| "name"
		| "position"
		| "roles"
		| "speed_kn"
		| "status"
		| "successful_landings"
		| "type"
		| "url"
		| "weight_kg"
		| "weight_lbs"
		| "year_built";
	ShipMission: "flight" | "name";
	ShipLocation: "latitude" | "longitude";
	HistoriesResult: "result" | "data";
	Result: "totalCount";
	Landpad:
		| "attempted_landings"
		| "details"
		| "full_name"
		| "id"
		| "landing_type"
		| "location"
		| "status"
		| "successful_landings"
		| "wikipedia";
	Location: "latitude" | "longitude" | "name" | "region";
	LaunchesPastResult: "result" | "data";
	Launchpad:
		| "attempted_launches"
		| "details"
		| "id"
		| "location"
		| "name"
		| "status"
		| "successful_launches"
		| "vehicles_launched"
		| "wikipedia";
	Mission: "description" | "id" | "manufacturers" | "name" | "twitter" | "website" | "wikipedia" | "payloads";
	MissionResult: "result" | "data";
	Roadster:
		| "apoapsis_au"
		| "details"
		| "earth_distance_km"
		| "earth_distance_mi"
		| "eccentricity"
		| "epoch_jd"
		| "inclination"
		| "launch_date_unix"
		| "launch_date_utc"
		| "launch_mass_kg"
		| "launch_mass_lbs"
		| "longitude"
		| "mars_distance_km"
		| "mars_distance_mi"
		| "name"
		| "norad_id"
		| "orbit_type"
		| "periapsis_arg"
		| "periapsis_au"
		| "period_days"
		| "semi_major_axis_au"
		| "speed_kph"
		| "speed_mph"
		| "wikipedia";
	RocketsResult: "result" | "data";
	ShipsResult: "result" | "data";
	users_mutation_response: "affected_rows" | "returning";
	CoreMission: "name" | "flight";
}

interface SourceFields {
	users: {
		distinct_on: null;
		limit: null;
		offset: null;
		order_by: null;
		where: null;
	};
	users_aggregate: {
		distinct_on: null;
		limit: null;
		offset: null;
		order_by: null;
		where: null;
	};
	users_by_pk: {
		id: null;
	};
	capsules: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	capsulesPast: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	capsulesUpcoming: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	capsule: {
		id: null;
	};
	company: {};
	cores: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	coresPast: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	coresUpcoming: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	core: {
		id: null;
	};
	dragons: {
		limit: null;
		offset: null;
	};
	dragon: {
		id: null;
	};
	histories: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	historiesResult: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	history: {
		id: null;
	};
	landpads: {
		limit: null;
		offset: null;
	};
	landpad: {
		id: null;
	};
	launches: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	launchesPast: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	launchesPastResult: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	launchesUpcoming: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	launch: {
		id: null;
	};
	launchLatest: {
		offset: null;
	};
	launchNext: {
		offset: null;
	};
	launchpads: {
		limit: null;
		offset: null;
	};
	launchpad: {
		id: null;
	};
	missions: {
		find: null;
		limit: null;
		offset: null;
	};
	missionsResult: {
		find: null;
		limit: null;
		offset: null;
	};
	mission: {
		id: null;
	};
	payloads: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	payload: {
		id: null;
	};
	roadster: {};
	rockets: {
		limit: null;
		offset: null;
	};
	rocketsResult: {
		limit: null;
		offset: null;
	};
	rocket: {
		id: null;
	};
	ships: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	shipsResult: {
		find: null;
		limit: null;
		offset: null;
		order: null;
		sort: null;
	};
	ship: {
		id: null;
	};
}

const linkBuilder = sourceStep<SourceFields, TargetTypes>();
export default linkBuilder;
