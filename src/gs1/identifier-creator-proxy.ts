import { isNullish, type Nullishable } from "@aidc-toolkit/core";
import {
    type IdentifierCreator,
    type IdentifierType,
    type IdentifierValidation,
    type NonGTINNumericIdentifierCreator,
    type NonGTINNumericIdentifierType,
    type NonNumericIdentifierCreator,
    type NonNumericIdentifierType,
    type NonNumericIdentifierValidation,
    type NonSerializableNumericIdentifierType,
    type NumericIdentifierCreator,
    type NumericIdentifierType,
    type NumericIdentifierValidation,
    PrefixManager,
    type PrefixType,
    PrefixTypes,
    PrefixValidator,
    type SerializableNumericIdentifierCreator,
    type SerializableNumericIdentifierType
} from "@aidc-toolkit/gs1";
import { Sequence } from "@aidc-toolkit/utility";
import type { AppExtension } from "../app-extension.js";
import { type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { i18nextAppExtension } from "../locale/i18n.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../type.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    valueParameterDescriptor
} from "../utility/transformer-descriptor.js";
import { identifierParameterDescriptor } from "./identifier-validator-proxy.js";
import { prefixDefinitionGS1UPCParameterDescriptor } from "./prefix-definition-descriptor.js";

abstract class IdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TIdentifierType extends IdentifierType, TIdentifierValidation extends IdentifierValidation, TIdentifierCreator extends IdentifierCreator<TIdentifierType, TIdentifierValidation>> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    static readonly #PREFIX_TYPES: Array<PrefixType | undefined> = [PrefixTypes.GS1CompanyPrefix, PrefixTypes.UPCCompanyPrefix, PrefixTypes.GS18Prefix];

    readonly #getCreator: (prefixManager: PrefixManager) => TIdentifierCreator;

    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, getCreator: (prefixManager: PrefixManager) => TIdentifierCreator) {
        super(appExtension);

        this.#getCreator = getCreator;
    }

    protected getCreator(prefixDefinition: Matrix<unknown>): TIdentifierCreator {
        const reducedPrefixDefinition = prefixDefinition.length === 1 ?
            // Prefix definition is horizontal.
            prefixDefinition[0] :
            // Prefix definition is vertical.
            prefixDefinition.map((prefixDefinitionRow) => {
                if (prefixDefinitionRow.length !== 1) {
                    throw new RangeError(i18nextAppExtension.t("IdentifierCreatorProxy.prefixDefinitionMustBeOneDimensional"));
                }

                return prefixDefinitionRow[0];
            });

        if (reducedPrefixDefinition.length > 3) {
            throw new RangeError(i18nextAppExtension.t("IdentifierCreatorProxy.prefixDefinitionMustHaveMaximumThreeElements"));
        }
        const prefix = reducedPrefixDefinition[0];

        if (typeof prefix !== "string") {
            throw new RangeError(i18nextAppExtension.t("IdentifierCreatorProxy.prefixMustBeString"));
        }

        const prefixTypeIndex = reducedPrefixDefinition[1] ?? 0;

        if (typeof prefixTypeIndex !== "number" || prefixTypeIndex < 0 || prefixTypeIndex >= IdentifierCreatorProxy.#PREFIX_TYPES.length) {
            throw new RangeError(i18nextAppExtension.t("IdentifierCreatorProxy.prefixTypeMustBeNumber", {
                maximumPrefixType: IdentifierCreatorProxy.#PREFIX_TYPES.length - 1
            }));
        }

        const prefixType = IdentifierCreatorProxy.#PREFIX_TYPES[prefixTypeIndex];

        // Undefined is included in type in case of invalid input.
        if (prefixType === undefined) {
            throw new RangeError(i18nextAppExtension.t("IdentifierCreatorProxy.invalidPrefixType"));
        }

        const prefixManager = PrefixManager.get(prefixType, prefix);

        const tweakFactor = reducedPrefixDefinition[2];

        if (!isNullish(tweakFactor)) {
            if (typeof tweakFactor !== "number") {
                throw new RangeError(i18nextAppExtension.t("IdentifierCreatorProxy.tweakFactorMustBeNumber"));
            }

            prefixManager.tweakFactor = tweakFactor;
        } else {
            prefixManager.resetTweakFactor();
        }

        return this.#getCreator(prefixManager);
    }
}

