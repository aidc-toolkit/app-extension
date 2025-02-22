import {
    checkCharacterPair,
    checkDigit,
    fiveDigitPriceWeightCheckDigit,
    fourDigitPriceWeightCheckDigit,
    hasValidCheckCharacterPair,
    hasValidCheckDigit
} from "@aidc-toolkit/gs1";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../types.js";

const numericSParameterDescriptor: ParameterDescriptor = {
    name: "numericS",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const numericSWithCheckDigitParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    name: "numericSWithCheckDigit"
};

const numericSFourDigitsParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    name: "numericSFourDigits"
};

const numericSFiveDigitsParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: numericSParameterDescriptor,
    name: "numericSFiveDigits"
};

const ai82SParameterDescriptor: ParameterDescriptor = {
    name: "ai82S",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const ai82SWithCheckCharacterPairParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: ai82SParameterDescriptor,
    name: "ai82SWithCheckCharacterPair"
};

@ProxyClass()
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
    fourDigitPriceWeightCheckDigit(
        @ProxyParameter(numericSFourDigitsParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => fourDigitPriceWeightCheckDigit(s));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    fiveDigitPriceWeightCheckDigit(
        @ProxyParameter(numericSFiveDigitsParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixSs, s => fiveDigitPriceWeightCheckDigit(s));
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
