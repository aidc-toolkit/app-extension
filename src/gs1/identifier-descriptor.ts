import { type ParameterDescriptor, Types } from "../descriptor.js";

export const identifierTypeParameterDescriptor: ParameterDescriptor = {
    name: "identifierType",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

export const identifierParameterDescriptor: ParameterDescriptor = {
    name: "identifier",
    type: Types.String,
    isMatrix: true,
    isRequired: true
};
