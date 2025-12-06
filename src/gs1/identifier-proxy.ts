import { isNullish, type Nullishable } from "@aidc-toolkit/core";
import {
    GTINCreator,
    type GTINDescriptor,
    type GTINLevel,
    GTINTypes,
    GTINValidator,
    type IdentifierCreator,
    type IdentifierDescriptor,
    type IdentifierType,
    type IdentifierTypes,
    type IdentifierTypeValidator,
    type IdentifierValidation,
    IdentifierValidators,
    type NonGTINNumericIdentifierCreator,
    type NonGTINNumericIdentifierDescriptor,
    type NonGTINNumericIdentifierType,
    type NonNumericIdentifierCreator,
    type NonNumericIdentifierDescriptor,
    type NonNumericIdentifierType,
    type NonNumericIdentifierValidation,
    type NumericIdentifierCreator,
    type NumericIdentifierDescriptor,
    type NumericIdentifierType,
    type NumericIdentifierValidation,
    PrefixManager,
    type PrefixType,
    PrefixTypes,
    PrefixValidator,
    type SerializableNumericIdentifierCreator,
    type SerializableNumericIdentifierDescriptor,
    type SerializableNumericIdentifierType
} from "@aidc-toolkit/gs1";
import { Sequence } from "@aidc-toolkit/utility";
import type { AppExtension } from "../app-extension.js";
import {
    expandParameterDescriptor,
    type ParameterDescriptor,
    ProxyClass,
    ProxyMethod,
    ProxyParameter,
    Types
} from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { i18nextAppExtension } from "../locale/i18n.js";
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

    protected constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, validator: IdentifierTypeValidator<TIdentifierType>) {
        super(appExtension);

        this.#validator = validator;
    }

    protected get validator(): IdentifierTypeValidator<TIdentifierType> {
        return this.#validator;
    }
}

abstract class NumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNumericIdentifierType extends NumericIdentifierType> extends IdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNumericIdentifierType> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    validate(
        @ProxyParameter(validateIdentifierParameterDescriptor) matrixIdentifiers: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(this.validator, matrixIdentifiers);
    }
}

abstract class GTINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, typeof IdentifierTypes.GTIN> {
}

abstract class NonGTINNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType = NonGTINNumericIdentifierType> extends NumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType> {
}

abstract class SerializableNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentifierType> {
}

abstract class NonNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentifierType> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    validate(
        @ProxyParameter(validateIdentifierParameterDescriptor) matrixIdentifiers: Matrix<string>,
        @ProxyParameter(exclusionAllNumericParameterDescriptor) exclusion: Nullishable<NonNumericIdentifierValidation["exclusion"]>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(this.validator, matrixIdentifiers, {
            exclusion: exclusion ?? undefined
        } satisfies NonNumericIdentifierValidation);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GTIN13"
})
export class GTIN13ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINTypes.GTIN13]);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GTIN12"
})
export class GTIN12ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINTypes.GTIN12]);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GTIN8"
})
export class GTIN8ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GTIN[GTINTypes.GTIN8]);
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

