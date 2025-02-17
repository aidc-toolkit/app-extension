import { AI39_CREATOR, AI82_CREATOR } from "@aidc-toolkit/gs1";
import { ProxyClass } from "../descriptor.js";
import type { AppProxy, ErrorExtends } from "../proxy.js";
import {
    exclusionAllNumericParameterDescriptor,
    exclusionNoneParameterDescriptor
} from "../utility/character-set-descriptor.js";
import { CharacterSetProxy } from "../utility/character-set-proxy.js";

@ProxyClass({
    methodInfix: "AI82",
    replaceParameterDescriptors: [
        {
            name: exclusionNoneParameterDescriptor.name,
            replacement: exclusionAllNumericParameterDescriptor
        }
    ]
})
export class AI82Proxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends CharacterSetProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, AI82_CREATOR);
    }
}

@ProxyClass({
    methodInfix: "AI39",
    replaceParameterDescriptors: [
        {
            name: exclusionNoneParameterDescriptor.name,
            replacement: exclusionAllNumericParameterDescriptor
        }
    ]
})
export class AI39Proxy<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>> extends CharacterSetProxy<TBigInt, ThrowError, TError> {
    constructor(appProxy: AppProxy<TBigInt, ThrowError, TError>) {
        super(appProxy, AI39_CREATOR);
    }
}
