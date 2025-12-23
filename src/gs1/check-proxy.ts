import {
    checkCharacterPair,
    checkDigit,
    hasValidCheckCharacterPair,
    hasValidCheckDigit,
    isValidPriceOrWeightCheckDigit,
    priceOrWeightCheckDigit
} from "@aidc-toolkit/gs1";
import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResult, SingletonResult } from "../type.js";

const checkSParameterDescriptor: ParameterDescriptor = {
    name: "checkS",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

const numericSParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: checkSParameterDescriptor,
    name: "numericS"
};

const numericSFourOrFiveDigitsParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    sortOrder: 0,
    name: "numericSFourOrFiveDigits"
};

const numericSWithCheckDigitParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    sortOrder: 1,
    name: "numericSWithCheckDigit"
};

const checkDigitParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    sortOrder: 2,
    name: "checkDigit",
    isMatrix: false
};

const ai82SParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: checkSParameterDescriptor,
    name: "ai82S"
};

const ai82SWithCheckCharacterPairParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: ai82SParameterDescriptor,
    name: "ai82SWithCheckCharacterPair"
};

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class CheckProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [numericSParameterDescriptor]
    })
    checkDigit(matrixSs: Matrix<string>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixSs, s => checkDigit(s));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [numericSWithCheckDigitParameterDescriptor]
    })
    hasValidCheckDigit(matrixSs: Matrix<string>): MatrixResult<boolean, ThrowError, TError> {
        return this.matrixResult(matrixSs, s => hasValidCheckDigit(s));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [numericSFourOrFiveDigitsParameterDescriptor]
    })
    priceOrWeightCheckDigit(matrixSs: Matrix<string>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixSs, s => priceOrWeightCheckDigit(s));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: false,
        parameterDescriptors: [{
            ...numericSFourOrFiveDigitsParameterDescriptor,
            isMatrix: false
        }, checkDigitParameterDescriptor]
    })
    isValidPriceOrWeightCheckDigit(s: string, checkDigit: string): SingletonResult<boolean, ThrowError, TError> {
        return this.singletonResult(() => isValidPriceOrWeightCheckDigit(s, checkDigit));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [ai82SParameterDescriptor]
    })
    checkCharacterPair(matrixSs: Matrix<string>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixSs, s => checkCharacterPair(s));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [ai82SWithCheckCharacterPairParameterDescriptor]
    })
    hasValidCheckCharacterPair(matrixSs: Matrix<string>): MatrixResult<boolean, ThrowError, TError> {
        return this.matrixResult(matrixSs, s => hasValidCheckCharacterPair(s));
    }
}
