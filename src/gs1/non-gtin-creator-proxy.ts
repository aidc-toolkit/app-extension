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
    namespace: "GS1",
    methodInfix: "GLN"
})
export class GLNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.glnCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.ssccCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GRAI"
})
export class GRAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.graiCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GIAI"
})
export class GIAICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.giaiCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsrnCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GDTI"
})
export class GDTICreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gdtiCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GINC"
})
export class GINCCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gincCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSIN"
})
export class GSINCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, NonSerializableNumericIdentifierType, NonGTINNumericIdentifierCreator> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gsinCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GCN"
})
export class GCNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gcnCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "CPID"
})
export class CPIDCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.cpidCreator);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GMN"
})
export class GMNCreatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierCreatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, prefixManager => prefixManager.gmnCreator);
    }
}
