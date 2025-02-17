import fs from "node:fs";
import * as path from "node:path";
import {
    type ClassDescriptor,
    type MethodDescriptor,
    type ParameterDescriptor,
    type ProxyClassType,
    type ProxyDecoratorCallback,
    setProxyDecoratorCallback
} from "./descriptor.js";
import { type AppProxy, LibProxy, type TypedFunction, type ErrorExtends } from "./proxy.js";

/**
 * Proxy base class type.
 */
type ProxyBaseClassType<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>> =
    (new(appProxy: AppProxy<TBigInt, ThrowError, TError>, ...args: unknown[]) => T) & { prototype: T };

/**
 * Abstract generator.
 */
export abstract class Generator implements ProxyDecoratorCallback {
    /**
     * Pending parameter descriptors, consumed and reset when method is described.
     */
    private _pendingParameterDescriptors: ParameterDescriptor[] = [];

    /**
     * Class method descriptors, keyed on declaration class name and method name.
     */
    private readonly _classMethodDescriptorsMap = new Map<string, MethodDescriptor[]>();

    /**
     * Pending class descriptors, consumed and reset when import is processed.
     */
    private _pendingClassDescriptors: ClassDescriptor[] = [];

    /**
     * Constructor.
     */
    protected constructor() {
        setProxyDecoratorCallback(this);
    }

    /**
     * @inheritDoc
     */
    parameterFunction<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(parameterDescriptor: ParameterDescriptor): (target: T, propertyKey: string, parameterIndex: number) => void {
        return (_target: T, _propertyKey: string, parameterIndex: number) => {
            this._pendingParameterDescriptors[parameterIndex] = parameterDescriptor;
        };
    }

