import type { AppExtension } from "./app-extension.js";
import { LibProxy } from "./lib-proxy.js";
import type { ErrorExtends, TypedFunction } from "./types.js";

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
 * Base parameter descriptor; all attributes required.
 */
export interface BaseParameterDescriptor extends TypeDescriptor {
    /**
     * True if required.
     */
    readonly isRequired: boolean;
}

/**
 * Extends parameter descriptor; extends a parameter descriptor and overrides select attributes.
 */
export interface ExtendsParameterDescriptor extends Partial<BaseParameterDescriptor> {
    /**
     * Base parameter descriptor that this one extends.
     */
    readonly extendsDescriptor: ParameterDescriptor;

    /**
     * Sort order within base parameter descriptor if applicable.
     */
    readonly sortOrder?: number;
}

/**
 * Parameter descriptor, either base or extends.
 */
export type ParameterDescriptor = BaseParameterDescriptor | ExtendsParameterDescriptor;

/**
 * Expand a parameter descriptor to its full form with all required attributes.
 *
 * @param parameterDescriptor
 * Parameter descriptor.
 *
 * @returns
 * Parameter descriptor in its full form.
 */
export function expandParameterDescriptor(parameterDescriptor: ParameterDescriptor): BaseParameterDescriptor {
    return !("extendsDescriptor" in parameterDescriptor) ?
        parameterDescriptor :
        {
            ...expandParameterDescriptor(parameterDescriptor.extendsDescriptor),
            ...parameterDescriptor
        };
}

/**
 * Method descriptor.
 */
export interface MethodDescriptor extends TypeDescriptor {
    /**
     * If true, application-specific invocation context is required.
     */
    readonly requiresContext?: boolean;

    /**
     * If true, method infix is ignored.
     */
    readonly ignoreInfix?: boolean;

