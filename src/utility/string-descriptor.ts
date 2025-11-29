import { type ParameterDescriptor, Types } from "../descriptor";

export const sParameterDescriptor: ParameterDescriptor = {
    name: "s",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};

export const validateSParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: sParameterDescriptor,
    name: "validateS"
};
