import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";

const exclusionParameterDescriptor: ParameterDescriptor = {
    name: "exclusion",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};

export const exclusionNoneParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 0,
    name: "exclusionNone"
};

export const exclusionFirstZeroParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 1,
    name: "exclusionFirstZero"
};

export const exclusionAllNumericParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 2,
    name: "exclusionAllNumeric"
};

export const exclusionAnyParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: exclusionParameterDescriptor,
    sortOrder: 3,
    name: "exclusionAny"
};
