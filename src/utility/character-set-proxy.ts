import type { Nullishable } from "@aidc-toolkit/core";
import {
    ALPHABETIC_CREATOR,
    ALPHANUMERIC_CREATOR,
    type CharacterSetCreator,
    type CharacterSetValidation,
    type CharacterSetValidator,
    type Exclusion,
    HEXADECIMAL_CREATOR,
    NUMERIC_CREATOR,
    Sequence
} from "@aidc-toolkit/utility";
import type { AppExtension } from "../app-extension.js";
import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";
import { expandParameterDescriptor, proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResult } from "../type.js";
import {
    exclusionAnyParameterDescriptor,
    exclusionFirstZeroParameterDescriptor,
    exclusionNoneParameterDescriptor
} from "./character-set-descriptor.js";
import { sParameterDescriptor, validateSParameterDescriptor } from "./string-descriptor.js";
import { StringProxy } from "./string-proxy.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    tweakParameterDescriptor,
    valueParameterDescriptor
} from "./transformer-descriptor.js";

const lengthParameterDescriptor: ParameterDescriptor = {
    name: "length",
    type: Types.Number,
    isMatrix: false,
    isRequired: true
};

const valueForSParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: sParameterDescriptor,
    name: "valueForS"
};

@proxy.describeClass(true)
export abstract class CharacterSetValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends StringProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    readonly #characterSetValidator: CharacterSetValidator;

    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, characterSetValidator: CharacterSetValidator) {
        super(appExtension);

        this.#characterSetValidator = characterSetValidator;
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [validateSParameterDescriptor, exclusionNoneParameterDescriptor]
    })
    validate(matrixSs: Matrix<string>, exclusion: Nullishable<Exclusion>): Matrix<string> {
        return this.validateString(this.#characterSetValidator, matrixSs, {
            exclusion: exclusion ?? undefined
        } satisfies CharacterSetValidation);
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        isMatrix: true,
        parameterDescriptors: [validateSParameterDescriptor, exclusionNoneParameterDescriptor]
    })
    isValid(matrixSs: Matrix<string>, exclusion: Nullishable<Exclusion>): Matrix<boolean> {
        return this.isValidString(this.validate(matrixSs, exclusion));
    }
}

@proxy.describeClass(true)
export abstract class CharacterSetCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    readonly #characterSetCreator: CharacterSetCreator;

    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, characterSetCreator: CharacterSetCreator) {
        super(appExtension, characterSetCreator);

        this.#characterSetCreator = characterSetCreator;
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [lengthParameterDescriptor, valueParameterDescriptor, exclusionNoneParameterDescriptor, tweakParameterDescriptor]
    })
    create(length: number, matrixValues: Matrix<number | bigint>, exclusion: Nullishable<Exclusion>, tweak: Nullishable<number | bigint>): MatrixResult<string, ThrowError, TError> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.matrixResult(matrixValues, value =>
            this.#characterSetCreator.create(length, value, exclusionOrUndefined, tweakOrUndefined)
        );
    }

    @proxy.describeMethod({
        infixBefore: "Sequence",
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [lengthParameterDescriptor, startValueParameterDescriptor, countParameterDescriptor, exclusionNoneParameterDescriptor, tweakParameterDescriptor]
    })
    createSequence(length: number, startValue: number, count: number, exclusion: Nullishable<Exclusion>, tweak: Nullishable<number | bigint>): MatrixResult<string, ThrowError, TError> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.iterableResult(() => {
            this.appExtension.validateSequenceCount(count);

            return this.#characterSetCreator.create(length, new Sequence(startValue, count), exclusionOrUndefined, tweakOrUndefined);
        });
    }

    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [valueForSParameterDescriptor, exclusionNoneParameterDescriptor, tweakParameterDescriptor]
    })
    valueFor(matrixSs: Matrix<string>, exclusion: Nullishable<Exclusion>, tweak: Nullishable<number | bigint>): MatrixResult<TBigInt, ThrowError, TError> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.matrixResult(matrixSs, s =>
            this.mapBigInt(this.#characterSetCreator.valueFor(s, exclusionOrUndefined, tweakOrUndefined))
        );
    }
}

@proxy.describeClass(false, {
    methodInfix: "Numeric",
    replacementParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionFirstZeroParameterDescriptor
        }
    ]
})
export class NumericProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, NUMERIC_CREATOR);
    }
}

@proxy.describeClass(false, {
    methodInfix: "Hexadecimal",
    replacementParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAnyParameterDescriptor
        }
    ]
})
export class HexadecimalProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, HEXADECIMAL_CREATOR);
    }
}

@proxy.describeClass(false, {
    methodInfix: "Alphabetic"
})
export class AlphabeticProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, ALPHABETIC_CREATOR);
    }
}

@proxy.describeClass(false, {
    methodInfix: "Alphanumeric",
    replacementParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAnyParameterDescriptor
        }
    ]
})
export class AlphanumericProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, ALPHANUMERIC_CREATOR);
    }
}
