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
import { type ExtendsParameterDescriptor, Types } from "../descriptor.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../type.js";
import { exclusionAllNumericParameterDescriptor } from "../utility/character-set-descriptor.js";
import { StringProxy } from "../utility/string-proxy.js";
import { identifierParameterDescriptor } from "./identifier-descriptor.js";

const validateIdentifierParameterDescriptor: ExtendsParameterDescriptor = {
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

export abstract class GTINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, GTINType> {
}

abstract class NonGTINNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType = NonGTINNumericIdentifierType> extends NumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, TNonGTINNumericIdentifierType> {
}

export abstract class NonSerializableNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonSerializableNumericIdentifierType> {
}

export abstract class SerializableNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NonGTINNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, SerializableNumericIdentifierType> {
}

@proxy.describeClass(true, {
    namespace: "GS1"
})
export abstract class NonNumericIdentifierValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends IdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt, NonNumericIdentifierType> {
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
