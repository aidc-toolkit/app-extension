/**
 * Application extension options. Never instantiated; used only as extension point for custom application extension
 * options to define types.
 */
export interface AppExtensionOptions {
    /**
     * If true, errors are reported through the throw/catch mechanism.
     */
    ThrowError: boolean;

    /**
     * Application error.
     */
    ApplicationError: object;

    /**
     * Invocation context.
     */
    InvocationContext: unknown;

    /**
     * Streaming context.
     */
    StreamingContext: unknown;

    /**
     * Big integer representation.
     */
    BigInteger: number | bigint;
}

/**
 * Custom application extension options.
 */
export interface CustomAppExtensionOptions extends AppExtensionOptions {
}

/**
 * If true, errors are reported through the throw/catch mechanism.
 */
export type ThrowError = CustomAppExtensionOptions["ThrowError"];

/**
 * Application error type.
 */
export type ApplicationError = CustomAppExtensionOptions["ApplicationError"];

/**
 * Invocation context type.
 */
export type InvocationContext = CustomAppExtensionOptions["InvocationContext"];

/**
 * Streaming context type.
 */
export type StreamingContext = CustomAppExtensionOptions["StreamingContext"];

/**
 * Big integer representation type.
 */
export type BigInteger = CustomAppExtensionOptions["BigInteger"];
