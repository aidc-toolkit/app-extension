import { I18nEnvironments } from "@aidc-toolkit/core";
import type { ParseKeys } from "i18next";
import { expandParameterDescriptor, getClassDescriptorsMap } from "../descriptor";
import { appExtensionResources, i18nAppExtensionInit, i18nextAppExtension } from "../locale/i18n";
import type {
    FunctionLocalization,
    Localization,
    ParameterLocalization,
    ProxyFunctionDescriptor,
    ProxyObjectDescriptor
} from "./descriptor";

/**
 * Abstract generator.
 */
export abstract class Generator {
    /**
     * Documentation base URL.
     */
    private static readonly DOCUMENTATION_BASE_URL = "https://aidc-toolkit.com/";

    /**
     * Documentation path, optionally preceded by locale.
     */
    private static readonly DOCUMENTATION_PATH = "app-extension/";

    /**
     * Locales.
     */
    private readonly _locales: readonly string[];

    /**
     * Default locale.
     */
    private readonly _defaultLocale: string;

    /**
     * Map of function localizations maps by namespace function name.
     */
    private readonly _functionLocalizationsMapsMap = new Map<string, ReadonlyMap<string, FunctionLocalization>>();

    /**
     * Map of parameter localizations maps by namespace function parameter name.
     */
    private readonly _parameterLocalizationsMapsMap = new Map<string, ReadonlyMap<string, ParameterLocalization>>();

    /**
     *
     */

    /**
     * Constructor.
     *
     * @param includeLocalizations
     * Include localizations if true.
     */
    constructor(includeLocalizations = true) {
        this._locales = includeLocalizations ? Object.keys(appExtensionResources) : [];
        this._defaultLocale = this._locales[0] ?? "";
    }

    /**
     * Get the locales.
     */
    protected get locales(): readonly string[] {
        return this._locales;
    }

    /**
     * Get the default locale.
     */
    protected get defaultLocale(): string {
        return this._defaultLocale;
    }

    /**
     * Get function localization.
     *
     * @param namespaceFunctionName
     * Namespace function name.
     *
     * @param locale
     * Locale.
     *
     * @returns
     * Function localization.
     */
    protected getFunctionLocalization(namespaceFunctionName: string, locale: string): FunctionLocalization {
        const functionLocalization = this._functionLocalizationsMapsMap.get(namespaceFunctionName)?.get(locale);

        if (functionLocalization === undefined) {
            throw new Error(`Localization for function "${namespaceFunctionName}", locale "${locale}" not found`);
        }

        return functionLocalization;
    }

    /**
     * Get parameter localization.
     *
     * @param namespaceFunctionName
     * Namespace function name.
     *
     * @param parameterName
     * Parameter name.
     *
     * @param locale
     * Locale.
     *
     * @returns
     * Function localization.
     */
    protected getParameterLocalization(namespaceFunctionName: string, parameterName: string, locale: string): ParameterLocalization {
        const parameterLocalization = this._parameterLocalizationsMapsMap.get(`${namespaceFunctionName}.${parameterName}`)?.get(locale);

        if (parameterLocalization === undefined) {
            throw new Error(`Localization for function "${namespaceFunctionName}", parameter "${parameterName}", locale "${locale}" not found`);
        }

        return parameterLocalization;
    }

    /**
     * Initialize the generation of the output.
     */
    protected abstract initialize(): void;

    /**
     * Create a proxy object.
     *
     * @param proxyObjectDescriptor
     * Proxy object descriptor.
     */
    protected abstract createProxyObject(proxyObjectDescriptor: ProxyObjectDescriptor): void;

    /**
     * Create a proxy function.
     *
     * @param proxyFunctionDescriptor
     * Proxy function descriptor.
     */
    protected abstract createProxyFunction(proxyFunctionDescriptor: ProxyFunctionDescriptor): void;

    /**
     * Finalize the generation of the output.
     *
     * @param success
     * True if successful.
     */
    protected abstract finalize(success: boolean): void | Promise<void>;

