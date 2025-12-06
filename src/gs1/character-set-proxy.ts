import { AI39_CREATOR, AI64_VALIDATOR, AI82_CREATOR } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { expandParameterDescriptor, ProxyClass } from "../descriptor.js";
import type { ErrorExtends } from "../type.js";
import { CharacterSetCreatorProxy, CharacterSetValidatorProxy } from "../utility/index.js";
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
export class AI82Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
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
export class AI39Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, AI39_CREATOR);
    }
}

@ProxyClass({
    namespace: "GS1",
    methodInfix: "AI64"
})
export class AI64Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt> extends CharacterSetValidatorProxy<ThrowError, TError, TInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) {
        super(appExtension, AI64_VALIDATOR);
    }
}
