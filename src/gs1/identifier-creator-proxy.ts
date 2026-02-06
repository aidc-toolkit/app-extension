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
import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { i18nextAppExtension } from "../locale/i18n.js";
import { proxy } from "../proxy.js";
import type { Matrix, MatrixResult } from "../type.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    valueParameterDescriptor
} from "../utility/transformer-descriptor.js";
import { identifierParameterDescriptor } from "./identifier-descriptor.js";
import { prefixDefinitionGS1UPCParameterDescriptor } from "./prefix-definition-descriptor.js";

@proxy.describeClass(true, {
    namespace: "GS1",
    category: "identifierCreation"
})
abstract class IdentifierCreatorProxy<TIdentifierType extends IdentifierType, TIdentifierValidation extends IdentifierValidation, TIdentifierCreator extends IdentifierCreator<TIdentifierType, TIdentifierValidation>> extends LibProxy {
    static readonly #PREFIX_TYPES: Array<PrefixType | undefined> = [PrefixTypes.GS1CompanyPrefix, PrefixTypes.UPCCompanyPrefix, PrefixTypes.GS18Prefix];

    readonly #getCreator: (prefixManager: PrefixManager) => TIdentifierCreator;

    constructor(appExtension: AppExtension, getCreator: (prefixManager: PrefixManager) => TIdentifierCreator) {
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

        /**
         * Get a prefix definition value if not nullish, not zero, and not an empty string.
         *
         * @param index
         * Index into prefix definition.
         *
         * @param defaultValue
         * Default value.
         *
         * @returns
         * Prefix definition value.
         */
        function getPrefixDefinitionValue(index: number, defaultValue: unknown): unknown {
            const prefixDefinitionValue = reducedPrefixDefinition[index];

            return !isNullish(prefixDefinitionValue) && prefixDefinitionValue !== 0 && prefixDefinitionValue !== "" ? prefixDefinitionValue : defaultValue;
        }

        const prefixTypeIndex = getPrefixDefinitionValue(1, 0);

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

        const tweakFactor = getPrefixDefinitionValue(2, null);

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
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

@proxy.describeClass(true)
export abstract class NumericIdentifierCreatorProxy<TNumericIdentifierType extends NumericIdentifierType, TNumericIdentifierCreator extends NumericIdentifierCreator<TNumericIdentifierType>> extends IdentifierCreatorProxy<TNumericIdentifierType, NumericIdentifierValidation, TNumericIdentifierCreator> {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, valueParameterDescriptor, sparseParameterDescriptor]
    })
    create(prefixDefinition: Matrix<unknown>, matrixValues: Matrix<number | bigint>, sparse: Nullishable<boolean>): MatrixResult<string> {
        const sparseOrUndefined = sparse ?? undefined;

        return this.setUpMatrixResult(() =>
            this.getCreator(prefixDefinition),
        matrixValues, (creator, value) =>
            creator.create(value, sparseOrUndefined)
        );
    }

    @proxy.describeMethod({
        infixBefore: "Sequence",
        type: Types.String,
        multiplicity: Multiplicities.Array,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, startValueParameterDescriptor, countParameterDescriptor, sparseParameterDescriptor]
    })
    createSequence(prefixDefinition: Matrix<unknown>, startValue: number, count: number, sparse: Nullishable<boolean>): MatrixResult<string> {
        return this.iterableResult(() => {
            this.appExtension.validateSequenceCount(count);

            return this.getCreator(prefixDefinition).create(new Sequence(startValue, count), sparse ?? undefined);
        });
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Array,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor]
    })
    createAll(prefixDefinition: Matrix<unknown>): MatrixResult<string> {
        return this.iterableResult(() => {
            const creator = this.getCreator(prefixDefinition);

            this.appExtension.validateSequenceCount(creator.capacity);

            return creator.createAll();
        });
    }
}

abstract class NonGTINNumericIdentifierCreatorProxy<TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType, TNonGTINNumericIdentifierCreator extends NonGTINNumericIdentifierCreator> extends NumericIdentifierCreatorProxy<TNonGTINNumericIdentifierType, TNonGTINNumericIdentifierCreator> {
}

export abstract class NonSerializableNumericIdentifierCreatorProxy<TNonSerializableNumericIdentifierType extends NonSerializableNumericIdentifierType, TNonGTINNumericIdentifierCreator extends NonGTINNumericIdentifierCreator> extends NonGTINNumericIdentifierCreatorProxy<TNonSerializableNumericIdentifierType, TNonGTINNumericIdentifierCreator> {
}

const singleValueParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    multiplicity: Multiplicities.Singleton
};

const baseIdentifierParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "baseIdentifier",
    multiplicity: Multiplicities.Singleton
};

const serialComponentParameterDescriptor: ParameterDescriptor = {
    name: "serialComponent",
    type: Types.String,
    multiplicity: Multiplicities.Matrix,
    isRequired: true
};

@proxy.describeClass(true)
export abstract class SerializableNumericIdentifierCreatorProxy extends NonGTINNumericIdentifierCreatorProxy<SerializableNumericIdentifierType, SerializableNumericIdentifierCreator> {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, singleValueParameterDescriptor, serialComponentParameterDescriptor, sparseParameterDescriptor]
    })
    createSerialized(prefixDefinition: Matrix<unknown>, value: number | bigint, matrixSerialComponents: Matrix<string>, sparse: Nullishable<boolean>): MatrixResult<string> {
        const sparseOrUndefined = sparse ?? undefined;

        return this.setUpMatrixResult(() =>
            this.getCreator(prefixDefinition),
        matrixSerialComponents, (creator, serialComponent) =>
            creator.createSerialized(value, serialComponent, sparseOrUndefined)
        );
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [baseIdentifierParameterDescriptor, serialComponentParameterDescriptor]
    })
    concatenate(baseIdentifier: string, matrixSerialComponents: Matrix<string>): MatrixResult<string> {
        return this.setUpMatrixResult(() =>
            this.getCreator([[baseIdentifier.substring(0, !baseIdentifier.startsWith("0") ? PrefixValidator.GS1_COMPANY_PREFIX_MINIMUM_LENGTH : PrefixValidator.UPC_COMPANY_PREFIX_MINIMUM_LENGTH + 1), PrefixTypes.GS1CompanyPrefix]]),
        matrixSerialComponents, (creator, serialComponent) =>
            creator.concatenate(baseIdentifier, serialComponent)
        );
    }
}

const referenceParameterDescriptor: ParameterDescriptor = {
    name: "reference",
    type: Types.String,
    multiplicity: Multiplicities.Matrix,
    isRequired: true
};

@proxy.describeClass(true)
export abstract class NonNumericIdentifierCreatorProxy extends IdentifierCreatorProxy<NonNumericIdentifierType, NonNumericIdentifierValidation, NonNumericIdentifierCreator> {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [prefixDefinitionGS1UPCParameterDescriptor, referenceParameterDescriptor]
    })
    create(prefixDefinition: Matrix<unknown>, matrixReferences: Matrix<string>): MatrixResult<string> {
        return this.setUpMatrixResult(() =>
            this.getCreator(prefixDefinition),
        matrixReferences, (creator, reference) =>
            creator.create(reference)
        );
    }
}
