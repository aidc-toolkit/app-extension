import type { LocaleStrings } from "@aidc-toolkit/core";
import * as fs from "node:fs";
import * as path from "node:path";
import { expandParameterDescriptor, type ParameterDescriptor } from "../descriptor.js";
import type { ProxyFunctionDescriptor } from "./descriptor.js";
import { Generator } from "./generator.js";
import { logger } from "./logger.js";

/**
 * Parameters sequencer entry.
 */
interface ParametersSequencerEntry {
    /**
     * Parameters sequence or null if automatic.
     */
    parametersSequencerOrNull: ParametersSequencer | null;

    /**
     * Parameter descriptor.
     */
    parameterDescriptor: ParameterDescriptor;

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
 * Format of locale strings module.
 */
interface LocaleStringsModule {
    /**
     * Locale strings.
     */
    localeStrings: LocaleStrings;
}

/**
 * Locale strings generator.
 */
class LocaleStringsGenerator extends Generator {
    /**
     * Locale strings import path.
     */
    private static readonly IMPORT_PATH = "../app-extension/src/locale";

    /**
     * Parameters sequencer.
     */
    private readonly _parametersSequencer: ParametersSequencer = {};

    /**
     * Parameters locale strings.
     */
    private readonly _parametersLocaleStrings: LocaleStrings = {};

    /**
     * Functions locale strings.
     */
    private readonly _functionsLocaleStrings: LocaleStrings = {};

    /**
     * Locale strings.
     */
    private readonly _localeStrings: LocaleStrings = {
        Parameters: this._parametersLocaleStrings,
        Functions: this._functionsLocaleStrings
    };

    /**
     * Constructor.
     */
    constructor() {
        super(false);
    }

    /**
     * @inheritDoc
     */
    protected initialize(): void {
    }

