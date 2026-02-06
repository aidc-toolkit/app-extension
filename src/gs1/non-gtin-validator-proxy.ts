import { IdentifierValidators } from "@aidc-toolkit/gs1";
import type { AppExtension } from "../app-extension.js";
import { proxy } from "../proxy.js";
import {
    NonNumericIdentifierValidatorProxy,
    NonSerializableNumericIdentifierValidatorProxy,
    SerializableNumericIdentifierValidatorProxy
} from "./identifier-validator-proxy.js";

@proxy.describeClass(false, {
    methodInfix: "GLN"
})
export class GLNValidatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GLN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "SSCC"
})
export class SSCCValidatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.SSCC);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GRAI"
})
export class GRAIValidatorProxy<ThrowError extends boolean> extends SerializableNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GRAI);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GIAI"
})
export class GIAIValidatorProxy<ThrowError extends boolean> extends NonNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GIAI);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSRN"
})
export class GSRNValidatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GSRN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GDTI"
})
export class GDTIValidatorProxy<ThrowError extends boolean> extends SerializableNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GDTI);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GINC"
})
export class GINCValidatorProxy<ThrowError extends boolean> extends NonNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GINC);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSIN"
})
export class GSINValidatorProxy<ThrowError extends boolean> extends NonSerializableNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GSIN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GCN"
})
export class GCNValidatorProxy<ThrowError extends boolean> extends SerializableNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GCN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "CPID"
})
export class CPIDValidatorProxy<ThrowError extends boolean> extends NonNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.CPID);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GMN"
})
export class GMNValidatorProxy<ThrowError extends boolean> extends NonNumericIdentifierValidatorProxy<ThrowError> {
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension, IdentifierValidators.GMN);
    }
}
