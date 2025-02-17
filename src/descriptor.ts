import type { AppProxy, LibProxy, ErrorExtends } from "./proxy.js";

/**
 * Core descriptor.
 */
interface Descriptor {
    readonly name: string;
}

/**
 * Types supported by proxy methods.
 */
export enum Type {
    /**
     * String.
     */
    String,

    /**
     * Number or enumeration.
     */
    Number,

    /**
     * Boolean.
     */
    Boolean,

    /**
     * Any.
     */
    Any
}

/**
 * Type descriptor.
 */
interface TypeDescriptor extends Descriptor {
    /**
     * Type.
     */
    readonly type: Type;

    /**
     * True if type is a matrix (method accepts or returns a two-dimensional array).
     */
    readonly isMatrix: boolean;
}

/**
 * Parameter descriptor.
 */
export interface ParameterDescriptor extends TypeDescriptor {
    /**
     * True if required.
     */
    readonly isRequired: boolean;
}

/**
 * Method descriptor.
 */
export interface MethodDescriptor extends TypeDescriptor {
    /**
     * If true, method infix is ignored.
     */
    readonly noInfix?: boolean;

    /**
     * String before which method infix appears. If undefined, infix is appended to the method name. Ignored if
     * `noInfix` is true.
     */
    readonly infixBefore?: string;

    /**
     * Parameter descriptors.
     */
    readonly parameterDescriptors: readonly ParameterDescriptor[];
}

/**
 * Class descriptor.
 */
export interface ClassDescriptor extends Descriptor {
    /**
     * Method infix. If undefined, method name is generated verbatim.
     */
    readonly methodInfix?: string;

    /**
     * Replace parameter descriptors for class hierarchies where enumeration parameter descriptors can change.
     */
    readonly replaceParameterDescriptors?: ReadonlyArray<{
        readonly name: string;
        readonly replacement: ParameterDescriptor;
    }>;

    /**
     * Method descriptors.
     */
    readonly methodDescriptors: readonly MethodDescriptor[];
}

/**
 * Callback to process proxy decorators.
 */
export interface ProxyDecoratorCallback {
    /**
     * Parameter function.
     *
     * @param parameterDescriptor
     * Parameter descriptor.
     *
     * @returns
     * Function to process parameter descriptor.
     */
    readonly parameterFunction: <TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(parameterDescriptor: ParameterDescriptor) => ((target: T, propertyKey: string, parameterIndex: number) => void);

    /**
     * Method function.
     *
     * @param methodDescriptor
     * Method descriptor.
     *
     * @returns
     * Function to process method descriptor.
     */
    readonly methodFunction: <TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(methodDescriptor: Omit<MethodDescriptor, "name" | "parameterDescriptors">) => ((target: T, propertyKey: string, propertyDescriptor: PropertyDescriptor) => void);

    /**
     * Class function.
     *
     * @param classDescriptor
     * Class descriptor.
     *
     * @returns
     * Function to process class descriptor.
     */
    readonly classFunction: <TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(classDescriptor: Omit<ClassDescriptor, "name" | "methodDescriptors">) => ((classType: ProxyClassType<TBigInt, ThrowError, TError, T>) => void);
}

/**
 * Default operation for decorators.
 *
 * @returns
 * No-op function.
 */
const noOp = () => () => {};

/**
 * Proxy decorator callback, initialized to no-op functions.
 */
let proxyDecoratorCallback: ProxyDecoratorCallback = {
    parameterFunction: noOp,
    methodFunction: noOp,
    classFunction: noOp
};

/**
 * Set the proxy decorator callback.
 *
 * @param callback
 * Proxy decorator callback.
 */
export function setProxyDecoratorCallback(callback: ProxyDecoratorCallback): void {
    proxyDecoratorCallback = callback;
}

/**
 * Proxy class type, enforcing inheritance hierarchy and constructor parameters.
 */
export type ProxyClassType<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>> =
    (new(appProxy: AppProxy<TBigInt, ThrowError, TError>) => T) & { prototype: T };

/**
 * Proxy parameter decorator.
 *
 * @param parameterDescriptor
 * Parameter descriptor.
 *
 * @returns
 * Function defining metadata for the parameter.
 */
export function ProxyParameter<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(parameterDescriptor: ParameterDescriptor): ((target: T, propertyKey: string, parameterIndex: number) => void) {
    return proxyDecoratorCallback.parameterFunction(parameterDescriptor);
}

/**
 * Proxy method decorator.
 *
 * @param methodDescriptor
 * Method descriptor.
 *
 * @returns
 * Function defining metadata for the method.
 */
export function ProxyMethod<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(methodDescriptor: Omit<MethodDescriptor, "name" | "parameterDescriptors">): ((target: T, propertyKey: string, propertyDescriptor: PropertyDescriptor) => void) {
    return proxyDecoratorCallback.methodFunction(methodDescriptor);
}

/**
 * Proxy class decorator.
 *
 * @param classDescriptor
 * Class descriptor.
 *
 * @returns
 * Function defining metadata for the class.
 */
export function ProxyClass<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(classDescriptor: Omit<ClassDescriptor, "name" | "methodDescriptors"> = {}): ((classType: ProxyClassType<TBigInt, ThrowError, TError, T>) => void) {
    return proxyDecoratorCallback.classFunction(classDescriptor);
}
