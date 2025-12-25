import {
    type AbstractConstructor,
    type Constructor,
    loggableValue,
    omit,
    type TypedAbstractConstructor
} from "@aidc-toolkit/core";
import type { Logger } from "tslog";
import type { AppExtension } from "./app-extension.js";
import type {
    ClassDescriptor,
    ExtendsParameterDescriptor,
    MethodDescriptor,
    ParameterDescriptor,
    ReplacementParameterDescriptor
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
    ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt,
    T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>,
    IsAbstract extends boolean,
    TConstructor extends TypedAbstractConstructor<TConstructor>
> = IsAbstract extends true ?
    AbstractConstructor<[appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>, ...args: RemainingConstructorParameters<TConstructor>], T> :
    Constructor<[appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>], T>;

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
type ClassMethodDecorator<TThis, TArguments extends unknown[], TReturn> =
    (target: (this: TThis, ...args: TArguments) => TReturn, context: ClassMethodDecoratorContext<TThis>) => (this: TThis, ...args: TArguments) => TReturn;

/**
 * Subset of method descriptor used during decoration process.
 */
type InterimMethodDescriptor = Omit<MethodDescriptor, "functionName" | "namespaceFunctionName">;

/**
 * Subset of method descriptor used in call to decorator.
 */
interface DecoratorMethodDescriptor extends Omit<InterimMethodDescriptor, "name" | "parameterDescriptors"> {
    parameterDescriptors: Array<ParameterDescriptor | ExtendsParameterDescriptor>;
}

/**
 * Subset of class descriptor used during decoration process.
 */
type InterimClassDescriptor =
    Omit<ClassDescriptor, "name" | "namespaceClassName" | "objectName" | "methodDescriptors">;

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
     * Abstract class descriptors map, keyed on declaration class name. Abstract classes are not used directly by target
     * applications.
     */
    readonly #abstractClassDescriptorsMap = new Map<string, ClassDescriptor>();

    /**
     * Concrete class descriptors map, keyed on declaration class name.
     */
    readonly #concreteClassDescriptorsMap = new Map<string, ClassDescriptor>();

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
        ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt,
        T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>,
        IsAbstract extends boolean,
        TConstructor extends TypedAbstractConstructor<TConstructor>,
        TProxyClassConstructor extends ProxyClassConstructor<ThrowError, TError, TInvocationContext, TBigInt, T, IsAbstract, TConstructor>
    >(isAbstract: IsAbstract, decoratorClassDescriptor: DecoratorClassDescriptor = {}): ClassDecorator<ThrowError, TError, TInvocationContext, TBigInt, T, IsAbstract, TConstructor, TProxyClassConstructor> {
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
            const name = context.name;

            // Validate that class descriptor is applied within an appropriate class.
            if (typeof name !== "string") {
                throw new Error(`${String(name)} has an invalid name`);
            }

            const namespacePrefix = decoratorClassDescriptor.namespace === undefined ? "" : `${decoratorClassDescriptor.namespace}.`;
            const namespaceClassName = `${namespacePrefix}${name}`;

            const abstractClassDescriptorsMap = this.#abstractClassDescriptorsMap;
            const concreteClassDescriptorsMap = this.#concreteClassDescriptorsMap;

            if (abstractClassDescriptorsMap.has(namespaceClassName) || concreteClassDescriptorsMap.has(namespaceClassName)) {
                throw new Error(`Duplicate class ${namespaceClassName}`);
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class hierarchy is known.
            let baseClassType: typeof LibProxy = Target as unknown as typeof LibProxy;
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

            let interimMethodDescriptors: InterimMethodDescriptor[];

            if (baseClassDescriptor !== undefined) {
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

                let functionName: string;

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

                const namespaceFunctionName = `${namespacePrefix}${functionName}`;

                const methodDescriptor = {
                    ...interimMethodDescriptor,
                    functionName,
                    namespaceFunctionName
                };

                methodDescriptors.push(methodDescriptor);
            }

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
            const objectNameGroups = /^(?<namespaceFirstWord>[A-Z]+[0-9]*|[A-Z][^A-Z.]*)(?<namespaceRemaining>[A-Z][^.]*|)\.?(?<className>[A-Z].*|)$/.exec(namespaceClassName)?.groups;

            if (objectNameGroups === undefined) {
                throw new Error(`${namespaceClassName} is not a valid namespace-qualified class name`);
            }

            const classDescriptor: ClassDescriptor = {
                name,
                ...interimClassDescriptor,
                namespaceClassName,
                objectName: `${objectNameGroups["namespaceFirstWord"].toLowerCase()}${objectNameGroups["namespaceRemaining"]}${objectNameGroups["className"]}`,
                methodDescriptors
            };

            (isAbstract ? abstractClassDescriptorsMap : concreteClassDescriptorsMap).set(namespaceClassName, classDescriptor);

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
                            namespace: decoratorClassDescriptor.namespace,
                            className: name,
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

            // Validate that method descriptor is applied within an appropriate class and has a valid name.
            if (this.#interim === undefined || typeof name !== "string" || context.static || context.private) {
                throw new Error(`${String(name)} is not defined within a supported class, has an invalid name, is static, or is private`);
            }

            let anyOptional = false;

            // Expand all parameter descriptors.
            const parameterDescriptors = decoratorMethodDescriptor.parameterDescriptors.map((decoratorParameterDescriptor) => {
                const parameterDescriptor = expandParameterDescriptor(decoratorParameterDescriptor);

                if (!parameterDescriptor.isRequired) {
                    anyOptional = true;
                } else if (anyOptional) {
                    throw new Error(`Parameter ${parameterDescriptor.name} descriptor of method ${name} is required but prior parameter descriptor is optional`);
                }

                return parameterDescriptor;
            });

            this.#interim.methodDescriptors.push({
                name,
                ...decoratorMethodDescriptor,
                parameterDescriptors
            });

            return function methodProxy(this: TThis, ...args: TArguments): TReturn {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class has been modified to add log method.
                const targetLogger = this as TargetLogger;

                let result: TReturn;

                try {
                    result = target.call(this, ...args);

                    // Volatile methods are not logged due to frequency.
                    if (!(decoratorMethodDescriptor.isVolatile ?? false)) {
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
