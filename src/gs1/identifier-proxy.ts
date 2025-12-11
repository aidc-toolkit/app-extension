import { isNullish, type Nullishable } from "@aidc-toolkit/core";
import {
    GTINCreator,
    GTINLengths,
    type GTINLevel,
    type GTINType,
    GTINValidator,
    type IdentifierCreator,
    type IdentifierType,
    type IdentifierTypeValidator,
    type IdentifierValidation,
    IdentifierValidators,
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
import { expandParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { i18nextAppExtension } from "../locale/i18n.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../type.js";
import { exclusionAllNumericParameterDescriptor } from "../utility/character-set-descriptor.js";
import { StringProxy } from "../utility/string-proxy.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    valueParameterDescriptor
} from "../utility/transformer-descriptor.js";

const identifierParameterDescriptor: ParameterDescriptor = {
    name: "identifier",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

const validateIdentifierParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    sortOrder: 0,
    name: "validateIdentifier"
};

abstract class IdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TIdentifierType extends IdentifierType> extends StringProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    readonly #validator: IdentifierTypeValidator<TIdentifierType>;

    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, validator: IdentifierTypeValidator<TIdentifierType>) {
        super(appExtension);

        this.#validator = validator;
    }

    protected get validator(): IdentifierTypeValidator<TIdentifierType> {
        return this.#validator;
    }
}

@proxy.describeClass(true, {
    namespace: "GS1"
})
abstract class NumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNumericIdentifierType extends NumericIdentifierType> extends IdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNumericIdentifierType> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [validateIdentifierParameterDescriptor]
    })
    validate(matrixIdentifiers: Matrix<string>): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(this.validator, matrixIdentifiers);
    }
}

abstract class GTINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, GTINType> {
}

abstract class NonGTINNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType = NonGTINNumericIdentifierType> extends NumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType> {
}

abstract class NonSerializableNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonSerializableNumericIdentifierType> {
}

abstract class SerializableNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentifierType> {
}

@proxy.describeClass(true, {
    namespace: "GS1"
})
abstract class NonNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentifierType> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [validateIdentifierParameterDescriptor, exclusionAllNumericParameterDescriptor]
    })
    validate(matrixIdentifiers: Matrix<string>, exclusion: Nullishable<NonNumericIdentifierValidation["exclusion"]>): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(this.validator, matrixIdentifiers, {
            exclusion: exclusion ?? undefined
        } satisfies NonNumericIdentifierValidation);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN13"
})
export class GTIN13ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINLengths.GTIN13]);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN12"
})
export class GTIN12ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINLengths.GTIN12]);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN8"
})
export class GTIN8ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINLengths.GTIN8]);
    }
}

const zeroSuppressibleGTIN12ParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "zeroSuppressibleGTIN12"
};

const zeroSuppressedGTIN12ParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "zeroSuppressedGTIN12"
};

const indicatorDigitParameterDescriptor: ParameterDescriptor = {
    name: "indicatorDigit",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

const convertGTINParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "convertGTIN"
};

const normalizeGTINParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "normalizeGTIN"
};

const validateGTINParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "validateGTIN"
};

const gtinLevelParameterDescriptor: ParameterDescriptor = {
    name: "gtinLevel",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};

const validateGTIN14ParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "validateGTIN14"
};

const rcnFormatParameterDescriptor: ParameterDescriptor = {
    name: "rcnFormat",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

const rcnParameterDescriptor: ParameterDescriptor = {
    name: "rcn",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

const rcnItemReferenceParameterDescriptor: ParameterDescriptor = {
    name: "rcnItemReference",
    type: Types.Number,
    isMatrix: false,
    isRequired: true
};

const rcnPriceOrWeightParameterDescriptor: ParameterDescriptor = {
    name: "rcnPriceOrWeight",
    type: Types.Number,
    isMatrix: true,
    isRequired: true
};

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class GTINValidatorStaticProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [zeroSuppressibleGTIN12ParameterDescriptor]
    })
    zeroSuppressGTIN12(matrixGTIN12s: Matrix<string>): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTIN12s, gtin12 => GTINValidator.zeroSuppress(gtin12));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [zeroSuppressedGTIN12ParameterDescriptor]
    })
    zeroExpandGTIN12(matrixZeroSuppressedGTIN12s: Matrix<string>): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixZeroSuppressedGTIN12s, zeroSuppressedGTIN12 => GTINValidator.zeroExpand(zeroSuppressedGTIN12));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [indicatorDigitParameterDescriptor, convertGTINParameterDescriptor]
    })
    convertToGTIN14(indicatorDigit: string, matrixGTINs: Matrix<string>): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTINs, gtin => GTINValidator.convertToGTIN14(indicatorDigit, gtin));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [normalizeGTINParameterDescriptor]
    })
    normalizeGTIN(matrixGTINs: Matrix<string>): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTINs, gtin => GTINValidator.normalize(gtin));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [validateGTINParameterDescriptor, gtinLevelParameterDescriptor]
    })
    validateGTIN(matrixGTINs: Matrix<string>, gtinLevel: Nullishable<GTINLevel>): Matrix<string> {
        const gtinLevelOrUndefined = gtinLevel ?? undefined;

        return LibProxy.mapMatrixRangeError(matrixGTINs, (gtin) => {
            GTINValidator.validateAny(gtin, gtinLevelOrUndefined);
        });
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [validateGTIN14ParameterDescriptor]
    })
    validateGTIN14(matrixGTIN14s: Matrix<string>): Matrix<string> {
        return LibProxy.mapMatrixRangeError(matrixGTIN14s, (gtin14) => {
            GTINValidator.validateGTIN14(gtin14);
        });
    }

    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnParameterDescriptor]
    })
    parseVariableMeasureRCN(format: string, matrixRCNs: Matrix<string>): MatrixResultError<number, ThrowError, TError> {
        return this.mapArray(matrixRCNs, (rcn) => {
            const rcnReference = GTINValidator.parseVariableMeasureRCN(format, rcn);

            return [rcnReference.itemReference, rcnReference.priceOrWeight];
        });
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GLN"
})
export class GLNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GLN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "SSCC"
})
export class SSCCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.SSCC);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GRAI"
})
export class GRAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GRAI);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GIAI"
})
export class GIAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GIAI);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSRN"
})
export class GSRNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GSRN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GDTI"
})
export class GDTIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GDTI);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GINC"
})
export class GINCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GINC);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSIN"
})
export class GSINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GSIN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GCN"
})
export class GCNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GCN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "CPID"
})
export class CPIDValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.CPID);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GMN"
})
export class GMNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GMN);
    }
}

