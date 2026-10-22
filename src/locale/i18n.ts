import { i18nCoreInit, i18nextInstance, i18nInit, type I18nLanguageDetector } from "@aidc-toolkit/core";
import { i18nGS1Init } from "@aidc-toolkit/gs1";
import { i18nUtilityInit } from "@aidc-toolkit/utility";
import type { ParseKeys, Resource } from "i18next";
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
export const i18nextAppExtensionT = i18nextInstance.getFixedT(null, appExtensionNS);

/**
 * Initialize internationalization.
 *
 * @param languageDetector
 * Language detector.
 *
 * @param debug
 * Debug setting.
 *
 * @returns
 * Application extension resource bundle.
 */
export async function i18nAppExtensionInit(languageDetector: I18nLanguageDetector, debug = false): Promise<Resource> {
    return i18nInit(languageDetector, debug, appExtensionResourceBundle, i18nCoreInit, i18nUtilityInit, i18nGS1Init);
}
