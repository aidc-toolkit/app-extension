import { AI39_CREATOR, AI64_VALIDATOR, AI82_CREATOR } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { expandParameterDescriptor, proxy } from "../proxy.js";
import type { ErrorExtends } from "../type.js";
import {
    exclusionAllNumericParameterDescriptor,
    exclusionNoneParameterDescriptor
} from "../utility/character-set-descriptor.js";
import { CharacterSetCreatorProxy, CharacterSetValidatorProxy } from "../utility/index.js";

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "AI82",
    replacementParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAllNumericParameterDescriptor
        }
    ]
})
export class AI82Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, AI82_CREATOR);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "AI39",
    replacementParameterDescriptors: [
        {
            name: expandParameterDescriptor(exclusionNoneParameterDescriptor).name,
            replacement: exclusionAllNumericParameterDescriptor
        }
    ]
})
export class AI39Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends CharacterSetCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, AI39_CREATOR);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "AI64"
})
export class AI64Proxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends CharacterSetValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, AI64_VALIDATOR);
    }
}
