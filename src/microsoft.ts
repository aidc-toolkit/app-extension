import type fs from "node:fs";
import * as path from "node:path";
import type { MethodDescriptor } from "./descriptor.js";
import { Generator } from "./generator.js";

/**
 * Named object metadata.
 */
interface NamedMetadata {
    /**
     * Name.
     */
    name: string;

    /**
     * Description.
     */
    description?: string;
}

/**
 * Types supported by functions.
 */
type Type = "string" | "number" | "boolean" | "any";

/**
 * Type dimensionalities supported by functions.
 */
type Dimensionality = "scalar" | "matrix";

/**
 * Type metadata.
 */
interface TypeMetadata {
    /**
     * Type.
     */
    type?: Type;

    /**
     * Dimensionality.
     */
    dimensionality?: Dimensionality;
}

/**
 * Parameter metadata.
 */
interface ParameterMetadata extends NamedMetadata, TypeMetadata {
    /**
     * True if parameter is optional.
     */
    optional?: boolean;

    /**
     * True if parameter is repeating.
     */
    repeating?: boolean;
}

/**
 * Function options metadata.
 */
interface OptionsMetadata {
    /**
     * True if function requires formula address.
     */
    requiresAddress?: boolean;

    /**
     * True if function requires parameter addresses.
     */
    requiresParameterAddresses?: boolean;

    /**
     * True if function returns a streaming result.
     */
    stream?: boolean;

    /**
     * True if function is cancelable.
     */
    cancelable?: boolean;

    /**
     * True if function is volatile.
     */
    volatile?: boolean;
}

/**
 * Function metadata.
 */
interface FunctionMetadata extends NamedMetadata {
    /**
     * Unique ID.
     */
    id: string;

    /**
     * Parameters.
     */
    parameters: ParameterMetadata[];

    /**
     * Result.
     */
    result: TypeMetadata;

    /**
     * Options.
     */
    options?: OptionsMetadata;

    /**
     * Help URL.
     */
    helpUrl?: string;
}

/**
 * Metadata.
 */
interface Metadata {
    /**
     * True if functions library allows custom data for data type any.
     */
    allowCustomDataForDataTypeAny: boolean;

    /**
     * True if functions library allows error for data type any.
     */
    allowErrorForDataTypeAny?: boolean;

    /**
     * Functions.
     */
    functions: FunctionMetadata[];
}

/**
 * Mapping of descriptor types to metadata types.
 */
const DESCRIPTOR_METADATA_TYPES: readonly Type[] = ["string", "number", "boolean"];

/**
 * Mapping of descriptor dimensionalities to metadata dimensionalities.
 */
const DESCRIPTOR_METADATA_DIMENSIONALITIES: readonly Dimensionality[] = ["scalar", "matrix"];

/**
 * Generator for Microsoft Excel.
 */
export class MicrosoftGenerator extends Generator {
    /**
     * Base file name.
     */
    private readonly _baseFileName: string;

    /**
     * Directory in which TypeScript file is to be written.
     */
    private readonly _sourceDirectory: string;

    /**
     * Directory in which JSON configuration is to be written.
     */
    private readonly _configDirectory: string;

    /**
     * TypeScript source stream.
     */
    private _sourceStream!: fs.WriteStream;

    /**
     * JSON configuration source stream.
     */
    private _configStream!: fs.WriteStream;

    /**
     * Metadata.
     */
    private _metadata!: Metadata;

    /**
     * Constructor.
     *
     * @param baseFileName
     * Base file name.
     *
     * @param sourceDirectory
     * Directory in which TypeScript file is to be written.
     *
     * @param configDirectory
     * Directory in which JSON configuration is to be written.
     */
    constructor(baseFileName: string, sourceDirectory: string, configDirectory: string) {
        super();

        this._baseFileName = baseFileName;
        this._sourceDirectory = sourceDirectory;
        this._configDirectory = configDirectory;
    }

