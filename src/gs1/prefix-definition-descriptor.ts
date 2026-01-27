import { type ExtendsParameterDescriptor, Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";

const prefixDefinitionParameterDescriptor: ParameterDescriptor = {
    name: "prefixDefinition",
    type: Types.Any,
    multiplicity: Multiplicities.SingletonArray,
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
