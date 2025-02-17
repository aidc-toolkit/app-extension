import { Sequence, Transformer, transformIterable } from "@aidc-toolkit/utility";
import { type ParameterDescriptor, ProxyClass, ProxyMethod, ProxyParameter, Type } from "../descriptor.js";
import { type ErrorExtends, LibProxy, type Matrix, type MatrixResultError, type ResultError } from "../proxy.js";
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
    name: "transformedValue",
    type: Type.Number,
    isMatrix: true,
    isRequired: true
};

@ProxyClass({
    methodInfix: "Transform"
})
export class TransformerProxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends LibProxy<TBigInt, ThrowError, TError> {
    @ProxyMethod({
        type: Type.Number,
        isMatrix: true
    })
    forward(
        @ProxyParameter(domainParameterDescriptor) domain: number | bigint,
        @ProxyParameter(valueParameterDescriptor) matrixValues: Matrix<number | bigint>,
        @ProxyParameter(tweakParameterDescriptor) tweak?: number | bigint
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
        @ProxyParameter(tweakParameterDescriptor) tweak?: number | bigint
    ): Matrix<ResultError<TBigInt, ThrowError, TError>> {
        return this.mapIterable(() => transformIterable(Transformer.get(domain, tweak ?? undefined).forward(new Sequence(startValue, count)), value => this.mapBigInt(value)));
    }

    @ProxyMethod({
        type: Type.Number,
        isMatrix: true
    })
    reverse(
        @ProxyParameter(domainParameterDescriptor) domain: number | bigint,
        @ProxyParameter(transformedValueParameterDescriptor) matrixTransformedValues: Matrix<number | bigint>,
        @ProxyParameter(tweakParameterDescriptor) tweak?: number | bigint
    ): MatrixResultError<ResultError<TBigInt, ThrowError, TError>, ThrowError, TError> {
        const transformer = Transformer.get(domain, tweak ?? undefined);

        return this.mapMatrix(matrixTransformedValues, transformedValue => this.mapBigInt(transformer.reverse(transformedValue)));
    }
}
