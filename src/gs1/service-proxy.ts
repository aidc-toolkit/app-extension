import { isNullish, type Nullishable } from "@aidc-toolkit/core";
import { type IdentifierType, IdentifierTypes, verifiedByGS1 } from "@aidc-toolkit/gs1";
import { type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { i18nextAppExtension } from "../locale/i18n.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../type.js";

const identifierTypeParameterDescriptor: ParameterDescriptor = {
    name: "identifierType",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

const identifierParameterDescriptor: ParameterDescriptor = {
    name: "identifier",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

const hyperlinkTextParameterDescriptor: ParameterDescriptor = {
    name: "hyperlinkText",
    type: Types.String,
    isMatrix: false,
    isRequired: false
};

const hyperlinkDetailsParameterDescriptor: ParameterDescriptor = {
    name: "hyperlinkDetails",
    type: Types.String,
    isMatrix: false,
    isRequired: false
};

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class ServiceProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    static #validateIdentifierType(identifierType: string): IdentifierType {
        if (!(identifierType in IdentifierTypes)) {
            throw new RangeError(i18nextAppExtension.t("ServiceProxy.invalidIdentifierType", {
                identifierType
            }));
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type is known.
        return identifierType as IdentifierType;
    }

    @proxy.describeMethod({
        type: Types.Any,
        isMatrix: true,
        requiresContext: true,
        parameterDescriptors: [
            identifierTypeParameterDescriptor,
            identifierParameterDescriptor,
            hyperlinkTextParameterDescriptor,
            hyperlinkDetailsParameterDescriptor
        ]
    })
    async verifiedByGS1(identifierType: string, matrixIdentifiers: Matrix<string>, text: Nullishable<string>, details: Nullishable<string>, invocationContext: Nullishable<TInvocationContext>): Promise<MatrixResultError<unknown, ThrowError, TError>> {
        if (isNullish(invocationContext)) {
            // Application error; no localization necessary.
            throw new Error("Invocation context not provided by application");
        }

        const validatedIdentifierType = ServiceProxy.#validateIdentifierType(identifierType);

        return this.appExtension.mapHyperlinkResults(invocationContext, this.mapMatrix(matrixIdentifiers, identifier => verifiedByGS1(validatedIdentifierType, identifier, text ?? undefined, details ?? undefined)));
    }
}
