import type { Nullishable } from "@aidc-toolkit/core";
import { RegExpValidator } from "@aidc-toolkit/utility";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Types } from "../descriptor.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../type.js";
import { validateSParameterDescriptor } from "./string-descriptor.js";
import { StringProxy } from "./string-proxy.js";

const regExpParameterDescriptor: ParameterDescriptor = {
    name: "regExp",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

const errorMessageParameterDescriptor: ParameterDescriptor = {
    name: "errorMessage",
    type: Types.String,
    isMatrix: false,
    isRequired: false
};

@ProxyClass({
    methodInfix: "RegExp"
})
export class RegExpProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends StringProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Types.String,
        isMatrix: true
    })
    validate(
        @ProxyParameter(regExpParameterDescriptor) regExp: string,
        @ProxyParameter(validateSParameterDescriptor) matrixSs: Matrix<string>,
        @ProxyParameter(errorMessageParameterDescriptor) errorMessage: Nullishable<string>
    ): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(new class extends RegExpValidator {
            protected override createErrorMessage(s: string): string {
                return errorMessage ?? super.createErrorMessage(s);
            }
        }(new RegExp(regExp)), matrixSs);
    }

    @ProxyMethod({
        type: Types.Boolean,
        isMatrix: true
    })
    isValid(
        @ProxyParameter(regExpParameterDescriptor) regExp: string,
        @ProxyParameter(validateSParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.isValidString(this.validate(regExp, matrixSs, undefined));
    }
}
