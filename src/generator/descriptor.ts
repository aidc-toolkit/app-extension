import type { BaseParameterDescriptor, ClassDescriptor, MethodDescriptor } from "../descriptor";

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
}

/**
 * Parameter localization.
 */
export interface ParameterLocalization extends Localization {
}

/**
 * Localization descriptor.
 */
export interface LocalizationDescriptor<T extends Localization> {
    /**
     * Localizations map by locale.
     */
    readonly localizationsMap: ReadonlyMap<string, T>;
}

/**
 * Proxy namespace descriptor.
 */
export interface ProxyNamespaceDescriptor {
    /**
     * Namespace if any.
     */
    readonly namespace: string | undefined;
}

/**
 * Proxy class descriptor.
 */
export interface ProxyClassDescriptor extends ProxyNamespaceDescriptor {
    /**
     * Class name.
     */
    readonly className: string;

    /**
     * Namespace-qualified class name.
     */
    readonly namespaceClassName: string;

    /**
     * Class descriptor.
     */
    readonly classDescriptor: ClassDescriptor;
}

/**
 * Proxy object descriptor.
 */
export interface ProxyObjectDescriptor extends ProxyClassDescriptor {
    /**
     * Object name.
     */
    readonly objectName: string;
}

/**
 * Proxy parameter descriptor.
 */
export interface ProxyParameterDescriptor extends ProxyNamespaceDescriptor, LocalizationDescriptor<ParameterLocalization> {
    /**
     * Function name.
     */
    readonly parameterName: string;

    /**
     * Parameter descriptor.
     */
    readonly parameterDescriptor: BaseParameterDescriptor;
}

/**
 * Proxy function descriptor.
 */
export interface ProxyFunctionDescriptor extends ProxyObjectDescriptor, LocalizationDescriptor<FunctionLocalization> {
    /**
     * Function name.
     */
    readonly functionName: string;

    /**
     * Namespace-qualified function name.
     */
    readonly namespaceFunctionName: string;

    /**
     * Proxy parameter descriptors
     */
    readonly proxyParameterDescriptors: ProxyParameterDescriptor[];

    /**
     * Method descriptor.
     */
    readonly methodDescriptor: MethodDescriptor;
}
