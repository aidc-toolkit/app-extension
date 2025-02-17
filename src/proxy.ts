import { i18nextAppExtension } from "./locale/i18n.js";

/**
 * Matrix type; shorthand for defining a two-dimensional matrix (array of array) of a type.
 *
 * @template T
 * Type.
 */
export type Matrix<T> =
    T[][];

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
 * Application proxy.
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
export abstract class AppProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> {
    /**
     * If true, errors are reported through the throw/catch mechanism.
     */
    private readonly _throwError: ThrowError;

    /**
     * Constructor.
     *
     * @param throwError
     * If true, errors are reported through the throw/catch mechanism.
     */
    protected constructor(throwError: ThrowError) {
        this._throwError = throwError;
    }

    /**
     * Determine if errors are reported through the throw/catch mechanism.
     */
    get throwError(): ThrowError {
        return this._throwError;
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
    abstract mapBigInt(value: bigint): ResultError<TBigInt, ThrowError, TError>;

    /**
     * Map a range error (thrown by the library) to an application-specific error. If errors are reported through the
     * throw/catch mechanism, the implementation may return the range error unmodified if that is supported.
     *
     * @param rangeError
     */
    abstract mapRangeError(rangeError: RangeError): TError;

    /**
     * Handle an error with a message; called when an exception occurs outside the control of the AIDC Toolkit library.
     * Implementation must not return, most likely by throwing the message wrapped in an error type.
     *
     * @param message
     * Message to include in the error.
     */
    abstract handleError(message: string): never;

    /**
     * Bind a synchronous method and wrap it in a try/catch for comprehensive error handling.
     *
     * @param thisArg
     * The value to be passed as the `this` parameter to the method.
     *
     * @param method
     * Method to call.
     *
     * @returns
     * Function wrapped around the method.
     */
    bindSync<TMethod extends TypedSyncFunction<TMethod>>(thisArg: ThisParameterType<TMethod>, method: TMethod): TypedFunction<TMethod> {
        const boundMethod = method.bind(thisArg);

        return (...args: Parameters<TMethod>): ReturnType<TMethod> => {
            try {
                return boundMethod(...args);
            } catch (e: unknown) {
                // eslint-disable-next-line no-console -- Necessary for diagnostics.
                console.error(e);

                this.handleError(e instanceof Error ? e.message : String(e));
            }
        };
    }

    /**
     * Bind an asynchronous method and wrap it in a try/catch for comprehensive error handling.
     *
     * @param thisArg
     * The value to be passed as the `this` parameter to the method.
     *
     * @param method
     * Method to call.
     *
     * @returns
     * Function wrapped around the method.
     */
    bindAsync<TMethod extends TypedAsyncFunction<TMethod>>(thisArg: ThisParameterType<TMethod>, method: TMethod): TypedAsyncFunction<TMethod> {
        const boundMethod = method.bind(thisArg);

        return async (...args: Parameters<TMethod>) => await boundMethod(...args).catch((e: unknown) => {
            // eslint-disable-next-line no-console -- Necessary for diagnostics.
            console.error(e);

            this.handleError(e instanceof Error ? e.message : String(e));
        });
    }

    /**
     * Spill a horizontal matrix vertically to fit within a maximum width and height.
     *
     * @param hMatrixValues
     * Horizontal matrix values. Matrix has length 1 and contains a single array with the values.
     *
     * @param maximumWidth
     * Maximum width.
     *
     * @param maximumHeight
     * Maximum height.
     *
     * @returns
     * Matrix spilled within maximum width and maximum height.
     */
    static vSpill(hMatrixValues: Matrix<unknown>, maximumWidth: number, maximumHeight: number): Matrix<unknown> {
        let result: Matrix<unknown>;

        if (hMatrixValues.length !== 1) {
            throw new RangeError(i18nextAppExtension.t("Proxy.vSpillMustBeHorizontalArray"));
        }

        const hArrayValues = hMatrixValues[0];
        const hLength = hArrayValues.length;
        const maximumArea = maximumWidth * maximumHeight;

        // Lengths 0 and 1 are valid and require no special processing.
        if (hLength > 1 && hLength <= maximumArea) {
            // Make spill as square as possible.
            let spillWidth = Math.min(Math.ceil(Math.sqrt(maximumArea)), maximumWidth);

            // Array that has a length of a power of 10 is treated specially.
            if (Number.isInteger(Math.log10(hLength))) {
                // Try spill width that is a power of 10.
                const spillWidth10 = Math.pow(10, Math.floor(Math.log10(spillWidth)));

                // Keep default if not enough space for power of 10 matrix.
                if (hLength / spillWidth10 <= maximumHeight) {
                    spillWidth = spillWidth10;
                }
            }

            result = [];

            let hStartIndex = 0;

            do {
                const hEndIndex = hStartIndex + spillWidth;

                result.push(hArrayValues.slice(hStartIndex, hEndIndex));

                hStartIndex = hEndIndex;
            } while (hStartIndex < hLength);
        } else {
            // Return matrix unmodified and let application handle spill error if any.
            result = hMatrixValues;
        }

        return result;
    }

    /**
     * Spill a vertical matrix horizontally to fit within a maximum width and height.
     *
     * @param vMatrixValues
     * Vertical matrix values. Matrix contains arrays of length 1 with the values.
     *
     * @param maximumHeight
     * Maximum height.
     *
     * @param maximumWidth
     * Maximum width.
     *
     * @returns
     * Matrix spilled within maximum height and maximum width.
     */
    static hSpill(vMatrixValues: Matrix<unknown>, maximumHeight: number, maximumWidth: number): Matrix<unknown> {
        let result: Matrix<unknown>;

        for (const hArrayValues of vMatrixValues) {
            // This test should be necessary only once but account for zero-size matrix and misuse of method.
            if (hArrayValues.length !== 1) {
                throw new RangeError(i18nextAppExtension.t("Proxy.hSpillNotAVerticalArray"));
            }
        }

        const vLength = vMatrixValues.length;
        const maximumArea = maximumWidth * maximumHeight;

        // Lengths 0 and 1 are valid and require no special processing.
        if (vLength > 1 && vLength <= maximumArea) {
            // Make spill as square as possible.
            let spillHeight = Math.min(Math.ceil(Math.sqrt(maximumArea)), maximumHeight);

            // Array that has a length of a power of 10 is treated specially.
            if (Number.isInteger(Math.log10(vLength))) {
                // Try spill height that is a power of 10.
                const spillHeight10 = Math.pow(10, Math.floor(Math.log10(spillHeight)));

                // Keep default if not enough space for power of 10 matrix.
                if (vLength / spillHeight10 <= maximumWidth) {
                    spillHeight = spillHeight10;
                }
            }

            result = [];

            for (let rowIndex = 0; rowIndex < spillHeight; rowIndex++) {
                const row = new Array<unknown>();

                for (let cellIndex = rowIndex; cellIndex < vLength; cellIndex++) {
                    row.push(vMatrixValues[cellIndex][0]);
                }

                result.push(row);
            }
        } else {
            // Return matrix unmodified and let application handle spill error if any.
            result = vMatrixValues;
        }

        return result;
    }
}

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
export abstract class LibProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> {
    /**
     * Application proxy.
     */
    private readonly _appProxy: AppProxy<TBigInt, ThrowError, TError>;

    /**
     * Constructor.
     *
     * @param appProxy
     * Application proxy.
     */
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        this._appProxy = appProxy;
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
        return this._appProxy.mapBigInt(value);
    }

    /**
     * Map a matrix of values to a matrix of strings via a callback that either returns or throws an exception. If the
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
    protected mapMatrixVoid<TValue>(matrixValues: Matrix<TValue>, callback: (value: TValue) => void): Matrix<string> {
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
                    const error = this._appProxy.mapRangeError(e);

                    if (this._appProxy.throwError) {
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
     * Map an iterable result of a callback.
     *
     * @param callback
     * Callback.
     *
     * @returns
     * Matrix of callback results.
     */
    protected mapIterable<TResult>(callback: () => Iterable<TResult>): Matrix<TResult> {
        return [Array.from(callback())];
    }
}
