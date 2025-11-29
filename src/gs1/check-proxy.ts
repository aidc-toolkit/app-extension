import {
    checkCharacterPair,
    checkDigit,
    hasValidCheckCharacterPair,
    hasValidCheckDigit,
    isValidPriceOrWeightCheckDigit,
    priceOrWeightCheckDigit
} from "@aidc-toolkit/gs1";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Types } from "../descriptor";
import { LibProxy } from "../lib-proxy";
import type { ErrorExtends, Matrix, MatrixResultError, ResultError } from "../types";

const checkSParameterDescriptor: ParameterDescriptor = {
    name: "checkS",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

const numericSParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: checkSParameterDescriptor,
    name: "numericS"
};

const numericSFourOrFiveDigitsParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    sortOrder: 0,
    name: "numericSFourOrFiveDigits"
};

const numericSWithCheckDigitParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    sortOrder: 1,
    name: "numericSWithCheckDigit"
};

const checkDigitParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    sortOrder: 2,
    name: "checkDigit",
    isMatrix: false
};

const ai82SParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: checkSParameterDescriptor,
    name: "ai82S"
};

// eslint-disable-next-line no-useless-assignment -- ESLint bug.
const ai82SWithCheckCharacterPairParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: ai82SParameterDescriptor,
    name: "ai82SWithCheckCharacterPair"
};

@ProxyClass({
    namespace: "GS1"
})
export class CheckProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    checkDigit(
        @ProxyParameter(numericSParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => checkDigit(s));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    hasValidCheckDigit(
        @ProxyParameter(numericSWithCheckDigitParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => hasValidCheckDigit(s));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    priceOrWeightCheckDigit(
        @ProxyParameter(numericSFourOrFiveDigitsParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => priceOrWeightCheckDigit(s));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: false
    })
    isValidPriceOrWeightCheckDigit(
        @ProxyParameter({
            ...numericSFourOrFiveDigitsParameterDescriptor,
            isMatrix: false
        }) s: string,
        @ProxyParameter(checkDigitParameterDescriptor) checkDigit: string
    ): ResultError<boolean, ThrowError, TError> {
        return isValidPriceOrWeightCheckDigit(s, checkDigit);
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    checkCharacterPair(
        @ProxyParameter(ai82SParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => checkCharacterPair(s));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    hasValidCheckCharacterPair(
        @ProxyParameter(ai82SWithCheckCharacterPairParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => hasValidCheckCharacterPair(s));
    }
}
