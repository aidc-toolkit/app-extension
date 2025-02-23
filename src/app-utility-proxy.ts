import { isNullish } from "./app-extension.js";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "./descriptor.js";
import { LibProxy } from "./lib-proxy.js";
import { i18nextAppExtension } from "./locale/i18n.js";
import type { ErrorExtends, Matrix } from "./types.js";

const valuesAny: ParameterDescriptor = {
    name: "valuesAny",
    type: Type.Any,
    isMatrix: true,
    isRequired: true
};

const maximumParameterDescriptor: ParameterDescriptor = {
    name: "maximum",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};

const maximumWidthParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: maximumParameterDescriptor,
    sortOrder: 0,
    name: "maximumWidth"
};

const maximumHeightParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: maximumParameterDescriptor,
    sortOrder: 1,
    name: "maximumHeight"
};

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
        return this.appExtension.version();
    }

    /**
     * Provide default values for maximum width and height if required.
     *
     * @param maximumWidth
     * Maximum width provided to function.
     *
     * @param maximumHeight
     * Maximum height provided to function.
     *
     * @param invocationContext
     * Invocation context.
     *
     * @returns
     * Array of maximum width and maximum height.
     */
    private async defaultMaximums(maximumWidth: number | undefined, maximumHeight: number | undefined, invocationContext: TInvocationContext | null | undefined): Promise<number[]> {
        if (isNullish(invocationContext)) {
            // Application error; no localization necessary.
            throw new Error("Invocation context not provided by application");
        }

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

        return [definedMaximumWidth, definedMaximumHeight];
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
        @ProxyParameter(valuesAny) hMatrixValues: Matrix<unknown>,
        @ProxyParameter(maximumWidthParameterDescriptor) maximumWidth?: number,
        @ProxyParameter(maximumHeightParameterDescriptor) maximumHeight?: number,
        invocationContext?: TInvocationContext
    ): Promise<Matrix<unknown>> {
        let result: Matrix<unknown>;

        if (hMatrixValues.length !== 1) {
            throw new RangeError(i18nextAppExtension.t("Proxy.vSpillMustBeHorizontalArray"));
        }

        const [definedMaximumWidth, definedMaximumHeight] = await this.defaultMaximums(maximumWidth, maximumHeight, invocationContext);

        const hArrayValues = hMatrixValues[0];
        const hLength = hArrayValues.length;
        const maximumArea = definedMaximumWidth * definedMaximumHeight;

        // Lengths 0 and 1 are valid and require no special processing.
        if (hLength > 1 && hLength <= maximumArea) {
            // Make spill as square as possible.
            let spillWidth = Math.min(Math.ceil(Math.sqrt(maximumArea)), definedMaximumWidth);

            // Array that has a length of a power of 10 is treated specially.
            if (Number.isInteger(Math.log10(hLength))) {
                // Try spill width that is a power of 10.
                const spillWidth10 = Math.pow(10, Math.floor(Math.log10(spillWidth)));

                // Keep default if not enough space for power of 10 matrix.
                if (hLength / spillWidth10 <= definedMaximumHeight) {
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
        @ProxyParameter(valuesAny) vMatrixValues: Matrix<unknown>,
        @ProxyParameter(maximumHeightParameterDescriptor) maximumHeight?: number,
        @ProxyParameter(maximumWidthParameterDescriptor) maximumWidth?: number,
        invocationContext?: TInvocationContext
    ): Promise<Matrix<unknown>> {
        let result: Matrix<unknown>;

        for (const hArrayValues of vMatrixValues) {
            // This test should be necessary only once but account for zero-size matrix and misuse of method.
            if (hArrayValues.length !== 1) {
                throw new RangeError(i18nextAppExtension.t("Proxy.hSpillNotAVerticalArray"));
            }
        }

        const [definedMaximumWidth, definedMaximumHeight] = await this.defaultMaximums(maximumWidth, maximumHeight, invocationContext);

        const vLength = vMatrixValues.length;
        const maximumArea = definedMaximumWidth * definedMaximumHeight;

        // Lengths 0 and 1 are valid and require no special processing.
        if (vLength > 1 && vLength <= maximumArea) {
            // Make spill as square as possible.
            let spillHeight = Math.min(Math.ceil(Math.sqrt(maximumArea)), definedMaximumHeight);

            // Array that has a length of a power of 10 is treated specially.
            if (Number.isInteger(Math.log10(vLength))) {
                // Try spill height that is a power of 10.
                const spillHeight10 = Math.pow(10, Math.floor(Math.log10(spillHeight)));

                // Keep default if not enough space for power of 10 matrix.
                if (vLength / spillHeight10 <= definedMaximumWidth) {
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
