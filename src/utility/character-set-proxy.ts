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
import type { AppExtensionBigInt } from "../app-extension-options.js";
import type { AppExtension } from "../app-extension.js";
import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { expandParameterDescriptor, proxy } from "../proxy.js";
import type { Matrix, MatrixResult } from "../type.js";
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
    multiplicity: Multiplicities.Singleton,
    isRequired: true
};

const valueForSParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: sParameterDescriptor,
    name: "valueForS"
};

@proxy.describeClass(true)
export abstract class CharacterSetValidatorProxy<ThrowError extends boolean> extends StringProxy<ThrowError> {
    readonly #characterSetValidator: CharacterSetValidator;

    constructor(appExtension: AppExtension<ThrowError>, characterSetValidator: CharacterSetValidator) {
        super(appExtension);

        this.#characterSetValidator = characterSetValidator;
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [validateSParameterDescriptor, exclusionNoneParameterDescriptor]
    })
    validate(matrixSs: Matrix<string>, exclusion: Nullishable<Exclusion>): Matrix<string> {
        return this.validateString(this.#characterSetValidator, matrixSs, {
            exclusion: exclusion ?? undefined
        } satisfies CharacterSetValidation);
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [validateSParameterDescriptor, exclusionNoneParameterDescriptor]
    })
    isValid(matrixSs: Matrix<string>, exclusion: Nullishable<Exclusion>): Matrix<boolean> {
        return this.isValidString(this.validate(matrixSs, exclusion));
    }
}

@proxy.describeClass(true)
export abstract class CharacterSetCreatorProxy<ThrowError extends boolean> extends CharacterSetValidatorProxy<ThrowError> {
    readonly #characterSetCreator: CharacterSetCreator;

    constructor(appExtension: AppExtension<ThrowError>, characterSetCreator: CharacterSetCreator) {
        super(appExtension, characterSetCreator);

        this.#characterSetCreator = characterSetCreator;
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [lengthParameterDescriptor, valueParameterDescriptor, exclusionNoneParameterDescriptor, tweakParameterDescriptor]
    })
    create(length: number, matrixValues: Matrix<number | bigint>, exclusion: Nullishable<Exclusion>, tweak: Nullishable<number | bigint>): MatrixResult<string, ThrowError> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.matrixResult(matrixValues, value =>
            this.#characterSetCreator.create(length, value, exclusionOrUndefined, tweakOrUndefined)
        );
    }

    @proxy.describeMethod({
        infixBefore: "Sequence",
        type: Types.String,
        multiplicity: Multiplicities.Array,
        parameterDescriptors: [lengthParameterDescriptor, startValueParameterDescriptor, countParameterDescriptor, exclusionNoneParameterDescriptor, tweakParameterDescriptor]
    })
    createSequence(length: number, startValue: number, count: number, exclusion: Nullishable<Exclusion>, tweak: Nullishable<number | bigint>): MatrixResult<string, ThrowError> {
        const exclusionOrUndefined = exclusion ?? undefined;
        const tweakOrUndefined = tweak ?? undefined;

        return this.iterableResult(() => {
            this.appExtension.validateSequenceCount(count);

            return this.#characterSetCreator.create(length, new Sequence(startValue, count), exclusionOrUndefined, tweakOrUndefined);
        });
    }

    @proxy.describeMethod({
        type: Types.Number,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [valueForSParameterDescriptor, exclusionNoneParameterDescriptor, tweakParameterDescriptor]
    })
    valueFor(matrixSs: Matrix<string>, exclusion: Nullishable<Exclusion>, tweak: Nullishable<number | bigint>): MatrixResult<AppExtensionBigInt, ThrowError> {
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
export class NumericProxy<ThrowError extends boolean> extends CharacterSetCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
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
export class HexadecimalProxy<ThrowError extends boolean> extends CharacterSetCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, HEXADECIMAL_CREATOR);
    }
}

@proxy.describeClass(false, {
    methodInfix: "Alphabetic"
})
export class AlphabeticProxy<ThrowError extends boolean> extends CharacterSetCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
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
export class AlphanumericProxy<ThrowError extends boolean> extends CharacterSetCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, ALPHANUMERIC_CREATOR);
    }
}
