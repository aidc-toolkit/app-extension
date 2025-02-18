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
    name: "numericSWithCheckDigit",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const numericSFourDigitsParameterDescriptor: ParameterDescriptor = {
    name: "numericSFourDigits",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const numericSFiveDigitsParameterDescriptor: ParameterDescriptor = {
    name: "numericSFiveDigits",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const ai82SParameterDescriptor: ParameterDescriptor = {
    name: "ai82S",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const ai82SWithCheckCharacterPairParameterDescriptor: ParameterDescriptor = {
    name: "ai82SWithCheckCharacterPair",
    type: Type.String,
    isMatrix: true,
    isRequired: true
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
