import {
    checkCharacterPair,
    checkDigit,
    hasValidCheckCharacterPair,
    hasValidCheckDigit, hasValidPriceWeightCheckDigit,
    priceWeightCheckDigit
} from "@aidc-toolkit/gs1";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../types.js";

const checkSParameterDescriptor: ParameterDescriptor = {
    name: "checkS",
    type: Type.String,
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

const ai82SParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: checkSParameterDescriptor,
    name: "ai82S"
};

const ai82SWithCheckCharacterPairParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: ai82SParameterDescriptor,
    name: "ai82SWithCheckCharacterPair"
};

@ProxyClass({
    namespace: "GS1"
})
export class CheckProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    checkDigit(
        @ProxyParameter(numericSParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => checkDigit(s));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    hasValidCheckDigit(
        @ProxyParameter(numericSWithCheckDigitParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => hasValidCheckDigit(s));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    priceWeightCheckDigit(
        @ProxyParameter(numericSFourOrFiveDigitsParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => priceWeightCheckDigit(s));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    hasValidPriceWeightCheckDigit(
        @ProxyParameter(numericSWithCheckDigitParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => hasValidPriceWeightCheckDigit(s));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    checkCharacterPair(
        @ProxyParameter(ai82SParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => checkCharacterPair(s));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    hasValidCheckCharacterPair(
        @ProxyParameter(ai82SWithCheckCharacterPairParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => hasValidCheckCharacterPair(s));
    }
}
