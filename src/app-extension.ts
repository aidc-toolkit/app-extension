import type { TypedAsyncFunction, TypedFunction, TypedSyncFunction } from "@aidc-toolkit/core";
import { i18nextAppExtension } from "./locale/i18n.js";
import type { ErrorExtends, ResultError, SheetAddress, SheetRange } from "./type.js";

/**
 * Application extension.
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
export abstract class AppExtension<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> {
    /**
     * Application version.
     */
    private readonly _version: string;

    /**
     * Maximum sequence count supported by application.
     */
    private readonly _maximumSequenceCount: number;

    /**
     * If true, errors are reported through the throw/catch mechanism.
     */
    private readonly _throwError: ThrowError;

    /**
     * Maximum width supported by application.
     */
    private _maximumWidth?: number;

    /**
     * Maximum height supported by application.
     */
    private _maximumHeight?: number;

    /**
     * Constructor.
     *
     * @param version
     * Application version.
     *
     * @param maximumSequenceCount
     * Maximum sequence count supported by application.
     *
     * @param throwError
     * If true, errors are reported through the throw/catch mechanism.
     */
    protected constructor(version: string, maximumSequenceCount: number, throwError: ThrowError) {
        this._version = version;
        this._maximumSequenceCount = maximumSequenceCount;
        this._throwError = throwError;
    }

    /**
     * Get the version.
     *
     * @returns
     * Version.
     */
    get version(): string {
        return this._version;
    }

    /**
     * Determine if errors are reported through the throw/catch mechanism.
     */
    get throwError(): ThrowError {
        return this._throwError;
    }

    /**
     * Get the maximum width supported by the application.
     *
     * @returns
     * Maximum width supported by the application.
     */
    async maximumWidth(): Promise<number> {
        this._maximumWidth ??= await this.getMaximumWidth();

        return this._maximumWidth;
    }

    /**
     * Get the maximum width supported by the application.
     *
     * @returns
     * Maximum width supported by the application.
     */
    protected abstract getMaximumWidth(): Promise<number>;

    /**
     * Get the maximum height supported by the application.
     *
     * @returns
     * Maximum height supported by the application.
     */
    async maximumHeight(): Promise<number> {
        this._maximumHeight ??= await this.getMaximumHeight();

        return this._maximumHeight;
    }

    /**
     * Get the maximum height supported by the application.
     *
     * @returns
     * Maximum height supported by the application.
     */
    protected abstract getMaximumHeight(): Promise<number>;

    /**
     * Get the sheet address from an invocation context.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Sheet address.
     */
    abstract getSheetAddress(invocationContext: TInvocationContext): Promise<SheetAddress>;

    /**
     * Get a parameter range from an invocation context.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @param parameterNumber
     * Parameter number.
     *
     * @returns
     * Sheet range or null if parameter is not a range.
     */
    abstract getParameterSheetRange(invocationContext: TInvocationContext, parameterNumber: number): Promise<SheetRange | null>;

    /**
     * Validate a sequence count against the maximum supported by application.
     *
     * @param sequenceCount
     * Sequence count.
     */
    validateSequenceCount(sequenceCount: number): void {
        const absoluteSequenceCount = Math.abs(sequenceCount);

        if (absoluteSequenceCount > this._maximumSequenceCount) {
            throw new RangeError(i18nextAppExtension.t("AppExtension.sequenceCountMustBeLessThanOrEqualTo", {
                sequenceCount: absoluteSequenceCount,
                maximumSequenceCount: this._maximumSequenceCount
            }));
        }
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
}
