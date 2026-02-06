import { AI39_CREATOR, AI64_VALIDATOR, AI82_CREATOR } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { expandParameterDescriptor, proxy } from "../proxy.js";
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
export class AI82Proxy extends CharacterSetCreatorProxy {
    constructor(appExtension: AppExtension) {
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
export class AI39Proxy extends CharacterSetCreatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, AI39_CREATOR);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "AI64"
})
export class AI64Proxy extends CharacterSetValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, AI64_VALIDATOR);
    }
}