@ProxyClass({
    namespace: "GS1"
})
export class GTINValidatorStaticProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    zeroSuppressGTIN12(
        @ProxyParameter(zeroSuppressibleGTIN12ParameterDescriptor) matrixGTIN12s: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTIN12s, gtin12 => GTINValidator.zeroSuppress(gtin12));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    zeroExpandGTIN12(
        @ProxyParameter(zeroSuppressedGTIN12ParameterDescriptor) matrixZeroSuppressedGTIN12s: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixZeroSuppressedGTIN12s, zeroSuppressedGTIN12 => GTINValidator.zeroExpand(zeroSuppressedGTIN12));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    convertToGTIN14(
        @ProxyParameter(indicatorDigitParameterDescriptor) indicatorDigit: string,
        @ProxyParameter(convertGTINParameterDescriptor) matrixGTINs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTINs, gtin => GTINValidator.convertToGTIN14(indicatorDigit, gtin));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    normalizeGTIN(
        @ProxyParameter(normalizeGTINParameterDescriptor) matrixGTINs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTINs, gtin => GTINValidator.normalize(gtin));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    validateGTIN(
        @ProxyParameter(validateGTINParameterDescriptor) matrixGTINs: Matrix<string>,
        @ProxyParameter(gtinLevelParameterDescriptor) gtinLevel: Nullishable<GTINLevel>
    ): Matrix<string> {
        const gtinLevelOrUndefined = gtinLevel ?? undefined;

        return LibProxy.mapMatrixRangeError(matrixGTINs, (gtin) => {
            GTINValidator.validateAny(gtin, gtinLevelOrUndefined);
        });
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    validateGTIN14(
        @ProxyParameter(validateGTIN14ParameterDescriptor) matrixGTIN14s: Matrix<string>
    ): Matrix<string> {
        return LibProxy.mapMatrixRangeError(matrixGTIN14s, (gtin14) => {
            GTINValidator.validateGTIN14(gtin14);
        });
    }

    @ProxyMethod({
        type: Types.Number,
        isMatrix: true
    })
    parseVariableMeasureRCN(
        @ProxyParameter(rcnFormatParameterDescriptor) format: string,
        @ProxyParameter(rcnParameterDescriptor) matrixRCNs: Matrix<string>
    ): MatrixResultError<number, ThrowError, TError> {
        return this.mapArray(matrixRCNs, (rcn) => {
            const rcnReference = GTINValidator.parseVariableMeasureRCN(format, rcn);

            return [rcnReference.itemReference, rcnReference.priceOrWeight];
        });
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GLN"
})
export class GLNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GLN);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "SSCC"
})
export class SSCCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.SSCC);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GRAI"
})
export class GRAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GRAI);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GIAI"
})
export class GIAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GIAI);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GSRN"
})
export class GSRNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GSRN);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GDTI"
})
export class GDTIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GDTI);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GINC"
})
export class GINCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GINC);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GSIN"
})
export class GSINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GSIN);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GCN"
})
export class GCNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GCN);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "CPID"
})
export class CPIDValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.CPID);
    }
}

@ProxyClass({
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

@ProxyClass({
    namespace: "GS1"
})
export class PrefixManagerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Types.Any,
        isMatrix: true
    })
    definePrefix(
        @ProxyParameter(prefixParameterDescriptor) prefix: string,
        @ProxyParameter(prefixTypeParameterDescriptor) prefixType: Nullishable<PrefixType>,
        @ProxyParameter(tweakFactorParameterDescriptor) tweakFactor: Nullishable<number>
    ): Matrix<unknown> {
        // Parameters will be validated by IdentifierCreatorProxy.getCreator().
        return [[prefix, prefixType, tweakFactor]];
    }
}

abstract class IdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TIdentifierDescriptor extends IdentifierDescriptor, TIdentifierValidation extends IdentifierValidation, TIdentifierCreator extends IdentifierCreator<TIdentifierDescriptor, TIdentifierValidation>> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    static readonly #PREFIX_TYPES: Array<PrefixType | undefined> = [PrefixTypes.GS1CompanyPrefix, PrefixTypes.UPCCompanyPrefix, PrefixTypes.GS18Prefix];

    readonly #getCreator: (prefixManager: PrefixManager) => TIdentifierCreator;

    protected constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, getCreator: (prefixManager: PrefixManager) => TIdentifierCreator) {
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

abstract class NumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNumericIdentifierDescriptor extends NumericIdentifierDescriptor, TNumericIdentifierCreator extends NumericIdentifierCreator<TNumericIdentifierDescriptor>> extends IdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNumericIdentifierDescriptor, NumericIdentifierValidation, TNumericIdentifierCreator> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    create(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(valueParameterDescriptor) matrixValues: Matrix<number | bigint>,
        @ProxyParameter(sparseParameterDescriptor) sparse: Nullishable<boolean>
    ): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixValues, value => creator.create(value, sparseOrUndefined));
    }

    @ProxyMethod({
        infixBefore: "Sequence",
        type: Types.String,
        isMatrix: true
    })
    createSequence(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(startValueParameterDescriptor) startValue: number,
        @ProxyParameter(countParameterDescriptor) count: number,
        @ProxyParameter(sparseParameterDescriptor) sparse: Nullishable<boolean>
    ): Matrix<string> {
        this.appExtension.validateSequenceCount(count);

        return LibProxy.matrixResult(this.getCreator(prefixDefinition).create(new Sequence(startValue, count), sparse ?? undefined));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    createAll(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>
    ): Matrix<string> {
        const creator = this.getCreator(prefixDefinition);

        this.appExtension.validateSequenceCount(creator.capacity);

        return LibProxy.matrixResult(creator.createAll());
    }
}

