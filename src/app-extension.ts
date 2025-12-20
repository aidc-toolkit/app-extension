import type { Hyperlink, Promisable, TypedAsyncFunction, TypedFunction, TypedSyncFunction } from "@aidc-toolkit/core";
import type { AppData } from "./app-data.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import type { ErrorExtends, MatrixResultError, ResultError, SheetAddress, SheetRange } from "./type.js";

/**
 * Application extension.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 *
 * @template TError
 * Error type.
 *
 * @template TInvocationContext
 * Application-specific invocation context type.
 *
 * @template TBigInt
 * Type to which big integer is mapped.
 */
export abstract class AppExtension<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> {
    /**
     * Application name prefix for properties and application data.
     */
    static readonly APPLICATION_NAME_PREFIX = "AIDCToolkit.";

    /**
     * Version property name.
     */
    static readonly VERSION_NAME = `${AppExtension.APPLICATION_NAME_PREFIX}version`;

    /**
     * Application version.
     */
    readonly #version: string;

    /**
     * Maximum sequence count supported by application.
     */
    readonly #maximumSequenceCount: number;

    /**
     * If true, errors are reported through the throw/catch mechanism.
     */
    readonly #throwError: ThrowError;

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
        this.#version = version;
        this.#maximumSequenceCount = maximumSequenceCount;
        this.#throwError = throwError;
    }

    /**
     * Initialize the application extension.
     */
    async initialize(): Promise<void> {
        const fileVersion = await this.getFileProperty(AppExtension.VERSION_NAME);

        if (fileVersion !== this.#version) {
            await this.setFileProperty(AppExtension.VERSION_NAME, this.#version);
        }
    }

    /**
     * Get the version.
     *
     * @returns
     * Version.
     */
    get version(): string {
        return this.#version;
    }

    /**
     * Determine if errors are reported through the throw/catch mechanism.
     */
    get throwError(): ThrowError {
        return this.#throwError;
    }

    /**
     * Get the maximum width supported by the application.
     */
    abstract get maximumWidth(): number;

    /**
     * Get the maximum height supported by the application.
     */
    abstract get maximumHeight(): number;

    /**
     * Get the sheet address from an invocation context.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Sheet address.
     */
    abstract getSheetAddress(invocationContext: TInvocationContext): Promisable<SheetAddress>;

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
    abstract getParameterSheetRange(invocationContext: TInvocationContext, parameterNumber: number): Promisable<SheetRange | null>;

    /**
     * Get a property stored within the active file.
     *
     * @param name
     * Property name.
     *
     * @returns
     * Property value or undefined if no value is stored under the given name.
     */
    abstract getFileProperty(name: string): Promisable<string | undefined>;

    /**
     * Set a property to be stored within the active file.
     *
     * @param name
     * Property name.
     *
     * @param value
     * Property value or null to remove.
     */
    abstract setFileProperty(name: string, value: string | null): Promisable<void>;

    /**
     * Decode application data from an encoded string.
     *
     * @param stringData
     * String data.
     *
     * @returns
     * Decoded application data.
     */
    protected static decodeAppData(stringData: string): AppData | undefined {
        let appData: AppData | undefined;

        const [type, data] = stringData.split(":", 2);

        switch (type) {
            case "text":
            case "json":
                appData = {
                    type,
                    data
                };
                break;

            case "object":
                appData = {
                    type: "object",
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type is determined by application mapping.
                    data: JSON.parse(data) as object
                };
                break;

            case "binary":
                appData = {
                    type: "binary",
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Index 0 is always valid.
                    data: new Uint8Array(atob(data).split("").map(char => char.codePointAt(0)!))
                };
                break;
        }

        return appData;
    }

    /**
     * Encode application data as a string for storage. Encoded string is the type, followed by a colon, followed by a
     * string representation of the data.
     *
     * @param appData
     * Application data.
     *
     * @returns
     * Encoded application data.
     */
    protected static encodeAppData(appData: AppData): string {
        let stringData: string;

        switch (appData.type) {
            case "text":
            case "json":
                stringData = `${appData.type}:${appData.data}`;
                break;

            case "object":
                stringData = `object:${JSON.stringify(appData.data)}`;
                break;

            case "binary":
                stringData = `binary:${btoa(String.fromCodePoint(...appData.data))}`;
                break;
        }

        return stringData;
    }

    /**
     * Get application data stored within the active file.
     *
     * @param name
     * Name under which data is stored.
     *
     * @returns
     * Application data or undefined if no data is stored under the given name.
     */
    abstract getFileData(name: string): Promisable<AppData | undefined>;

    /**
     * Set application data to be stored within the active file.
     *
     * @param name
     * Name under which to store data.
     *
     * @param appData
     * Application data or null to remove.
     */
    abstract setFileData(name: string, appData: AppData | null): Promisable<void>;

    /**
     * Get application data stored and shared across multiple files.
     *
     * @param name
     * Name under which data is stored.
     *
     * @returns
     * Application ata or undefined if no data is stored under the given name.
     */
    abstract getSharedData(name: string): Promisable<AppData | undefined>;

    /**
     * Set application data to be stored and shared across multiple files.
     *
     * @param name
     * Name under which to store data.
     *
     * @param appData
     * Application data or null to remove.
     */
    abstract setSharedData(name: string, appData: AppData | null): Promisable<void>;

    /**
     * Validate a sequence count against the maximum supported by application.
     *
     * @param sequenceCount
     * Sequence count.
     */
    validateSequenceCount(sequenceCount: number): void {
        const absoluteSequenceCount = Math.abs(sequenceCount);

        if (absoluteSequenceCount > this.#maximumSequenceCount) {
            throw new RangeError(i18nextAppExtension.t("AppExtension.sequenceCountMustBeLessThanOrEqualTo", {
                sequenceCount: absoluteSequenceCount,
                maximumSequenceCount: this.#maximumSequenceCount
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
     * Map hyperlink results to a form suitable for the application.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @param matrixHyperlinkResults
     * Matrix of hyperlink results from function call.
     *
     * @returns
     * Matrix of results in a form suitable for the application.
     */
    abstract mapHyperlinkResults(invocationContext: TInvocationContext, matrixHyperlinkResults: MatrixResultError<Hyperlink, ThrowError, TError>): Promisable<MatrixResultError<unknown, ThrowError, TError>>;

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
     * @template TMethod
     * Method type.
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
     * @template TMethod
     * Method type.
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
