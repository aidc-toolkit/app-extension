import type { Nullishable } from "@aidc-toolkit/core";
import { PrefixManager, type PrefixType, RemoteGCPLengthCache } from "@aidc-toolkit/gs1";
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
 * GS1 Company Prefix length cache shared data.
 */
interface GCPLengthCacheSharedData {
    nextCheckDateTimeString: string;

    cacheDateTimeString: string | undefined;

    cacheData: Uint8Array | undefined;
}

/**
 * Determine if data object is GS1 Company Prefix length cache shared data.
 *
 * @param data
 * Data object.
 *
 * @returns
 * True if data object is GS1 Company Prefix length cache shared data.
 */
function isGCPLengthCacheSharedData(data: object): data is GCPLengthCacheSharedData {
    // Property type check is necessary to guard against data corruption or changes in format.
    return "nextCheckDateTimeString" in data && typeof data.nextCheckDateTimeString === "string";
}

@proxy.describeClass(false, {
    namespace: "GS1"
})
export class PrefixManagerProxy<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt> extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt> {
    /**
     * GS1 Company Prefix length data property name.
     */
    static readonly #GCP_LENGTH_DATA_NAME = `${AppExtension.APPLICATION_NAME_PREFIX}gcpLength`;

    #gcpLengthCacheData: GCPLengthCacheData | undefined = undefined;
    
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

        // Restore from shared data if available on first pass.
        if (this.#gcpLengthCacheData === undefined) {
            const gcpLengthCacheAppData = await this.appExtension.getSharedData(PrefixManagerProxy.#GCP_LENGTH_DATA_NAME);

            if (gcpLengthCacheAppData?.type === "object" && isGCPLengthCacheSharedData(gcpLengthCacheAppData.data)) {
                this.#gcpLengthCacheData = {
                    nextCheckDateTime: new Date(gcpLengthCacheAppData.data.nextCheckDateTimeString),
                    cacheDateTime: gcpLengthCacheAppData.data.cacheDateTimeString !== undefined ? new Date(gcpLengthCacheAppData.data.cacheDateTimeString) : undefined,
                    cacheData: gcpLengthCacheAppData.data.cacheData
                };

                this.appExtension.logger.trace("GS1 Company Prefix length data loaded from shared data");
            } else {
                // No shared data.
                this.#gcpLengthCacheData = {
                    nextCheckDateTime: now,
                    cacheDateTime: undefined,
                    cacheData: undefined
                };
            }
        }

        // Load/reload if next check date/time has passed.
        if (this.#gcpLengthCacheData.nextCheckDateTime.getTime() <= now.getTime()) {
            const appExtension = this.appExtension;
            const gcpLengthCacheData = this.#gcpLengthCacheData;

            const gcpLengthCache = new class extends RemoteGCPLengthCache {
                getNextCheckDateTime(): Date {
                    appExtension.logger.debug(`GS1 Company Prefix length next check date/time ${gcpLengthCacheData.nextCheckDateTime.toISOString()}`);

                    return gcpLengthCacheData.nextCheckDateTime;
                }

                async setNextCheckDateTime(nextCheckDateTime: Date): Promise<void> {
                    gcpLengthCacheData.nextCheckDateTime = nextCheckDateTime;

                    // Next check date/time is the last property to be updated.
                    await appExtension.setSharedData(PrefixManagerProxy.#GCP_LENGTH_DATA_NAME, {
                        type: "object",
                        data: {
                            nextCheckDateTimeString: nextCheckDateTime.toISOString(),
                            cacheDateTimeString: gcpLengthCacheData.cacheDateTime?.toISOString(),
                            cacheData: gcpLengthCacheData.cacheData
                        } satisfies GCPLengthCacheSharedData
                    });

                    appExtension.logger.trace(`GS1 Company Prefix length saved to shared data with next check date/time ${nextCheckDateTime.toISOString()}`);
                }

                override getCacheDateTime(): Date | undefined {
                    appExtension.logger.debug(`GS1 Company Prefix length cache date/time ${gcpLengthCacheData.cacheDateTime?.toISOString()}`);

                    return gcpLengthCacheData.cacheDateTime;
                }

                override setCacheDateTime(cacheDateTime: Date): void {
                    gcpLengthCacheData.cacheDateTime = cacheDateTime;
                }

                override getCacheData(): Uint8Array | undefined {
                    appExtension.logger.debug("GS1 Company Prefix length cache data retrieved");

                    return gcpLengthCacheData.cacheData;
                }

                override setCacheData(cacheData: Uint8Array): void {
                    gcpLengthCacheData.cacheData = cacheData;
                }

                override async getSourceDateTime(): Promise<Date> {
                    const sourceDateTime = await super.getSourceDateTime();

                    appExtension.logger.debug(`GS1 Company Prefix source date/time ${sourceDateTime.toISOString()}`);

                    return sourceDateTime;
                }

                override async getSourceData(): Promise<string | Uint8Array> {
                    const sourceData = super.getSourceData();

                    appExtension.logger.debug("GS1 Company Prefix length source data retrieved");

                    return sourceData;
                }
            }();

            await PrefixManager.loadGCPLengthData(gcpLengthCache).catch((e: unknown) => {
                // Try again in ten minutes.
                gcpLengthCacheData.nextCheckDateTime = new Date(now.getTime() + 10 * 60 * 1000);

                appExtension.logger.error("Load GS1 Company Prefix length data failed", e);
            });
        }
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
