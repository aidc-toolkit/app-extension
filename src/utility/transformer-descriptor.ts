import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";

export const valueParameterDescriptor: ParameterDescriptor = {
    name: "value",
    type: Types.Number,
    multiplicity: Multiplicities.Matrix,
    isRequired: true
};

export const startValueParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "startValue",
    multiplicity: Multiplicities.Singleton
};

export const countParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "count",
    multiplicity: Multiplicities.Singleton
};

export const tweakParameterDescriptor: ParameterDescriptor = {
    name: "tweak",
    type: Types.Number,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};
