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
export class GLNValidatorProxy extends NonSerializableNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GLN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "SSCC"
})
export class SSCCValidatorProxy extends NonSerializableNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.SSCC);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GRAI"
})
export class GRAIValidatorProxy extends SerializableNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GRAI);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GIAI"
})
export class GIAIValidatorProxy extends NonNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GIAI);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSRN"
})
export class GSRNValidatorProxy extends NonSerializableNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GSRN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GDTI"
})
export class GDTIValidatorProxy extends SerializableNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GDTI);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GINC"
})
export class GINCValidatorProxy extends NonNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GINC);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSIN"
})
export class GSINValidatorProxy extends NonSerializableNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GSIN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GCN"
})
export class GCNValidatorProxy extends SerializableNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GCN);
    }
}

@proxy.describeClass(false, {
    methodInfix: "CPID"
})
export class CPIDValidatorProxy extends NonNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.CPID);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GMN"
})
export class GMNValidatorProxy extends NonNumericIdentifierValidatorProxy {
    constructor(appExtension: AppExtension) {
        super(appExtension, IdentifierValidators.GMN);
    }
}
