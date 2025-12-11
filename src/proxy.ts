import type { AbstractConstructor, Constructor, TypedAbstractConstructor, TypedFunction } from "@aidc-toolkit/core";
import type { AppExtension } from "./app-extension.js";
import { type ClassDescriptor, expandParameterDescriptor, type MethodDescriptor } from "./descriptor.js";
import { LibProxy } from "./lib-proxy.js";
import type { ErrorExtends } from "./type.js";

/**
 * Remaining parameters past first parameter in constructor.
 */
type RemainingParameters<TConstructor extends TypedAbstractConstructor<TConstructor>> =
    TConstructor extends abstract new (arg0: infer _P0, ...args: infer P) => InstanceType<TConstructor> ? P : never;

/**
 * Proxy class constructor type with fixed constructor signature for concrete class and variable constructor for
 * abstract class.
 *
 * @template T
 * Proxy class type.
 *
 * @template IsAbstract
 * True if the proxy class is abstract.
 *
 * @template TConstructor
 * Proxy class constructor type.
 */
type ProxyClassConstructor<
    ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt,
    T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>,
    IsAbstract extends boolean,
    TConstructor extends TypedAbstractConstructor<TConstructor>
> = IsAbstract extends true ?
    AbstractConstructor<[appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, ...args: RemainingParameters<TConstructor>], T> :
    Constructor<[appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>], T> & typeof LibProxy;

/**
 * Class decorator type. Defines the parameters passed to a class decorator function and the return type as identical to
 * the constructor.
 *
 * @template T
 * Proxy class type.
 *
 * @template IsAbstract
 * True if the proxy class is abstract.
 *
 * @template TConstructor
 * Proxy class constructor type.
 *
 * @template TProxyClassConstructor
 * Narrowed proxy class constructor type.
 */
type ClassDecorator<
    ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt,
    T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>,
    IsAbstract extends boolean,
    TConstructor extends TypedAbstractConstructor<TConstructor>,
    TProxyClassConstructor extends ProxyClassConstructor<ThrowError, TError, TInvocationContext, TBigInt, T, IsAbstract, TConstructor>
> = (Target: TProxyClassConstructor, context: ClassDecoratorContext<TProxyClassConstructor>) => TProxyClassConstructor;

/**
 * Class method decorator type. Defines the parameters passed to a class method decorator function and the return type
 * as identical to the method.
 *
 * @template TFunction
 * Function type.
 */
type ClassMethodDecorator<TFunction extends TypedFunction<TFunction>> =
    (target: TFunction, context: ClassMethodDecoratorContext<ThisParameterType<TFunction>>) => TFunction;

/**
 * Proxy class.
 */
export class Proxy {
    /**
     * Abstract class descriptors map, keyed on declaration class name. Abstract classes are not used directly by target
     * applications.
     */
    readonly #abstractClassDescriptorsMap = new Map<string, ClassDescriptor>();

    /**
     * Concrete class descriptors map, keyed on declaration class name.
     */
    readonly #concreteClassDescriptorsMap = new Map<string, ClassDescriptor>();

    /**
     * Pending method descriptors.
     */
    #pendingMethodDescriptors: MethodDescriptor[] | undefined = undefined;

