import type { ApplicationError, ThrowError } from "./app-extension-options.js";

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
 * Function singleton return, possibly including an error return. If the application extension reports errors through
 * the return value, the result is the union of the return type and the error type; otherwise, it's just the return
 * type.
 *
 * @template TResult
 * Result type.
 */
export type SingletonResult<TResult> = ThrowError extends true ? TResult : TResult | ApplicationError;

/**
 * Function matrix return, possibly including an error return in each element. If the application extension reports
 * errors through the return value, the individual element result is the union of the return type and the error type;
 * otherwise, it's just the return type.
 *
 * @template TResult
 * Result type.
 */
export type MatrixResult<TResult> = Matrix<SingletonResult<TResult>>;
