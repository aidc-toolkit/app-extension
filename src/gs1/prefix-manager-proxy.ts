import type { Nullishable } from "@aidc-toolkit/core";
import type { PrefixType } from "@aidc-toolkit/gs1";
import { Multiplicities, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix } from "../type.js";

const prefixParameterDescriptor: ParameterDescriptor = {
    name: "prefix",
    type: Types.String,
    multiplicity: Multiplicities.Singleton,
    isRequired: true
};

const prefixTypeParameterDescriptor: ParameterDescriptor = {
    name: "prefixType",
    type: Types.Number,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

const tweakFactorParameterDescriptor: ParameterDescriptor = {
    name: "tweakFactor",
    type: Types.Number,
    multiplicity: Multiplicities.Singleton,
    isRequired: false
};

@proxy.describeClass(false, {
    namespace: "GS1",
    category: "prefix"
})
export class PrefixManagerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.Any,
        multiplicity: Multiplicities.SingletonArray,
        parameterDescriptors: [prefixParameterDescriptor, prefixTypeParameterDescriptor, tweakFactorParameterDescriptor]
    })
    definePrefix(prefix: string, prefixType: Nullishable<PrefixType>, tweakFactor: Nullishable<number>): Matrix<unknown> {
        // Parameters will be validated by IdentifierCreatorProxy.getCreator().
        return [[prefix, prefixType, tweakFactor]];
    }
}
