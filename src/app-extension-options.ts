/**
 * Application extension options. Never instantiated; used only as extension point for custom application extension
 * options to define types.
 */
export interface AppExtensionOptions {
    /**
     * Error.
     */
    Error: object;

    /**
     * Invocation context.
     */
    InvocationContext: unknown;

    /**
     * Streaming invocation context.
     */
    StreamingInvocationContext: unknown;

    /**
     * Big integer representation.
     */
    BigInt: number | bigint;
}

/**
 * Custom application extension options.
 */
export interface CustomAppExtensionOptions extends AppExtensionOptions {
}

/**
 * Error type.
 */
export type AppExtensionError = CustomAppExtensionOptions["Error"];

/**
 * Invocation context type.
 */
export type AppExtensionInvocationContext = CustomAppExtensionOptions["InvocationContext"];

/**
 * Streaming invocation context type.
 */
export type AppExtensionStreamingInvocationContext = CustomAppExtensionOptions["StreamingInvocationContext"];

/**
 * Big integer representation type.
 */
export type AppExtensionBigInt = CustomAppExtensionOptions["BigInt"];
