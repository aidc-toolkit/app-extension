import { i18nCoreInit, i18nInit } from "@aidc-toolkit/core";
import { i18nGS1Init } from "@aidc-toolkit/gs1";
import { i18nUtilityInit } from "@aidc-toolkit/utility";
import type { i18n, ParseKeys, Resource, TFunction } from "i18next";
import enLocaleResources from "./en/locale-resources.js";
import frLocaleResources from "./fr/locale-resources.js";

/**
 * Application extension namespace.
 */
export const appExtensionNS = "aidct_app_extension";

/**
 * Application extension parse keys.
 */
export type AppExtensionParseKeys = ParseKeys<typeof appExtensionNS>;

/**
 * Locale resources type is extracted from the English locale resources object.
 */
export type AppExtensionLocaleResources = typeof enLocaleResources;

/**
 * Application extension resource bundle.
 */
export const appExtensionResourceBundle: Resource = {
    en: {
        aidct_app_extension: enLocaleResources
    },
    fr: {
        aidct_app_extension: frLocaleResources
    }
};

/**
 * Application extension i18next translator function.
 */
export let i18nextAppExtensionT: TFunction<typeof appExtensionNS>;

/**
 * Initialize internationalization.
 *
 * @param i18next
 * Internationalization instance.
 *
 * @param debug
 * Debug setting.
 *
 * @returns
 * Application extension resource bundle.
 */
export async function i18nAppExtensionInit(i18next: i18n, debug = false): Promise<Resource> {
    // Bind translator function to i18next.
    i18nextAppExtensionT = i18next.getFixedT(null, appExtensionNS);

    return i18nInit(i18next, debug, appExtensionResourceBundle, i18nCoreInit, i18nUtilityInit, i18nGS1Init);
}
