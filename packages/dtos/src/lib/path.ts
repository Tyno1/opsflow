import type { paths } from "@/generated/api.js";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type PathMethod<P extends keyof paths, M extends HttpMethod> = NonNullable<
	paths[P][M]
>;

type JsonBody<T> = T extends {
	content: { "application/json": infer B };
}
	? B
	: never;

/** Path-level parameters (shared across methods). */
export type PathParameters<P extends keyof paths> = paths[P]["parameters"];

/** Method-level parameters (path, query, header, cookie). */
export type PathMethodParameters<P extends keyof paths, M extends HttpMethod> =
	PathMethod<P, M> extends { parameters: infer Params } ? Params : never;

export type PathParams<P extends keyof paths, M extends HttpMethod> =
	PathMethodParameters<P, M> extends { path: infer PP } ? PP : never;

export type PathQuery<P extends keyof paths, M extends HttpMethod> =
	PathMethodParameters<P, M> extends { query?: infer Q }
		? NonNullable<Q>
		: never;

export type PathRequest<P extends keyof paths, M extends HttpMethod> =
	PathMethod<P, M> extends { requestBody: infer RB } ? JsonBody<RB> : never;

type PathResponseBody<
	P extends keyof paths,
	M extends HttpMethod,
	S extends keyof PathMethod<P, M>["responses"] & number,
> = JsonBody<PathMethod<P, M>["responses"][S]>;

/** Response body for a status code. Empty bodies (e.g. 204) resolve to void. */
export type PathResponse<
	P extends keyof paths,
	M extends HttpMethod,
	S extends keyof PathMethod<P, M>["responses"] & number,
	// biome-ignore lint/suspicious/noConfusingVoidType: empty API responses use void
> = PathResponseBody<P, M, S> extends never ? void : PathResponseBody<P, M, S>;

export type PathStatusCode<
	P extends keyof paths,
	M extends HttpMethod,
> = keyof PathMethod<P, M>["responses"] & number;

export type PathResponses<P extends keyof paths, M extends HttpMethod> = {
	[S in PathStatusCode<P, M>]: PathResponse<P, M, S>;
};

/** All responses for a method — matches paths[P][M]["responses"]. */
export type PathMethodResponses<
	P extends keyof paths,
	M extends HttpMethod,
> = PathMethod<P, M>["responses"];
