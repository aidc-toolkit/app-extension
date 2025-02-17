import { type ParameterDescriptor, Type } from "../descriptor.js";

export const valueParameterDescriptor: ParameterDescriptor = {
    name: "value",
    type: Type.Number,
    isMatrix: true,
    isRequired: true
};

export const startValueParameterDescriptor: ParameterDescriptor = {
    name: "startValue",
    type: Type.Number,
    isMatrix: false,
    isRequired: true
};

export const countParameterDescriptor: ParameterDescriptor = {
    name: "count",
    type: Type.Number,
    isMatrix: false,
    isRequired: true
};

export const tweakParameterDescriptor: ParameterDescriptor = {
    name: "tweak",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};
