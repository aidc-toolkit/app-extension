import { mapIterable } from "@aidc-toolkit/utility";
import type { AppExtensionBigInt } from "./app-extension-options.js";
import type { AppExtension } from "./app-extension.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import type { Matrix, MatrixResult, SingletonResult } from "./type.js";

/**
 * Library proxy.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 */
export abstract class LibProxy<ThrowError extends boolean> {
    /**
     * Application extension.
     */
    readonly #appExtension: AppExtension<ThrowError>;

    /**
     * Constructor.
     *
     * @param appExtension
     * Application extension.
     */
    constructor(appExtension: AppExtension<ThrowError>) {
        this.#appExtension = appExtension;
    }

    /**
     * Get the application extension.
     */
    get appExtension(): AppExtension<ThrowError> {
        return this.#appExtension;
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
    mapBigInt(value: bigint): SingletonResult<AppExtensionBigInt, ThrowError> {
        return this.#appExtension.mapBigInt(value);
    }

    /**
     * Handle an error thrown by a function call. Return type is {@linkcode SingletonResult} to ensure assignment
     * compatibility.
     *
     * @param e
     * Error.
     *
     * @returns
     * Error if errors are not thrown.
     */
    #handleError<TResult>(e: unknown): SingletonResult<TResult, ThrowError> {
        let result;

        if (e instanceof RangeError) {
            const error = this.#appExtension.mapRangeError(e);

            if (this.#appExtension.throwError) {
                // eslint-disable-next-line @typescript-eslint/only-throw-error -- Type is determined by application.
                throw error;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Won't get here if ThrowError is false so result is TError.
            result = error as SingletonResult<TResult, ThrowError>;
        } else {
            // Unknown error; pass on to application extension.
            result = this.appExtension.handleError(e instanceof Error ? e.message : String(e));
        }

        return result;
    }

    /**
     * Call a singleton result function with error handling.
     *
     * @param callback
     * Callback.
     *
     * @returns
     * Callback return or error if errors are not thrown.
     */
    singletonResult<TResult>(callback: () => SingletonResult<TResult, ThrowError>): SingletonResult<TResult, ThrowError> {
        let result;

        try {
            result = callback();
        } catch (e: unknown) {
            result = this.#handleError<TResult>(e);
        }

        return result;
    }

    /**
     * Call a matrix result function with error handling.
     *
     * @param matrixValues
     * Matrix of values.
     *
     * @param valueCallback
     * Callback to process value.
     *
     * @returns
     * Matrix of callback results and errors if errors are not thrown.
     */
    protected matrixResult<TValue, TResult>(matrixValues: Matrix<TValue>, valueCallback: (value: TValue) => SingletonResult<TResult, ThrowError>): MatrixResult<TResult, ThrowError> {
        return matrixValues.map(rowValues => rowValues.map(value => this.singletonResult(() => valueCallback(value))));
    }

    /**
     * Map a matrix of validate string results to boolean. If the string is empty, the result is true, indicating that
     * there is no error.
     *
     * @param matrixValidateResults
     * Matrix of results from a call to a validate function.
     *
     * @returns
     * Matrix of boolean values, true if corresponding string is empty.
     */
    protected isValidString(matrixValidateResults: MatrixResult<string, ThrowError>): Matrix<boolean> {
        return matrixValidateResults.map(rowValues => rowValues.map(value => (validateResult => validateResult === "")(value)));
    }

    /**
     * Set up a mapping and call a matrix result function with error handling.
     *
     * @param setUpCallback
     * Callback to set up the mapping.
     *
     * @param matrixValues
     * Matrix of values.
     *
     * @param valueCallback
     * Callback to process value.
     *
     * @returns
     * Matrix of callback results and errors if errors are not thrown.
     */
    protected setUpMatrixResult<TSetup, TValue, TResult>(setUpCallback: () => TSetup, matrixValues: Matrix<TValue>, valueCallback: (setup: TSetup, value: TValue) => SingletonResult<TResult, ThrowError>): MatrixResult<TResult, ThrowError> {
        let result;

        try {
            result = matrixValues.map(rowValues => rowValues.map(value => this.singletonResult(() => valueCallback(setUpCallback(), value))));
        } catch (e: unknown) {
            result = [[this.#handleError(e)]];
        }

        return result;
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
    #arrayCallback<TValue, TResult>(value: TValue, callback: (value: TValue) => Array<SingletonResult<TResult, ThrowError>>): Array<SingletonResult<TResult, ThrowError>> {
        const result = this.singletonResult(() => callback(value));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- If result is not an array, it must be an error.
        return result instanceof Array ? result : [result as SingletonResult<TResult, ThrowError>];
    }

    /**
     * Call an array result function with error handling and map to a matrix.
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
    protected arrayResult<TValue, TResult>(matrixValues: Matrix<TValue>, callback: (value: TValue) => Array<SingletonResult<TResult, ThrowError>>): MatrixResult<TResult, ThrowError> {
        let result: MatrixResult<TResult, ThrowError>;

        if (matrixValues.length === 0) {
            // Special case; unlikely to occur.
            result = [[]];
        } else if (matrixValues.length === 1) {
            result = [];

            matrixValues[0].forEach((value, columnIndex) => {
                const arrayResult = this.#arrayCallback(value, callback);

                arrayResult.forEach((resultError, rowIndex) => {
                    // Append a row if necessary.
                    if (result.length <= rowIndex) {
                        result.push([]);
                    }

                    // Assignment will automatically expand row to the number of columns in the matrix.
                    result[rowIndex][columnIndex] = resultError;
                });
            });
        } else {
            result = matrixValues.map((rowValue) => {
                let arrayResult: Array<SingletonResult<TResult, ThrowError>>;

                if (rowValue.length === 0) {
                    // Special case; unlikely to occur.
                    arrayResult = [];
                } else if (rowValue.length === 1) {
                    arrayResult = this.#arrayCallback(rowValue[0], callback);
                } else {
                    arrayResult = [this.#handleError(new RangeError(i18nextAppExtension.t("Proxy.matrixMustBeArray")))];
                }

                return arrayResult;
            });
        }

        return result;
    }

    /**
     * Call a matrix result function with error handling and map a non-error result to an empty string and {@linkcode
     * RangeError} to the string error message.
     *
     * @param matrixValues
     * Matrix of values.
     *
     * @param callback
     * Callback that either returns or throws an exception.
     *
     * @returns
     * Matrix of strings.
     */
    protected matrixErrorResult<TValue>(matrixValues: Matrix<TValue>, callback: (value: TValue) => void): Matrix<string> {
        return matrixValues.map(rowValues => rowValues.map((value) => {
            let result;

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
                    throw e;
                }
            }

            return result;
        }));
    }

    /**
     * Call an iterable result function with error handling and map to a matrix. Although the natural approach would be
     * to map to a single-element array containing an array of *N* results (i.e., [[r0, r1, r2, ..., r*N*]]), this is
     * rendered visually as a single row. The more readable approach is as a single column, so the mapping is to an
     * *N*-element array of single-element result arrays (i.e., [[r0], [r1], [r2], ..., [r*N*]]).
     *
     * @param iterableCallback
     * Iterable callback.
     *
     * @returns
     * Matrix of callback results.
     */
    protected iterableResult<TResult>(iterableCallback: () => Iterable<SingletonResult<TResult, ThrowError>>): MatrixResult<TResult, ThrowError> {
        let result;

        try {
            result = Array.from(mapIterable(iterableCallback(), result => [result]));
        } catch (e: unknown) {
            result = [[this.#handleError(e)]];
        }

        return result;
    }
}
