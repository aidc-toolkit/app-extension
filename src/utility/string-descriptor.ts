import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";

export const sParameterDescriptor: ParameterDescriptor = {
    name: "s",
    type: Types.String,
    multiplicity: Multiplicities.Matrix,
    isRequired: true
};

export const validateSParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: sParameterDescriptor,
    name: "validateS"
};
