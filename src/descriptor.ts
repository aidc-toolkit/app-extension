/**
 * Core descriptor.
 */
interface Descriptor {
    /**
     * Name.
     */
    readonly name: string;
}

/**
 * Types supported by proxy methods.
 */
export const Types = {
    /**
     * String.
     */
    String: 0,

    /**
     * Number or enumeration.
     */
    Number: 1,

    /**
     * Boolean.
     */
    Boolean: 2,

    /**
     * Any.
     */
    Any: 3
} as const;

/**
 * Type key.
 */
export type TypeKey = keyof typeof Types;

/**
 * Type.
 */
export type Type = typeof Types[TypeKey];

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
    readonly namespace?: string | undefined;

    /**
     * Method infix. If undefined, method name is generated verbatim.
     */
    readonly methodInfix?: string | undefined;

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
