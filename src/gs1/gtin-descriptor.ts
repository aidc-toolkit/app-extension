import { type ParameterDescriptor, Types } from "../descriptor.js";

export const indicatorDigitParameterDescriptor: ParameterDescriptor = {
    name: "indicatorDigit",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

export const rcnFormatParameterDescriptor: ParameterDescriptor = {
    name: "rcnFormat",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

export const rcnItemReferenceParameterDescriptor: ParameterDescriptor = {
    name: "rcnItemReference",
    type: Types.Number,
    isMatrix: false,
    isRequired: true
};

export const rcnPriceOrWeightParameterDescriptor: ParameterDescriptor = {
    name: "rcnPriceOrWeight",
    type: Types.Number,
    isMatrix: true,
    isRequired: true
};