    /**
     * @inheritDoc
     */
    protected initialize(): void {
        this._sourceStream = this.openOutputStream(path.resolve(this._sourceDirectory, `${this._baseFileName}.ts`));
        this._configStream = this.openOutputStream(path.resolve(this._configDirectory, `${this._baseFileName}.json`));

        this._sourceStream.write("/* eslint-disable @typescript-eslint/unbound-method -- All methods will be bound. */\n\n");
        this._sourceStream.write("import * as AppExtension from \"@aidc-toolkit/app-extension\";\n");
        this._sourceStream.write("import { appProxy } from \"./proxy.js\";\n");

        this._metadata = {
            allowCustomDataForDataTypeAny: true,
            // version, vSpill, and hSpill are locally defined.
            functions: [
                {
                    id: "version",
                    name: "version",
                    parameters: [],
                    result: {
                        type: "string",
                        dimensionality: "scalar"
                    }
                },
                {
                    id: "vSpill",
                    name: "vSpill",
                    parameters: [
                        {
                            name: "hValues",
                            type: "any",
                            dimensionality: "matrix",
                            optional: false
                        },
                        {
                            name: "maximumWidth",
                            type: "number",
                            dimensionality: "scalar",
                            optional: true
                        },
                        {
                            name: "maximumHeight",
                            type: "number",
                            dimensionality: "scalar",
                            optional: true
                        }
                    ],
                    result: {
                        type: "any",
                        dimensionality: "matrix"
                    },
                    options: {
                        requiresAddress: true
                    }
                },
                {
                    id: "hSpill",
                    name: "hSpill",
                    parameters: [
                        {
                            name: "vValues",
                            type: "any",
                            dimensionality: "matrix",
                            optional: false
                        },
                        {
                            name: "maximumHeight",
                            type: "number",
                            dimensionality: "scalar",
                            optional: true
                        },
                        {
                            name: "maximumWidth",
                            type: "number",
                            dimensionality: "scalar",
                            optional: true
                        }
                    ],
                    result: {
                        type: "any",
                        dimensionality: "matrix"
                    },
                    options: {
                        requiresAddress: true
                    }
                }
            ]
        };
    }

    /**
     * @inheritDoc
     */
    protected startImport(_fileName: string): void {
    }

    /**
     * @inheritDoc
     */
    protected createProxyObject(className: string, objectName: string): void {
        // Create the proxy object.
        this._sourceStream.write(`\nconst ${objectName} = new AppExtension.${className}(appProxy);\n\n`);
    }

    /**
     * @inheritDoc
     */
    protected createProxyFunction(_className: string, objectName: string, functionName: string, methodDescriptor: MethodDescriptor): void {
        // Create the function and associated it with its JSON metadata ID.
        this._sourceStream.write(`CustomFunctions.associate("${functionName}", appProxy.bindSync(${objectName}, ${objectName}.${methodDescriptor.name}));\n`);

        // Add the function to the configuration.
        this._metadata.functions.push({
            id: functionName,
            name: functionName,
            parameters: methodDescriptor.parameterDescriptors.map(parameterDescriptor => ({
                name: parameterDescriptor.name,
                type: DESCRIPTOR_METADATA_TYPES[parameterDescriptor.type],
                dimensionality: DESCRIPTOR_METADATA_DIMENSIONALITIES[Number(parameterDescriptor.isMatrix)],
                optional: !parameterDescriptor.isRequired
            })),
            result: {
                type: DESCRIPTOR_METADATA_TYPES[methodDescriptor.type],
                dimensionality: DESCRIPTOR_METADATA_DIMENSIONALITIES[Number(methodDescriptor.isMatrix)]
            }
        });
    }

    /**
     * @inheritDoc
     */
    protected endImport(_fileName: string): void {
    }

    /**
     * @inheritDoc
     */
    protected finalize(): void {
        this._configStream.write(JSON.stringify(this._metadata, null, 2));

        this._configStream.close();
        this._sourceStream.close();
    }
}
