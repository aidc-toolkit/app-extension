import {
    checkCharacterPair,
    checkDigit,
    hasValidCheckCharacterPair,
    hasValidCheckDigit,
    isValidPriceOrWeightCheckDigit,
    priceOrWeightCheckDigit
} from "@aidc-toolkit/gs1";
import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { Matrix, MatrixResult, SingletonResult } from "../type.js";

const checkSParameterDescriptor: ParameterDescriptor = {
    name: "checkS",
    type: Types.String,
    multiplicity: Multiplicities.Matrix,
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
    multiplicity: Multiplicities.Singleton
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
    namespace: "GS1",
    category: "checkCharacter"
})
export class CheckProxy extends LibProxy {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [numericSParameterDescriptor]
    })
    checkDigit(matrixSs: Matrix<string>): MatrixResult<string> {
        return this.matrixResult(matrixSs, s => checkDigit(s));
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [numericSWithCheckDigitParameterDescriptor]
    })
    hasValidCheckDigit(matrixSs: Matrix<string>): MatrixResult<boolean> {
        return this.matrixResult(matrixSs, s => hasValidCheckDigit(s));
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [numericSFourOrFiveDigitsParameterDescriptor]
    })
    priceOrWeightCheckDigit(matrixSs: Matrix<string>): MatrixResult<string> {
        return this.matrixResult(matrixSs, s => priceOrWeightCheckDigit(s));
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        multiplicity: Multiplicities.Singleton,
        parameterDescriptors: [{
            ...numericSFourOrFiveDigitsParameterDescriptor,
            multiplicity: Multiplicities.Singleton
        }, checkDigitParameterDescriptor]
    })
    isValidPriceOrWeightCheckDigit(s: string, checkDigit: string): SingletonResult<boolean> {
        return this.singletonResult(() => isValidPriceOrWeightCheckDigit(s, checkDigit));
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [ai82SParameterDescriptor]
    })
    checkCharacterPair(matrixSs: Matrix<string>): MatrixResult<string> {
        return this.matrixResult(matrixSs, s => checkCharacterPair(s));
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [ai82SWithCheckCharacterPairParameterDescriptor]
    })
    hasValidCheckCharacterPair(matrixSs: Matrix<string>): MatrixResult<boolean> {
        return this.matrixResult(matrixSs, s => hasValidCheckCharacterPair(s));
    }
}
