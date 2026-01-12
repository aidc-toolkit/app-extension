import { i18nCoreInit, type I18nEnvironment, i18nInit } from "@aidc-toolkit/core";
import { i18nGS1Init } from "@aidc-toolkit/gs1";
import { i18nUtilityInit } from "@aidc-toolkit/utility";
import i18next, { type i18n, type Resource } from "i18next";
import enLocaleResources from "./en/locale-resources.js";
import frLocaleResources from "./fr/locale-resources.js";

export const appExtensionNS = "aidct_app_extension";

/**
 * Locale resources type is extracted from the English locale resources object.
 */
export type AppExtensionLocaleResources = typeof enLocaleResources;

/**
 * App extension resource.
 */
export const appExtensionResourceBundle: Resource = {
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
 * App extension resource.
 */
export async function i18nAppExtensionInit(environment: I18nEnvironment, debug = false): Promise<Resource> {
    return i18nInit(i18nextAppExtension, environment, debug, appExtensionNS, appExtensionResourceBundle, i18nCoreInit, i18nUtilityInit, i18nGS1Init);
}
