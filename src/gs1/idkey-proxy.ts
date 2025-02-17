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
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "../descriptor.js";
import { i18nextAppExtension } from "../locale/i18n.js";
import { type AppProxy, type ErrorExtends, LibProxy, type Matrix, type MatrixResultError } from "../proxy.js";
import { exclusionAllNumericParameterDescriptor } from "../utility/character-set-descriptor.js";
import { StringProxy } from "../utility/string-proxy.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    valueParameterDescriptor
} from "../utility/transformer-descriptor.js";

const validateIdentificationKeyParameterDescriptor: ParameterDescriptor = {
    name: "validateIdentificationKey",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

abstract class IdentificationKeyValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TIdentificationKeyValidation extends IdentificationKeyValidation, TIdentificationKeyValidator extends IdentificationKeyValidator<TIdentificationKeyValidation>> extends StringProxy<TBigInt, ThrowError, TError> {
    private readonly _validator: TIdentificationKeyValidator;

    protected constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>, validator: TIdentificationKeyValidator) {
        super(appProxy);

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

abstract class NumericIdentificationKeyValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TNumericIdentificationKeyValidator extends NumericIdentificationKeyValidator> extends IdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, IdentificationKeyValidation, TNumericIdentificationKeyValidator> {
}

abstract class GTINValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, GTINValidator> {
}

abstract class NonGTINNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TNonGTINNumericIdentificationKeyValidator extends NonGTINNumericIdentificationKeyValidator> extends NumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, TNonGTINNumericIdentificationKeyValidator> {
}

abstract class SerializableNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, SerializableNumericIdentificationKeyValidator> {
}

abstract class NonNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends IdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, NonNumericIdentificationKeyValidation, NonNumericIdentificationKeyValidator> {
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
export class GTIN13ValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends GTINValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GTIN13_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GTIN12"
})
export class GTIN12ValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends GTINValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GTIN12_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GTIN8"
})
export class GTIN8ValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends GTINValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GTIN8_VALIDATOR);
    }
}

const zeroSuppressGTIN12ParameterDescriptor: ParameterDescriptor = {
    name: "zeroSuppressGTIN12",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const zeroExpandGTIN12ParameterDescriptor: ParameterDescriptor = {
    name: "zeroExpandGTIN12",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const indicatorDigitParameterDescriptor: ParameterDescriptor = {
    name: "indicatorDigit",
    type: Type.String,
    isMatrix: false,
    isRequired: true
};

const convertGTINParameterDescriptor: ParameterDescriptor = {
    name: "convertGTIN",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const normalizeGTINParameterDescriptor: ParameterDescriptor = {
    name: "normalizeGTIN",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const validateAnyGTINParameterDescriptor: ParameterDescriptor = {
    name: "validateAnyGTIN",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

const gtinLevelParameterDescriptor: ParameterDescriptor = {
    name: "gtinLevel",
    type: Type.Number,
    isMatrix: false,
    isRequired: true
};

const validateGTIN14ParameterDescriptor: ParameterDescriptor = {
    name: "validateGTIN14",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

@ProxyClass()
export class GTINValidatorStaticProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends LibProxy<TBigInt, ThrowError, TError> {
    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    zeroSuppressGTIN12(
        @ProxyParameter(zeroSuppressGTIN12ParameterDescriptor) matrixGTIN12s: Matrix<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixGTIN12s, gtin12 => GTINValidator.zeroSuppress(gtin12));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    zeroExpandGTIN12(
        @ProxyParameter(zeroExpandGTIN12ParameterDescriptor) matrixZeroSuppressedGTIN12s: Matrix<string>
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
    validateAnyGTIN(
        @ProxyParameter(validateAnyGTINParameterDescriptor) matrixGTINs: Matrix<string>,
        @ProxyParameter(gtinLevelParameterDescriptor) gtinLevel?: GTINLevel
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
export class GLNValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyValidator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GLN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "SSCC"
})
export class SSCCValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyValidator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, SSCC_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GRAI"
})
export class GRAIValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends SerializableNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GRAI_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GIAI"
})
export class GIAIValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GIAI_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GSRN"
})
export class GSRNValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyValidator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GSRN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GDTI"
})
export class GDTIValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends SerializableNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GDTI_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GINC"
})
export class GINCValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GINC_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GSIN"
})
export class GSINValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyValidator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GSIN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GCN"
})
export class GCNValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends SerializableNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GCN_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "CPID"
})
export class CPIDValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, CPID_VALIDATOR);
    }
}

@ProxyClass({
    methodInfix: "GMN"
})
export class GMNValidatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyValidatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, GMN_VALIDATOR);
    }
}

const prefixDefinitionParameterDescriptor: Pick<ParameterDescriptor, "type" | "isMatrix" | "isRequired"> = {
    type: Type.Any,
    isMatrix: true,
    isRequired: true
};

