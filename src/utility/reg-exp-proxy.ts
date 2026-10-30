import type { Nullishable } from "@aidc-toolkit/core";
import { RegExpValidator } from "@aidc-toolkit/utility";
import { Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { proxy } from "../proxy.js";
import type { Matrix } from "../type.js";
import { validateSParameterDescriptor } from "./string-descriptor.js";
import { StringProxy } from "./string-proxy.js";

const regExpParameterDescriptor: ParameterDescriptor = {
    name: "regExp",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: true
};

const errorMessageParameterDescriptor: ParameterDescriptor = {
    name: "errorMessage",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

@proxy.describeClass(false, {
    methodInfix: "RegExp"
})
export class RegExpProxy extends StringProxy {
    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [regExpParameterDescriptor, validateSParameterDescriptor, errorMessageParameterDescriptor]
    })
    validate(regExp: string, matrixSs: Matrix<string>, errorMessage: Nullishable<string>): Matrix<string> {
        return this.validateString(new class extends RegExpValidator {
            protected override createErrorMessage(s: string): string {
                // Replace {{s}} with the invalid string.
                return errorMessage?.replace(/\{\{s\}\}/ug, s) ?? super.createErrorMessage(s);
            }
        }(new RegExp(regExp, "u")), matrixSs);
    }

    @proxy.describeMethod({
        type: Types.Boolean,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [regExpParameterDescriptor, validateSParameterDescriptor]
    })
    isValid(regExp: string, matrixSs: Matrix<string>): Matrix<boolean> {
        return this.isValidString(this.validate(regExp, matrixSs, undefined));
    }
}
