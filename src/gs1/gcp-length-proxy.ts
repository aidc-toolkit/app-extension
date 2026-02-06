import { GCPLength, type GCPLengthData, RemoteGCPLengthCache } from "@aidc-toolkit/gs1";
import type { Logger } from "tslog";
import type { AppExtension } from "../app-extension.js";
import { type ExtendsParameterDescriptor, Multiplicities, Types } from "../descriptor.js";
import { LibProxy } from "../lib-proxy.js";
import { proxy } from "../proxy.js";
import type { Matrix, MatrixResult, SingletonResult } from "../type.js";
import { identifierParameterDescriptor, identifierTypeParameterDescriptor } from "./identifier-descriptor.js";
import { validateIdentifierType } from "./identifier-type.js";

const gcpLengthIdentifierParameterDescriptor: ExtendsParameterDescriptor = {
    extendsDescriptor: identifierParameterDescriptor,
    name: "gcpLengthIdentifier"
};

/**
 * Application extension GCP length cache. Data is stored in application extension shared data.
 */
class AppExtensionGCPLengthCache<ThrowError extends boolean> extends RemoteGCPLengthCache {
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
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension.sharedAppDataStorage, RemoteGCPLengthCache.DEFAULT_BASE_URL, appExtension.httpFetch);

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
    namespace: "GS1",
    category: "service"
})
export class GCPLengthProxy<ThrowError extends boolean> extends LibProxy<ThrowError> {
    readonly #gcpLength: GCPLength;
    
    constructor(appExtension: AppExtension<ThrowError>) {
        super(appExtension);
        
        this.#gcpLength = new GCPLength(new AppExtensionGCPLengthCache(appExtension));
    }

    /**
     * Load GS1 Company Prefix length data.
     *
     * @returns
     * Void promise.
     */
    async #loadGCPLengthData(): Promise<void> {
        return this.#gcpLength.load().catch((e: unknown) => {
            // Log and swallow error.
            this.appExtension.logger.error("Load GS1 Company Prefix length data failed", e);
        });
    }

    @proxy.describeMethod({
        type: Types.Number,
        multiplicity: Multiplicities.Matrix,
        isAsync: true,
        parameterDescriptors: [identifierTypeParameterDescriptor, gcpLengthIdentifierParameterDescriptor]
    })
    async gcpLengthOf(identifierType: string, matrixIdentifiers: Matrix<string>): Promise<MatrixResult<number, ThrowError>> {
        return this.#loadGCPLengthData().then(() => this.setUpMatrixResult(
            () => validateIdentifierType(identifierType),
            matrixIdentifiers,
            (validatedIdentifierType, identifier) => this.#gcpLength.lengthOf(validatedIdentifierType, identifier)
        ));
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Singleton,
        isAsync: true,
        parameterDescriptors: []
    })
    async gcpLengthDateTime(): Promise<SingletonResult<string, ThrowError>> {
        return this.#loadGCPLengthData().then(() =>
            this.singletonResult(() => this.#gcpLength.dateTime.toISOString())
        );
    }

    @proxy.describeMethod({
        type: Types.String,
        multiplicity: Multiplicities.Singleton,
        isAsync: true,
        parameterDescriptors: []
    })
    async gcpLengthDisclaimer(): Promise<SingletonResult<string, ThrowError>> {
        return this.#loadGCPLengthData().then(() =>
            this.singletonResult(() => this.#gcpLength.disclaimer)
        );
    }
}
