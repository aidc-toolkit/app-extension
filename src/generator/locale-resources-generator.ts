import type { LocaleResources } from "@aidc-toolkit/core";
import * as fs from "node:fs";
import * as path from "node:path";
import packageConfiguration from "../../package.json" with { type: "json" };
import type {
    ClassDescriptor,
    ExtendsParameterDescriptor,
    MethodDescriptor,
    ParameterDescriptor
} from "../descriptor.js";
import { Generator } from "./generator.js";

/**
 * Parameters sequencer entry.
 */
interface ParametersSequencerEntry {
    /**
     * Parameters sequencer or null if automatic.
     */
    parametersSequencerOrNull: ParametersSequencer | null;

    /**
     * Parameter descriptor.
     */
    parameterDescriptor: ParameterDescriptor | ExtendsParameterDescriptor;

    /**
     * Parameter name.
     */
    parameterName: string;

    /**
     * Base parameter name.
     */
    baseParameterName: string;

    /**
     * True if parameter is actually used and not just a base.
     */
    isUsed: boolean;
}

/**
 * Parameters sequencer for keeping similar (extended) parameters together.
 */
type ParametersSequencer = Record<string, ParametersSequencerEntry>;

/**
 * Format of locale resources module.
 */
interface LocaleResourcesModule {
    /**
     * Locale resources.
     */
    default: LocaleResources;
}

/**
 * Locale resources generator.
 */
class LocaleResourcesGenerator extends Generator {
    /**
     * Locale resources import path.
     */
    static readonly #IMPORT_PATH = "../app-extension/src/locale";

    /**
     * Parameters sequencer.
     */
    readonly #parametersSequencer: ParametersSequencer = {};

    /**
     * Parameters locale resources.
     */
    readonly #parametersLocaleResources: LocaleResources = {};

    /**
     * Functions locale resources.
     */
    readonly #functionsLocaleResources: LocaleResources = {};

