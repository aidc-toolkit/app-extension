import { isNullish, type NonNullishable, type Nullishable } from "@aidc-toolkit/core";
import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "./descriptor.js";
import { LibProxy } from "./lib-proxy.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import { proxy } from "./proxy.js";
import type { ErrorExtends, Matrix, MatrixResult } from "./type.js";

const spillMatrixParameterDescriptor: ParameterDescriptor = {
    name: "spillMatrix",
    type: Types.Any,
    isMatrix: true,
    isRequired: true
};

const spillMaximumParameterDescriptor: ParameterDescriptor = {
    name: "spillMaximum",
    type: Types.Number,
    isMatrix: false,
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
 * Application utilities.
 *
 *@template ThrowError
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
@proxy.describeClass(false)
export class AppUtilityProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    /**
     * Get the version.
     *
     * @returns
     * Version.
     */
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: false,
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
    async #defaultMaximums(maximumDimensions: MaximumDimensions, invocationContext: Nullishable<TInvocationContext>): Promise<NonNullishable<MaximumDimensions>> {
        if (isNullish(invocationContext)) {
            // Application error; no localization necessary.
            throw new Error("Invocation context not provided by application");
        }

        const maximumWidth = maximumDimensions.width;
        const maximumHeight = maximumDimensions.height;

        let definedMaximumWidth: number;
        let definedMaximumHeight: number;

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
     * @param matrixValues
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
        requiresContext: true,
        type: Types.Any,
        isMatrix: true,
        parameterDescriptors: [spillMatrixParameterDescriptor, spillMaximumHeightParameterDescriptor, spillMaximumWidthParameterDescriptor]
    })
    async spill(matrixValues: Matrix<unknown>, maximumHeight: Nullishable<number>, maximumWidth: Nullishable<number>, invocationContext: Nullishable<TInvocationContext>): Promise<MatrixResult<unknown, ThrowError, TError>> {
        let result: MatrixResult<unknown, ThrowError, TError>;

        // Assume matrix is uniformly two-dimensional.
        const height = matrixValues.length;
        const width = height !== 0 ? matrixValues[0].length : 0;

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
                        const row = matrixValues[0].slice(startIndex, endIndex);

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
                            row.push(matrixValues[valueIndex][0]);
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
                result = matrixValues;
            }
        } else {
            // Return error as only element in matrix.
            result = [[isArrayOrError]];
        }

        return result;
    }

    @proxy.describeMethod({
        type: Types.String,
        isHidden: true,
        isVolatile: true,
        isMatrix: true,
        parameterDescriptors: []
    })
    loggerMessages(): MatrixResult<string, ThrowError, TError> {
        return this.iterableResult(() => this.appExtension.loggerMessages);
    }
}
