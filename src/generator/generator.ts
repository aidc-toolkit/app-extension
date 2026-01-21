import { getLogger, I18nEnvironments, phaseURL, type Promisable } from "@aidc-toolkit/core";
import type { DefaultNamespace, ParseKeys } from "i18next";
import type { Logger } from "tslog";
import packageConfiguration from "../../package.json" with { type: "json" };
import { AppHelperProxy } from "../app-helper-proxy.js";
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

registerProxies(AppHelperProxy, Utility, GS1);

/**
 * Localization.
 */
export interface Localization {
    /**
     * Name.
     */
    readonly name: string;

    /**
     * Description.
     */
    readonly description: string;
}

/**
 * Function localization.
 */
export interface FunctionLocalization extends Localization {
    /**
     * Namespace function name.
     */
    readonly namespaceFunctionName: string;

    /**
     * Documentation URL.
     */
    readonly documentationURL: string;

    /**
     * Parameters map.
     */
    readonly parametersMap: ReadonlyMap<string, Localization>;
}

/**
 * Abstract generator.
 */
export abstract class Generator {
    /**
     * Documentation path, optionally preceded by locale.
     */
    static readonly #DOCUMENTATION_PATH = "app-extension/";

    /**
     * Logger.
     */
    readonly #logger = getLogger();

    /**
     * Base URL.
     */
    readonly #baseURL: string;

    /**
     * Locales.
     */
    readonly #locales: readonly string[];

    /**
     * Default locale.
     */
    readonly #defaultLocale: string;

    /**
     * Constructor.
     *
     * @param includeLocalizations
     * Include localizations if true.
     */
    constructor(includeLocalizations = true) {
        this.#baseURL = phaseURL(packageConfiguration.version, "http://10.211.55.2:5173");
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
     * Initialize the generation of the output.
     */
    protected abstract initialize(): void;

    /**
     * Create a namespace.
     *
     * @param namespace
     * Namespace.
     */
    protected abstract createNamespace(namespace: string | undefined): void;

    /**
     * Create a category.
     *
     * @param namespace
     * Namespace.
     *
     * @param category
     * Category.
     *
     * @param categoryLocalizationsMap
     * Category localizations map.
     */
    protected abstract createCategory(namespace: string | undefined, category: string, categoryLocalizationsMap: ReadonlyMap<string, string>): void;

    /**
     * Create a proxy object for a class.
     *
     * @param objectName
     * Object name, derived from namespace and class name.
     *
     * @param classDescriptor
     * Class descriptor.
     */
    protected abstract createProxyObject(objectName: string, classDescriptor: ClassDescriptor): void;

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
     * Function localizations map.
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
     * @param key
     * Key.
     *
     * @param localizationCallback
     * Callback to finalize localization.
     *
     * @returns
     * Localization.
     */
    static #generateLocalization<TLocalization extends Localization>(locale: string, key: string, localizationCallback: (locale: string, localization: Localization) => TLocalization): TLocalization {
        const lngReturnObjectsOption = {
            lng: locale,
            returnObjects: true
        } as const;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Localized key exists and return type is Localization.
        return localizationCallback(locale, i18nextAppExtension.t(key as ParseKeys<DefaultNamespace, typeof lngReturnObjectsOption>, lngReturnObjectsOption) as Localization);
    }

