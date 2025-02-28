/**
 * Type that error type is expected to extend. If the application framework reports errors through the throw/catch
 * mechanism, the error type is expected to extend {@link Error}. Otherwise, it may extend any object type.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 */
export type ErrorExtends<ThrowError extends boolean> =
    ThrowError extends true ? Error : object;

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
export type Matrix<T> =
    T[][];

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
export type ResultError<TResult, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> =
    ThrowError extends false ? TResult | TError : TResult;

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
export type MatrixResultError<TResult, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> =
    Matrix<ResultError<TResult, ThrowError, TError>>;

/**
 * Typed function, applicable to any function, stricter than {@link Function}.
 */
export type TypedFunction<TMethod extends (...args: Parameters<TMethod>) => ReturnType<TMethod>> =
    (...args: Parameters<TMethod>) => ReturnType<TMethod>;

/**
 * Typed synchronous function, applicable to any function that doesn't return a Promise.
 */
export type TypedSyncFunction<TMethod extends TypedFunction<TMethod>> =
    [ReturnType<TMethod>] extends [PromiseLike<unknown>] ? never : TypedFunction<TMethod>;

/**
 * Determine the fundamental promised type. This is stricter than `Awaited<Type>` in that it requires a Promise.
 */
type PromisedType<T> =
    [T] extends [PromiseLike<infer TPromised>] ? TPromised : never;

/**
 * Typed asynchronous function, applicable to any function that returns a Promise.
 */
export type TypedAsyncFunction<TMethod extends (...args: Parameters<TMethod>) => PromiseLike<PromisedType<ReturnType<TMethod>>>> =
    (...args: Parameters<TMethod>) => Promise<PromisedType<ReturnType<TMethod>>>;

/**
 * Nullishable type. Application extension may pass `null` or `undefined` to missing parameters.
 */
export type Nullishable<T> =
    T | null | undefined;

/**
 * Non-nullishable type. If T is an object type, it is spread and attributes within it are made non-nullishable.
 */
export type NonNullishable<T> = T extends object ? {
    [P in keyof T]-?: NonNullishable<T[P]>
} : NonNullable<T>;

/**
 * Determine if argument is nullish. Application extension may pass `null` or `undefined` to missing parameters.
 *
 * @param argument
 * Argument.
 *
 * @returns
 * True if argument is undefined or null.
 */
export function isNullish<T>(argument: T | null | undefined): argument is null | undefined {
    return argument === null || argument === undefined;
}
