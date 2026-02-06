import type { NonGTINNumericIdentifierCreator, NonSerializableNumericIdentifierType } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { proxy } from "../proxy.js";
import {
    NonNumericIdentifierCreatorProxy,
    NonSerializableNumericIdentifierCreatorProxy,
    SerializableNumericIdentifierCreatorProxy
} from "./identifier-creator-proxy.js";

@proxy.describeClass(false, {
    methodInfix: "GLN"
})
export class GLNCreatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.glnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.ssccCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GRAI"
})
export class GRAICreatorProxy<ThrowError extends boolean> extends SerializableNumericIdentifierCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.graiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GIAI"
})
export class GIAICreatorProxy<ThrowError extends boolean> extends NonNumericIdentifierCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.giaiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.gsrnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GDTI"
})
export class GDTICreatorProxy<ThrowError extends boolean> extends SerializableNumericIdentifierCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.gdtiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GINC"
})
export class GINCCreatorProxy<ThrowError extends boolean> extends NonNumericIdentifierCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.gincCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSIN"
})
export class GSINCreatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.gsinCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GCN"
})
export class GCNCreatorProxy<ThrowError extends boolean> extends SerializableNumericIdentifierCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.gcnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "CPID"
})
export class CPIDCreatorProxy<ThrowError extends boolean> extends NonNumericIdentifierCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.cpidCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GMN"
})
export class GMNCreatorProxy<ThrowError extends boolean> extends NonNumericIdentifierCreatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, prefixManager => prefixManager.gmnCreator);
    }
}