abstract class NonGTINNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonGTINNumericIdentifierDescriptor extends NonGTINNumericIdentifierDescriptor, TNonGTINNumericIdentifierCreator extends NonGTINNumericIdentifierCreator> extends NumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonGTINNumericIdentifierDescriptor, TNonGTINNumericIdentifierCreator> {
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

abstract class SerializableNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentifierDescriptor, SerializableNumericIdentifierCreator> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    createSerialized(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(singleValueParameterDescriptor) value: number,
        @ProxyParameter(serialComponentParameterDescriptor) matrixSerialComponents: Matrix<string>,
        @ProxyParameter(sparseParameterDescriptor) sparse: Nullishable<boolean>
    ): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixSerialComponents, serialComponent => creator.createSerialized(value, serialComponent, sparseOrUndefined));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    concatenate(
        @ProxyParameter(baseIdentifierParameterDescriptor) baseIdentifier: string,
        @ProxyParameter(serialComponentParameterDescriptor) matrixSerialComponents: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
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

abstract class NonNumericIdentifierCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentifierDescriptor, NonNumericIdentifierValidation, NonNumericIdentifierCreator> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    create(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(referenceParameterDescriptor) matrixReferences: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        return this.mapMatrix(matrixReferences, reference => creator.create(reference));
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GTIN",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(prefixDefinitionGS1UPCParameterDescriptor).name,
            replacement: prefixDefinitionAnyParameterDescriptor
        }
    ]
})
export class GTINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, GTINDescriptor, GTINCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gtinCreator);
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true
    })
    createGTIN14(
        @ProxyParameter(indicatorDigitParameterDescriptor) indicatorDigit: string,
        @ProxyParameter(prefixDefinitionAnyParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(valueParameterDescriptor) matrixValues: Matrix<number | bigint>,
        @ProxyParameter(sparseParameterDescriptor) sparse: Nullishable<boolean>
    ): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixValues, value => creator.createGTIN14(indicatorDigit, value, sparseOrUndefined));
    }

    @ProxyMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true
    })
    createVariableMeasureRCN(
        @ProxyParameter(rcnFormatParameterDescriptor) format: string,
        @ProxyParameter(rcnItemReferenceParameterDescriptor) itemReference: number,
        @ProxyParameter(rcnPriceOrWeightParameterDescriptor) matrixPricesOrWeights: Matrix<number>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixPricesOrWeights, priceOrWeight => GTINCreator.createVariableMeasureRCN(format, itemReference, priceOrWeight));
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GLN"
})
export class GLNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentifierDescriptor, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.glnCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentifierDescriptor, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.ssccCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GRAI"
})
export class GRAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.graiCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GIAI"
})
export class GIAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.giaiCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentifierDescriptor, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsrnCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GDTI"
})
export class GDTICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gdtiCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GINC"
})
export class GINCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gincCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GSIN"
})
export class GSINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentifierDescriptor, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsinCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GCN"
})
export class GCNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gcnCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "CPID"
})
export class CPIDCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.cpidCreator);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "GMN"
})
export class GMNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gmnCreator);
    }
}
