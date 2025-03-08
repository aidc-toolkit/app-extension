import {
    CPID_VALIDATOR,
    GCN_VALIDATOR,
    GDTI_VALIDATOR,
    GIAI_VALIDATOR,
    GINC_VALIDATOR,
    GLN_VALIDATOR,
    GMN_VALIDATOR,
    GRAI_VALIDATOR,
    GSIN_VALIDATOR,
    GSRN_VALIDATOR,
    GTIN12_VALIDATOR,
    GTIN13_VALIDATOR,
    GTIN8_VALIDATOR,
    type GTINCreator,
    type GTINLevel,
    GTINValidator,
    type IdentificationKeyCreator,
    type IdentificationKeyValidation,
    type IdentificationKeyValidator,
    type NonGTINNumericIdentificationKeyCreator,
    type NonGTINNumericIdentificationKeyValidator,
    type NonNumericIdentificationKeyCreator,
    type NonNumericIdentificationKeyValidation,
    type NonNumericIdentificationKeyValidator,
    type NumericIdentificationKeyCreator,
    type NumericIdentificationKeyValidator,
    PrefixManager,
    PrefixType,
    type SerializableNumericIdentificationKeyCreator,
    type SerializableNumericIdentificationKeyValidator,
    SSCC_VALIDATOR
} from "@aidc-toolkit/gs1";
import { Sequence } from "@aidc-toolkit/utility";
import type { AppExtension } from "../app-extension.js";
import {
    expandParameterDescriptor,
    type ParameterDescriptor,
    ProxyClass,
    ProxyMethod,
    ProxyParameter,
    Type
} from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { i18nextAppExtension } from "../locale/i18n.js";
import { type ErrorExtends, isNullish, type Matrix, type MatrixResultError, type Nullishable } from "../types.js";
import { exclusionAllNumericParameterDescriptor } from "../utility/character-set-descriptor.js";
import { StringProxy } from "../utility/string-proxy.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    valueParameterDescriptor
} from "../utility/transformer-descriptor.js";

const identificationKeyParameterDescriptor: ParameterDescriptor = {
    name: "identificationKey",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const validateIdentificationKeyParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identificationKeyParameterDescriptor,
    sortOrder: 0,
    name: "validateIdentificationKey"
};

abstract class IdentificationKeyValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TIdentificationKeyValidation extends IdentificationKeyValidation, TIdentificationKeyValidator extends IdentificationKeyValidator<TIdentificationKeyValidation>> extends StringProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    private readonly _validator: TIdentificationKeyValidator;

    protected constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, validator: TIdentificationKeyValidator) {
        super(appExtension);

        this._validator = validator;
    }

    protected get validator(): TIdentificationKeyValidator {
        return this._validator;
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    validate(
        @ProxyParameter(validateIdentificationKeyParameterDescriptor) matrixIdentificationKeys: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(this.validator, matrixIdentificationKeys);
    }
}

abstract class NumericIdentificationKeyValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNumericIdentificationKeyValidator extends NumericIdentificationKeyValidator> extends IdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, IdentificationKeyValidation, TNumericIdentificationKeyValidator> {
}

abstract class GTINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, GTINValidator> {
}

abstract class NonGTINNumericIdentificationKeyValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonGTINNumericIdentificationKeyValidator extends NonGTINNumericIdentificationKeyValidator> extends NumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonGTINNumericIdentificationKeyValidator> {
}

abstract class SerializableNumericIdentificationKeyValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentificationKeyValidator> {
}

abstract class NonNumericIdentificationKeyValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentificationKeyValidation, NonNumericIdentificationKeyValidator> {
    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    override validate(
        @ProxyParameter(validateIdentificationKeyParameterDescriptor) matrixIdentificationKeys: Matrix<string>,
        @ProxyParameter(exclusionAllNumericParameterDescriptor) exclusion?: NonNumericIdentificationKeyValidation["exclusion"]
    ): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(this.validator, matrixIdentificationKeys, {
            exclusion: exclusion ?? undefined
        } satisfies NonNumericIdentificationKeyValidation);
    }
}

