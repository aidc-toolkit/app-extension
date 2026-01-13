import { getLogger, I18nEnvironments, type Promisable } from "@aidc-toolkit/core";
import type { ParseKeys } from "i18next";
import type { Logger } from "tslog";
import { AppUtilityProxy } from "../app-utility-proxy.js";
import type { ClassDescriptor, MethodDescriptor } from "../descriptor.js";
import * as GS1 from "../gs1/index.js";
import { appExtensionResourceBundle, i18nAppExtensionInit, i18nextAppExtension } from "../locale/i18n.js";
import { proxy } from "../proxy.js";
import * as Utility from "../utility/index.js";

/**
 * Dummy method to force proxies to register their decorators.
 *
 * @param _proxies
 * Proxies.
 */
function registerProxies(..._proxies: unknown[]): void {
}

registerProxies(AppUtilityProxy, Utility, GS1);

/**
 * Localization.
 */
export interface Localization {
    /**
     * Name.
     */
    name: string;

    /**
     * Description.
     */
    description: string;
}

/**
 * Function localization.
 */
export interface FunctionLocalization extends Localization {
    /**
     * Documentation URL.
     */
    documentationURL: string;

    /**
     * Parameters map.
     */
    parametersMap: Map<string, Localization>;
}

/**
 * Abstract generator.
 */
export abstract class Generator {
    /**
     * Documentation base URL.
     */
    static readonly #DOCUMENTATION_BASE_URL = "https://aidc-toolkit.com/";

    /**
     * Documentation path, optionally preceded by locale.
     */
    static readonly #DOCUMENTATION_PATH = "app-extension/";

    /**
     * Logger.
     */
    readonly #logger = getLogger();

    /**
     * Locales.
     */
    readonly #locales: readonly string[];

    /**
     * Default locale.
     */
    readonly #defaultLocale: string;

    /**
     * Map of function localizations maps by namespace function name.
     */
    readonly #functionLocalizationsMapsMap = new Map<string, ReadonlyMap<string, FunctionLocalization>>();

    /**
     * Constructor.
     *
     * @param includeLocalizations
     * Include localizations if true.
     */
    constructor(includeLocalizations = true) {
        this.#locales = includeLocalizations ? Object.keys(appExtensionResourceBundle) : [];
        this.#defaultLocale = this.#locales[0] ?? "";
    }

    /**
     * Get the logger.
     */
    get logger(): Logger<object> {
        return this.#logger;
    }

    /**
     * Get the locales.
     */
    protected get locales(): readonly string[] {
        return this.#locales;
    }

    /**
     * Get the default locale.
     */
    protected get defaultLocale(): string {
        return this.#defaultLocale;
    }

    /**
     * Get function localization.
     *
     * @param locale
     * Locale.
     *
     * @param namespaceFunctionName
     * Namespace function name.
     *
     * @returns
     * Function localization.
     */
    protected getFunctionLocalization(locale: string, namespaceFunctionName: string): FunctionLocalization {
        const functionLocalization = this.#functionLocalizationsMapsMap.get(namespaceFunctionName)?.get(locale);

        if (functionLocalization === undefined) {
            throw new Error(`${locale} localization for function ${namespaceFunctionName} not found`);
        }

        return functionLocalization;
    }

    /**
     * Get parameter localization.
     *
     * @param locale
     * Locale.
     *
     * @param namespaceFunctionName
     * Namespace function name.
     *
     * @param parameterName
     * Parameter name.
     *
     * @returns
     * Parameter localization.
     */
    protected getParameterLocalization(locale: string, namespaceFunctionName: string, parameterName: string): Localization {
        const parameterLocalization = this.getFunctionLocalization(locale, namespaceFunctionName).parametersMap.get(parameterName);

        if (parameterLocalization === undefined) {
            throw new Error(`${locale} localization for function ${namespaceFunctionName} parameter ${parameterName} not found`);
        }

        return parameterLocalization;
    }

    /**
     * Initialize the generation of the output.
     */
    protected abstract initialize(): void;

    /**
     * Create a proxy object for a class.
     *
     * @param classDescriptor
     * Class descriptor.
     */
    protected abstract createProxyObject(classDescriptor: ClassDescriptor): void;

    /**
     * Create a proxy function for a class and method.
     *
     * @param classDescriptor
     * Class descriptor.
     *
     * @param methodDescriptor
     * Method descriptor.
     *
     * @param functionLocalizationsMap
     * Localizations map.
     */
    protected abstract createProxyFunction(classDescriptor: ClassDescriptor, methodDescriptor: MethodDescriptor, functionLocalizationsMap: ReadonlyMap<string, FunctionLocalization>): void;

    /**
     * Finalize the generation of the output.
     *
     * @param success
     * True if successful.
     */
    protected abstract finalize(success: boolean): Promisable<void>;

    /**
     * Generate a localization.
     *
     * @template TLocalization
     * Localization type.
     *
     * @param locale
     * Locale.
     *
     * @param localizedKeyPrefix
     * Localized key prefix.
     *
     * @param namespacePrefix
     * Namespace prefix to be appended to name.
     *
     * @param localizationCallback
     * Callback to finalize localization.
     *
     * @returns
     * Localization.
     */
    #generateLocalization<TLocalization extends Localization>(locale: string, localizedKeyPrefix: string, namespacePrefix: string, localizationCallback: (locale: string, localization: Localization) => TLocalization): TLocalization {
        const lngOption = {
            lng: locale
        };

        return localizationCallback(locale, {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Localized key exists.
            name: `${namespacePrefix}${i18nextAppExtension.t(`${localizedKeyPrefix}name` as ParseKeys, lngOption)}`,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Localized key exists.
            description: i18nextAppExtension.t(`${localizedKeyPrefix}description` as ParseKeys, lngOption)
        });
    }

    /**
     * Generate by processing individual imports.
     */
    async generate(): Promise<void> {
        let success = false;

        await i18nAppExtensionInit(I18nEnvironments.CLI);

        this.initialize();

        try {
            for (const [_namespaceClassName, classDescriptor] of proxy.classDescriptorsMap.entries()) {
                const namespace = classDescriptor.namespace;
                const namespacePrefix = namespace === undefined ? "" : `${namespace}.`;
                const namespacePath = namespace === undefined ? "" : `${namespace}/`;

                this.createProxyObject(classDescriptor);

                for (const methodDescriptor of classDescriptor.methodDescriptors) {
                    const namespaceFunctionName = methodDescriptor.namespaceFunctionName;
                    const functionLocalizationsMap = new Map(this.#locales.map(locale =>
                        [locale, this.#generateLocalization<FunctionLocalization>(locale, `Functions.${namespaceFunctionName}.`, namespacePrefix, (locale, localization) => ({
                            ...localization,
                            documentationURL: `${Generator.#DOCUMENTATION_BASE_URL}${locale === this.defaultLocale ? "" : `${locale}/`}${Generator.#DOCUMENTATION_PATH}${namespacePath}${localization.name}.html`,
                            parametersMap: new Map(methodDescriptor.parameterDescriptors.map(parameterDescriptor =>
                                // eslint-disable-next-line max-nested-callbacks -- Callback is empty.
                                [parameterDescriptor.name, this.#generateLocalization(locale, `Parameters.${parameterDescriptor.name}.`, "", (_locale, localization) => localization)]
                            ))
                        }))]
                    ));

                    this.#functionLocalizationsMapsMap.set(namespaceFunctionName, functionLocalizationsMap);

                    this.createProxyFunction(classDescriptor, methodDescriptor, functionLocalizationsMap);
                }
            }

            success = true;
        } finally {
            await this.finalize(success);
        }
    }
}
