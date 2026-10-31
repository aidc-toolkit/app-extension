import {
    type AppDataStorage,
    getLogger,
    type HTTPFetch,
    type Hyperlink,
    LogLevels,
    MemoryTransport,
    type Promisable
} from "@aidc-toolkit/core";
import type { Logger } from "tslog";
import type {
    ApplicationError,
    BigInteger,
    InvocationContext,
    StreamingContext,
    ThrowError
} from "./app-extension-options.js";
import type { LibProxy } from "./lib-proxy.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import type { StreamingCancelledCallback, StreamingConsumerCallback } from "./streaming.js";
import type { MatrixResult, SheetAddress, SheetRange, SingletonResult } from "./type.js";

/**
 * Application extension.
 */
export abstract class AppExtension {
    /**
     * Application name.
     */
    static readonly APPLICATION_NAME = "AIDCToolkit";

    /**
     * Version property name.
     */
    static readonly VERSION_NAME = `${AppExtension.APPLICATION_NAME}.version`;

    /**
     * Maximum logger messages length.
     */
    static readonly #MAXIMUM_LOGGER_MESSAGES_LENGTH = 120;

    /**
     * Truncate logger messages length.
     */
    static readonly #TRUNCATE_LOGGER_MESSAGES_LENGTH = 100;

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
     * Logger memory transport.
     */
    readonly #memoryTransport: MemoryTransport<object>;

    /**
     * Proxies map for lazy loading and memory management.
     */
    readonly #proxiesMap = new WeakMap<object, LibProxy>();

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

        this.#logger = getLogger(isProduction ? LogLevels.Info : LogLevels.Debug, {
            type: isProduction ? "hidden" : "pretty"
        });

        this.#memoryTransport = new MemoryTransport(this.#logger, AppExtension.#MAXIMUM_LOGGER_MESSAGES_LENGTH, AppExtension.#TRUNCATE_LOGGER_MESSAGES_LENGTH);
    }

    /**
     * Initialize the application extension.
     */
    async initialize(): Promise<void> {
        const fileVersion = await this.getDocumentProperty(AppExtension.VERSION_NAME);

        if (fileVersion !== this.#version) {
            await this.setDocumentProperty(AppExtension.VERSION_NAME, this.#version);
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
     * Get the logger memory transport.
     */
    get memoryTransport(): MemoryTransport<object> {
        return this.#memoryTransport;
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
     * Get a proxy instance. The use of a weak map ensures that proxies are loaded only as needed and may be garbage
     * collected if required.
     *
     * @param ProxyConstructor
     * Proxy constructor.
     *
     * @returns
     * Proxy instance.
     */
    getProxy<T extends LibProxy>(ProxyConstructor: new (appExtension: AppExtension) => T): T {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type is managed in this method.
        let proxy = this.#proxiesMap.get(ProxyConstructor) as T | undefined;

        if (proxy === undefined) {
            proxy = new ProxyConstructor(this);

            this.#proxiesMap.set(ProxyConstructor, proxy);
        }

        return proxy;
    }

    /**
     * Get the sheet address from an invocation context.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Sheet address.
     */
    abstract getSheetAddress(invocationContext: InvocationContext): Promisable<SheetAddress>;

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
    abstract getParameterSheetRange(invocationContext: InvocationContext, parameterNumber: number): Promisable<SheetRange | null>;

    /**
     * Install a streaming function.
     *
     * @param streamingContext
     * Streaming context.
     *
     * @param streamingCancelledCallback
     * Streaming cancelled callback, called when streaming is cancelled.
     *
     * @returns
     * Streaming consumer callback, called when stream contents updated.
     */
    abstract installStreaming<TResult>(streamingContext: StreamingContext, streamingCancelledCallback: StreamingCancelledCallback): StreamingConsumerCallback<TResult>;

    /**
     * Get a property stored within the active document.
     *
     * @param name
     * Property name.
     *
     * @returns
     * Property value or undefined if no value is stored under the given name.
     */
    abstract getDocumentProperty(name: string): Promisable<string | undefined>;

    /**
     * Set a property to be stored within the active document.
     *
     * @param name
     * Property name.
     *
     * @param value
     * Property value.
     */
    abstract setDocumentProperty(name: string, value: string): Promisable<void>;

    /**
     * Delete a property from the active document.
     *
     * @param name
     * Property name.
     */
    abstract deleteDocumentProperty(name: string): Promisable<void>;

    /**
     * Get application data storage for the current document.
     */
    abstract get documentAppDataStorage(): AppDataStorage<boolean>;

    /**
     * Get application data storage shared across multiple documents.
     */
    abstract get sharedAppDataStorage(): AppDataStorage<boolean>;

    /**
     * Get HTTP fetch function.
     */
    abstract get httpFetch(): HTTPFetch;

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
     * Map a big integer to its representation type.
     *
     * @param value
     * Big integer value to map.
     *
     * @returns
     * Mapped big integer value.
     */
    abstract mapBigInt(value: bigint): SingletonResult<BigInteger>;

    /**
     * Map hyperlink results to a form suitable for the application.
     *
     * @param matrixHyperlinkResults
     * Matrix of hyperlink results from function call.
     *
     * @returns
     * Matrix of results in a form suitable for the application.
     */
    abstract mapHyperlinkResults(matrixHyperlinkResults: MatrixResult<Hyperlink>): Promisable<MatrixResult<unknown>>;

    /**
     * Map a range error (thrown by the library) to an application-specific error. If errors are reported through the
     * throw/catch mechanism, the implementation may return the range error unmodified if that is supported.
     *
     * @param rangeError
     * Range error.
     */
    abstract mapRangeError(rangeError: RangeError): ApplicationError;

    /**
     * Handle an error with a message; called when an exception occurs outside the control of the AIDC Toolkit library.
     * Implementation must not return, most likely by throwing the message wrapped in an error type.
     *
     * @param message
     * Message to include in the error.
     */
    abstract handleError(message: string): never;
}