    /**
     * Generate by processing individual imports.
     */
    async generate(): Promise<void> {
        let success = false;

        await i18nAppExtensionInit(I18nEnvironments.CLI);

        this.initialize();

        const namespaceHierarchy = new Map<string | undefined, Map<string, ClassDescriptor[]>>();

        // Organize class descriptors by namespace and category.
        for (const classDescriptor of proxy.classDescriptors) {
            const namespace = classDescriptor.namespace;
            const category = classDescriptor.category;

            let categoryHierarchy = namespaceHierarchy.get(namespace);

            if (categoryHierarchy === undefined) {
                categoryHierarchy = new Map();
                namespaceHierarchy.set(namespace, categoryHierarchy);
            }

            let classDescriptors = categoryHierarchy.get(category);

            if (classDescriptors === undefined) {
                classDescriptors = [];
                categoryHierarchy.set(category, classDescriptors);
            }

            classDescriptors.push(classDescriptor);
        }

        try {
            for (const [namespace, categoryHierarchy] of namespaceHierarchy) {
                const namespacePrefix = namespace === undefined ? "" : `${namespace}.`;
                const namespacePath = namespace === undefined ? "" : `${namespace}/`;

                this.createNamespace(namespace);

                for (const [category, classDescriptors] of categoryHierarchy) {
                    const namespaceCategory = `${namespacePrefix}${category}`;

                    const categoriesKey = `Categories.${category}`;
                    const namespaceCategoriesKey = `Categories.${namespaceCategory}`;

                    const categoryLocalizationsMap = new Map(this.locales.map((locale) => {
                        const lngOption = {
                            lng: locale
                        } as const;

                        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Localized key exists.
                        return [locale, i18nextAppExtension.t((i18nextAppExtension.exists(namespaceCategoriesKey, lngOption) ? namespaceCategoriesKey : categoriesKey) as ParseKeys, lngOption)];
                    }));

                    this.createCategory(namespace, category, categoryLocalizationsMap);

                    const namespaceClassNamesSet = new Set<string>();

                    for (const classDescriptor of classDescriptors) {
                        const namespaceClassName = classDescriptor.namespaceClassName;

                        if (namespaceClassNamesSet.has(namespaceClassName)) {
                            throw new Error(`Duplicate class ${namespaceClassName}`);
                        }

                        namespaceClassNamesSet.add(namespaceClassName);

                        // First capture group is:
                        // - one or more uppercase letters followed by zero or more numbers; or
                        // - single uppercase letter followed by zero or more characters except uppercase letters or period.
                        //
                        // Second capture group is:
                        // - single uppercase letter followed by zero or more characters except period; or
                        // - zero characters (empty string).
                        //
                        // Third capture group, separated by optional period, is:
                        // - single uppercase letter followed by zero or more characters (remainder of string); or
                        // - zero characters (empty string).
                        const objectNameGroups = /^(?<namespaceFirstWord>[A-Z]+[0-9]*|[A-Z][^A-Z.]*)(?<namespaceRemaining>[A-Z][^.]*|)\.?(?<className>[A-Z].*|)$/u.exec(namespaceClassName)?.groups;

                        if (objectNameGroups === undefined) {
                            throw new Error(`${namespaceClassName} is not a valid namespace-qualified class name`);
                        }

                        this.createProxyObject(`${objectNameGroups["namespaceFirstWord"].toLowerCase()}${objectNameGroups["namespaceRemaining"]}${objectNameGroups["className"]}`, classDescriptor);

                        for (const methodDescriptor of classDescriptor.methodDescriptors) {
                            const functionLocalizationsMap = new Map(this.locales.map(locale =>
                                [locale, Generator.#generateLocalization<FunctionLocalization>(locale, `Functions.${methodDescriptor.namespaceFunctionName}`, (locale, localization) => ({
                                    ...localization,
                                    namespaceFunctionName: `${namespacePrefix}${localization.name}`,
                                    documentationURL: `${this.#baseURL}/${locale === this.defaultLocale ? "" : `${locale}/`}${Generator.#DOCUMENTATION_PATH}${namespacePath}${localization.name}.html`,
                                    parametersMap: new Map(methodDescriptor.parameterDescriptors.map(parameterDescriptor =>
                                        // eslint-disable-next-line max-nested-callbacks -- Callback is empty.
                                        [parameterDescriptor.name, Generator.#generateLocalization(locale, `Parameters.${parameterDescriptor.name}`, (_locale, localization) => localization)]
                                    ))
                                }))]
                            ));

                            this.createProxyFunction(classDescriptor, methodDescriptor, functionLocalizationsMap);
                        }
                    }
                }
            }

            success = true;
        } finally {
            await this.finalize(success);
        }
    }
}
