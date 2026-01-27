import { Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";

export const identifierTypeParameterDescriptor: ParameterDescriptor = {
    name: "identifierType",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: true
};

export const identifierParameterDescriptor: ParameterDescriptor = {
    name: "identifier",
    type: Types.String,
    multiplicity: Multiplicities.Matrix,
    isRequired: true
};
