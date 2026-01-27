import { Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";

export const indicatorDigitParameterDescriptor: ParameterDescriptor = {
    name: "indicatorDigit",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: true
};
