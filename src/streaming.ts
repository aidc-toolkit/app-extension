import type { MatrixResult } from "./type.js";

/**
 * Streaming consumer callback, returned by application extension implementation.
 */
export type StreamingConsumerCallback<TResult, ThrowError extends boolean> =
    (result: MatrixResult<TResult, ThrowError>) => void;

/**
 * Streaming cancelled callback, passed to application extension implementation.
 */
export type StreamingCancelledCallback =
    () => void;
