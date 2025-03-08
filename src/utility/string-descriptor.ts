import { type ParameterDescriptor, Type } from "../descriptor.js";

export const sParameterDescriptor: ParameterDescriptor = {
    name: "s",
    type: Type.String,
    isMatrix: true,
    isRequired: true
};

export const validateSParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: sParameterDescriptor,
    name: "validateS"
};
