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
    nextCheckDateTime: Date | undefined;

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

/**
 * Application extension GCP length cache. Data is stored in application extension shared data.
 */
class AppExtensionGCPLengthCache<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends RemoteGCPLengthCache {
    /**
     * GS1 Company Prefix length data property name.
     */
    static readonly #GCP_LENGTH_DATA_NAME = `${AppExtension.APPLICATION_NAME_PREFIX}gcpLength`;

    /**
     * Application extension.
     */
    readonly #appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>;

    #nextCheckDateTime?: Date | undefined;

    #cacheDateTime?: Date | undefined;

    #cacheData?: Uint8Array | undefined;

    /**
     * Constructor.
     *
     * @param appExtension
     * Application extension.
     */
    constructor(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>) {
        super();

        this.#appExtension = appExtension;
    }
    
    async initialize(): Promise<void> {
        const gcpLengthCacheAppData = await this.#appExtension.getSharedData(AppExtensionGCPLengthCache.#GCP_LENGTH_DATA_NAME);

        if (isGCPLengthCacheData(gcpLengthCacheAppData)) {
            this.#nextCheckDateTime = gcpLengthCacheAppData.nextCheckDateTime;
            this.#cacheDateTime = gcpLengthCacheAppData.cacheDateTime;
            this.#cacheData = gcpLengthCacheAppData.cacheData;

            this.#appExtension.logger.trace("GS1 Company Prefix length data loaded from shared data");
        }
    }

    get nextCheckDateTime(): Date | undefined {
        this.#appExtension.logger.debug(`GS1 Company Prefix length next check date/time ${this.#nextCheckDateTime?.toISOString()}`);

        return this.#nextCheckDateTime;
    }

    get cacheDateTime(): Date | undefined {
        this.#appExtension.logger.debug(`GS1 Company Prefix length cache date/time ${this.#cacheDateTime?.toISOString()}`);

        return this.#cacheDateTime;
    }

    get cacheData(): Uint8Array {
        this.#appExtension.logger.debug("GS1 Company Prefix length cache data retrieved");

        if (this.#cacheData === undefined) {
            // Application bug; localization not necessary.
            throw new Error("Cache data not defined");
        }

        return this.#cacheData;
    }

    override get sourceDateTime(): Promise<Date> {
        return super.sourceDateTime.then((sourceDateTime) => {
            this.#appExtension.logger.debug(`GS1 Company Prefix source date/time ${sourceDateTime.toISOString()}`);

            return sourceDateTime;
        });
    }

    override get sourceData(): Promise<Uint8Array> {
        return super.sourceData.then((sourceData) => {
            this.#appExtension.logger.debug("GS1 Company Prefix length source data retrieved");

            return sourceData;
        });
    }

    /**
     * @inheritDoc
     */
    async update(nextCheckDateTime: Date, cacheDateTime?: Date, cacheData?: Uint8Array): Promise<void> {
        this.#nextCheckDateTime = nextCheckDateTime;

        if (cacheDateTime !== undefined) {
            this.#cacheDateTime = cacheDateTime;
        }

        if (cacheData !== undefined) {
            this.#cacheData = cacheData;
        }

        await this.#appExtension.setSharedData(AppExtensionGCPLengthCache.#GCP_LENGTH_DATA_NAME, {
            nextCheckDateTime: this.#nextCheckDateTime,
            cacheDateTime: this.#cacheDateTime,
            cacheData: this.#cacheData
        } satisfies GCPLengthCacheData);

        this.#appExtension.logger.trace(`GS1 Company Prefix length saved to shared data with next check date/time ${nextCheckDateTime.toISOString()}`);
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
        const appExtension = this.appExtension;

        if (this.#gcpLengthCache === undefined) {
            this.#gcpLengthCache = new AppExtensionGCPLengthCache(this.appExtension);

            await this.#gcpLengthCache.initialize();
        }

        const gcpLengthCache = this.#gcpLengthCache;

        await PrefixManager.loadGCPLengthData(gcpLengthCache).catch((e: unknown) => {
            // Swallow error and log it.
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