    /**
     * @inheritDoc
     */
    protected createProxyObject(): void {
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
    private saveParameterSequence(parameterDescriptor: ParameterDescriptor, isUsed: boolean): ParametersSequencerEntry {
        let parametersSequencerEntry: ParametersSequencerEntry;

        if (!("extendsDescriptor" in parameterDescriptor)) {
            const parameterName = parameterDescriptor.name;

            // Create entry if it doesn't exist, otherwise pick up where last call left off.
            if (!(parameterName in this._parametersSequencer)) {
                parametersSequencerEntry = {
                    parametersSequencerOrNull: null,
                    parameterDescriptor,
                    isUsed
                };

                this._parametersSequencer[parameterName] = parametersSequencerEntry;
            } else {
                parametersSequencerEntry = this._parametersSequencer[parameterName];
            }
        } else {
            const baseParametersSequencerEntry = this.saveParameterSequence(parameterDescriptor.extendsDescriptor, false);

            const expandedParameterDescriptor = expandParameterDescriptor(parameterDescriptor);
            const parameterName = expandedParameterDescriptor.name;

            if (parameterName !== expandParameterDescriptor(parameterDescriptor.extendsDescriptor).name) {
                // Make sure that base parameters sequencer entry refers to a record type.
                baseParametersSequencerEntry.parametersSequencerOrNull ??= {};

                if (!(parameterName in baseParametersSequencerEntry.parametersSequencerOrNull)) {
                    parametersSequencerEntry = {
                        parametersSequencerOrNull: null,
                        parameterDescriptor,
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
    protected createProxyFunction(proxyFunctionDescriptor: ProxyFunctionDescriptor): void {
        const {
            namespace,
            functionName,
            methodDescriptor
        } = proxyFunctionDescriptor;

        // Add any parameters that are not already known.
        for (const parameterDescriptor of methodDescriptor.parameterDescriptors) {
            this.saveParameterSequence(parameterDescriptor, true);
        }

        let functionsLocaleStrings = this._functionsLocaleStrings;

        if (namespace !== undefined) {
            if (!(namespace in functionsLocaleStrings)) {
                const namespaceFunctionsLocaleStrings: LocaleStrings = {};

                // Add namespace and navigate to it.
                functionsLocaleStrings[namespace] = namespaceFunctionsLocaleStrings;
                functionsLocaleStrings = namespaceFunctionsLocaleStrings;
            } else {
                // Navigate to namespace.
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Entry is never a string.
                functionsLocaleStrings = functionsLocaleStrings[namespace] as LocaleStrings;
            }
        }

        if (functionName in functionsLocaleStrings) {
            throw new Error(`Duplicate function "${functionName}"`);
        }

        // Add function.
        functionsLocaleStrings[functionName] = {
            name: functionName,
            description: "*** LOCALIZATION REQUIRED ***"
        };
    }

    /**
     * Merge source locale strings into existing destination locale strings.
     *
     * @param logChanges
     * If true, changes are logged. Limits output when processing multiple sources.
     *
     * @param parentKey
     * Parent key for logging purposes.
     *
     * @param sourceLocaleStrings
     * Source locale strings.
     *
     * @param destinationLocaleStrings
     * Destination locale strings.
     *
     * @param addMissing
     * Add missing if true; applies to locale strings that are not regional.
     *
     * @returns
     * Merged locale strings.
     */
    private static merge(logChanges: boolean, parentKey: string, sourceLocaleStrings: LocaleStrings, destinationLocaleStrings: LocaleStrings, addMissing: boolean): LocaleStrings {
        // Some entries at the top are not part of the generator output.
        const deleteMissing = parentKey.length !== 0;

        const newDestinationLocaleStrings: LocaleStrings = {};

        // Copy over or delete any destination keys that are not in source.
        for (const [key, destinationValue] of Object.entries(destinationLocaleStrings)) {
            if (!(key in sourceLocaleStrings)) {
                if (!deleteMissing) {
                    newDestinationLocaleStrings[key] = destinationValue;
                } else if (logChanges) {
                    logger.info(`Deleting ${parentKey}${key}...`);
                }
            }
        }

        for (const [key, sourceValue] of Object.entries(sourceLocaleStrings)) {
            if (!(key in destinationLocaleStrings)) {
                if (addMissing) {
                    if (logChanges) {
                        logger.info(`Adding ${parentKey}${key}...`);
                    }

                    newDestinationLocaleStrings[key] = sourceValue;
                }
            } else {
                const destinationValue = destinationLocaleStrings[key];

                if (typeof sourceValue === "object" && typeof destinationValue === "object") {
                    newDestinationLocaleStrings[key] = LocaleStringsGenerator.merge(logChanges, `${parentKey}${key}.`, sourceValue, destinationValue, addMissing);
                } else if (typeof sourceValue === "string" && typeof destinationValue === "string") {
                    newDestinationLocaleStrings[key] = destinationValue;
                } else {
                    throw new Error(`Mismatched types at ${parentKey}${key}`);
                }
            }
        }

        return newDestinationLocaleStrings;
    }

    /**
     * Build parameters locale strings by going through parameters sequencer.
     *
     * @param parametersSequencer
     * Parameters sequencer.
     */
    private buildParametersLocaleStrings(parametersSequencer: ParametersSequencer): void {
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
                this._parametersLocaleStrings[parameterName] = {
                    name: parameterName,
                    description: "*** LOCALIZATION REQUIRED ***"
                };
            }

            if (parametersSequencerEntry.parametersSequencerOrNull !== null) {
                this.buildParametersLocaleStrings(parametersSequencerEntry.parametersSequencerOrNull);
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
    private static buildOutput(prefix: string, value: LocaleStrings | string, indentLevel: number): string {
        return `${"    ".repeat(indentLevel)}${prefix} ${typeof value === "object" ?
            `{\n${
                Object.entries(value).map(entry => LocaleStringsGenerator.buildOutput(`${entry[0]}:`, entry[1], indentLevel + 1)).join(",\n")
            }\n${"    ".repeat(indentLevel)}}` :
            // JSON.stringify() will apply quotes as appropriate.
            JSON.stringify(value)
        }`;
    }

    /**
     * @inheritDoc
     */
    protected async finalize(success: boolean): Promise<void> {
        if (success) {
            this.buildParametersLocaleStrings(this._parametersSequencer);

            await Promise.all(fs.readdirSync(LocaleStringsGenerator.IMPORT_PATH, {
                withFileTypes: true
            }).filter(entry => entry.isDirectory()).map(async (entry) => {
                const localeStringsSource = path.resolve(LocaleStringsGenerator.IMPORT_PATH, entry.name, "locale-strings.ts");

                await import(localeStringsSource).then((module) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Module format is known.
                    const localeStrings = LocaleStringsGenerator.merge(entry.name === "en", "", this._localeStrings, (module as LocaleStringsModule).localeStrings, !entry.name.includes("-"));

                    fs.writeFileSync(localeStringsSource, `${LocaleStringsGenerator.buildOutput("export const localeStrings =", localeStrings, 0)};\n`);
                });
            }));
        }
    }
}

await new LocaleStringsGenerator().generate();
