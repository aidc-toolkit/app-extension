import { getLogger, type Hyperlink, LogLevels, type Promisable } from "@aidc-toolkit/core";
import type { Logger } from "tslog";
import type { AppData } from "./app-data.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import type { ErrorExtends, MatrixResult, SheetAddress, SheetRange, SingletonResult } from "./type.js";

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
     * Maximum logger messages length. When the number of logger messages reaches this length, the oldest messages are
     * rotated out.
     */
    static readonly #MAXIMUM_LOGGER_MESSAGES_LENGTH = 120;

    /**
     * Rotate logger messages length. When the number of logger messages reaches the maximum, the logger messages are
     * trimmed to this length.
     */
    static readonly #ROTATE_LOGGER_MESSAGES_LENGTH = 100;

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
     * Logger.
     */
    readonly #logger: Logger<object>;

    /**
     * Logger messages.
     */
    readonly #loggerMessages: string[] = [];

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

        // Running in production if version doesn't include a pre-release identifier.
        const isProduction = !version.includes("-");

        this.#logger = getLogger(isProduction ? LogLevels.Info : LogLevels.Trace, {
            type: isProduction ? "hidden" : "pretty",
            hideLogPositionForProduction: isProduction,
            attachedTransports: [
                (logObject) => {
                    // Trim logger messages if necessary.
                    if (this.#loggerMessages.length === AppExtension.#MAXIMUM_LOGGER_MESSAGES_LENGTH) {
                        this.#loggerMessages.splice(0, AppExtension.#MAXIMUM_LOGGER_MESSAGES_LENGTH - AppExtension.#ROTATE_LOGGER_MESSAGES_LENGTH);
                    }

                    this.#loggerMessages.push(JSON.stringify(logObject));
                }
            ]
        });
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
     * Get the logger.
     */
    get logger(): Logger<object> {
        return this.#logger;
    }

    /**
     * Get the logger messages.
     */
    get loggerMessages(): readonly string[] {
        return this.#loggerMessages;
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
     * Decode a string representing a binary array.
     *
     * @param data
     * String.
     *
     * @returns
     * Binary array.
     */
    static #decodeBinary(data: string): Uint8Array {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Index 0 is always valid.
        return new Uint8Array(atob(data).split("").map(char => char.codePointAt(0)!));
    }

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
                    data: JSON.parse(data, (_key, value: unknown) =>
                        // Decode strings representing binary arrays and pass through other values unmodified.
                        typeof value === "string" && value.startsWith("binary:") ?
                            AppExtension.#decodeBinary(value) :
                            value
                    ) as object
                };
                break;

            case "binary":
                appData = {
                    type: "binary",
                    data: AppExtension.#decodeBinary(data)
                };
                break;
        }

        return appData;
    }

    /**
     * Encode a binary array as a string for storage.
     *
     * @param data
     * Binary array.
     *
     * @returns
     * String.
     */
    static #encodeBinary(data: Uint8Array): string {
        return btoa(String.fromCodePoint(...data));
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
                stringData = `object:${JSON.stringify(appData.data, (_key, value: unknown) =>
                    // Encode binary arrays as strings and pass through other values unmodified.
                    typeof value === "object" && value !== null && value instanceof Uint8Array ?
                        // There's a very small risk that a string will be passed in this format.
                        AppExtension.#encodeBinary(value) :
                        value
                )}`;
                break;

            case "binary":
                stringData = AppExtension.#encodeBinary(appData.data);
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
    abstract mapBigInt(value: bigint): SingletonResult<TBigInt, ThrowError, TError>;

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
    abstract mapHyperlinkResults(invocationContext: TInvocationContext, matrixHyperlinkResults: MatrixResult<Hyperlink, ThrowError, TError>): Promisable<MatrixResult<unknown, ThrowError, TError>>;

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
}