export const sparseParameterDescriptor: ParameterDescriptor = {
    name: "sparse",
    type: Types.Boolean,
    isMatrix: false,
    isRequired: false
};

@proxy.describeClass(true, {
    namespace: "GS1"
})
export abstract class NumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNumericIdentifierType extends NumericIdentifierType, TNumericIdentifierCreator extends NumericIdentifierCreator<TNumericIdentifierType>> extends IdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNumericIdentifierType, NumericIdentifierValidation, TNumericIdentifierCreator> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, valueParameterDescriptor, sparseParameterDescriptor]
    })
    create(prefixDefinition: Matrix<unknown>, matrixValues: Matrix<number | bigint>, sparse: Nullishable<boolean>): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixValues, value => creator.create(value, sparseOrUndefined));
    }

    @proxy.describeMethod({
        infixBefore: "Sequence",
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, startValueParameterDescriptor, countParameterDescriptor, sparseParameterDescriptor]
    })
    createSequence(prefixDefinition: Matrix<unknown>, startValue: number, count: number, sparse: Nullishable<boolean>): Matrix<string> {
        this.appExtension.validateSequenceCount(count);

        return LibProxy.matrixResult(this.getCreator(prefixDefinition).create(new Sequence(startValue, count), sparse ?? undefined));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor]
    })
    createAll(prefixDefinition: Matrix<unknown>): Matrix<string> {
        const creator = this.getCreator(prefixDefinition);

        this.appExtension.validateSequenceCount(creator.capacity);

        return LibProxy.matrixResult(creator.createAll());
    }
}

abstract class NonGTINNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType, TNonGTINNumericIdentifierCreator extends NonGTINNumericIdentifierCreator> extends NumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType, TNonGTINNumericIdentifierCreator> {
}

export abstract class NonSerializableNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonSerializableNumericIdentifierType extends NonSerializableNumericIdentifierType, TNonGTINNumericIdentifierCreator extends NonGTINNumericIdentifierCreator> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonSerializableNumericIdentifierType, TNonGTINNumericIdentifierCreator> {
}

const singleValueParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    isMatrix: false
};

const baseIdentifierParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "baseIdentifier",
    isMatrix: false
};

const serialComponentParameterDescriptor: ParameterDescriptor = {
    name: "serialComponent",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

@proxy.describeClass(true, {
    namespace: "GS1"
})
export abstract class SerializableNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentifierType, SerializableNumericIdentifierCreator> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, singleValueParameterDescriptor, serialComponentParameterDescriptor, sparseParameterDescriptor]
    })
    createSerialized(prefixDefinition: Matrix<unknown>, value: number, matrixSerialComponents: Matrix<string>, sparse: Nullishable<boolean>): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixSerialComponents, serialComponent => creator.createSerialized(value, serialComponent, sparseOrUndefined));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [baseIdentifierParameterDescriptor, serialComponentParameterDescriptor]
    })
    concatenate(baseIdentifier: string, matrixSerialComponents: Matrix<string>): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator([[baseIdentifier.substring(0, !baseIdentifier.startsWith("0") ? PrefixValidator.GS1_COMPANY_PREFIX_MINIMUM_LENGTH : PrefixValidator.UPC_COMPANY_PREFIX_MINIMUM_LENGTH + 1), PrefixTypes.GS1CompanyPrefix]]);

        return this.mapMatrix(matrixSerialComponents, serialComponent => creator.concatenate(baseIdentifier, serialComponent));
    }
}

const referenceParameterDescriptor: ParameterDescriptor = {
    name: "reference",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

@proxy.describeClass(true, {
    namespace: "GS1"
})
export abstract class NonNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentifierType, NonNumericIdentifierValidation, NonNumericIdentifierCreator> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, referenceParameterDescriptor]
    })
    create(prefixDefinition: Matrix<unknown>, matrixReferences: Matrix<string>): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        return this.mapMatrix(matrixReferences, reference => creator.create(reference));
    }
}
