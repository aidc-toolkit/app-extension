import { isNullish, type LogLevel, logLevelOf, type NonNullishable, type Nullishable } from "@aidc-toolkit/core";
import type { AppExtensionInvocationContext, AppExtensionStreamingInvocationContext } from "./app-extension-options.js";
import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "./descriptor.js";
import { LibProxy } from "./lib-proxy.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import { proxy } from "./proxy.js";
import type { Matrix, MatrixResult } from "./type.js";

const spillArrayParameterDescriptor: ParameterDescriptor = {
    name: "spillArray",
    type: Types.Any,
    multiplicity: Multiplicities.Array,
    isRequired: true
};

const spillMaximumParameterDescriptor: ParameterDescriptor = {
    name: "spillMaximum",
    type: Types.Number,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

const spillMaximumWidthParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: spillMaximumParameterDescriptor,
    sortOrder: 0,
    name: "spillMaximumWidth"
};

const spillMaximumHeightParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: spillMaximumParameterDescriptor,
    sortOrder: 1,
    name: "spillMaximumHeight"
};

const logLevelParameterDescriptor: ParameterDescriptor = {
    name: "logLevel",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

/**
 * Maximum dimensions.
 */
interface MaximumDimensions {
    /**
     * Optional maximum width.
     */
    width: Nullishable<number>;

    /**
     * Optional maximum height.
     */
    height: Nullishable<number>;
}

/**
 * Application helper.
 *
 * @template ThrowError
 * If true, errors are reported through the throw/catch mechanism.
 */
@proxy.describeClass(false, {
    category: "helper"
})
export class AppHelperProxy<ThrowError extends boolean> extends LibProxy<ThrowError> {
    static readonly #LOGGER_STREAM_NAME = "loggerStream";

    /**
     * Get the version.
     *
     * @returns
     * Version.
     */
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Singleton,
        parameterDescriptors: []
    })
    version(): string {
        return this.appExtension.version;
    }

    /**
     * Provide default values for maximum width and height if required.
     *
     * @param maximumDimensions
     * Maximum dimensions provided to function.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Array of maximum width and maximum height.
     */
    async #defaultMaximums(maximumDimensions: MaximumDimensions, invocationContext: Nullishable<AppExtensionInvocationContext>): Promise<NonNullishable<MaximumDimensions>> {
        if (isNullish(invocationContext)) {
            // Application error; no localization necessary.
            throw new Error("Invocation context not provided by application");
        }

        const maximumWidth = maximumDimensions.width;
        const maximumHeight = maximumDimensions.height;

        let definedMaximumWidth;
        let definedMaximumHeight;

        // Skip any extra work if both values are provided.
        if (isNullish(maximumWidth) || isNullish(maximumHeight)) {
            const sheetAddress = await this.appExtension.getSheetAddress(invocationContext);

            definedMaximumWidth = maximumWidth ?? this.appExtension.maximumWidth - sheetAddress.columnIndex;
            definedMaximumHeight = maximumHeight ?? this.appExtension.maximumHeight - sheetAddress.rowIndex;
        } else {
            definedMaximumWidth = maximumWidth;
            definedMaximumHeight = maximumHeight;
        }

        return {
            width: definedMaximumWidth,
            height: definedMaximumHeight
        };
    }

    /**
     * Spill a one-dimensional matrix to fit a rectangle within a given maximum height and width.
     *
     * @param arrayValues
     * Matrix values. Matrix is length 1 or contains arrays of length 1 with the values.
     *
     * @param maximumHeight
     * Maximum height.
     *
     * @param maximumWidth
     * Maximum width.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Matrix spilled within maximum height and maximum width.
     */
    @proxy.describeMethod({
        type: Types.Any,
        multiplicity: Multiplicities.Matrix,
        isAsync: true,
        requiresContext: true,
        parameterDescriptors: [spillArrayParameterDescriptor, spillMaximumHeightParameterDescriptor, spillMaximumWidthParameterDescriptor]
    })
    async spill(arrayValues: Matrix<unknown>, maximumHeight: Nullishable<number>, maximumWidth: Nullishable<number>, invocationContext: Nullishable<AppExtensionInvocationContext>): Promise<MatrixResult<unknown, ThrowError>> {
        let result;

        // Assume matrix is uniformly two-dimensional.
        const height = arrayValues.length;
        const width = height !== 0 ? arrayValues[0].length : 0;

        const isArrayOrError = this.singletonResult(() => {
            if (height > 1 && width > 1) {
                throw new RangeError(i18nextAppExtension.t("Proxy.matrixMustBeArray"));
            }

            return true;
        });

        if (isArrayOrError === true) {
            const maximumDimensions = await this.#defaultMaximums({
                width: maximumWidth,
                height: maximumHeight
            }, invocationContext);

            const isHorizontal = height === 1;
            const length = isHorizontal ? width : height;
            const maximumParallel = isHorizontal ? maximumDimensions.width : maximumDimensions.height;
            const maximumPerpendicular = isHorizontal ? maximumDimensions.height : maximumDimensions.width;
            const maximumArea = maximumParallel * maximumPerpendicular;

            // Lengths 0 and 1 are valid and require no special processing.
            if (length > 1 && length <= maximumArea) {
                const lengthSquareRoot = Math.sqrt(length);

                let spillParallel: number | undefined = undefined;

                // Array that has a length of a power of 10 is treated specially.
                if (Number.isInteger(Math.log10(length))) {
                    // Try spill that is a power of 10, favouring the parallel direction.
                    let spillParallel10 = 10 ** Math.ceil(Math.log10(lengthSquareRoot));

                    // Favour the perpendicular direction if not enough parallel space.
                    if (spillParallel10 > maximumParallel) {
                        spillParallel10 /= 10;
                    }

                    // Take result as the spill parallel if it fits.
                    if (spillParallel10 <= maximumParallel && length / spillParallel10 <= maximumPerpendicular) {
                        spillParallel = spillParallel10;
                    }
                }

                // Make spill as square as possible, favouring the parallel direction.
                spillParallel ??= Math.max(Math.min(Math.ceil(lengthSquareRoot), maximumParallel), Math.floor(length / maximumPerpendicular));

                const spillPerpendicular = Math.ceil(length / spillParallel);

                result = [];

                if (isHorizontal) {
                    let startIndex = 0;

                    do {
                        const endIndex = startIndex + spillParallel;

                        // Each row is a slice of the original single row.
                        const row = arrayValues[0].slice(startIndex, endIndex);

                        // Row length will be anywhere from 1 to spillParallel.
                        if (row.length < spillParallel) {
                            const rowLength = row.length;

                            row.length = spillParallel;

                            // Fill empty cells with empty string.
                            row.fill("", rowLength, spillParallel);
                        }

                        result.push(row);

                        startIndex = endIndex;
                    } while (startIndex < length);
                } else {
                    for (let rowIndex = 0; rowIndex < spillParallel; rowIndex++) {
                        const row: unknown[] = [];

                        // Each column is a slice of the original single column.
                        for (let valueIndex = rowIndex; valueIndex < length; valueIndex += spillParallel) {
                            row.push(arrayValues[valueIndex][0]);
                        }

                        // Row length will always be spillPerpendicular or spillPerpendicular - 1.
                        if (row.length < spillPerpendicular) {
                            row[spillPerpendicular - 1] = "";
                        }

                        result.push(row);
                    }
                }
            } else {
                // Return matrix unmodified and let application handle spill error if any.
                result = arrayValues;
            }
        } else {
            // Return error as only element in matrix.
            result = [[isArrayOrError]];
        }

        return result;
    }

    /**
     * Get the logger messages. This is a snapshot, with the option to change the log level for the next call.
     *
     * @param logLevelString
     * Log level as string.
     *
     * @returns
     * Logger messages.
     */
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Array,
        isHidden: true,
        parameterDescriptors: [logLevelParameterDescriptor]
    })
    loggerMessages(logLevelString: Nullishable<string>): MatrixResult<string, ThrowError> {
        const appExtension = this.appExtension;

        let logLevel: LogLevel | undefined = undefined;

        if (!isNullish(logLevelString)) {
            try {
                logLevel = logLevelOf(logLevelString);
            } catch {
                // Ignore error.
            }
        }

        // Set log level if required.
        if (logLevel !== undefined) {
            appExtension.logger.settings.minLevel = logLevel;
        }

        return appExtension.memoryTransport.messages.map(message => [message]);
    }

    /**
     * Get the logger messages as a stream.
     *
     * @param logLevelString
     * Log level as string.
     *
     * @param streamingInvocationContext
     * Streaming invocation context.
     */
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Array,
        isHidden: true,
        isStream: true,
        parameterDescriptors: [logLevelParameterDescriptor]
    })
    loggerStream(logLevelString: Nullishable<string>, streamingInvocationContext: Nullishable<AppExtensionStreamingInvocationContext>): void {
        if (isNullish(streamingInvocationContext)) {
            // Application error; no localization necessary.
            throw new Error("Streaming invocation context not provided by application");
        }

        const appExtension = this.appExtension;

        let notificationCallbackAdded = false;
        let previousLogLevel: number | undefined = undefined;

        const streamingConsumerCallback = appExtension.setUpStreaming<string>(streamingInvocationContext, () => {
            if (notificationCallbackAdded) {
                appExtension.memoryTransport.removeNotificationCallback(AppHelperProxy.#LOGGER_STREAM_NAME);
            }

            if (previousLogLevel !== undefined) {
                appExtension.logger.settings.minLevel = previousLogLevel;
            }
        });

        if (appExtension.memoryTransport.addNotificationCallback(AppHelperProxy.#LOGGER_STREAM_NAME, (_message, messages) => {
            streamingConsumerCallback(this.iterableResult(() => messages));
        })) {
            notificationCallbackAdded = true;

            let logLevel: LogLevel | undefined = undefined;

            if (!isNullish(logLevelString)) {
                try {
                    logLevel = logLevelOf(logLevelString);
                } catch {
                    // Ignore error.
                }
            }

            // Set log level if required.
            if (logLevel !== undefined) {
                previousLogLevel = appExtension.logger.settings.minLevel;
                appExtension.logger.settings.minLevel = logLevel;
            }
        } else {
            // Diagnostic tool; localization not required.
            streamingConsumerCallback([["Only one logger stream allowable per workbook"]]);
        }
    }
}
