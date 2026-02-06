import type { MatrixResult } from "./type.js";

/**
 * Streaming consumer callback, returned by application extension implementation.
 */
export type StreamingConsumerCallback<TResult> =
    (result: MatrixResult<TResult>) => void;

/**
 * Streaming cancelled callback, passed to application extension implementation.
 */
export type StreamingCancelledCallback =
    () => void;
