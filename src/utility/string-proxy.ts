import type { StringValidation, StringValidator } from "@aidc-toolkit/utility";
import { LibProxy } from "../lib-proxy.js";
import type { ErrorExtends, Matrix, MatrixResult } from "../type.js";

export abstract class StringProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    protected validateString<TStringValidation extends StringValidation>(validator: StringValidator<TStringValidation>, matrixSs: Matrix<string>, validation?: TStringValidation): Matrix<string> {
        return this.matrixErrorResult(matrixSs, (s) => {
            validator.validate(s, validation);
        });
    }

    protected isValidString(matrixValidateResults: MatrixResult<string, ThrowError, TError>): Matrix<boolean> {
        return this.matrixResultNoError(matrixValidateResults, validateResult => validateResult === "");
    }
}
