import type { Nullishable } from "@aidc-toolkit/core";
import { GTINLengths, type GTINLevel, GTINValidator, IdentifierValidators } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResult } from "../type.js";
import { indicatorDigitParameterDescriptor, rcnFormatParameterDescriptor } from "./gtin-descriptor.js";
import { identifierParameterDescriptor } from "./identifier-descriptor.js";
import { GTINValidatorProxy } from "./identifier-validator-proxy.js";

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN13"
})
export class GTIN13ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINLengths.GTIN13]);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN12"
})
export class GTIN12ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINLengths.GTIN12]);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN8"
})
export class GTIN8ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINLengths.GTIN8]);
    }
}

const zeroSuppressibleGTIN12ParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "zeroSuppressibleGTIN12"
};

const zeroSuppressedGTIN12ParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "zeroSuppressedGTIN12"
};

const convertGTINParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "convertGTIN"
};

const normalizeGTINParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "normalizeGTIN"
};

const validateGTINParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "validateGTIN"
};

const gtinLevelParameterDescriptor: ParameterDescriptor = {
    name: "gtinLevel",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};

const validateGTIN14ParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "validateGTIN14"
};

const rcnParameterDescriptor: ParameterDescriptor = {
    name: "rcn",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class GTINValidatorStaticProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [zeroSuppressibleGTIN12ParameterDescriptor]
    })
    zeroSuppressGTIN12(matrixGTIN12s: Matrix<string>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixGTIN12s, gtin12 => GTINValidator.zeroSuppress(gtin12));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [zeroSuppressedGTIN12ParameterDescriptor]
    })
    zeroExpandGTIN12(matrixZeroSuppressedGTIN12s: Matrix<string>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixZeroSuppressedGTIN12s, zeroSuppressedGTIN12 => GTINValidator.zeroExpand(zeroSuppressedGTIN12));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [indicatorDigitParameterDescriptor, convertGTINParameterDescriptor]
    })
    convertToGTIN14(indicatorDigit: string, matrixGTINs: Matrix<string>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixGTINs, gtin => GTINValidator.convertToGTIN14(indicatorDigit, gtin));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [normalizeGTINParameterDescriptor]
    })
    normalizeGTIN(matrixGTINs: Matrix<string>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixGTINs, gtin => GTINValidator.normalize(gtin));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [validateGTINParameterDescriptor, gtinLevelParameterDescriptor]
    })
    validateGTIN(matrixGTINs: Matrix<string>, gtinLevel: Nullishable<GTINLevel>): Matrix<string> {
        const gtinLevelOrUndefined = gtinLevel ?? undefined;

        return this.matrixErrorResult(matrixGTINs, (gtin) => {
            GTINValidator.validateAny(gtin, gtinLevelOrUndefined);
        });
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [validateGTIN14ParameterDescriptor]
    })
    validateGTIN14(matrixGTIN14s: Matrix<string>): Matrix<string> {
        return this.matrixErrorResult(matrixGTIN14s, (gtin14) => {
            GTINValidator.validateGTIN14(gtin14);
        });
    }

    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnParameterDescriptor]
    })
    parseVariableMeasureRCN(format: string, matrixRCNs: Matrix<string>): MatrixResult<number, ThrowError, TError> {
        return this.arrayResult(matrixRCNs, (rcn) => {
            const rcnReference = GTINValidator.parseVariableMeasureRCN(format, rcn);

            return [rcnReference.itemReference, rcnReference.priceOrWeight];
        });
    }
}
