import type { Nullishable } from "@aidc-toolkit/core";
import type { GTINCreator, GTINType } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { Types } from "../descriptor.js";
import { expandParameterDescriptor, proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResult } from "../type.js";
import { valueParameterDescriptor } from "../utility/transformer-descriptor.js";
import { indicatorDigitParameterDescriptor } from "./gtin-descriptor.js";
import { NumericIdentifierCreatorProxy, sparseParameterDescriptor } from "./identifier-creator-proxy.js";
import {
    prefixDefinitionAnyParameterDescriptor,
    prefixDefinitionGS1UPCParameterDescriptor
} from "./prefix-definition-descriptor.js";

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN",
    replacementParameterDescriptors: [
        {
            name: expandParameterDescriptor(prefixDefinitionGS1UPCParameterDescriptor).name,
            replacement: prefixDefinitionAnyParameterDescriptor
        }
    ]
})
export class GTINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, GTINType, GTINCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gtinCreator);
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true,
        parameterDescriptors: [indicatorDigitParameterDescriptor, prefixDefinitionAnyParameterDescriptor, valueParameterDescriptor, sparseParameterDescriptor]
    })
    createGTIN14(indicatorDigit: string, prefixDefinition: Matrix<unknown>, matrixValues: Matrix<number | bigint>, sparse: Nullishable<boolean>): MatrixResult<string, ThrowError, TError> {
        const sparseOrUndefined = sparse ?? undefined;

        return this.setUpMatrixResult(() =>
            this.getCreator(prefixDefinition),
        matrixValues, (creator, value) =>
            creator.createGTIN14(indicatorDigit, value, sparseOrUndefined)
        );
    }
}
