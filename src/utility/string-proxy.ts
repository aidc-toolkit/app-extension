import type { StringValidation, StringValidator } from "@aidc-toolkit/utility";
import { LibProxy } from "../lib-proxy.js";
import type { ErrorExtends, Matrix } from "../type.js";

export abstract class StringProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    protected validateString<TStringValidation extends StringValidation>(validator: StringValidator<TStringValidation>, matrixSs: Matrix<string>, validation?: TStringValidation): Matrix<string> {
        return this.matrixErrorResult(matrixSs, (s) => {
            validator.validate(s, validation);
        });
    }
}
