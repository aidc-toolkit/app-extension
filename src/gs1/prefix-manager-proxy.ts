import type { Nullishable } from "@aidc-toolkit/core";
import {
    type GCPLengthCache,
    type GCPLengthData,
    PrefixManager,
    type PrefixType,
    RemoteGCPLengthCache
} from "@aidc-toolkit/gs1";
import type { Logger } from "tslog";
import type { AppExtension } from "../app-extension.js";
import { type ExtendsParameterDescriptor, type ParameterDescriptor, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { ErrorExtends, Matrix, MatrixResult, SingletonResult } from "../type.js";
import { identifierParameterDescriptor, identifierTypeParameterDescriptor } from "./identifier-descriptor.js";
import { validateIdentifierType } from "./identifier-type.js";

const prefixParameterDescriptor: ParameterDescriptor = {
    name: "prefix",
    type: Types.String,
    isMatrix: false,
    isRequired: true
};

const prefixTypeParameterDescriptor: ParameterDescriptor = {
    name: "prefixType",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};

const tweakFactorParameterDescriptor: ParameterDescriptor = {
    name: "tweakFactor",
    type: Types.Number,
    isMatrix: false,
    isRequired: false
};

const gcpLengthIdentifierParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "gcpLengthIdentifier"
};

/**
 * Application extension GCP length cache. Data is stored in application extension shared data.
 */
class AppExtensionGCPLengthCache<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends RemoteGCPLengthCache {
    /**
     * Logger.
     */
    readonly #logger: Logger<object>;

    /**
     * Constructor.
     *
     * @param appExtension
     * Application extension.
     */
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension.sharedAppDataStorage);

        this.#logger = appExtension.logger;
    }

    /**
     * @inheritDoc
     */
    override get nextCheckDateTime(): Promise<Date | undefined> {
        return super.nextCheckDateTime.then((nextCheckDateTime) => {
            this.#logger.debug(`GS1 Company Prefix length next check date/time ${nextCheckDateTime?.toISOString()}`);

            return nextCheckDateTime;
        });
    }

    /**
     * @inheritDoc
     */
    override get cacheDateTime(): Promise<Date | undefined> {
        return super.cacheDateTime.then((cacheDateTime) => {
            this.#logger.debug(`GS1 Company Prefix length cache date/time ${cacheDateTime?.toISOString()}`);

            return cacheDateTime;
        });
    }

    override get cacheData(): Promise<GCPLengthData> {
        return super.cacheData.then((cacheData) => {
            this.#logger.debug("GS1 Company Prefix length cache data retrieved");

            return cacheData;
        });
    }

    /**
     * @inheritDoc
     */
    override get sourceDateTime(): Promise<Date> {
        return super.sourceDateTime.then((sourceDateTime) => {
            this.#logger.debug(`GS1 Company Prefix source date/time ${sourceDateTime.toISOString()}`);

            return sourceDateTime;
        });
    }

    /**
     * @inheritDoc
     */
    override get sourceData(): Promise<GCPLengthData> {
        return super.sourceData.then((sourceData) => {
            this.#logger.debug("GS1 Company Prefix length source data retrieved");

            return sourceData;
        });
    }

    /**
     * @inheritDoc
     */
    override async update(nextCheckDateTime: Date, cacheDateTime?: Date, cacheData?: GCPLengthData): Promise<void> {
        return super.update(nextCheckDateTime, cacheDateTime, cacheData).then(() => {
            this.#logger.trace(`GS1 Company Prefix length saved to shared data with next check date/time ${nextCheckDateTime.toISOString()}`);
        });
    }
}

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class PrefixManagerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    #gcpLengthCache!: GCPLengthCache;
    
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super(appExtension);
        
        appExtension.addPostInitializeCallback(() => {
            this.#gcpLengthCache = new AppExtensionGCPLengthCache(appExtension);
        });
    }

    @proxy.describeMethod({
        type: Types.Any,
        isMatrix: true,
        parameterDescriptors: [prefixParameterDescriptor, prefixTypeParameterDescriptor, tweakFactorParameterDescriptor]
    })
    definePrefix(prefix: string, prefixType: Nullishable<PrefixType>, tweakFactor: Nullishable<number>): Matrix<unknown> {
        // Parameters will be validated by IdentifierCreatorProxy.getCreator().
        return [[prefix, prefixType, tweakFactor]];
    }

    /**
     * Load GS1 Company Prefix length data.
     */
    async #loadGCPLengthData(): Promise<void> {
        const logger = this.appExtension.logger;

        return PrefixManager.loadGCPLengthData(this.#gcpLengthCache).catch((e: unknown) => {
            // Swallow error and log it.
            logger.error("Load GS1 Company Prefix length data failed", e);
        });
    }

    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [identifierTypeParameterDescriptor, gcpLengthIdentifierParameterDescriptor]
    })
    async gcpLength(identifierType: string, matrixIdentifiers: Matrix<string>): Promise<MatrixResult<number, ThrowError, TError>> {
        return this.#loadGCPLengthData().then(() => this.setUpMatrixResult(
            () => validateIdentifierType(identifierType),
            matrixIdentifiers,
            (validatedIdentifierType, identifier) => PrefixManager.gcpLength(validatedIdentifierType, identifier)
        ));
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: false,
        parameterDescriptors: []
    })
    async gcpLengthDateTime(): Promise<SingletonResult<string, ThrowError, TError>> {
        return this.#loadGCPLengthData().then(() =>
            this.singletonResult(() => PrefixManager.gcpLengthDateTime().toISOString())
        );
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: false,
        parameterDescriptors: []
    })
    async gcpLengthDisclaimer(): Promise<SingletonResult<string, ThrowError, TError>> {
        return this.#loadGCPLengthData().then(() =>
            this.singletonResult(() => PrefixManager.gcpLengthDisclaimer())
        );
    }
}