    /**
     * Locale resources.
     */
    readonly #LocaleResources: LocaleResources = {
        Parameters: this.#parametersLocaleResources,
        Functions: this.#functionsLocaleResources
    };

    /**
     * Constructor.
     */
    constructor() {
        super(packageConfiguration.version, false);
    }

    /**
     * @inheritDoc
     */
    protected override initialize(): void {
    }

    /**
     * @inheritDoc
     */
    protected override createNamespace(): void {
    }

    /**
     * @inheritDoc
     */
    protected override createCategory(): void {
    }

    /**
     * @inheritDoc
     */
    protected override createProxyObject(): void {
    }

    /**
     * Save a parameter descriptor in the appropriate spot in the sequence.
     *
     * @param parameterDescriptor
     * Parameter descriptor.
     *
     * @param isUsed
     * True if parameter descriptor is actually used and not just a base.
     *
     * @returns
     * Parameters sequencer entry.
     */
    #saveParameterSequence(parameterDescriptor: ParameterDescriptor | ExtendsParameterDescriptor, isUsed: boolean): ParametersSequencerEntry {
        let parametersSequencerEntry: ParametersSequencerEntry;

        if (!("extendsDescriptor" in parameterDescriptor)) {
            const parameterName = parameterDescriptor.name;

            // Create entry if it doesn't exist, otherwise pick up where last call left off.
            if (!(parameterName in this.#parametersSequencer)) {
                parametersSequencerEntry = {
                    parametersSequencerOrNull: null,
                    parameterDescriptor,
                    parameterName,
                    baseParameterName: parameterName,
                    isUsed
                };

                this.#parametersSequencer[parameterName] = parametersSequencerEntry;
            } else {
                parametersSequencerEntry = this.#parametersSequencer[parameterName];
            }
        } else {
            const baseParametersSequencerEntry = this.#saveParameterSequence(parameterDescriptor.extendsDescriptor, false);

            let parameterName: string;
            let baseParameterName: string | null;

            if (parameterDescriptor.name !== undefined) {
                parameterName = parameterDescriptor.name;
                baseParameterName = baseParametersSequencerEntry.parameterName;
            } else {
                parameterName = baseParametersSequencerEntry.parameterName;
                baseParameterName = baseParametersSequencerEntry.baseParameterName;
            }

            if (parameterName !== baseParameterName) {
                // Make sure that base parameters sequencer entry refers to a record type.
                baseParametersSequencerEntry.parametersSequencerOrNull ??= {};

                if (!(parameterName in baseParametersSequencerEntry.parametersSequencerOrNull)) {
                    parametersSequencerEntry = {
                        parametersSequencerOrNull: null,
                        parameterDescriptor,
                        parameterName,
                        baseParameterName,
                        isUsed
                    };

                    baseParametersSequencerEntry.parametersSequencerOrNull[parameterName] = parametersSequencerEntry;
                } else {
                    parametersSequencerEntry = baseParametersSequencerEntry.parametersSequencerOrNull[parameterName];
                }
            } else {
                // If name is the same, which means that parameter descriptor modified type information only.
                parametersSequencerEntry = baseParametersSequencerEntry;
            }
        }

        return parametersSequencerEntry;
    }

    /**
     * @inheritDoc
     */
    protected override createProxyFunction(classDescriptor: ClassDescriptor, methodDescriptor: MethodDescriptor): void {
        // Hidden functions aren't localized.
        if (methodDescriptor.isHidden !== true) {
            // Add any parameters that are not already known.
            for (const parameterDescriptor of methodDescriptor.parameterDescriptors) {
                this.#saveParameterSequence(parameterDescriptor, true);
            }

            let functionsLocaleResources = this.#functionsLocaleResources;

            const namespace = classDescriptor.namespace;

            if (namespace !== undefined) {
                if (!(namespace in functionsLocaleResources)) {
                    const namespaceFunctionsLocaleResources: LocaleResources = {};

                    // Add namespace and navigate to it.
                    functionsLocaleResources[namespace] = namespaceFunctionsLocaleResources;
                    functionsLocaleResources = namespaceFunctionsLocaleResources;
                } else {
                    // Navigate to namespace.
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Entry is never a string.
                    functionsLocaleResources = functionsLocaleResources[namespace] as LocaleResources;
                }
            }

            const functionName = methodDescriptor.functionName;

            if (functionName in functionsLocaleResources) {
                throw new Error(`Duplicate function ${functionName}`);
            }

            // Add function.
            functionsLocaleResources[functionName] = {
                name: functionName,
                description: "*** LOCALIZATION REQUIRED ***"
            };
        }
    }

    /**
     * Merge source locale resources into existing destination locale resources.
     *
     * @param logChanges
     * If true, changes are logged. Limits output when processing multiple sources.
     *
     * @param parentKey
     * Parent key for logging purposes.
     *
     * @param sourceLocaleResources
     * Source locale resources.
     *
     * @param destinationLocaleResources
     * Destination locale resources.
     *
     * @param addMissing
     * Add missing if true; applies to locale resources that are not regional.
     *
     * @returns
     * Merged locale resources.
     */
    #merge(logChanges: boolean, parentKey: string, sourceLocaleResources: LocaleResources, destinationLocaleResources: LocaleResources, addMissing: boolean): LocaleResources {
        // Some entries at the top are not part of the generator output.
        const deleteMissing = parentKey.length !== 0;

        const newDestinationLocaleResources: LocaleResources = {};

        // Copy over or delete any destination keys that are not in source.
        for (const [key, destinationValue] of Object.entries(destinationLocaleResources)) {
            if (!(key in sourceLocaleResources)) {
                if (!deleteMissing) {
                    newDestinationLocaleResources[key] = destinationValue;
                } else if (logChanges) {
                    this.logger.info(`Deleting ${parentKey}${key}...`);
                }
            }
        }

        for (const [key, sourceValue] of Object.entries(sourceLocaleResources)) {
            if (!(key in destinationLocaleResources)) {
                if (addMissing) {
                    if (logChanges) {
                        this.logger.info(`Adding ${parentKey}${key}...`);
                    }

                    newDestinationLocaleResources[key] = sourceValue;
                }
            } else {
                const destinationValue = destinationLocaleResources[key];

                if (typeof sourceValue === "object" && typeof destinationValue === "object") {
                    newDestinationLocaleResources[key] = this.#merge(logChanges, `${parentKey}${key}.`, sourceValue, destinationValue, addMissing);
                } else if (typeof sourceValue === "string" && typeof destinationValue === "string") {
                    newDestinationLocaleResources[key] = destinationValue;
                } else {
                    throw new Error(`Mismatched types at ${parentKey}${key}`);
                }
            }
        }

        return newDestinationLocaleResources;
    }

    /**
     * Build parameters locale resources by going through parameters sequencer.
     *
     * @param parametersSequencer
     * Parameters sequencer.
     */
    #buildParametersLocaleResources(parametersSequencer: ParametersSequencer): void {
        const entries = Object.entries(parametersSequencer);

        // Sort the entries as defined by the descriptors.
        entries.sort((entry1, entry2) => {
            let result: number;

            const parameterDescriptor1 = entry1[1].parameterDescriptor;
            const parameterDescriptor2 = entry2[1].parameterDescriptor;

            if ("sortOrder" in parameterDescriptor1) {
                if ("sortOrder" in parameterDescriptor2) {
                    result = parameterDescriptor1.sortOrder - parameterDescriptor2.sortOrder;
                } else {
                    // Parameter descriptors with undefined sort order to go the end.
                    result = -parameterDescriptor1.sortOrder;
                }
            } else {
                // eslint-disable-next-line no-lonely-if -- Matches structure in "then" clause.
                if ("sortOrder" in parameterDescriptor2) {
                    // Parameter descriptors with undefined sort order to go the end.
                    result = parameterDescriptor2.sortOrder;
                } else {
                    result = 0;
                }
            }

            return result;
        });

        for (const [parameterName, parametersSequencerEntry] of entries) {
            if (parametersSequencerEntry.isUsed) {
                this.#parametersLocaleResources[parameterName] = {
                    name: parameterName,
                    description: "*** LOCALIZATION REQUIRED ***"
                };
            }

            if (parametersSequencerEntry.parametersSequencerOrNull !== null) {
                this.#buildParametersLocaleResources(parametersSequencerEntry.parametersSequencerOrNull);
            }
        }
    }

    /**
     * Build output to be written back to source file.
     *
     * @param prefix
     * Line prefix.
     *
     * @param value
     * Line value.
     *
     * @param indentLevel
     * Indent level.
     *
     * @returns
     * Output string.
     */
    static #buildOutput(prefix: string, value: LocaleResources | string, indentLevel: number): string {
        return `${"    ".repeat(indentLevel)}${prefix} ${typeof value === "object" ?
            `{\n${
                Object.entries(value).map(entry => LocaleResourcesGenerator.#buildOutput(`${entry[0]}:`, entry[1], indentLevel + 1)).join(",\n")
            }\n${"    ".repeat(indentLevel)}}` :
            // JSON.stringify() will apply quotes as appropriate.
            JSON.stringify(value)
        }`;
    }

    /**
     * @inheritDoc
     */
    protected override async finalize(success: boolean): Promise<void> {
        if (success) {
            this.#buildParametersLocaleResources(this.#parametersSequencer);

            await Promise.all(fs.readdirSync(LocaleResourcesGenerator.#IMPORT_PATH, {
                withFileTypes: true
            }).filter(entry => entry.isDirectory()).map(async (entry) => {
                const localeResourcesSource = path.resolve(LocaleResourcesGenerator.#IMPORT_PATH, entry.name, "locale-resources.ts");

                return import(localeResourcesSource).then((module) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Module format is known.
                    const localeResources = this.#merge(entry.name === "en", "", this.#LocaleResources, (module as LocaleResourcesModule).default, !entry.name.includes("-"));

                    fs.writeFileSync(localeResourcesSource, `${LocaleResourcesGenerator.#buildOutput("export default", localeResources, 0)};\n`);
                });
            }));
        }
    }
}

const generator = new LocaleResourcesGenerator();

generator.generate().catch((e: unknown) => {
    generator.logger.error(e);
    process.exit(1);
});
