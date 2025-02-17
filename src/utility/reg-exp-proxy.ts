import { RegExpValidator } from "@aidc-toolkit/utility";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "../descriptor.js";
import type { ErrorExtends, MatrixResultError, Matrix } from "../proxy.js";
import { validateSParameterDescriptor } from "./string-descriptor.js";
import { StringProxy } from "./string-proxy.js";

const regExpParameterDescriptor: ParameterDescriptor = {
    name: "regExp",
    type: Type.String,
    isMatrix: false,
    isRequired: true
};

const errorMessageParameterDescriptor: ParameterDescriptor = {
    name: "errorMessage",
    type: Type.String,
    isMatrix: false,
    isRequired: false
};

@ProxyClass({
    methodInfix: "RegExp"
})
export class RegExpProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends StringProxy<TBigInt, ThrowError, TError> {
    @ProxyMethod({
        type: Type.String,
        isMatrix: true
    })
    validate(
        @ProxyParameter(regExpParameterDescriptor) regExp: string,
        @ProxyParameter(validateSParameterDescriptor) matrixSs: Matrix<string>,
        @ProxyParameter(errorMessageParameterDescriptor) errorMessage?: string
    ): MatrixResultError<string, ThrowError, TError> {
        return this.validateString(new class extends RegExpValidator {
            protected override createErrorMessage(s: string): string {
                return errorMessage ?? super.createErrorMessage(s);
            }
        }(new RegExp(regExp)), matrixSs);
    }

    @ProxyMethod({
        type: Type.Boolean,
        isMatrix: true
    })
    isValid(
        @ProxyParameter(regExpParameterDescriptor) regExp: string,
        @ProxyParameter(validateSParameterDescriptor) matrixSs: Matrix<string>
    ): MatrixResultError<boolean, ThrowError, TError> {
        return this.isValidString(this.validate(regExp, matrixSs));
    }
}
