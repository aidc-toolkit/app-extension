import { AI39_CREATOR, AI82_CREATOR } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { expandParameterDescriptor, ProxyClass } from "../descriptor.js";
import type { ErrorExtends } from "../types.js";
import { CharacterSetProxy } from "../utility";
import {
    exclusionAllNumericParameterDescriptor,
    exclusionNoneParameterDescriptor
} from "../utility/character-set-descriptor.js";

@ProxyClass({
    namespace: "GS1",
    methodInfix: "AI82",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAllNumericParameterDescriptor
        }
    ]
})
export class AI82Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, AI82_CREATOR);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "AI39",
    replaceParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAllNumericParameterDescriptor
        }
    ]
})
export class AI39Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, AI39_CREATOR);
    }
}