const prefixParameterDescriptor: ParameterDescriptor = {
    name: "prefix",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

const prefixTypeParameterDescriptor: ParameterDescriptor = {
    name: "prefixType",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};

const tweakFactorParameterDescriptor: ParameterDescriptor = {
    name: "tweakFactor",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};

const prefixDefinitionParameterDescriptor: ParameterDescriptor = {
    name: "prefixDefinition",
    type: Types.Any,
    isMatrix: true,
    isRequired: true
};

const prefixDefinitionGS1UPCParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: prefixDefinitionParameterDescriptor,
    name: "prefixDefinitionGS1UPC"
};

const prefixDefinitionAnyParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: prefixDefinitionParameterDescriptor,
    name: "prefixDefinitionAny"
};

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class PrefixManagerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.Any,
        isMatrix: true,
        parameterDescriptors: [prefixParameterDescriptor, prefixTypeParameterDescriptor, tweakFactorParameterDescriptor]
    })
    definePrefix(prefix: string, prefixType: Nullishable<PrefixType>, tweakFactor: Nullishable<number>): Matrix<unknown> {
        // Parameters will be validated by IdentifierCreatorProxy.getCreator().
        return [[prefix, prefixType, tweakFactor]];
    }
}

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

const sparseParameterDescriptor: ParameterDescriptor = {
    name: "sparse",
    type: Types.Boolean,
    isMatrix: false,
    isRequired: false
};

@proxy.describeClass(true, {
    namespace: "GS1"
})
abstract class NumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNumericIdentifierType extends NumericIdentifierType, TNumericIdentifierCreator extends NumericIdentifierCreator<TNumericIdentifierType>> extends IdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNumericIdentifierType, NumericIdentifierValidation, TNumericIdentifierCreator> {
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

abstract class NonSerializableNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonSerializableNumericIdentifierType extends NonSerializableNumericIdentifierType, TNonGTINNumericIdentifierCreator extends NonGTINNumericIdentifierCreator> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonSerializableNumericIdentifierType, TNonGTINNumericIdentifierCreator> {
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
abstract class SerializableNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentifierType, SerializableNumericIdentifierCreator> {
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
abstract class NonNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentifierType, NonNumericIdentifierValidation, NonNumericIdentifierCreator> {
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

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(prefixDefinitionGS1UPCParameterDescriptor).name,
            replacement: prefixDefinitionAnyParameterDescriptor
        }
    ]
})
export class GTINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, GTINType, GTINCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gtinCreator);
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true,
        parameterDescriptors: [indicatorDigitParameterDescriptor, prefixDefinitionAnyParameterDescriptor, valueParameterDescriptor, sparseParameterDescriptor]
    })
    createGTIN14(indicatorDigit: string, prefixDefinition: Matrix<unknown>, matrixValues: Matrix<number | bigint>, sparse: Nullishable<boolean>): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixValues, value => creator.createGTIN14(indicatorDigit, value, sparseOrUndefined));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnItemReferenceParameterDescriptor, rcnPriceOrWeightParameterDescriptor]
    })
    createVariableMeasureRCN(format: string, itemReference: number, matrixPricesOrWeights: Matrix<number>): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixPricesOrWeights, priceOrWeight => GTINCreator.createVariableMeasureRCN(format, itemReference, priceOrWeight));
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GLN"
})
export class GLNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.glnCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.ssccCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GRAI"
})
export class GRAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.graiCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GIAI"
})
export class GIAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.giaiCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsrnCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GDTI"
})
export class GDTICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gdtiCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GINC"
})
export class GINCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gincCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSIN"
})
export class GSINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsinCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GCN"
})
export class GCNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gcnCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "CPID"
})
export class CPIDCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.cpidCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GMN"
})
export class GMNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gmnCreator);
    }
}