const prefixDefinitionGS1UPCParameterDescriptor: ParameterDescriptor = {
    name: "prefixDefinitionGS1UPC",
    ...prefixDefinitionParameterDescriptor
};

const prefixDefinitionAnyParameterDescriptor: ParameterDescriptor = {
    name: "prefixDefinitionAny",
    ...prefixDefinitionParameterDescriptor
};

abstract class IdentificationKeyCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TIdentificationKeyCreator extends IdentificationKeyCreator> extends LibProxy<TBigInt, ThrowError, TError> {
    private readonly _getCreator: (prefixManager: PrefixManager) => TIdentificationKeyCreator;

    protected constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>, getCreator: (prefixManager: PrefixManager) => TIdentificationKeyCreator) {
        super(appProxy);

        this._getCreator = getCreator;
    }

    protected getCreator(prefixDefinition: Matrix<unknown>): TIdentificationKeyCreator {
        const isHorizontal = prefixDefinition.length === 1;
        
        const reducedPrefixDefinition = isHorizontal ?
            prefixDefinition[0] :
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

        const tweakFactor = reducedPrefixDefinition[2];
        
        if (tweakFactor !== undefined && typeof tweakFactor !== "number") {
            throw new RangeError(i18nextAppExtension.t("IdentificationKeyCreatorProxy.tweakFactorMustBeNumber"));
        }

        const prefixManager = PrefixManager.get(prefixType, prefix);
        
        if (tweakFactor !== undefined) {
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

abstract class NumericIdentificationKeyCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TNumericIdentificationKeyCreator extends NumericIdentificationKeyCreator> extends IdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, TNumericIdentificationKeyCreator> {
    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    create(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(valueParameterDescriptor) matrixValues: Matrix<number | bigint>,
        @ProxyParameter(sparseParameterDescriptor) sparse?: boolean
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
        @ProxyParameter(sparseParameterDescriptor) sparse?: boolean
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

abstract class NonGTINNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TNonGTINNumericIdentificationKeyCreator extends NonGTINNumericIdentificationKeyCreator> extends NumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, TNonGTINNumericIdentificationKeyCreator> {
}

const singleValueParameterDescriptor: ParameterDescriptor = {
    ...valueParameterDescriptor,
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

abstract class SerializableNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, SerializableNumericIdentificationKeyCreator> {
    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    createSerialized(
        @ProxyParameter(prefixDefinitionGS1UPCParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(singleValueParameterDescriptor) value: number,
        @ProxyParameter(serialComponentParameterDescriptor) matrixSerialComponents: Matrix<string>,
        @ProxyParameter(sparseParameterDescriptor) sparse?: boolean
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

abstract class NonNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends IdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, NonNumericIdentificationKeyCreator> {
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
            name: prefixDefinitionGS1UPCParameterDescriptor.name,
            replacement: prefixDefinitionAnyParameterDescriptor
        }
    ]
})
export class GTINCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, GTINCreator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.gtinCreator);
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true,
        noInfix: true
    })
    createGTIN14(
        @ProxyParameter(indicatorDigitParameterDescriptor) indicatorDigit: string,
        @ProxyParameter(prefixDefinitionAnyParameterDescriptor) prefixDefinition: Matrix<unknown>,
        @ProxyParameter(valueParameterDescriptor) matrixValues: Matrix<number | bigint>,
        @ProxyParameter(sparseParameterDescriptor) sparse?: boolean
    ): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixValues, value => creator.createGTIN14(indicatorDigit, value, sparseOrUndefined));
    }
}

@ProxyClass({
    methodInfix: "GLN"
})
export class GLNCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyCreator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.glnCreator);
    }
}

@ProxyClass({
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyCreator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.ssccCreator);
    }
}

@ProxyClass({
    methodInfix: "GRAI"
})
export class GRAICreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends SerializableNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.graiCreator);
    }
}

@ProxyClass({
    methodInfix: "GIAI"
})
export class GIAICreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.giaiCreator);
    }
}

@ProxyClass({
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyCreator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.gsrnCreator);
    }
}

@ProxyClass({
    methodInfix: "GDTI"
})
export class GDTICreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends SerializableNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.gdtiCreator);
    }
}

@ProxyClass({
    methodInfix: "GINC"
})
export class GINCCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.gincCreator);
    }
}

@ProxyClass({
    methodInfix: "GSIN"
})
export class GSINCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonGTINNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError, NonGTINNumericIdentificationKeyCreator> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.gsinCreator);
    }
}

@ProxyClass({
    methodInfix: "GCN"
})
export class GCNCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends SerializableNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.gcnCreator);
    }
}

@ProxyClass({
    methodInfix: "CPID"
})
export class CPIDCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.cpidCreator);
    }
}

@ProxyClass({
    methodInfix: "GMN"
})
export class GMNCreatorProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends NonNumericIdentificationKeyCreatorProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, prefixManager => prefixManager.gmnCreator);
    }
}