@ProxyClass({
    methodInfix: "GTIN13"
})
export class GTIN13ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GTIN13_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GTIN12"
})
export class GTIN12ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GTIN12_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GTIN8"
})
export class GTIN8ValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends GTINValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GTIN8_VALIDATOR);
    }
}

const zeroSuppressibleGTIN12ParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identificationKeyParameterDescriptor,
    name: "zeroSuppressibleGTIN12"
};

const zeroSuppressedGTIN12ParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identificationKeyParameterDescriptor,
    name: "zeroSuppressedGTIN12"
};

const indicatorDigitParameterDescriptor: ParameterDescriptor = {
    name: "indicatorDigit",
    type: Type.String,
    isMatrix: false,
    isRequired: true
};

const convertGTINParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identificationKeyParameterDescriptor,
    name: "convertGTIN"
};

const normalizeGTINParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identificationKeyParameterDescriptor,
    name: "normalizeGTIN"
};

const validateGTINParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identificationKeyParameterDescriptor,
    name: "validateGTIN"
};

const gtinLevelParameterDescriptor: ParameterDescriptor = {
    name: "gtinLevel",
    type: Type.Number,
    isMatrix: false,
    isRequired: true
};

const validateGTIN14ParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: identificationKeyParameterDescriptor,
    name: "validateGTIN14"
};

@ProxyClass()
export class GTINValidatorStaticProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    zeroSuppressGTIN12(
        @ProxyParameter(zeroSuppressibleGTIN12ParameterDescriptor) matrixGTIN12s: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTIN12s, gtin12 => GTINValidator.zeroSuppress(gtin12));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    zeroExpandGTIN12(
        @ProxyParameter(zeroSuppressedGTIN12ParameterDescriptor) matrixZeroSuppressedGTIN12s: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixZeroSuppressedGTIN12s, zeroSuppressedGTIN12 => GTINValidator.zeroExpand(zeroSuppressedGTIN12));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    convertToGTIN14(
        @ProxyParameter(indicatorDigitParameterDescriptor) indicatorDigit: string,
        @ProxyParameter(convertGTINParameterDescriptor) matrixGTINs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTINs, gtin => GTINValidator.convertToGTIN14(indicatorDigit, gtin));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    normalizeGTIN(
        @ProxyParameter(normalizeGTINParameterDescriptor) matrixGTINs: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTINs, gtin => GTINValidator.normalize(gtin));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    validateGTIN(
        @ProxyParameter(validateGTINParameterDescriptor) matrixGTINs: Matrix<string>,
        @ProxyParameter(gtinLevelParameterDescriptor) gtinLevel: Nullishable<GTINLevel>
    ): Matrix<string> {
        const gtinLevelOrUndefined = gtinLevel ?? undefined;

        return this.mapMatrixVoid(matrixGTINs, (gtin) => {
            GTINValidator.validateAny(gtin, gtinLevelOrUndefined);
        });
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    validateGTIN14(
        @ProxyParameter(validateGTIN14ParameterDescriptor) matrixGTIN14s: Matrix<string>
    ): Matrix<string> {
        return this.mapMatrixVoid(matrixGTIN14s, (gtin14) => {
            GTINValidator.validateGTIN14(gtin14);
        });
    }
}

@ProxyClass({
    methodInfix: "GLN"
})
export class GLNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyValidator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GLN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "SSCC"
})
export class SSCCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyValidator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, SSCC_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GRAI"
})
export class GRAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GRAI_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GIAI"
})
export class GIAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GIAI_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GSRN"
})
export class GSRNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyValidator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GSRN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GDTI"
})
export class GDTIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GDTI_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GINC"
})
export class GINCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GINC_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GSIN"
})
export class GSINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyValidator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GSIN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GCN"
})
export class GCNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GCN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "CPID"
})
export class CPIDValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, CPID_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GMN"
})
export class GMNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, GMN_VALIDATOR);
    }
}

