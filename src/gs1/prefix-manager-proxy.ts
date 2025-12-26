import type { Nullishable } from "@aidc-toolkit/core";
import { PrefixManager, type PrefixType, RemoteGCPLengthCache } from "@aidc-toolkit/gs1";
import type { AppData } from "../app-data.js";
import { AppExtension } from "../app-extension.js";
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
 * GS1 Company Prefix length cache data.
 */
interface GCPLengthCacheData {
    nextCheckDateTime: Date;

    cacheDateTime: Date | undefined;

    cacheData: Uint8Array | undefined;
}

/**
 * Determine if data object is GS1 Company Prefix length cache data.
 *
 * @param data
 * Data object.
 *
 * @returns
 * True if data object is GS1 Company Prefix length cache data.
 */
function isGCPLengthCacheData(data: AppData | undefined): data is GCPLengthCacheData {
    // Property type check is necessary to guard against data corruption or changes in format.
    return typeof data === "object" && "nextCheckDateTime" in data && data.nextCheckDateTime instanceof Date;
}

class AppExtensionGCPLengthCache<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends RemoteGCPLengthCache {
    /**
     * GS1 Company Prefix length data property name.
     */
    static readonly #GCP_LENGTH_DATA_NAME = `${AppExtension.APPLICATION_NAME_PREFIX}gcpLength`;

    readonly #appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>;

    #nextCheckDateTime!: Date;

    #cacheDateTime?: Date | undefined;

    #cacheData?: Uint8Array | undefined;
    
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super();

        this.#appExtension = appExtension;
    }
    
    async initialize(): Promise<void> {
        const now = new Date();

        const gcpLengthCacheAppData = await this.#appExtension.getSharedData(AppExtensionGCPLengthCache.#GCP_LENGTH_DATA_NAME);

        if (isGCPLengthCacheData(gcpLengthCacheAppData)) {
            this.#nextCheckDateTime = gcpLengthCacheAppData.nextCheckDateTime;
            this.#cacheDateTime = gcpLengthCacheAppData.cacheDateTime;
            this.#cacheData = gcpLengthCacheAppData.cacheData;

            this.#appExtension.logger.trace("GS1 Company Prefix length data loaded from shared data");
        } else {
            // No shared data.
            this.#nextCheckDateTime = now;
        }
    }

    getNextCheckDateTime(): Date {
        this.#appExtension.logger.debug(`GS1 Company Prefix length next check date/time ${this.#nextCheckDateTime.toISOString()}`);

        return this.#nextCheckDateTime;
    }

    async setNextCheckDateTime(nextCheckDateTime: Date): Promise<void> {
        this.#nextCheckDateTime = nextCheckDateTime;

        // Next check date/time is the last property to be updated.
        await this.#appExtension.setSharedData(AppExtensionGCPLengthCache.#GCP_LENGTH_DATA_NAME, {
            nextCheckDateTime: this.#nextCheckDateTime,
            cacheDateTime: this.#cacheDateTime,
            cacheData: this.#cacheData
        } satisfies GCPLengthCacheData);

        this.#appExtension.logger.trace(`GS1 Company Prefix length saved to shared data with next check date/time ${nextCheckDateTime.toISOString()}`);
    }

    override getCacheDateTime(): Date | undefined {
        this.#appExtension.logger.debug(`GS1 Company Prefix length cache date/time ${this.#cacheDateTime?.toISOString()}`);

        return this.#cacheDateTime;
    }

    override setCacheDateTime(cacheDateTime: Date): void {
        this.#cacheDateTime = cacheDateTime;
    }

    override getCacheData(): Uint8Array | undefined {
        this.#appExtension.logger.debug("GS1 Company Prefix length cache data retrieved");

        return this.#cacheData;
    }

    override setCacheData(cacheData: Uint8Array): void {
        this.#cacheData = cacheData;
    }

    override async getSourceDateTime(): Promise<Date> {
        const sourceDateTime = await super.getSourceDateTime();

        this.#appExtension.logger.debug(`GS1 Company Prefix source date/time ${sourceDateTime.toISOString()}`);

        return sourceDateTime;
    }

    override async getSourceData(): Promise<string | Uint8Array> {
        const sourceData = super.getSourceData();

        this.#appExtension.logger.debug("GS1 Company Prefix length source data retrieved");

        return sourceData;
    }
}

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class PrefixManagerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    #gcpLengthCache?: AppExtensionGCPLengthCache<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>;
    
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
        const now = new Date();

        const appExtension = this.appExtension;

        if (this.#gcpLengthCache === undefined) {
            this.#gcpLengthCache = new AppExtensionGCPLengthCache(this.appExtension);

            await this.#gcpLengthCache.initialize();
        }

        const gcpLengthCache = this.#gcpLengthCache;

        await PrefixManager.loadGCPLengthData(gcpLengthCache).catch(async (e: unknown) => {
            // Try again in ten minutes.
            await gcpLengthCache.setNextCheckDateTime(new Date(now.getTime() + 10 * 60 * 1000));

            appExtension.logger.error("Load GS1 Company Prefix length data failed", e);
        });
    }

    @proxy.describeMethod({
        type: Types.Number,
        isMatrix: true,
        parameterDescriptors: [identifierTypeParameterDescriptor, gcpLengthIdentifierParameterDescriptor]
    })
    async gcpLength(identifierType: string, matrixIdentifiers: Matrix<string>): Promise<MatrixResult<number, ThrowError, TError>> {
        await this.#loadGCPLengthData();

        return this.setUpMatrixResult(() =>
            validateIdentifierType(identifierType),
        matrixIdentifiers, (validatedIdentifierType, identifier) =>
            PrefixManager.gcpLength(validatedIdentifierType, identifier)
        );
    }

    @proxy.describeMethod({
        type: Types.String,
        isMatrix: false,
        parameterDescriptors: []
    })
    async gcpLengthDateTime(): Promise<SingletonResult<string, ThrowError, TError>> {
        await this.#loadGCPLengthData();

        return this.singletonResult(() => PrefixManager.gcpLengthDateTime().toISOString());
    }
}
