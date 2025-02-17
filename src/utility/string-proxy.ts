import type { StringValidation, StringValidator } from "@aidc-toolkit/utility";
import { LibProxy, type ErrorExtends, type Matrix, type MatrixResultError } from "../proxy.js";

export abstract class StringProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends LibProxy<TBigInt, ThrowError, TError> {
    protected validateString<TStringValidation extends StringValidation>(validator: StringValidator<TStringValidation>, matrixSs: Matrix<string>, validation?: TStringValidation): Matrix<string> {
        return this.mapMatrixVoid(matrixSs, (s) => {
            validator.validate(s, validation);
        });
    }

    protected isValidString(matrixValidateResults: MatrixResultError<string, ThrowError, TError>): MatrixResultError<boolean, ThrowError, TError> {
        return this.mapMatrix(matrixValidateResults, validateResult => validateResult === "");
    }
}
