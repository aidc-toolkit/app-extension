import {
    type AbstractConstructor,
    type Constructor,
    loggableValue,
    omit,
    type TypedAbstractConstructor
} from "@aidc-toolkit/core";
import type { Logger } from "tslog";
import type { AppExtension } from "./app-extension.js";
import {
    type ClassDescriptor,
    type ExtendsParameterDescriptor,
    type MethodDescriptor,
    Multiplicities,
    type ParameterDescriptor,
    type ReplacementParameterDescriptor
} from "./descriptor.js";
import { LibProxy } from "./lib-proxy.js";
import type { ErrorExtends } from "./type.js";

/**
 * Remaining parameters past first parameter in constructor.
 */
type RemainingConstructorParameters<TConstructor extends TypedAbstractConstructor<TConstructor>> =
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
    ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt,
    T extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>,
    IsAbstract extends boolean,
    TConstructor extends TypedAbstractConstructor<TConstructor>
> = IsAbstract extends true ?
    AbstractConstructor<[appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>, ...args: RemainingConstructorParameters<TConstructor>], T> :
    Constructor<[appExtension: AppExtension<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>], T>;

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
    ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt,
    T extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>,
    IsAbstract extends boolean,
    TConstructor extends TypedAbstractConstructor<TConstructor>,
    TProxyClassConstructor extends ProxyClassConstructor<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, T, IsAbstract, TConstructor>
> = (Target: TProxyClassConstructor, context: ClassDecoratorContext<TProxyClassConstructor>) => TProxyClassConstructor;

/**
 * Class method decorator type. Defines the parameters passed to a class method decorator function and the return type
 * as identical to the method.
 *
 * @template TFunction
 * Function type.
 */
type ClassMethodDecorator<TThis, TArguments extends unknown[], TReturn> =
    (target: (this: TThis, ...args: TArguments) => TReturn, context: ClassMethodDecoratorContext<TThis>) => (this: TThis, ...args: TArguments) => TReturn;

/**
 * Subset of method descriptor used during decoration process.
 */
type InterimMethodDescriptor = Omit<MethodDescriptor, "functionName">;

/**
 * Subset of method descriptor used in call to decorator.
 */
interface DecoratorMethodDescriptor extends Omit<InterimMethodDescriptor, "name" | "parameterDescriptors"> {
    parameterDescriptors: Array<ParameterDescriptor | ExtendsParameterDescriptor>;
}

/**
 * Subset of class descriptor used during decoration process.
 */
interface InterimClassDescriptor extends Omit<ClassDescriptor, "name" | "category" | "objectName" | "methodDescriptors"> {
    readonly category?: string;
}

/**
 * Subset of class descriptor used in call to decorator.
 */
interface DecoratorClassDescriptor extends Omit<InterimClassDescriptor, "replacementParameterDescriptors"> {
    readonly replacementParameterDescriptors?: ReadonlyArray<Omit<ReplacementParameterDescriptor, "replacement"> & {
        readonly replacement: ParameterDescriptor | ExtendsParameterDescriptor;
    }>;
}

/**
 * Expand a parameter descriptor to its full form with all required attributes.
 *
 * @param parameterDescriptor
 * Parameter descriptor.
 *
 * @returns
 * Parameter descriptor in its full form.
 */
export function expandParameterDescriptor(parameterDescriptor: ParameterDescriptor | ExtendsParameterDescriptor): ParameterDescriptor {
    return !("extendsDescriptor" in parameterDescriptor) ?
        parameterDescriptor :
        {
            ...expandParameterDescriptor(parameterDescriptor.extendsDescriptor),
            ...parameterDescriptor
        };
}

/**
 * Placeholder for interim descriptors.
 */
interface Interim {
    /**
     * Interim class descriptor.
     */
    readonly classDescriptor: InterimClassDescriptor;

    /**
     * Interim method descriptors.
     */
    readonly methodDescriptors: InterimMethodDescriptor[];
}

