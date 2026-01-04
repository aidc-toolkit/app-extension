import type { Nullishable } from "@aidc-toolkit/core";
import { RegExpValidator } from "@aidc-toolkit/utility";
import { type ParameterDescriptor, Types } from "../descriptor.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix } from "../type.js";
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

@proxy.describeClass(false, {
    methodInfix: "RegExp"
})
export class RegExpProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends StringProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        parameterDescriptors: [regExpParameterDescriptor, validateSParameterDescriptor, errorMessageParameterDescriptor]
    })
    validate(regExp: string, matrixSs: Matrix<string>, errorMessage: Nullishable<string>): Matrix<string> {
        return this.validateString(new class extends RegExpValidator {
            protected override createErrorMessage(s: string): string {
                // Replace {{s}} with the invalid string.
                return errorMessage?.replace(/\{\{s}}/g, s) ?? super.createErrorMessage(s);
            }
        }(new RegExp(regExp)), matrixSs);
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        isMatrix: true,
        parameterDescriptors: [regExpParameterDescriptor, validateSParameterDescriptor]
    })
    isValid(regExp: string, matrixSs: Matrix<string>): Matrix<boolean> {
        return this.isValidString(this.validate(regExp, matrixSs, undefined));
    }
}
