import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";

export const sParameterDescriptor: ParameterDescriptor = {
    name: "s",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

export const validateSParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: sParameterDescriptor,
    name: "validateS"
};
