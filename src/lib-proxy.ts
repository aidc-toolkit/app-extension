import { mapIterable } from "@aidc-toolkit/utility";
import type { AppExtension } from "./app-extension";
import { i18nextAppExtension } from "./locale/i18n";
import type { ErrorExtends, Matrix, MatrixResultError, ResultError } from "./types";

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
     * Handle an error thrown by a function call.
     *
     * @param e
     * Error.
     *
     * @returns
     * Error if errors are not thrown.
     */
    private handleError<TResult>(e: unknown): ResultError<TResult, ThrowError, TError> {
        let result: ResultError<TResult, ThrowError, TError>;

        if (e instanceof RangeError) {
            const error = this._appExtension.mapRangeError(e);

            if (this._appExtension.throwError) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type is determined by application mapping.
                throw error as Error;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type determination is handled above.
            result = error as ResultError<TResult, ThrowError, TError>;
        } else {
            // Unknown error; pass up the stack.
            // eslint-disable-next-line @typescript-eslint/only-throw-error -- Error is being passed on from elsewhere.
            throw e;
        }

        return result;
    }

    /**
     * Do the callback for a simple return.
     *
     * @param value
     * Value.
     *
     * @param callback
     * Callback.
     *
     * @returns
     * Callback result or error if errors are not thrown.
     */
    private doCallback<TValue, TResult>(value: TValue, callback: (value: TValue) => TResult): ResultError<TResult, ThrowError, TError> {
        let result: ResultError<TResult, ThrowError, TError>;

        try {
            result = callback(value);
        } catch (e: unknown) {
            result = this.handleError(e);
        }

        return result;
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
        return matrixValues.map(rowValues => rowValues.map(value => this.doCallback(value, callback)));
    }

    /**
     * Do the callback for an array return.
     *
     * @param value
     * Value.
     *
     * @param callback
     * Callback.
     *
     * @returns
     * Callback result or error as array if errors are not thrown.
     */
    private doArrayCallback<TValue, TResult>(value: TValue, callback: (value: TValue) => TResult[]): Array<ResultError<TResult, ThrowError, TError>> {
        const result = this.doCallback(value, callback);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type determination is handled.
        return result instanceof Array ? result : [result as ResultError<TResult, ThrowError, TError>];
    }

    /**
     * Map a one-dimensional matrix of values using a callback.
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
    protected mapArray<TValue, TResult>(matrixValues: Matrix<TValue>, callback: (value: TValue) => TResult[]): MatrixResultError<TResult, ThrowError, TError> {
        let matrixResultError: MatrixResultError<TResult, ThrowError, TError>;

        if (matrixValues.length === 0) {
            // Special case; unlikely to occur.
            matrixResultError = [[]];
        } else if (matrixValues.length === 1) {
            matrixResultError = [];

            matrixValues[0].forEach((value, columnIndex) => {
                const arrayResultError = this.doArrayCallback(value, callback);

                arrayResultError.forEach((resultError, rowIndex) => {
                    if (matrixResultError.length <= rowIndex) {
                        matrixResultError.push([]);
                    }

                    // Assignment will automatically expand array.
                    matrixResultError[rowIndex][columnIndex] = resultError;
                });
            });
        } else {
            matrixResultError = matrixValues.map((rowValue) => {
                let arrayResultError: Array<ResultError<TResult, ThrowError, TError>>;

                if (rowValue.length === 0) {
                    // Special case; unlikely to occur.
                    arrayResultError = [];
                } else if (rowValue.length === 1) {
                    arrayResultError = this.doArrayCallback(rowValue[0], callback);
                } else {
                    arrayResultError = [this.handleError(new RangeError(i18nextAppExtension.t("Proxy.matrixMustBeArray")))];
                }

                return arrayResultError;
            });
        }

        return matrixResultError;
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