const prefixParameterDescriptor: ParameterDescriptor = {
    name: "prefix",
    type: Type.String,
    isMatrix: false,
    isRequired: true
};

const prefixTypeParameterDescriptor: ParameterDescriptor = {
    name: "prefixType",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};

const tweakFactorParameterDescriptor: ParameterDescriptor = {
    name: "tweakFactor",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};

const prefixDefinitionParameterDescriptor: ParameterDescriptor = {
    name: "prefixDefinition",
    type: Type.Any,
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

@ProxyClass()
export class PrefixManagerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Type.Any,
        isMatrix: true
    })
    definePrefix(
        @ProxyParameter(prefixParameterDescriptor) prefix: string,
        @ProxyParameter(prefixTypeParameterDescriptor) prefixType: Nullishable<PrefixType>,
        @ProxyParameter(tweakFactorParameterDescriptor) tweakFactor: Nullishable<number>
    ): Matrix<unknown> {
        // Parameters will be validated by IdentificationKeyCreatorProxy.getCreator().
        return [[prefix, prefixType, tweakFactor]];
    }
}

abstract class IdentificationKeyCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TIdentificationKeyCreator extends IdentificationKeyCreator> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    private readonly _getCreator: (prefixManager: PrefixManager) => TIdentificationKeyCreator;

    protected constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, getCreator: (prefixManager: PrefixManager) => TIdentificationKeyCreator) {
        super(appExtension);

        this._getCreator = getCreator;
    }

    protected getCreator(prefixDefinition: Matrix<unknown>): TIdentificationKeyCreator {
        const reducedPrefixDefinition = prefixDefinition.length === 1 ?
            // Prefix definition is horizontal.
            prefixDefinition[0] :
            // Prefix definition is vertical.
            prefixDefinition.map((prefixDefinitionRow) => {
                if (prefixDefinitionRow.length !== 1) {
                    throw new RangeError(i18nextAppExtension.t("IdentificationKeyCreatorProxy.prefixDefinitionMustBeOneDimensional"));
                }

                return prefixDefinitionRow[0];
            });

        if (reducedPrefixDefinition.length > 3) {
            throw new RangeError(i18nextAppExtension.t("IdentificationKeyCreatorProxy.prefixDefinitionMustHaveMaximumThreeElements"));
        }
        
        const prefix = reducedPrefixDefinition[0];
        
        if (typeof prefix !== "string") {
            throw new RangeError(i18nextAppExtension.t("IdentificationKeyCreatorProxy.prefixMustBeString"));
        }

        const prefixType = reducedPrefixDefinition[1] ?? PrefixType.GS1CompanyPrefix;
        
        if (typeof prefixType !== "number") {
            throw new RangeError(i18nextAppExtension.t("IdentificationKeyCreatorProxy.prefixTypeMustBeNumber"));
        }

        const prefixManager = PrefixManager.get(prefixType, prefix);

        const tweakFactor = reducedPrefixDefinition[2];
        
        if (!isNullish(tweakFactor)) {
            if (typeof tweakFactor !== "number") {
                throw new RangeError(i18nextAppExtension.t("IdentificationKeyCreatorProxy.tweakFactorMustBeNumber"));
            }

            prefixManager.tweakFactor = tweakFactor;
        } else {
            prefixManager.resetTweakFactor();
        }
        
        return this._getCreator(prefixManager);
    }
}

const sparseParameterDescriptor: ParameterDescriptor = {
    name: "sparse",
    type: Type.Boolean,
    isMatrix: false,
    isRequired: false
};

