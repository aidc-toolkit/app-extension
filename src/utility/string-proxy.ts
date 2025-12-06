import type { StringValidation, StringValidator } from "@aidc-toolkit/utility";
import { LibProxy } from "../lib-proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../type.js";

export abstract class StringProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    protected validateString<TStringValidation extends StringValidation>(validator: StringValidator<TStringValidation>, matrixSs: Matrix<string>, validation?: TStringValidation): Matrix<string> {
        return LibProxy.mapMatrixRangeError(matrixSs, (s) => {
            validator.validate(s, validation);
        });
    }

    protected isValidString(matrixValidateResults: MatrixResultError<string, ThrowError, TError>): MatrixResultError<boolean, ThrowError, TError> {
        return this.mapMatrix(matrixValidateResults, validateResult => validateResult === "");
    }
}
