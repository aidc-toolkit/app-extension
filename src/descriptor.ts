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
     * True if type is a matrix (method accepts or returns, or parameter is, a two-dimensional array).
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
 * Extends parameter descriptor.
 */
export interface ExtendsParameterDescriptor extends Partial<ParameterDescriptor> {
    /**
     * Parameter descriptor that this one extends.
     */
    readonly extendsDescriptor: ParameterDescriptor | ExtendsParameterDescriptor;

    /**
     * Sort order within extended parameter descriptor.
     */
    readonly sortOrder?: number;
}

/**
 * Replacement parameter descriptor.
 */
export interface ReplacementParameterDescriptor {
    /**
     * Name to replace.
     */
    readonly name: string;

    /**
     * Replacement parameter descriptor.
     */
    readonly replacement: ParameterDescriptor;
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
     * If true, function is hidden from user interface.
     */
    readonly isHidden?: boolean;

    /**
     * If true, function is volatile and should be reevaluated regulary.
     */
    readonly isVolatile?: boolean;

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

    /**
     * Function name with optional infix.
     */
    readonly functionName: string;

    /**
     * Function name in optional namespace with optional infix.
     */
    readonly namespaceFunctionName: string;
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
     * Replacement parameter descriptors  for class hierarchies where parameter types can narrow
     */
    readonly replacementParameterDescriptors?: ReplacementParameterDescriptor[];

    /**
     * Class name in optional namespace.
     */
    readonly namespaceClassName: string;

    /**
     * Object name.
     */
    readonly objectName: string;

    /**
     * Method descriptors.
     */
    readonly methodDescriptors: readonly MethodDescriptor[];
}
