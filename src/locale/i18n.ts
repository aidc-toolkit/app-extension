import { i18nCoreInit, type I18nEnvironment } from "@aidc-toolkit/core";
import { gs1Resources, i18nGS1Init } from "@aidc-toolkit/gs1";
import { i18nUtilityInit, utilityResources } from "@aidc-toolkit/utility";
import i18next, { type i18n, type Resource } from "i18next";
import enLocaleResources from "./en/locale-resources.js";
import frLocaleResources from "./fr/locale-resources.js";

export const appExtensionNS = "aidct_app_extension";

/**
 * Locale resources type is extracted from the English locale resources object.
 */
export type AppExtensionLocaleResources = typeof enLocaleResources;

/**
 * App extension resources.
 */
export const appExtensionResources: Resource = {
    en: {
        aidct_app_extension: enLocaleResources
    },
    fr: {
        aidct_app_extension: frLocaleResources
    }
};

// Explicit type is necessary because type can't be inferred without additional references.
export const i18nextAppExtension: i18n = i18next.createInstance();

/**
 * Initialize internationalization.
 *
 * @param environment
 * Environment in which the application is running.
 *
 * @param debug
 * Debug setting.
 *
 * @returns
 * Void promise.
 */
export async function i18nAppExtensionInit(environment: I18nEnvironment, debug = false): Promise<void> {
    await i18nUtilityInit(environment, debug);
    await i18nGS1Init(environment, debug);
    await i18nCoreInit(i18nextAppExtension, environment, debug, appExtensionNS, utilityResources, gs1Resources, appExtensionResources);
}