    /**
     * String before which method infix appears. If undefined, infix is appended to the method name. Ignored if
     * `ignoreInfix` is true.
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
     * Class namespace. If not provided, class is at the top level.
     */
    readonly namespace?: string;

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
 * Proxy class type with fixed constructor.
 */
type ProxyClassType<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>> =
    (new(appExtension: AppExtension<ThrowError, TError, TInvocationContext, TBigInt>) => T) & typeof LibProxy;

/**
 * Pending parameter descriptors, consumed and reset when method is described.
 */
let pendingParameterDescriptors: ParameterDescriptor[] = [];

/**
 * Class method descriptors, keyed on declaration class name and method name.
 */
const classMethodsDescriptorsMap = new Map<string, MethodDescriptor[]>();

/**
 * Class descriptors, keyed on declaration class name.
 */
const classDescriptorsMap = new Map<string, ClassDescriptor>();

/**
 * Proxy parameter decorator.
 *
 * @param parameterDescriptor
 * Parameter descriptor.
 *
 * @returns
 * Function defining metadata for the parameter.
 */
export function ProxyParameter<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>>(parameterDescriptor: ParameterDescriptor): ((target: T, propertyKey: string, parameterIndex: number) => void) {
    return (_target: T, _propertyKey: string, parameterIndex: number) => {
        pendingParameterDescriptors[parameterIndex] = parameterDescriptor;
    };
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
export function ProxyMethod<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>>(methodDescriptor: Omit<MethodDescriptor, "name" | "parameterDescriptors">): ((target: T, propertyKey: string, propertyDescriptor: PropertyDescriptor) => void) {
    return (target: T, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
        const declarationClassName = target.constructor.name;

        // Validate that method descriptor is applied to a function.
        if (typeof propertyDescriptor.value !== "function") {
            throw new Error(`${declarationClassName}.${propertyKey} is not a method`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Known to be a method.
        const parameterCount = (propertyDescriptor.value as TypedFunction<(...args: unknown[]) => unknown>).length - (!(methodDescriptor.requiresContext ?? false) ? 0 : 1);

        let anyOptional = false;

        // Validate that all parameters have descriptors.
        for (let index = 0; index < parameterCount; index++) {
            const parameterDescriptor = expandParameterDescriptor(pendingParameterDescriptors[index]);

            if (typeof parameterDescriptor === "undefined") {
                throw new Error(`Missing parameter descriptor at index ${index} of ${declarationClassName}.${propertyKey}`);
            }

            if (!parameterDescriptor.isRequired) {
                anyOptional = true;
            } else if (anyOptional) {
                throw new Error(`Parameter descriptor ${parameterDescriptor.name} at index ${index} of ${declarationClassName}.${propertyKey} is required but prior parameter descriptor ${pendingParameterDescriptors[index - 1].name} is optional`);
            }
        }

        let methodDescriptors = classMethodsDescriptorsMap.get(declarationClassName);
        if (methodDescriptors === undefined) {
            methodDescriptors = [];
            classMethodsDescriptorsMap.set(declarationClassName, methodDescriptors);
        }

        // Method descriptors array is constructed in reverse order so that final result is in the correct order.
        methodDescriptors.push({
            name: propertyKey,
            ...methodDescriptor,
            parameterDescriptors: pendingParameterDescriptors
        });

        pendingParameterDescriptors = [];
    };
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
export function ProxyClass<ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, TInvocationContext, TBigInt, T extends LibProxy<ThrowError, TError, TInvocationContext, TBigInt>>(classDescriptor: Omit<ClassDescriptor, "name" | "methodDescriptors"> = {}): ((classType: ProxyClassType<ThrowError, TError, TInvocationContext, TBigInt, T>) => void) {
    return (classType: ProxyClassType<ThrowError, TError, TInvocationContext, TBigInt, T>) => {
        const methodDescriptorsMap = new Map<string, MethodDescriptor>();

        /**
         * Build method descriptors map from every class in hierarchy until LibProxy class is reached.
         *
         * @param classType
         * Class type.
         */
        function buildMethodDescriptorsMap(classType: typeof LibProxy): void {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class hierarchy is known.
            const baseClassType = Object.getPrototypeOf(classType) as typeof LibProxy;

            // Start with class furthest up the hierarchy.
            if (baseClassType !== LibProxy) {
                buildMethodDescriptorsMap(baseClassType);
            }

            const classMethodDescriptors = classMethodsDescriptorsMap.get(classType.name);

            if (classMethodDescriptors !== undefined) {
                for (const classMethodDescriptor of classMethodDescriptors) {
                    // If any class overrides a base class method, it will appear in the same position as the base class method.
                    methodDescriptorsMap.set(classMethodDescriptor.name, classMethodDescriptor);
                }
            }
        }

        buildMethodDescriptorsMap(classType);

        let methodDescriptors: MethodDescriptor[];

        if (classDescriptor.replaceParameterDescriptors !== undefined) {
            const replacementParameterDescriptorsMap = new Map(classDescriptor.replaceParameterDescriptors.map(replaceParameterDescriptor => [replaceParameterDescriptor.name, replaceParameterDescriptor.replacement]));

            // Method descriptors for class have to be built as copies due to possible mutation of parameter descriptors.
            methodDescriptors = Array.from(methodDescriptorsMap.values()).map(methodDescriptor => ({
                ...methodDescriptor,
                parameterDescriptors: methodDescriptor.parameterDescriptors.map(parameterDescriptor => replacementParameterDescriptorsMap.get(expandParameterDescriptor(parameterDescriptor).name) ?? parameterDescriptor)
            }));
        } else {
            methodDescriptors = Array.from(methodDescriptorsMap.values());
        }

        classDescriptorsMap.set(classType.name, {
            name: classType.name,
            ...classDescriptor,
            methodDescriptors
        });
    };
}

/**
 * Get class descriptors.
 *
 * @returns
 * Class descriptors.
 */
export function getClassDescriptors(): ReadonlyMap<string, ClassDescriptor> {
    return classDescriptorsMap;
}
