import type { Nullishable } from "@aidc-toolkit/core";
import { verifiedByGS1 } from "@aidc-toolkit/gs1";
import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { Matrix, MatrixResult } from "../type.js";
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
export class VerifiedByGS1Proxy extends LibProxy {
    @proxy.describeMethod({
        type: Types.Any,
        multiplicity: Multiplicities.Matrix,
        isAsync: true,
        parameterDescriptors: [
            identifierTypeParameterDescriptor,
            hyperlinkIdentifierParameterDescriptor,
            hyperlinkTextParameterDescriptor,
            hyperlinkDetailsParameterDescriptor
        ]
    })
    async verifiedByGS1(identifierType: string, matrixIdentifiers: Matrix<string>, text: Nullishable<string>, details: Nullishable<string>): Promise<MatrixResult<unknown>> {
        return this.appExtension.mapHyperlinkResults(this.setUpMatrixResult(() =>
            validateIdentifierType(identifierType),
        matrixIdentifiers, (validatedIdentifierType, identifier) =>
            verifiedByGS1(validatedIdentifierType, identifier, text ?? undefined, details ?? undefined)
        ));
    }
}
