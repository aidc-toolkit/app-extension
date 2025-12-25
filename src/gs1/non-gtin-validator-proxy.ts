import { IdentifierValidators } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends } from "../type.js";
import {
    NonNumericIdentifierValidatorProxy,
    NonSerializableNumericIdentifierValidatorProxy,
    SerializableNumericIdentifierValidatorProxy
} from "./identifier-validator-proxy.js";

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GLN"
})
export class GLNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GLN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "SSCC"
})
export class SSCCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.SSCC);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GRAI"
})
export class GRAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GRAI);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GIAI"
})
export class GIAIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GIAI);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSRN"
})
export class GSRNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GSRN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GDTI"
})
export class GDTIValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GDTI);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GINC"
})
export class GINCValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GINC);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GSIN"
})
export class GSINValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GSIN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GCN"
})
export class GCNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends SerializableNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GCN);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "CPID"
})
export class CPIDValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.CPID);
    }
}

@proxy.describeClass(false, {
    namespace: "GS1",
    methodInfix: "GMN"
})
export class GMNValidatorProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends NonNumericIdentifierValidatorProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension, IdentifierValidators.GMN);
    }
}
