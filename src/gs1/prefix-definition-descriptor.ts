import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";

const prefixDefinitionParameterDescriptor: ParameterDescriptor = {
    name: "prefixDefinition",
    type: Types.Any,
    isMatrix: true,
    isRequired: true
};

export const prefixDefinitionGS1UPCParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: prefixDefinitionParameterDescriptor,
    name: "prefixDefinitionGS1UPC"
};

export const prefixDefinitionAnyParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: prefixDefinitionParameterDescriptor,
    name: "prefixDefinitionAny"
};
