import {
    type ClassDescriptor,
    type MethodDescriptor,
    type ParameterDescriptor,
    type Type,
    Types
} from "../descriptor.js";
import { type FunctionLocalization, Generator, type Localization } from "./generator.js";

/**
 * Class type alias.
 */
export interface ClassTypeAlias {
    /**
     * Name.
     */
    readonly name: string;

    /**
     * Getter function.
     */
    readonly getter: string;

    /**
     * Declaration associating name with implementation type and creating getter function.
     */
    readonly declaration: string[];
}

/**
 * Function implementation.
 */
export interface FunctionImplementation {
    /**
     * Function name.
     */
    readonly functionName: string;

    /**
     * Parameter localizations with JavaScript type and parameter descriptor.
     */
    readonly parameterLocalizations: ReadonlyArray<Localization & {
        /**
         * JavaScript type.
         */
        javaScriptType: string;

        /**
         * Parameter descriptor.
         */
        parameterDescriptor?: ParameterDescriptor;
    }>;

    /**
     * Declaration.
     */
    readonly declaration: string[];
}

/**
 * Generator with helpers for writing TypeScript functions file.
 */
export abstract class FunctionsGenerator extends Generator {
    /**
     * Mapping of descriptor types to JavaScript types.
     */
    static readonly #DESCRIPTOR_TYPE_STRINGS: Readonly<Record<Type, string>> = {
        [Types.String]: "string",
        [Types.Number]: "number",
        [Types.Boolean]: "boolean",
        [Types.Any]: "any"
    };

    protected static readonly BASE_IMPORTS = [
        "import * as AppExtension from \"@aidc-toolkit/app-extension\";",
        "import { appExtension } from \"./app-extension.js\";"
    ];

    /**
     * If true, functions are declared inline rather than using `function`.
     */
    readonly #inline: boolean;

    /**
     * If true, application extension supports context.
     */
    readonly #supportsContext: boolean;

    /**
     * Invocation context type name.
     */
    readonly #invocationContextTypeName: string;

    /**
     * Streaming invocation context type name.
     */
    readonly #streamingInvocationContextTypeName: string;

    /**
     * Template declaration for type alias.
     */
    readonly #templateDeclaration: string;

    /**
     * Current class type alias.
     */
    #classTypeAlias!: ClassTypeAlias;

    /**
     * Constructor.
     *
     * @param version
     * Package version.
     *
     * @param inline
     * If true, functions are declared inline rather than using `function`.
     *
     * @param throwError
     * If true, errors are reported through the throw/catch mechanism.
     *
     * @param errorTypeName
     * Error type name.
     *
     * @param supportsContext
     * If true, application extension supports context.
     *
     * Big integer type name.
     * @param invocationContextTypeName
     * Invocation context type name.
     *
     * @param streamingInvocationContextTypeName
     * Streaming invocation context type name.
     *
     * @param bigIntTypeName
     * Big integer type name.
     */
    constructor(version: string, inline: boolean, throwError: boolean, errorTypeName: string, supportsContext: boolean, invocationContextTypeName: string, streamingInvocationContextTypeName: string, bigIntTypeName: string) {
        super(version, true);

        this.#inline = inline;

        this.#supportsContext = supportsContext;
        this.#invocationContextTypeName = invocationContextTypeName;
        this.#streamingInvocationContextTypeName = streamingInvocationContextTypeName;

        this.#templateDeclaration = `<${throwError}, ${errorTypeName}, ${invocationContextTypeName}, ${streamingInvocationContextTypeName}, ${bigIntTypeName}>`;
    }

    /**
     * Get the class type alias.
     */
    get classTypeAlias(): ClassTypeAlias {
        return this.#classTypeAlias;
    }

    /**
     * Get the import statement for a namespace.
     *
     * @param namespace
     * Namespace.
     *
     * @returns
     * Import statement.
     */
    protected getNamespaceImport(namespace: string): string {
        return `import * as AppExtension${namespace} from "@aidc-toolkit/app-extension/${namespace.toLowerCase()}";`;
    }

    /**
     * @inheritDoc
     */
    protected override createClassProxy(classDescriptor: ClassDescriptor): void {
        const classDescriptorNamespace = classDescriptor.namespace ?? "";
        const name = `${classDescriptorNamespace}${classDescriptor.name}`;
        const getter = `get${name}()`;
        const implementation = `AppExtension${classDescriptorNamespace}.${classDescriptor.name}${this.#templateDeclaration}`;

        this.#classTypeAlias = {
            name,
            getter,
            declaration: [
                "",
                "/**",
                " * Class type alias name.",
                " */",
                `type ${name} = ${implementation};`,
                "",
                "/**",
                " * Getter function to get an instance of the class.",
                " *",
                " * @returns",
                " * Class instance.",
                " */",
                `function ${getter}: ${name} {`,
                `    return appExtension.getProxy(${implementation});`,
                "}"
            ]
        };
    }

    /**
     * Get a function implementation.
     *
     * @param methodDescriptor
     * Method descriptor.
     *
     * @param functionNamePrefix
     * Function name prefix.
     *
     * @param functionLocalization
     * Function localization. May be undefined for hidden functions, in which case generated
     *
     * @param parameterCallback
     * Callback to modify parameter in implementation function call.
     *
     * @returns
     * Function implementation.
     */
    protected getFunctionImplementation(methodDescriptor: MethodDescriptor, functionNamePrefix: string, functionLocalization: FunctionLocalization | undefined, parameterCallback?: (name: string, parameterDescriptor: ParameterDescriptor) => string): FunctionImplementation {
        const methodType = `${this.classTypeAlias.name}["${methodDescriptor.name}"]`;

        const parameterDescriptors = methodDescriptor.parameterDescriptors;

        const parameterLocalizations: Array<FunctionImplementation["parameterLocalizations"][number]> = parameterDescriptors.map((parameterDescriptor) => {
            const parameterLocalization = functionLocalization?.parametersMap.get(parameterDescriptor.name) ?? {
                name: parameterDescriptor.name,
                description: "*** NO LOCALIZATION ***"
            };

            return {
                ...parameterLocalization,
                javaScriptType: FunctionsGenerator.#DESCRIPTOR_TYPE_STRINGS[parameterDescriptor.type],
                parameterDescriptor
            };
        });

        const dummyParameters: string[] = [];

        if (this.#supportsContext) {
            if (methodDescriptor.requiresContext === true) {
                parameterLocalizations.push({
                    name: "invocationContext",
                    description: "Invocation context.",
                    javaScriptType: this.#invocationContextTypeName
                });
            }

            if (methodDescriptor.isStream === true) {
                parameterLocalizations.push({
                    name: "streamingInvocationContext",
                    description: "Streaming invocation context.",
                    javaScriptType: this.#streamingInvocationContextTypeName
                });
            }
        } else {
            if (methodDescriptor.requiresContext === true) {
                // Invocation context type name represents a literal dummy value.
                dummyParameters.push(this.#invocationContextTypeName);
            }

            if (methodDescriptor.isStream === true) {
                // Streaming invocation context type name represents a literal dummy value.
                dummyParameters.push(this.#streamingInvocationContextTypeName);
            }
        }

        const asyncQualifier = methodDescriptor.isAsync === true ? "async " : "";
        const functionName = functionNamePrefix === "" ?
            functionLocalization?.name ?? methodDescriptor.name :
            `${functionNamePrefix}${functionLocalization?.titleCaseName ?? methodDescriptor.name.replace(/^[a-z]/u, c => c.toUpperCase())}`;

        return {
            functionName,
            parameterLocalizations,
            declaration: [
                `${
                    !this.#inline ?
                        `export ${asyncQualifier}function ${functionName}` :
                        asyncQualifier
                }(${parameterLocalizations.map((parameterLocalization, index) =>
                    `${parameterLocalization.name}: Parameters<${methodType}>[${index}]`
                ).join(", ")}): ReturnType<${methodType}> ${!this.#inline ? "{" : "=>"}`,
                `    ${!this.#inline ? "return " : ""}${(this.classTypeAlias.getter)}.${methodDescriptor.name}(${[...parameterLocalizations.map(parameterLocalization =>
                    parameterCallback === undefined || parameterLocalization.parameterDescriptor === undefined ?
                        parameterLocalization.name :
                        parameterCallback(parameterLocalization.name, parameterLocalization.parameterDescriptor)
                ), ...dummyParameters].join(", ")})${(!this.#inline ? ";" : "")}`,
                ...!this.#inline ? ["}"] : []
            ]
        };
    }
}
