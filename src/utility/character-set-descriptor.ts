import { type ParameterDescriptor, Type } from "../descriptor.js";

const exclusionParameterDescriptor: ParameterDescriptor = {
    name: "exclusion",
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};

export const exclusionNoneParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 0,
    name: "exclusionNone"
};

export const exclusionFirstZeroParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 1,
    name: "exclusionFirstZero"
};

export const exclusionAllNumericParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 2,
    name: "exclusionAllNumeric"
};

export const exclusionAnyParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 3,
    name: "exclusionAny"
};
