import type { Nullishable } from "@aidc-toolkit/core";
import { GTINCreator, type GTINType } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { Types } from "../descriptor.js";
import { expandParameterDescriptor, proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError } from "../type.js";
import { valueParameterDescriptor } from "../utility/transformer-descriptor.js";
import {
    indicatorDigitParameterDescriptor,
    rcnFormatParameterDescriptor,
    rcnItemReferenceParameterDescriptor,
    rcnPriceOrWeightParameterDescriptor
} from "./gtin-descriptor.js";
import { NumericIdentifierCreatorProxy, sparseParameterDescriptor } from "./identifier-creator-proxy.js";
import {
    prefixDefinitionAnyParameterDescriptor,
    prefixDefinitionGS1UPCParameterDescriptor
} from "./prefix-definition-descriptor.js";

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GTIN",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(prefixDefinitionGS1UPCParameterDescriptor).name,
            replacement: prefixDefinitionAnyParameterDescriptor
        }
    ]
})
export class GTINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends NumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt, GTINType, GTINCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gtinCreator);
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true,
        parameterDescriptors: [indicatorDigitParameterDescriptor, prefixDefinitionAnyParameterDescriptor, valueParameterDescriptor, sparseParameterDescriptor]
    })
    createGTIN14(indicatorDigit: string, prefixDefinition: Matrix<unknown>, matrixValues: Matrix<number | bigint>, sparse: Nullishable<boolean>): MatrixResultError<string, ThrowError, TError> {
        const creator = this.getCreator(prefixDefinition);

        const sparseOrUndefined = sparse ?? undefined;

        return this.mapMatrix(matrixValues, value => creator.createGTIN14(indicatorDigit, value, sparseOrUndefined));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnItemReferenceParameterDescriptor, rcnPriceOrWeightParameterDescriptor]
    })
    createVariableMeasureRCN(format: string, itemReference: number, matrixPricesOrWeights: Matrix<number>): MatrixResultError<string, ThrowError, TError> {
        return this.mapMatrix(matrixPricesOrWeights, priceOrWeight => GTINCreator.createVariableMeasureRCN(format, itemReference, priceOrWeight));
    }
}
