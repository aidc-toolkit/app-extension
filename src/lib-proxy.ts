import { mapIterable } from "@aidc-toolkit/utility";
import type { AppExtension } from "./app-extension.js";
import type { ErrorExtends, Matrix, MatrixResultError, ResultError } from "./types.js";

/**
 * Library proxy.
 *
 * @template TBigInt
 * Type to which big integer is mapped.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 *
 * @template TError
 * Error type.
 */
export abstract class LibProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> {
    /**
     * Application extension.
     */
    private readonly _appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>;

    /**
     * Constructor.
     *
     * @param appExtension
     * Application extension.
     */
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        this._appExtension = appExtension;
    }

    /**
     * Get the application extension.
     */
    protected get appExtension(): AppExtension<ThrowError, TError, TInvocationContext, TBigInt> {
        return this._appExtension;
    }

    /**
     * Map big integer to another type if necessary.
     *
     * @param value
     * Big integer value to map.
     *
     * @returns
     * Mapped big integer value.
     */
    mapBigInt(value: bigint): ResultError<TBigInt, ThrowError, TError> {
        return this._appExtension.mapBigInt(value);
    }

    /**
     * Map a matrix of values using a callback.
     *
     * @param matrixValues
     * Matrix of values.
     *
     * @param callback
     * Callback.
     *
     * @returns
     * Matrix of callback results and errors if errors are not thrown.
     */
    protected mapMatrix<TValue, TResult>(matrixValues: Matrix<TValue>, callback: (value: TValue) => TResult): MatrixResultError<TResult, ThrowError, TError> {
        return matrixValues.map(rowValues => rowValues.map((value) => {
            let result: ResultError<TResult, ThrowError, TError>;

            try {
                result = callback(value);
            } catch (e: unknown) {
                if (e instanceof RangeError) {
                    const error = this._appExtension.mapRangeError(e);

                    if (this._appExtension.throwError) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type is known to extend Error.
                        throw error as Error;
                    }

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type determination is handled above.
                    result = error as ResultError<TResult, ThrowError, TError>;
                } else {
                    // Unknown error; pass up the stack.
                    // eslint-disable-next-line @typescript-eslint/only-throw-error -- Type will be interpreted and mapped by caller.
                    throw e;
                }
            }

            return result;
        }));
    }

    /**
     * Map a matrix of values to a matrix of strings via a callback that either returns or throws a range error. If the
     * callback returns, the result for that element is the empty string; otherwise, if it's a range error, the result
     * for that element is the error message.
     *
     * @param matrixValues
     * Matrix to map.
     *
     * @param callback
     * Callback that either returns or throws an exception.
     *
     * @returns
     * Matrix of strings.
     *
     * @template TValue
     * Value type.
     */
    protected static mapMatrixRangeError<TValue>(matrixValues: Matrix<TValue>, callback: (value: TValue) => void): Matrix<string> {
        return matrixValues.map(rowValues => rowValues.map((value) => {
            let result: string;

            try {
                callback(value);

                // No error; return empty string.
                result = "";
            } catch (e: unknown) {
                if (e instanceof RangeError) {
                    // Library error; return error message.
                    result = e.message;
                } else {
                    // Unknown error; pass up the stack.
                    throw e instanceof Error ?
                        e :
                        new Error("Unknown error", {
                            cause: e
                        });
                }
            }

            return result;
        }));
    }

    /**
     * Convert an iterable result of a callback to a matrix result. Although the natural approach would be to map to a
     * single-element array containing an array of *N* results (i.e., [[r0, r1, r2, ..., r*N*]]), this is rendered
     * visually as a single row. The more readable approach is as a single column, so the mapping is to an *N*-element
     * array of single-element result arrays (i.e., [[r0], [r1], [r2], ..., [r*N*]]).
     *
     * @param iterableResult
     * Iterable result.
     *
     * @returns
     * Matrix of callback results.
     */
    protected static matrixResult<TResult>(iterableResult: Iterable<TResult>): Matrix<TResult> {
        return Array.from(mapIterable(iterableResult, result => [result]));
    }
}
