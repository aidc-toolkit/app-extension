/**
 * Type that error type is expected to extend. If the application framework reports errors through the throw/catch
 * mechanism, the error type is expected to extend {@link Error}. Otherwise, it may extend any object type.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 */
export type ErrorExtends<ThrowError extends boolean> = ThrowError extends true ? Error : object;

/**
 * Sheet.
 */
export interface Sheet {
    /**
     * Sheet name.
     */
    readonly name: string;
}

/**
 * Single cell address.
 */
export interface Address {
    /**
     * Zero-indexed row.
     */
    readonly rowIndex: number;

    /**
     * Zero-indexed column.
     */
    readonly columnIndex: number;
}

/**
 * Sheet address.
 */
export interface SheetAddress extends Sheet, Address {
}

/**
 * Range of cells.
 */
export interface Range {
    /**
     * Start address, inclusive.
     */
    readonly startAddress: Address;

    /**
     * End address, exclusive.
     */
    readonly endAddress: Address;
}

/**
 * Sheet range.
 */
export interface SheetRange extends Sheet, Range {
}

/**
 * Matrix type; shorthand for defining a two-dimensional matrix (array of array) of a type.
 *
 * @template T
 * Type.
 */
export type Matrix<T> = T[][];

/**
 * Function result, possibly including an error result. If the application framework reports errors through the return
 * value, the result is the union of the result type and the error type; otherwise, it's just the result type.
 *
 * @template TResult
 * Result type.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 *
 * @template TError
 * Error type.
 */
export type ResultError<TResult, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> = ThrowError extends false ? TResult | TError : TResult;

/**
 * Function result as matrix, possibly including an error result in each element. If the application framework reports
 * errors through the return value, the individual element result is the union of the result type and the error type;
 * otherwise, it's just the result type.
 *
 * @template TResult
 * Result type.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 *
 * @template TError
 * Error type.
 */
export type MatrixResultError<TResult, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> = Matrix<ResultError<TResult, ThrowError, TError>>;