    /**
     * Describe a proxy class.
     *
     * @template T
     * Proxy class type.
     *
     * @template IsAbstract
     * True if the proxy class is abstract.
     *
     * @template TConstructor
     * Proxy class constructor type.
     *
     * @template TProxyClassConstructor
     * Narrowed proxy class constructor type.
     *
     * @param isAbstract
     * True if class is abstract.
     *
     * @param classDescriptor
     * Class descriptor.
     *
     * @returns
     * Function with which to decorate the class.
     */
    describeClass<
        ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt,
        T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>,
        IsAbstract extends boolean,
        TConstructor extends TypedAbstractConstructor<TConstructor>,
        TProxyClassConstructor extends ProxyClassConstructor<ThrowError, TError, TInvocationContext, TBigInt, T, IsAbstract, TConstructor>
    >(isAbstract: IsAbstract, classDescriptor: Omit<ClassDescriptor, "name" | "isAbstract" | "methodDescriptors"> = {}): ClassDecorator<ThrowError, TError, TInvocationContext, TBigInt, T, IsAbstract, TConstructor, TProxyClassConstructor> {
        const pendingMethodDescriptors: MethodDescriptor[] = [];

        this.#pendingMethodDescriptors = pendingMethodDescriptors;

        return (target: TProxyClassConstructor, context: ClassDecoratorContext<TProxyClassConstructor>) => {
            const name = context.name;

            // Validate that class descriptor is applied within an appropriate class.
            if (typeof name !== "string") {
                throw new Error(`${String(name)} has an invalid name`);
            }

            const namespacePrefix = classDescriptor.namespace === undefined ? "" : `${classDescriptor.namespace}.`;
            const namespaceClassName = `${namespacePrefix}${name}`;

            const abstractClassDescriptorsMap = this.#abstractClassDescriptorsMap;
            const concreteClassDescriptorsMap = this.#concreteClassDescriptorsMap;

            if (abstractClassDescriptorsMap.has(namespaceClassName) || concreteClassDescriptorsMap.has(namespaceClassName)) {
                throw new Error(`Duplicate class ${namespaceClassName}`);
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class hierarchy is known.
            let baseClassType: typeof LibProxy = target as unknown as typeof LibProxy;
            let baseClassDescriptor: ClassDescriptor | undefined;

            do {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class hierarchy is known.
                baseClassType = Object.getPrototypeOf(baseClassType) as typeof LibProxy;

                const namespaceBaseClassName = `${namespacePrefix}${baseClassType.name}`;

                // Look first within the namespace and then in no namespace, in both abstract class descriptors map and concrete class descriptors map.
                baseClassDescriptor =
                    abstractClassDescriptorsMap.get(namespaceBaseClassName) ?? abstractClassDescriptorsMap.get(baseClassType.name) ??
                    concreteClassDescriptorsMap.get(namespaceBaseClassName) ?? concreteClassDescriptorsMap.get(baseClassType.name);
            } while (baseClassType !== LibProxy && baseClassDescriptor === undefined);

            const baseClassMethodDescriptors = baseClassDescriptor !== undefined ? baseClassDescriptor.methodDescriptors.slice() : [];

            let methodDescriptors: MethodDescriptor[];

            if (classDescriptor.replaceParameterDescriptors !== undefined) {
                const replacementParameterDescriptorsMap = new Map(classDescriptor.replaceParameterDescriptors.map(replaceParameterDescriptor => [replaceParameterDescriptor.name, replaceParameterDescriptor.replacement]));

                // Method descriptors for class have to be built as copies due to possible mutation of parameter descriptors.
                methodDescriptors = baseClassMethodDescriptors.map(baseClassMethodDescriptor => ({
                    ...baseClassMethodDescriptor,
                    parameterDescriptors: baseClassMethodDescriptor.parameterDescriptors.map(parameterDescriptor => replacementParameterDescriptorsMap.get(expandParameterDescriptor(parameterDescriptor).name) ?? parameterDescriptor)
                }));
            } else {
                methodDescriptors = baseClassMethodDescriptors;
            }

            // Replace base class method descriptors with matching names or append new method descriptor.
            for (const pendingMethodDescriptor of pendingMethodDescriptors) {
                const existingIndex = methodDescriptors.findIndex(methodDescriptor => methodDescriptor.name === pendingMethodDescriptor.name);

                if (existingIndex !== -1) {
                    methodDescriptors[existingIndex] = pendingMethodDescriptor;
                } else {
                    methodDescriptors.push(pendingMethodDescriptor);
                }
            }

            (isAbstract ? abstractClassDescriptorsMap : concreteClassDescriptorsMap).set(namespaceClassName, {
                name,
                ...classDescriptor,
                methodDescriptors
            });

            this.#pendingMethodDescriptors = undefined;

            // Target is unmodified.
            return target;
        };
    }

    /**
     * Describe a proxy method.
     *
     * @template TFunction
     * Function type.
     *
     * @param methodDescriptor
     * Method descriptor.
     *
     * @returns
     * Function with which to decorate the method.
     */
    describeMethod<TFunction extends TypedFunction<TFunction>>(methodDescriptor: Omit<MethodDescriptor, "name">): ClassMethodDecorator<TFunction> {
        return (target: TFunction, context: ClassMethodDecoratorContext<ThisParameterType<TFunction>>) => {
            const name = context.name;

            // Validate that method descriptor is applied within an appropriate class and has a valid name.
            if (this.#pendingMethodDescriptors === undefined || typeof name !== "string" || context.static || context.private) {
                throw new Error(`${String(name)} is not defined within a supported class, has an invalid name, is static, or is private`);
            }

            let anyOptional = false;

            // Validate that all parameters have descriptors.
            for (const parameterDescriptor of methodDescriptor.parameterDescriptors) {
                const expandedParameterDescriptor = expandParameterDescriptor(parameterDescriptor);

                if (!expandedParameterDescriptor.isRequired) {
                    anyOptional = true;
                } else if (anyOptional) {
                    throw new Error(`Parameter ${expandedParameterDescriptor.name} descriptor of method ${name} is required but prior parameter descriptor is optional`);
                }
            }

            this.#pendingMethodDescriptors.push({
                name,
                ...methodDescriptor
            });

            // Target is unmodified.
            return target;
        };
    }

    /**
     * Get the class descriptors map.
     */
    get classDescriptorsMap(): Map<string, ClassDescriptor> {
        return this.#concreteClassDescriptorsMap;
    }
}

/**
 * Proxy object used by all proxy classes.
 */
export const proxy = new Proxy();