/**
 * Target logger interface to be implemented by returned decorator class.
 */
interface TargetLogger {
    /**
     * Logger.
     */
    readonly logger: Logger<object>;

    /**
     * Build a function that returns a loggable value for a method call.
     *
     * @param methodName
     * Method name.
     *
     * @param args
     * Input arguments.
     *
     * @param result
     * Output result.
     */
    callBuilder: (methodName: string, args: unknown[], result: unknown) => () => unknown;
}

/**
 * Proxy class.
 */
export class Proxy {
    /**
     * Abstract class descriptors map, keyed on declaration class. Abstract classes are not used directly by target
     * applications.
     */
    readonly #abstractClassDescriptorsMap = new Map<typeof LibProxy, ClassDescriptor>();

    /**
     * Concrete class descriptors map, keyed on declaration class.
     */
    readonly #concreteClassDescriptorsMap = new Map<typeof LibProxy, ClassDescriptor>();

    /**
     * Interim object.
     */
    #interim: Interim | undefined = undefined;

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
     * @param decoratorClassDescriptor
     * Class descriptor.
     *
     * @returns
     * Function with which to decorate the class.
     */
    describeClass<
        ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TStreamingInvocationContext, TBigInt,
        T extends LibProxy<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt>,
        IsAbstract extends boolean,
        TConstructor extends TypedAbstractConstructor<TConstructor>,
        TProxyClassConstructor extends ProxyClassConstructor<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, T, IsAbstract, TConstructor>
    >(isAbstract: IsAbstract, decoratorClassDescriptor: DecoratorClassDescriptor = {}): ClassDecorator<ThrowError, TError, TInvocationContext, TStreamingInvocationContext, TBigInt, T, IsAbstract, TConstructor, TProxyClassConstructor> {
        const interimClassDescriptor: InterimClassDescriptor = decoratorClassDescriptor.replacementParameterDescriptors === undefined ?
            omit(decoratorClassDescriptor, "replacementParameterDescriptors") :
            {
                ...decoratorClassDescriptor,
                replacementParameterDescriptors: decoratorClassDescriptor.replacementParameterDescriptors.map(replaceParameterDescriptor => ({
                    ...replaceParameterDescriptor,
                    replacement: expandParameterDescriptor(replaceParameterDescriptor.replacement)
                }))
            };

        const interim: Interim = {
            classDescriptor: interimClassDescriptor,
            methodDescriptors: []
        };

        this.#interim = interim;

        return (Target: TProxyClassConstructor, context: ClassDecoratorContext<TProxyClassConstructor>) => {
            const className = context.name;

            // Validate that class descriptor is applied within an appropriate class.
            if (className === undefined) {
                throw new Error("Class has no name");
            }

            const abstractClassDescriptorsMap = this.#abstractClassDescriptorsMap;
            const concreteClassDescriptorsMap = this.#concreteClassDescriptorsMap;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Target is known to be of type LibProxy.
            const targetClassType = Target as unknown as typeof LibProxy;

            let baseClassType = targetClassType;
            let baseClassDescriptor;

            do {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class hierarchy is known to stop at LibProxy.
                baseClassType = Object.getPrototypeOf(baseClassType) as typeof LibProxy;

                // Look in both abstract class descriptors map and concrete class descriptors map.
                baseClassDescriptor = abstractClassDescriptorsMap.get(baseClassType) ?? concreteClassDescriptorsMap.get(baseClassType);
            } while (baseClassType !== LibProxy && baseClassDescriptor === undefined);

            let namespace = interimClassDescriptor.namespace;
            let category = interimClassDescriptor.category;

            let interimMethodDescriptors: InterimMethodDescriptor[];

            if (baseClassDescriptor !== undefined) {
                // Inherit namespace and category from base class if not explicitly defined.
                namespace ??= baseClassDescriptor.namespace;
                category ??= baseClassDescriptor.category;

                const baseClassMethodDescriptors = baseClassDescriptor.methodDescriptors;
                const replaceParameterDescriptors = decoratorClassDescriptor.replacementParameterDescriptors;

                if (replaceParameterDescriptors !== undefined) {
                    const replacementParameterDescriptorsMap = new Map(replaceParameterDescriptors.map(replaceParameterDescriptor => [replaceParameterDescriptor.name, expandParameterDescriptor(replaceParameterDescriptor.replacement)]));

                    // Interim method descriptors for class have to be built as copies due to possible mutation of parameter descriptors.
                    interimMethodDescriptors = baseClassMethodDescriptors.map(baseClassMethodDescriptor => ({
                        ...baseClassMethodDescriptor,
                        parameterDescriptors: baseClassMethodDescriptor.parameterDescriptors.map(parameterDescriptor => replacementParameterDescriptorsMap.get(parameterDescriptor.name) ?? parameterDescriptor)
                    }));
                } else {
                    interimMethodDescriptors = baseClassMethodDescriptors.slice();
                }
            } else {
                interimMethodDescriptors = [];
            }

            const namespacePrefix = namespace === undefined ? "" : `${namespace}.`;
            const namespaceClassName = `${namespacePrefix}${className}`;

            if (category === undefined) {
                throw new Error(`Missing category for ${namespaceClassName}`);
            }

            // Replace base class method descriptors with matching names or append new method descriptor.
            for (const classInterimMethodDescriptor of interim.methodDescriptors) {
                const existingIndex = interimMethodDescriptors.findIndex(interimMethodDescriptor => interimMethodDescriptor.name === classInterimMethodDescriptor.name);

                if (existingIndex !== -1) {
                    interimMethodDescriptors[existingIndex] = classInterimMethodDescriptor;
                } else {
                    interimMethodDescriptors.push(classInterimMethodDescriptor);
                }
            }

            const methodDescriptors: MethodDescriptor[] = [];

            const methodInfix = decoratorClassDescriptor.methodInfix;

            for (const interimMethodDescriptor of interimMethodDescriptors) {
                const methodName = interimMethodDescriptor.name;
                const infixBefore = interimMethodDescriptor.infixBefore;

                let functionName;

                if (methodInfix === undefined || interimMethodDescriptor.ignoreInfix === true) {
                    // No other classes in the hierarchy or no infix required.
                    functionName = methodName;
                } else if (infixBefore === undefined) {
                    // Other classes in the hierarchy and infix is postfix.
                    functionName = `${methodName}${methodInfix}`;
                } else {
                    const insertIndex = methodName.indexOf(infixBefore);

                    if (insertIndex === -1) {
                        throw new Error(`Cannot find "${infixBefore}" in method ${methodName}`);
                    }

                    // Other classes in the hierarchy and infix is in the middle of the string.
                    functionName = `${methodName.substring(0, insertIndex)}${methodInfix}${methodName.substring(insertIndex)}`;
                }

                methodDescriptors.push({
                    ...interimMethodDescriptor,
                    functionName
                });
            }

            const classDescriptor: ClassDescriptor = {
                ...interimClassDescriptor,
                name: className,
                namespace,
                category,
                methodDescriptors
            };

            (isAbstract ? abstractClassDescriptorsMap : concreteClassDescriptorsMap).set(targetClassType, classDescriptor);

            const methodDescriptorsMap = new Map<string, MethodDescriptor>();

            for (const methodDescriptor of methodDescriptors) {
                methodDescriptorsMap.set(methodDescriptor.name, methodDescriptor);
            }

            this.#interim = undefined;

            return class extends Target implements TargetLogger {
                /**
                 * Get the logger.
                 */
                get logger(): Logger<object> {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type hierarchy is known.
                    return (this as unknown as T).appExtension.logger;
                }

                /**
                 * @inheritDoc
                 */
                callBuilder(methodName: string, args: unknown[], result: unknown): () => unknown {
                    return () => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Method name is known to be valid at this point.
                        const methodDescriptor = methodDescriptorsMap.get(methodName)!;

                        return {
                            namespace,
                            className,
                            methodName,
                            functionName: methodDescriptor.functionName,
                            parameters: methodDescriptor.parameterDescriptors.map((parameterDescriptor, index) => ({
                                name: parameterDescriptor.name,
                                value: loggableValue(args[index])
                            })),
                            result: loggableValue(result)
                        };
                    };
                }
            };
        };
    }

    /**
     * Describe a proxy method.
     *
     * @template TFunction
     * Function type.
     *
     * @param decoratorMethodDescriptor
     * Method descriptor.
     *
     * @returns
     * Function with which to decorate the method.
     */
    describeMethod<TThis, TArguments extends unknown[], TReturn>(decoratorMethodDescriptor: DecoratorMethodDescriptor): ClassMethodDecorator<TThis, TArguments, TReturn> {
        return (target: (this: TThis, ...args: TArguments) => TReturn, context: ClassMethodDecoratorContext<TThis>): (this: TThis, ...args: TArguments) => TReturn => {
            const name = context.name;

            // Validate that method descriptor is applied within an appropriate class.
            if (this.#interim === undefined) {
                throw new Error(`Class for method ${String(name)} does not have a descriptor`);
            }

            // Validate that method descriptor has a valid name and is neither static nor private.
            if (typeof name !== "string" || context.static || context.private) {
                throw new Error(`Method ${String(name)} has an invalid name, is static, or is private`);
            }

            let anyOptional = false;

            // Expand all parameter descriptors.
            const parameterDescriptors = decoratorMethodDescriptor.parameterDescriptors.map((decoratorParameterDescriptor) => {
                const parameterDescriptor = expandParameterDescriptor(decoratorParameterDescriptor);
                const parameterName = parameterDescriptor.name;

                if (!parameterDescriptor.isRequired) {
                    anyOptional = true;
                } else if (anyOptional) {
                    throw new Error(`Parameter ${parameterName} descriptor of method ${name} is required but prior parameter descriptor is optional`);
                }

                if ((parameterDescriptor.multiplicity === Multiplicities.Array || parameterDescriptor.multiplicity === Multiplicities.Matrix) && decoratorMethodDescriptor.multiplicity !== Multiplicities.Matrix) {
                    throw new Error(`Parameter ${parameterName} descriptor of method ${name} is array or matrix but method descriptor is not matrix`);
                }

                return parameterDescriptor;
            });

            this.#interim.methodDescriptors.push({
                ...decoratorMethodDescriptor,
                name,
                parameterDescriptors
            });

            return function methodProxy(this: TThis, ...args: TArguments): TReturn {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class has been modified to add log method.
                const targetLogger = this as TargetLogger;

                let result;

                try {
                    result = target.call(this, ...args);

                    // Stream methods are responsible for their own logging.
                    if (decoratorMethodDescriptor.isStream !== true) {
                        if (!(result instanceof Promise)) {
                            targetLogger.logger.trace(targetLogger.callBuilder(name, args, result));
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Promise interception pattern.
                            result = result.then((promisedResult: unknown) => {
                                targetLogger.logger.trace(targetLogger.callBuilder(name, args, promisedResult));

                                return promisedResult;
                            }).catch((e: unknown) => {
                                targetLogger.logger.error(targetLogger.callBuilder(name, args, e));

                                throw e;
                            }) as TReturn;
                        }
                    }
                } catch (e: unknown) {
                    targetLogger.logger.error(targetLogger.callBuilder(name, args, e));

                    throw e;
                }

                return result;
            };
        };
    }

    /**
     * Get the class descriptors.
     */
    get classDescriptors(): MapIterator<ClassDescriptor> {
        return this.#concreteClassDescriptorsMap.values();
    }
}

/**
 * Proxy object used by all proxy classes.
 */
export const proxy = new Proxy();
