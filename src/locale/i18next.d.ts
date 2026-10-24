import type { CoreLocaleResources } from "@aidc-toolkit/core";
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
        /**
         * Resources override.
         */
        resources: {
            /**
             * Core locale resources.
             */
            aidct_core: CoreLocaleResources;

            /**
             * Utility locale resources.
             */
            aidct_utility: UtilityLocaleResources;

            /**
             * GS1 locale resources.
             */
            aidct_gs1: GS1LocaleResources;

            /**
             * Application extension locale resources.
             */
            aidct_app_extension: AppExtensionLocaleResources;
        };
    }
}
