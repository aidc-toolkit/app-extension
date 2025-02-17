import { type ParameterDescriptor, Type } from "../descriptor.js";

const exclusionParameterDescriptor: Pick<ParameterDescriptor, "type" | "isMatrix" | "isRequired"> = {
    type: Type.Number,
    isMatrix: false,
    isRequired: false
};

export const exclusionNoneParameterDescriptor: ParameterDescriptor = {
    name: "exclusionNone",
    ...exclusionParameterDescriptor
};

export const exclusionFirstZeroParameterDescriptor: ParameterDescriptor = {
    name: "exclusionFirstZero",
    ...exclusionParameterDescriptor
};

export const exclusionAllNumericParameterDescriptor: ParameterDescriptor = {
    name: "exclusionAllNumeric",
    ...exclusionParameterDescriptor
};

export const exclusionAnyParameterDescriptor: ParameterDescriptor = {
    name: "exclusionAny",
    ...exclusionParameterDescriptor
};
