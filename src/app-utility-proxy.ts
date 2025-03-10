import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "./descriptor.js";
import { LibProxy } from "./lib-proxy.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import { type ErrorExtends, isNullish, type Matrix, type NonNullishable, type Nullishable } from "./types.js";

const spillMatrix: ParameterDescriptor = {
    name: "spillMatrix",
    type: Type.Any,
    isMatrix: true,
    isRequired: true
};

const spillMaximumParameterDescriptor: ParameterDescriptor = {
    name: "spillMaximum",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};

const spillMaximumWidthParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: spillMaximumParameterDescriptor,
    sortOrder: 0,
    name: "spillMaximumWidth"
};

const spillMaximumHeightParameterDescriptor: ParameterDescriptor = {
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
 */
@ProxyClass()
export class AppUtilityProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    /**
     * Get the version.
     *
     * @returns
     * Version.
     */
    @ProxyMethod({
        type: Type.String,
        isMatrix: false
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
    private async defaultMaximums(maximumDimensions: MaximumDimensions, invocationContext: Nullishable<TInvocationContext>): Promise<NonNullishable<MaximumDimensions>> {
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

            definedMaximumWidth = maximumWidth ?? await this.appExtension.maximumWidth() - sheetAddress.columnIndex;
            definedMaximumHeight = maximumHeight ?? await this.appExtension.maximumHeight() - sheetAddress.rowIndex;
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
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Matrix spilled within maximum width and maximum height.
     */
    @ProxyMethod({
        requiresContext: true,
        type: Type.Any,
        isMatrix: true
    })
    async vSpill(
        @ProxyParameter(spillMatrix) hMatrixValues: Matrix<unknown>,
        @ProxyParameter(spillMaximumWidthParameterDescriptor) maximumWidth: Nullishable<number>,
        @ProxyParameter(spillMaximumHeightParameterDescriptor) maximumHeight: Nullishable<number>,
        invocationContext: Nullishable<TInvocationContext>
    ): Promise<Matrix<unknown>> {
        let result: Matrix<unknown>;

        if (hMatrixValues.length !== 1) {
            throw new RangeError(i18nextAppExtension.t("Proxy.vSpillMustBeHorizontalArray"));
        }

        const maximumDimensions = await this.defaultMaximums({
            width: maximumWidth,
            height: maximumHeight
        }, invocationContext);

        const hArrayValues = hMatrixValues[0];
        const hLength = hArrayValues.length;
        const maximumArea = maximumDimensions.width * maximumDimensions.height;

        // Lengths 0 and 1 are valid and require no special processing.
        if (hLength > 1 && hLength <= maximumArea) {
            // Make spill as square as possible.
            let spillWidth = Math.min(Math.ceil(Math.sqrt(maximumArea)), maximumDimensions.width);

            // Array that has a length of a power of 10 is treated specially.
            if (Number.isInteger(Math.log10(hLength))) {
                // Try spill width that is a power of 10.
                const spillWidth10 = Math.pow(10, Math.floor(Math.log10(spillWidth)));

                // Keep default if not enough space for power of 10 matrix.
                if (hLength / spillWidth10 <= maximumDimensions.height) {
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
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Matrix spilled within maximum height and maximum width.
     */
    @ProxyMethod({
        requiresContext: true,
        type: Type.Any,
        isMatrix: true
    })
    async hSpill(
        @ProxyParameter(spillMatrix) vMatrixValues: Matrix<unknown>,
        @ProxyParameter(spillMaximumHeightParameterDescriptor) maximumHeight: Nullishable<number>,
        @ProxyParameter(spillMaximumWidthParameterDescriptor) maximumWidth: Nullishable<number>,
        invocationContext: Nullishable<TInvocationContext>
    ): Promise<Matrix<unknown>> {
        let result: Matrix<unknown>;

        for (const hArrayValues of vMatrixValues) {
            // This test should be necessary only once but account for zero-size matrix and misuse of method.
            if (hArrayValues.length !== 1) {
                throw new RangeError(i18nextAppExtension.t("Proxy.hSpillNotAVerticalArray"));
            }
        }

        const maximumDimensions = await this.defaultMaximums({
            width: maximumWidth,
            height: maximumHeight
        }, invocationContext);

        const vLength = vMatrixValues.length;
        const maximumArea = maximumDimensions.width * maximumDimensions.height;

        // Lengths 0 and 1 are valid and require no special processing.
        if (vLength > 1 && vLength <= maximumArea) {
            // Make spill as square as possible.
            let spillHeight = Math.min(Math.ceil(Math.sqrt(maximumArea)), maximumDimensions.height);

            // Array that has a length of a power of 10 is treated specially.
            if (Number.isInteger(Math.log10(vLength))) {
                // Try spill height that is a power of 10.
                const spillHeight10 = Math.pow(10, Math.floor(Math.log10(spillHeight)));

                // Keep default if not enough space for power of 10 matrix.
                if (vLength / spillHeight10 <= maximumDimensions.width) {
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
