import { VariableMeasure } from "@aidc-toolkit/gs1";
import { type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResult } from "../type.js";

const rcnFormatParameterDescriptor: ParameterDescriptor = {
    name: "rcnFormat",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

const rcnParameterDescriptor: ParameterDescriptor = {
    name: "rcn",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

const rcnItemReferenceParameterDescriptor: ParameterDescriptor = {
    name: "rcnItemReference",
    type: Types.Number,
    isMatrix: false,
    isRequired: true
};

const rcnPriceOrWeightParameterDescriptor: ParameterDescriptor = {
    name: "rcnPriceOrWeight",
    type: Types.Number,
    isMatrix: true,
    isRequired: true
};

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class VariableMeasureProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnParameterDescriptor]
    })
    parseVariableMeasureRCN(format: string, matrixRCNs: Matrix<string>): MatrixResult<number, ThrowError, TError> {
        return this.arrayResult(matrixRCNs, (rcn) => {
            const rcnReference = VariableMeasure.parseRCN(format, rcn);

            return [rcnReference.itemReference, rcnReference.priceOrWeight];
        });
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: true,
        ignoreInfix: true,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnItemReferenceParameterDescriptor, rcnPriceOrWeightParameterDescriptor]
    })
    createVariableMeasureRCN(format: string, itemReference: number, matrixPricesOrWeights: Matrix<number>): MatrixResult<string, ThrowError, TError> {
        return this.matrixResult(matrixPricesOrWeights, priceOrWeight => VariableMeasure.createRCN(format, itemReference, priceOrWeight));
    }
}
