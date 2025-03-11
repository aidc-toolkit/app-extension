import { Sequence, Transformer, mapIterable } from "@aidc-toolkit/utility";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import type { ErrorExtends, Matrix, MatrixResultError, Nullishable, ResultError } from "../types.js";
import {
    countParameterDescriptor,
    startValueParameterDescriptor,
    tweakParameterDescriptor,
    valueParameterDescriptor
} from "./transformer-descriptor.js";

const domainParameterDescriptor: ParameterDescriptor = {
    name: "domain",
    type: Type.Number,
    isMatrix: false,
    isRequired: true
};

const transformedValueParameterDescriptor: ParameterDescriptor = {
    extendsDescriptor: valueParameterDescriptor,
    name: "transformedValue"
};

@ProxyClass({
    methodInfix: "Transform"
})
export class TransformerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    @ProxyMethod({
        type: Type.Number,
        isMatrix: true
    })
    forward(
        @ProxyParameter(domainParameterDescriptor) domain: number | bigint,
        @ProxyParameter(valueParameterDescriptor) matrixValues: Matrix<number | bigint>,
        @ProxyParameter(tweakParameterDescriptor) tweak: Nullishable<number | bigint>
    ): MatrixResultError<ResultError<TBigInt, ThrowError, TError>, ThrowError, TError> {
        const transformer = Transformer.get(domain, tweak ?? undefined);

        return this.mapMatrix(matrixValues, value => this.mapBigInt(transformer.forward(value)));
    }

    @ProxyMethod({
        infixBefore: "Sequence",
        type: Type.Number,
        isMatrix: true
    })
    forwardSequence(
        @ProxyParameter(domainParameterDescriptor) domain: number | bigint,
        @ProxyParameter(startValueParameterDescriptor) startValue: number,
        @ProxyParameter(countParameterDescriptor) count: number,
        @ProxyParameter(tweakParameterDescriptor) tweak: Nullishable<number | bigint>
    ): Matrix<ResultError<TBigInt, ThrowError, TError>> {
        this.appExtension.validateSequenceCount(count);

        return LibProxy.matrixResult(mapIterable(Transformer.get(domain, tweak ?? undefined).forward(new Sequence(startValue, count)), value => this.mapBigInt(value)));
    }

    @ProxyMethod({
        type: Type.Number,
        isMatrix: true
    })
    reverse(
        @ProxyParameter(domainParameterDescriptor) domain: number | bigint,
        @ProxyParameter(transformedValueParameterDescriptor) matrixTransformedValues: Matrix<number | bigint>,
        @ProxyParameter(tweakParameterDescriptor) tweak: Nullishable<number | bigint>
    ): MatrixResultError<ResultError<TBigInt, ThrowError, TError>, ThrowError, TError> {
        const transformer = Transformer.get(domain, tweak ?? undefined);

        return this.mapMatrix(matrixTransformedValues, transformedValue => this.mapBigInt(transformer.reverse(transformedValue)));
    }
}