    /**
     * Generate localizations map.
     *
     * @param localizedKeyPrefix
     * Localized key prefix.
     *
     * @param localizationCallback
     * Callback to finalize localization.
     *
     * @returns
     * Localization map.
     */
    private generateLocalizationsMap<T extends Localization>(localizedKeyPrefix: string, localizationCallback: (locale: string, localization: Localization) => T): ReadonlyMap<string, T> {
        return new Map(this._locales.map((locale) => {
            const lngOption = {
                lng: locale
            };

            return [locale, localizationCallback(locale, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Localized key exists.
                name: i18nextAppExtension.t(`${localizedKeyPrefix}name` as ParseKeys, lngOption),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Localized key exists.
                description: i18nextAppExtension.t(`${localizedKeyPrefix}description` as ParseKeys, lngOption)
            })];
        }));
    }

    /**
     * Generate by processing individual imports.
     */
    async generate(): Promise<void> {
        let success = false;

        await i18nAppExtensionInit(I18nEnvironments.CLI);

        this.initialize();

        try {
            for (const classDescriptor of getClassDescriptorsMap().values()) {
                const namespace = classDescriptor.namespace;
                const namespacePrefix = namespace === undefined ? "" : `${namespace}.`;
                const className = classDescriptor.name;
                const methodInfix = classDescriptor.methodInfix;

                // Namespace-qualified class name is used to construct object name.
                const namespaceClassName = `${namespacePrefix}${className}`;

                // First capture group is:
                // - one or more uppercase letters followed by zero or more numbers; or
                // - single uppercase letter followed by zero or more characters except uppercase letters or period.
                // Second capture group is:
                // - single uppercase letter followed by zero or more characters except period; or
                // - zero characters (empty string).
                // Third capture group, separated by optional period, is:
                // - single uppercase letter followed by zero or more characters (remainder of string); or
                // - zero characters (empty string).
                const classNameMatch = /^([A-Z]+[0-9]*|[A-Z][^A-Z.]*)([A-Z][^.]*|)\.?([A-Z].*|)$/.exec(namespaceClassName);

                if (classNameMatch === null) {
                    throw new Error(`${namespaceClassName} is not a valid namespace-qualified class name`);
                }

                const proxyObjectDescriptor: ProxyObjectDescriptor = {
                    namespace,
                    className,
                    namespaceClassName,
                    classDescriptor,
                    objectName: `${classNameMatch[1].toLowerCase()}${classNameMatch[2]}${classNameMatch[3]}`
                };

                this.createProxyObject(proxyObjectDescriptor);

                for (const methodDescriptor of classDescriptor.methodDescriptors) {
                    const methodName = methodDescriptor.name;
                    const infixBefore = methodDescriptor.infixBefore;

                    let functionName: string;

                    if (methodInfix === undefined || methodDescriptor.ignoreInfix === true) {
                        // No other classes in the hierarchy or no infix required.
                        functionName = methodName;
                    } else if (infixBefore === undefined) {
                        // Other classes in the hierarchy and infix is postfix.
                        functionName = `${methodName}${methodInfix}`;
                    } else {
                        const insertIndex = methodName.indexOf(infixBefore);

                        if (insertIndex === -1) {
                            throw new Error(`Cannot find "${infixBefore}" in method name ${methodName}`);
                        }

                        // Other classes in the hierarchy and infix is in the middle of the string.
                        functionName = `${methodName.substring(0, insertIndex)}${methodInfix}${methodName.substring(insertIndex)}`;
                    }

                    const namespaceFunctionName = `${namespacePrefix}${functionName}`;

                    const functionLocalizationsMap = this.generateLocalizationsMap<FunctionLocalization>(`Functions.${namespaceFunctionName}.`, (locale, localization) => ({
                        ...localization,
                        documentationURL: `${Generator.DOCUMENTATION_BASE_URL}${locale === this.defaultLocale ? "" : `${locale}/`}${Generator.DOCUMENTATION_PATH}${namespace === undefined ? "" : `${namespace}/`}${localization.name}.html`
                    }));

                    this._functionLocalizationsMapsMap.set(namespaceFunctionName, functionLocalizationsMap);

                    this.createProxyFunction({
                        ...proxyObjectDescriptor,
                        functionName,
                        namespaceFunctionName,
                        localizationsMap: functionLocalizationsMap,
                        proxyParameterDescriptors: methodDescriptor.parameterDescriptors.map((parameterDescriptor) => {
                            const expandedParameterDescriptor = expandParameterDescriptor(parameterDescriptor);

                            const parameterName = expandedParameterDescriptor.name;

                            const parameterLocalizationsMap = this.generateLocalizationsMap(`Parameters.${parameterName}.`, (_locale, localization) => localization);

                            this._parameterLocalizationsMapsMap.set(`${namespaceFunctionName}.${parameterName}`, parameterLocalizationsMap);

                            return {
                                namespace,
                                parameterName,
                                localizationsMap: parameterLocalizationsMap,
                                parameterDescriptor: expandedParameterDescriptor
                            };
                        }),
                        methodDescriptor
                    });
                }
            }

            success = true;
        } finally {
            await this.finalize(success);
        }
    }
}
