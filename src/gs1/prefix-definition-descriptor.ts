import { type ParameterDescriptor, Types } from "../descriptor.js";

const prefixDefinitionParameterDescriptor: ParameterDescriptor = {
    name: "prefixDefinition",
    type: Types.Any,
    isMatrix: true,
    isRequired: true
};

export const prefixDefinitionGS1UPCParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: prefixDefinitionParameterDescriptor,
    name: "prefixDefinitionGS1UPC"
};

export const prefixDefinitionAnyParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: prefixDefinitionParameterDescriptor,
    name: "prefixDefinitionAny"
};
