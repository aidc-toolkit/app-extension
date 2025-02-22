import { type ParameterDescriptor, Type } from "../descriptor.js";

export const valueParameterDescriptor: ParameterDescriptor = {
    name: "value",
    type: Type.Number,
    isMatrix: true,
    isRequired: true
};

export const startValueParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "startValue",
    isMatrix: false
};

export const countParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "count",
    isMatrix: false
};

export const tweakParameterDescriptor: ParameterDescriptor = {
    name: "tweak",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};
