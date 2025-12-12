import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";

export const valueParameterDescriptor: ParameterDescriptor = {
    name: "value",
    type: Types.Number,
    isMatrix: true,
    isRequired: true
};

export const startValueParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "startValue",
    isMatrix: false
};

export const countParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "count",
    isMatrix: false
};

export const tweakParameterDescriptor: ParameterDescriptor = {
    name: "tweak",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};
