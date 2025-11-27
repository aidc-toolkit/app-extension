import type { GS1LocaleResources } from "@aidc-toolkit/gs1";
import type { UtilityLocaleResources } from "@aidc-toolkit/utility";
import type { AppExtensionLocaleResources } from "./i18n.js";

/**
 * Internationalization module.
 */
declare module "i18next" {
    /**
     * Custom type options for this package.
     */
    interface CustomTypeOptions {
        defaultNS: "aidct_app_extension";
        resources: {
            aidct_utility: UtilityLocaleResources;
            aidct_gs1: GS1LocaleResources;
            aidct_app_extension: AppExtensionLocaleResources;
        };
    }
}