abstract class NumericIdentificationKeyCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNumericIdentificationKeyCreator extends NumericIdentificationKeyCreator> extends IdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNumericIdentificationKeyCreator> {
    @ProxyMethod({
        type: Type.String,
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
        type: Type.String,
        isMatrix: true
    })
    createSequence(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(startValueParameterDescriptor) startValue: number,
        @ProxyParameter(countParameterDescriptor) count: number,
        @ProxyParameter(sparseParameterDescriptor) sparse: Nullishable<boolean>
    ): Matrix<string> {
        return this.mapIterable(() => this.getCreator(prefixDefinition).create(new Sequence(startValue, count), sparse ?? undefined));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    createAll(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>
    ): Matrix<string> {
        return this.mapIterable(() => this.getCreator(prefixDefinition).createAll());
    }
}

abstract class NonGTINNumericIdentificationKeyCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonGTINNumericIdentificationKeyCreator extends NonGTINNumericIdentificationKeyCreator> extends NumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonGTINNumericIdentificationKeyCreator> {
}

const singleValueParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    isMatrix: false
};

const baseIdentificationKeyParameterDescriptor: ParameterDescriptor = {
    name: "baseIdentificationKey",
    type: Type.String,
    isMatrix: false,
    isRequired: true
};

const serialComponentParameterDescriptor: ParameterDescriptor = {
    name: "serialComponent",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

abstract class SerializableNumericIdentificationKeyCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentificationKeyCreator> {
    @ProxyMethod({
        type: Type.String,
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
        type: Type.String,
        isMatrix: true
    })
    concatenate(
        @ProxyParameter(baseIdentificationKeyParameterDescriptor) baseIdentificationKey: string,
        @ProxyParameter(serialComponentParameterDescriptor) matrixSerialComponents: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator([[baseIdentificationKey.substring(0, !baseIdentificationKey.startsWith("0") ? PrefixManager.GS1_COMPANY_PREFIX_MINIMUM_LENGTH : PrefixManager.UPC_COMPANY_PREFIX_MINIMUM_LENGTH + 1), PrefixType.GS1CompanyPrefix]]);

        return this.mapMatrix(matrixSerialComponents, serialComponent => creator.concatenate(baseIdentificationKey, serialComponent));
    }
}

const referenceParameterDescriptor: ParameterDescriptor = {
    name: "reference",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

abstract class NonNumericIdentificationKeyCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentificationKeyCreator> {
    @ProxyMethod({
        type: Type.String,
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
    methodInfix: "GTIN",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(prefixDefinitionGS1UPCParameterDescriptor).name,
            replacement: prefixDefinitionAnyParameterDescriptor
        }
    ]
})
export class GTINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, GTINCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gtinCreator);
    }

    @ProxyMethod({
        type: Type.String,
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
}

@ProxyClass({
    methodInfix: "GLN"
})
export class GLNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.glnCreator);
    }
}

@ProxyClass({
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.ssccCreator);
    }
}

@ProxyClass({
    methodInfix: "GRAI"
})
export class GRAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.graiCreator);
    }
}

@ProxyClass({
    methodInfix: "GIAI"
})
export class GIAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.giaiCreator);
    }
}

@ProxyClass({
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsrnCreator);
    }
}

@ProxyClass({
    methodInfix: "GDTI"
})
export class GDTICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gdtiCreator);
    }
}

@ProxyClass({
    methodInfix: "GINC"
})
export class GINCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gincCreator);
    }
}

@ProxyClass({
    methodInfix: "GSIN"
})
export class GSINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonGTINNumericIdentificationKeyCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsinCreator);
    }
}

@ProxyClass({
    methodInfix: "GCN"
})
export class GCNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends SerializableNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gcnCreator);
    }
}

@ProxyClass({
    methodInfix: "CPID"
})
export class CPIDCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.cpidCreator);
    }
}

@ProxyClass({
    methodInfix: "GMN"
})
export class GMNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonNumericIdentificationKeyCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gmnCreator);
    }
}
