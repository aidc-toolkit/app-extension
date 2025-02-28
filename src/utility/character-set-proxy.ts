import {
    ALPHABETIC_CREATOR,
    ALPHANUMERIC_CREATOR,
    type CharacterSetCreator,
    type CharacterSetValidation,
    type Exclusion,
    HEXADECIMAL_CREATOR,
    NUMERIC_CREATOR,
    Sequence
} from "@aidc-toolkit/utility";
import type { AppExtension } from "../app-extension.js";
import {
    expandParameterDescriptor,
    type ParameterDescriptor,
    ProxyClass,
    ProxyMethod,
    ProxyParameter,
    Type
} from "../descriptor.js";
import type { ErrorExtends, Matrix, MatrixResultError, Nullishable, ResultError } from "../types.js";
import {
    exclusionAnyParameterDescriptor,
    exclusionFirstZeroParameterDescriptor,
    exclusionNoneParameterDescriptor
} from "./character-set-descriptor.js";
import { validateSParameterDescriptor } from "./string-descriptor.js";
import { StringProxy } from "./string-proxy.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    tweakParameterDescriptor,
    valueParameterDescriptor
} from "./transformer-descriptor.js";

const lengthParameterDescriptor: ParameterDescriptor = {
    name: "length",
    type: Type.Number,
    isMatrix: false,
    isRequired: true
};

const valueForSParameterDescriptor: ParameterDescriptor = {
    name: "valueForS",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

export abstract class CharacterSetProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends StringProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    private readonly _characterSetCreator: CharacterSetCreator;

    protected constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, characterSetCreator: CharacterSetCreator) {
        super(appExtension);

        this._characterSetCreator = characterSetCreator;
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    validate(
        @ProxyParameter(validateSParameterDescriptor) matrixSs: Matrix<string>,
        @ProxyParameter(exclusionNoneParameterDescriptor) exclusion: Nullishable<Exclusion>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(this._characterSetCreator, matrixSs, {
            exclusion: exclusion ?? undefined
        } satisfies CharacterSetValidation);
    }

    @ProxyMethod({
        type: Type.Boolean,
        isMatrix: true
    })
    isValid(
        @ProxyParameter(validateSParameterDescriptor) matrixSs: Matrix<string>,
        @ProxyParameter(exclusionNoneParameterDescriptor) exclusion: Nullishable<Exclusion>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.isValidString(this.validate(matrixSs, exclusion));
    }

    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    create(
        @ProxyParameter(lengthParameterDescriptor) length: number,
        @ProxyParameter(valueParameterDescriptor) matrixValues: Matrix<number | bigint>,
        @ProxyParameter(exclusionNoneParameterDescriptor) exclusion: Nullishable<Exclusion>,
        @ProxyParameter(tweakParameterDescriptor) tweak?: number | bigint
    ): MatrixResultError<string, ThrowError, TError> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.mapMatrix(matrixValues, value => this._characterSetCreator.create(length, value, exclusionOrUndefined, tweakOrUndefined));
    }

    @ProxyMethod({
        infixBefore: "Sequence",
        type: Type.String,
        isMatrix: true
    })
    createSequence(
        @ProxyParameter(lengthParameterDescriptor) length: number,
        @ProxyParameter(startValueParameterDescriptor) startValue: number,
        @ProxyParameter(countParameterDescriptor) count: number,
        @ProxyParameter(exclusionNoneParameterDescriptor) exclusion: Nullishable<Exclusion>,
        @ProxyParameter(tweakParameterDescriptor) tweak?: number | bigint
    ): Matrix<string> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.mapIterable(() => this._characterSetCreator.create(length, new Sequence(startValue, count), exclusionOrUndefined, tweakOrUndefined));
    }

    @ProxyMethod({
        type: Type.Number,
        isMatrix: true
    })
    valueFor(
        @ProxyParameter(valueForSParameterDescriptor) matrixSs: Matrix<string>,
        @ProxyParameter(exclusionNoneParameterDescriptor) exclusion: Nullishable<Exclusion>,
        @ProxyParameter(tweakParameterDescriptor) tweak?: number | bigint
    ): MatrixResultError<ResultError<TBigInt, ThrowError, TError>, ThrowError, TError> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.mapMatrix(matrixSs, s => this.mapBigInt(this._characterSetCreator.valueFor(s, exclusionOrUndefined, tweakOrUndefined)));
    }
}

@ProxyClass({
    methodInfix: "Numeric",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionFirstZeroParameterDescriptor
        }
    ]
})
export class NumericProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, NUMERIC_CREATOR);
    }
}

@ProxyClass({
    methodInfix: "Hexadecimal",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAnyParameterDescriptor
        }
    ]
})
export class HexadecimalProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, HEXADECIMAL_CREATOR);
    }
}

@ProxyClass({
    methodInfix: "Alphabetic"
})
export class AlphabeticProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, ALPHABETIC_CREATOR);
    }
}

@ProxyClass({
    methodInfix: "Alphanumeric",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAnyParameterDescriptor
        }
    ]
})
export class AlphanumericProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, ALPHANUMERIC_CREATOR);
    }
}
