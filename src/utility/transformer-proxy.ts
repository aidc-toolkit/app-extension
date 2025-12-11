import type { Nullishable } from "@aidc-toolkit/core";
import { mapIterable, Sequence, Transformer } from "@aidc-toolkit/utility";
import { type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError, ResultError } from "../type.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    tweakParameterDescriptor,
    valueParameterDescriptor
} from "./transformer-descriptor.js";

const domainParameterDescriptor: ParameterDescriptor = {
    name: "domain",
    type: Types.Number,
    isMatrix: false,
    isRequired: true
};

const transformedValueParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "transformedValue"
};

@proxy.describeClass(false, {
    methodInfix: "Transform"
})
export class TransformerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [domainParameterDescriptor, valueParameterDescriptor, tweakParameterDescriptor]
    })
    forward(domain: number | bigint, matrixValues: Matrix<number | bigint>, tweak: Nullishable<number | bigint>): MatrixResultError<ResultError<TBigInt, ThrowError, TError>, ThrowError, TError> {
        const transformer = Transformer.get(domain, tweak ?? undefined);

        return this.mapMatrix(matrixValues, value => this.mapBigInt(transformer.forward(value)));
    }

    @proxy.describeMethod({
        infixBefore: "Sequence",
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [domainParameterDescriptor, startValueParameterDescriptor, countParameterDescriptor, tweakParameterDescriptor]
    })
    forwardSequence(domain: number | bigint, startValue: number, count: number, tweak: Nullishable<number | bigint>): Matrix<ResultError<TBigInt, ThrowError, TError>> {
        this.appExtension.validateSequenceCount(count);

        return LibProxy.matrixResult(mapIterable(Transformer.get(domain, tweak ?? undefined).forward(new Sequence(startValue, count)), value => this.mapBigInt(value)));
    }

    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [domainParameterDescriptor, transformedValueParameterDescriptor, tweakParameterDescriptor]
    })
    reverse(domain: number | bigint, matrixTransformedValues: Matrix<number | bigint>, tweak: Nullishable<number | bigint>): MatrixResultError<ResultError<TBigInt, ThrowError, TError>, ThrowError, TError> {
        const transformer = Transformer.get(domain, tweak ?? undefined);

        return this.mapMatrix(matrixTransformedValues, transformedValue => this.mapBigInt(transformer.reverse(transformedValue)));
    }
}
