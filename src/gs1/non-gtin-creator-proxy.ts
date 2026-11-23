import type {
    CPIDCreator,
    GCNCreator,
    GDTICreator,
    GIAICreator,
    GINCCreator,
    GLNCreator,
    GMNCreator,
    GRAICreator,
    GSINCreator,
    GSRNCreator,
    SSCCCreator
} from "@aidc-toolkit/gs1";
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
export class GLNCreatorProxy extends NonSerializableNumericIdentifierCreatorProxy<GLNCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.glnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "SSCC"
})
export class SSCCCreatorProxy extends NonSerializableNumericIdentifierCreatorProxy<SSCCCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.ssccCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GRAI"
})
export class GRAICreatorProxy extends SerializableNumericIdentifierCreatorProxy<GRAICreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.graiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GIAI"
})
export class GIAICreatorProxy extends NonNumericIdentifierCreatorProxy<GIAICreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.giaiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSRN"
})
export class GSRNCreatorProxy extends NonSerializableNumericIdentifierCreatorProxy<GSRNCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.gsrnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GDTI"
})
export class GDTICreatorProxy extends SerializableNumericIdentifierCreatorProxy<GDTICreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.gdtiCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GINC"
})
export class GINCCreatorProxy extends NonNumericIdentifierCreatorProxy<GINCCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.gincCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GSIN"
})
export class GSINCreatorProxy extends NonSerializableNumericIdentifierCreatorProxy<GSINCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.gsinCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GCN"
})
export class GCNCreatorProxy extends SerializableNumericIdentifierCreatorProxy<GCNCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.gcnCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "CPID"
})
export class CPIDCreatorProxy extends NonNumericIdentifierCreatorProxy<CPIDCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.cpidCreator);
    }
}

@proxy.describeClass(false, {
    methodInfix: "GMN"
})
export class GMNCreatorProxy extends NonNumericIdentifierCreatorProxy<GMNCreator> {
    constructor(appExtension: AppExtension) {
        super(appExtension, prefixManager => prefixManager.gmnCreator);
    }
}
