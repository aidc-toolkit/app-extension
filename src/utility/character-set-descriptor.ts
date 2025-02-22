import { type ParameterDescriptor, Type } from "../descriptor.js";

const exclusionParameterDescriptor: ParameterDescriptor = {
    name: "exclusion",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};

export const exclusionNoneParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    name: "exclusionNone"
};

export const exclusionFirstZeroParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    name: "exclusionFirstZero"
};

export const exclusionAllNumericParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    name: "exclusionAllNumeric"
};

export const exclusionAnyParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    name: "exclusionAny"
};
