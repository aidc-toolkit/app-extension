import { VariableMeasure } from "@aidc-toolkit/gs1";
import { Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { Matrix, MatrixResult } from "../type.js";

const rcnFormatParameterDescriptor: ParameterDescriptor = {
    name: "rcnFormat",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: true
};

const rcnParameterDescriptor: ParameterDescriptor = {
    name: "rcn",
    type: Types.String,
    multiplicity: Multiplicities.Array,
    isRequired: true
};

const rcnItemReferenceParameterDescriptor: ParameterDescriptor = {
    name: "rcnItemReference",
    type: Types.Number,
    multiplicity: Multiplicities.Singleton,
    isRequired: true
};

const rcnPriceOrWeightParameterDescriptor: ParameterDescriptor = {
    name: "rcnPriceOrWeight",
    type: Types.Number,
    multiplicity: Multiplicities.Matrix,
    isRequired: true
};

@proxy.describeClass(false, {
    namespace: "GS1",
    category: "variableMeasure"
})
export class VariableMeasureProxy<ThrowError extends boolean> extends LibProxy<ThrowError> {
    @proxy.describeMethod({
        type: Types.Number,
        multiplicity: Multiplicities.Matrix,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnParameterDescriptor]
    })
    parseVariableMeasureRCN(format: string, matrixRCNs: Matrix<string>): MatrixResult<number, ThrowError> {
        return this.arrayResult(matrixRCNs, (rcn) => {
            const rcnReference = VariableMeasure.parseRCN(format, rcn);

            return [rcnReference.itemReference, rcnReference.priceOrWeight];
        });
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Matrix,
        ignoreInfix: true,
        parameterDescriptors: [rcnFormatParameterDescriptor, rcnItemReferenceParameterDescriptor, rcnPriceOrWeightParameterDescriptor]
    })
    createVariableMeasureRCN(format: string, itemReference: number, matrixPricesOrWeights: Matrix<number>): MatrixResult<string, ThrowError> {
        return this.matrixResult(matrixPricesOrWeights, priceOrWeight => VariableMeasure.createRCN(format, itemReference, priceOrWeight));
    }
}
