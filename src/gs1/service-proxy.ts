import { isNullish, type Nullishable } from "@aidc-toolkit/core";
import { verifiedByGS1 } from "@aidc-toolkit/gs1";
import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResult } from "../type.js";
import { identifierParameterDescriptor, identifierTypeParameterDescriptor } from "./identifier-descriptor.js";
import { validateIdentifierType } from "./identifier-type.js";

const hyperlinkIdentifierParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "hyperlinkIdentifier"
};

const hyperlinkTextParameterDescriptor: ParameterDescriptor = {
    name: "hyperlinkText",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

const hyperlinkDetailsParameterDescriptor: ParameterDescriptor = {
    name: "hyperlinkDetails",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

@proxy.describeClass(false, {
    namespace: "GS1",
    category: "service"
})
export class ServiceProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.Any,
        multiplicity: Multiplicities.Matrix,
        isAsync: true,
        requiresContext: true,
        parameterDescriptors: [
            identifierTypeParameterDescriptor,
            hyperlinkIdentifierParameterDescriptor,
            hyperlinkTextParameterDescriptor,
            hyperlinkDetailsParameterDescriptor
        ]
    })
    async verifiedByGS1(identifierType: string, matrixIdentifiers: Matrix<string>, text: Nullishable<string>, details: Nullishable<string>, invocationContext: Nullishable<TInvocationContext>): Promise<MatrixResult<unknown, ThrowError, TError>> {
        if (isNullish(invocationContext)) {
            // Application error; no localization necessary.
            throw new Error("Invocation context not provided by application");
        }

        return this.appExtension.mapHyperlinkResults(invocationContext, this.setUpMatrixResult(() =>
            validateIdentifierType(identifierType),
        matrixIdentifiers, (validatedIdentifierType, identifier) =>
            verifiedByGS1(validatedIdentifierType, identifier, text ?? undefined, details ?? undefined)
        ));
    }
}
