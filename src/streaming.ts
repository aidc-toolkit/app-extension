import type { ErrorExtends, MatrixResult } from "./type.js";

/**
 * Streaming consumer callback, returned by application extension implementation.
 */
export type StreamingConsumerCallback<TResult, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> =
    (result: MatrixResult<TResult, ThrowError, TError>) => void;

/**
 * Streaming cancelled callback, passed to application extension implementation.
 */
export type StreamingCancelledCallback =
    () => void;
