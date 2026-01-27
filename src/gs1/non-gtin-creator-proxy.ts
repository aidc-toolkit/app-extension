import type { NonGTINNumericIdentifierCreator, NonSerializableNumericIdentifierType } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends } from "../type.js";
import {
    NonNumericIdentifierCreatorProxy,
    NonSerializableNumericIdentifierCreatorProxy,
    SerializableNumericIdentifierCreatorProxy
} from "./identifier-creator-proxy.js";

@proxy.describeClass(false, {
    methodInfix: "GLN"
})
export class GLNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.glnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.ssccCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GRAI"
})
export class GRAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.graiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GIAI"
})
export class GIAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.giaiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsrnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GDTI"
})
export class GDTICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gdtiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GINC"
})
export class GINCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gincCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSIN"
})
export class GSINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsinCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GCN"
})
export class GCNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gcnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "CPID"
})
export class CPIDCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.cpidCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GMN"
})
export class GMNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gmnCreator);
    }
}
