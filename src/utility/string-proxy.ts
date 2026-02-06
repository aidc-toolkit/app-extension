import type { StringValidation, StringValidator } from "@aidc-toolkit/utility";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { Matrix } from "../type.js";

@proxy.describeClass(true, {
    category: "string"
})
export abstract class StringProxy extends LibProxy {
    protected validateString<TStringValidation extends StringValidation>(validator: StringValidator<TStringValidation>, matrixSs: Matrix<string>, validation?: TStringValidation): Matrix<string> {
        return this.matrixErrorResult(matrixSs, (s) => {
            validator.validate(s, validation);
        });
    }
}