    /**
     * @inheritDoc
     */
    methodFunction<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(methodDescriptor: Omit<MethodDescriptor, "name" | "parameterDescriptors">): (target: T, propertyKey: string, propertyDescriptor: PropertyDescriptor) => void {
        return (target: T, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
            const declarationClassName = target.constructor.name;

            // Validate that method descriptor is applied to a function.
            if (typeof propertyDescriptor.value !== "function") {
                throw new Error(`${declarationClassName}.${propertyKey} is not a method`);
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Known to be a method.
            const parameterCount = (propertyDescriptor.value as TypedFunction<(...args: unknown[]) => unknown>).length;

            let anyOptional = false;

            // Validate that all parameters have descriptors.
            for (let index = 0; index < parameterCount; index++) {
                const parameterDescriptor = this._pendingParameterDescriptors[index];

                if (typeof parameterDescriptor === "undefined") {
                    throw new Error(`Missing parameter descriptor at index ${index} of ${declarationClassName}.${propertyKey}`);
                }

                if (!parameterDescriptor.isRequired) {
                    anyOptional = true;
                } else if (anyOptional) {
                    throw new Error(`Parameter descriptor ${parameterDescriptor.name} at index ${index} of ${declarationClassName}.${propertyKey} is required but prior parameter descriptor ${this._pendingParameterDescriptors[index - 1].name} is optional`);
                }
            }

            let methodDescriptors = this._classMethodDescriptorsMap.get(declarationClassName);
            if (methodDescriptors === undefined) {
                methodDescriptors = [];
                this._classMethodDescriptorsMap.set(declarationClassName, methodDescriptors);
            }

            // Method descriptors array is constructed in reverse order so that final result is in the correct order.
            methodDescriptors.push({
                name: propertyKey,
                ...methodDescriptor,
                parameterDescriptors: this._pendingParameterDescriptors
            });

            this._pendingParameterDescriptors = [];
        };
    }

    /**
     * @inheritDoc
     */
    classFunction<TBigInt, ThrowError extends boolean, TError extends ErrorExtends<ThrowError>, T extends LibProxy<TBigInt, ThrowError, TError>>(classDescriptor: Omit<ClassDescriptor, "name" | "methodDescriptors">): (classType: ProxyClassType<TBigInt, ThrowError, TError, T>) => void {
        return (classType: ProxyClassType<TBigInt, ThrowError, TError, T>) => {
            const methodDescriptorsMap = new Map<string, MethodDescriptor>();

            const classMethodDescriptorsMap = this._classMethodDescriptorsMap;

            /**
             * Build method descriptors map from every class in hierarchy until LibProxy class is reached.
             *
             * @param classType
             * Class type.
             */
            function buildMethodDescriptorsMap(classType: ProxyBaseClassType<TBigInt, ThrowError, TError, T>): void {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Class hierarchy is known.
                const baseClassType = Object.getPrototypeOf(classType) as ProxyBaseClassType<TBigInt, ThrowError, TError, T>;

                // Start with class furthest up the hierarchy.
                if (baseClassType !== LibProxy) {
                    buildMethodDescriptorsMap(baseClassType);
                }

                const classMethodDescriptors = classMethodDescriptorsMap.get(classType.name);

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

                // Method descriptors for class have to be built as copies due to mutation of parameter descriptors.
                methodDescriptors = Array.from(methodDescriptorsMap.values().map((methodDescriptor) => {
                    const parameterDescriptors: ParameterDescriptor[] = [];

                    for (const parameterDescriptor of methodDescriptor.parameterDescriptors) {
                        parameterDescriptors.push(replacementParameterDescriptorsMap.get(parameterDescriptor.name) ?? parameterDescriptor);
                    }

                    return {
                        ...methodDescriptor,
                        parameterDescriptors
                    };
                }));
            } else {
                methodDescriptors = Array.from(methodDescriptorsMap.values());
            }

            this._pendingClassDescriptors.push({
                name: classType.name,
                ...classDescriptor,
                methodDescriptors
            });
        };
    }

    /**
     * Open an output stream, creating the directory if necessary.
     *
     * @param fileName
     * File name.
     *
     * @returns
     * Output stream.
     */
    protected openOutputStream(fileName: string): fs.WriteStream {
        const directoryName = path.dirname(fileName);

        // Create directory if it doesn't exist.
        if (!fs.existsSync(directoryName)) {
            fs.mkdirSync(directoryName, {
                recursive: true
            });
        }

        return fs.createWriteStream(fileName);
    }

    /**
     * Initialize the generation of the output.
     */
    protected abstract initialize(): void;

    /**
     * Start importing a file.
     *
     * @param fileName
     * Name of file being imported.
     */
    protected abstract startImport(fileName: string): void;

    /**
     * Create a proxy object.
     *
     * @param className
     * Class name of proxy object.
     *
     * @param objectName
     * Object name of proxy object.
     */
    protected abstract createProxyObject(className: string, objectName: string): void;

    /**
     * Create a proxy function.
     *
     * @param className
     * Class name of proxy function.
     *
     * @param objectName
     * Object name of proxy function.
     *
     * @param functionName
     * Function name of proxy function.
     *
     * @param methodDescriptor
     * Method descriptor for proxy function.
     */
    protected abstract createProxyFunction(className: string, objectName: string, functionName: string, methodDescriptor: MethodDescriptor): void;

    /**
     * End importing a file.
     *
     * @param fileName
     * Name of file being imported.
     */
    protected abstract endImport(fileName: string): void;

    /**
     * Finalize the generation of the output.
     */
    protected abstract finalize(): void;

    /**
     * Generate by processing individual imports.
     */
    async generate(): Promise<void> {
        this.initialize();

        try {
            for (const line of fs.readFileSync("src/index.ts", "utf8").split("\n")) {
                const fileNameMatch = /^export \* from "(.+-proxy\.js)";$/.exec(line);
                if (fileNameMatch !== null) {
                    const fileName = fileNameMatch[1];

                    // Side effect of import is to build descriptors.
                    await import(fileName).then(() => {
                        this.startImport(fileName);

                        for (const classDescriptor of this._pendingClassDescriptors) {
                            const className = classDescriptor.name;
                            const methodInfix = classDescriptor.methodInfix;

                            // First capture group is:
                            // - one or more uppercase letters followed by zero or more numbers; or
                            // - single uppercase letter followed by zero or more characters except uppercase letters.
                            // Second capture group is:
                            // - single uppercase followed by zero or more characters (remainder of string); or
                            // - zero characters (empty string).
                            const classNameMatch = /^([A-Z]+[0-9]*|[A-Z][^A-Z]*)([A-Z].*|)$/.exec(className);

                            if (classNameMatch === null) {
                                throw new Error(`${className} is not a valid class name`);
                            }

                            const objectName = `${classNameMatch[1].toLowerCase()}${classNameMatch[2]}`;

                            this.createProxyObject(className, objectName);

                            for (const methodDescriptor of classDescriptor.methodDescriptors) {
                                const methodName = methodDescriptor.name;
                                const infixBefore = methodDescriptor.infixBefore;

                                let functionName: string;

                                if (methodInfix === undefined || methodDescriptor.noInfix === true) {
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

                                this.createProxyFunction(className, objectName, functionName, methodDescriptor);
                            }
                        }

                        this.endImport(fileName);

                        this._pendingClassDescriptors = [];
                    });
                }
            }
        } finally {
            this.finalize();
        }
    }
}
