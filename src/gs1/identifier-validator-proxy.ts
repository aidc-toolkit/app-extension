import type { Nullishable } from "@aidc-toolkit/core";
import type {
    GTINType,
    IdentifierType,
    IdentifierTypeValidator,
    NonGTINNumericIdentifierType,
    NonNumericIdentifierType,
    NonNumericIdentifierValidation,
    NonSerializableNumericIdentifierType,
    NumericIdentifierType,
    SerializableNumericIdentifierType
} from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { type ExtendsParameterDescriptor, Multiplicities, Types } from "../descriptor.js";
import { proxy } from "../proxy.js";
import type { Matrix, MatrixResult } from "../type.js";
import { exclusionAllNumericParameterDescriptor } from "../utility/character-set-descriptor.js";
import { StringProxy } from "../utility/string-proxy.js";
import { identifierParameterDescriptor } from "./identifier-descriptor.js";

const validateIdentifierParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    sortOrder: 0,
    name: "validateIdentifier"
};

const splitIdentifierParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    sortOrder: 1,
    name: "splitIdentifier",
    multiplicity: Multiplicities.Array
};

@proxy.describeClass(true, {
    namespace: "GS1",
    category: "identifierValidation"
})
abstract class IdentifierValidatorProxy<ThrowError extends boolean, TIdentifierType extends IdentifierType> extends StringProxy<ThrowError> {
    readonly #validator: IdentifierTypeValidator<TIdentifierType>;

    constructor(appExtension: AppExtension<ThrowError>, validator: IdentifierTypeValidator<TIdentifierType>) {
        super(appExtension);

        this.#validator = validator;
    }

    protected get validator(): IdentifierTypeValidator<TIdentifierType> {
        return this.#validator;
    }
}

@proxy.describeClass(true)
abstract class NumericIdentifierValidatorProxy<ThrowError extends boolean, TNumericIdentifierType extends NumericIdentifierType> extends IdentifierValidatorProxy<ThrowError, TNumericIdentifierType> {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [validateIdentifierParameterDescriptor]
    })
    validate(matrixIdentifiers: Matrix<string>): Matrix<string> {
        return this.validateString(this.validator, matrixIdentifiers);
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [validateIdentifierParameterDescriptor]
    })
    isValid(matrixIdentifiers: Matrix<string>): Matrix<boolean> {
        return this.isValidString(this.validate(matrixIdentifiers));
    }
}

export abstract class GTINValidatorProxy<ThrowError extends boolean> extends NumericIdentifierValidatorProxy<ThrowError, GTINType> {
}

abstract class NonGTINNumericIdentifierValidatorProxy<ThrowError extends boolean, TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType = NonGTINNumericIdentifierType> extends NumericIdentifierValidatorProxy<ThrowError, TNonGTINNumericIdentifierType> {
}

export abstract class NonSerializableNumericIdentifierValidatorProxy<ThrowError extends boolean> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, NonSerializableNumericIdentifierType> {
}

@proxy.describeClass(true)
export abstract class SerializableNumericIdentifierValidatorProxy<ThrowError extends boolean> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, SerializableNumericIdentifierType> {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [splitIdentifierParameterDescriptor]
    })
    split(matrixIdentifiers: Matrix<string>): MatrixResult<string, ThrowError> {
        return this.arrayResult(matrixIdentifiers, (identifier) => {
            const serializableNumericIdentifierSplit = this.validator.split(identifier);

            return [serializableNumericIdentifierSplit.baseIdentifier, serializableNumericIdentifierSplit.serialComponent];
        });
    }
}

@proxy.describeClass(true)
export abstract class NonNumericIdentifierValidatorProxy<ThrowError extends boolean> extends IdentifierValidatorProxy<ThrowError, NonNumericIdentifierType> {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [validateIdentifierParameterDescriptor, exclusionAllNumericParameterDescriptor]
    })
    validate(matrixIdentifiers: Matrix<string>, exclusion: Nullishable<NonNumericIdentifierValidation["exclusion"]>): Matrix<string> {
        return this.validateString(this.validator, matrixIdentifiers, {
            exclusion: exclusion ?? undefined
        } satisfies NonNumericIdentifierValidation);
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [validateIdentifierParameterDescriptor, exclusionAllNumericParameterDescriptor]
    })
    isValid(matrixIdentifiers: Matrix<string>, exclusion: Nullishable<NonNumericIdentifierValidation["exclusion"]>): Matrix<boolean> {
        return this.isValidString(this.validate(matrixIdentifiers, exclusion));
    }
}
