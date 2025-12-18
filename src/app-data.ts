/**
 * Application text data.
 */
interface AppTextData {
    /**
     * Data type.
     */
    type: "text";

    /**
     * Text data.
     */
    data: string;
}

/**
 * Application JSON data.
 */
interface AppJSONData {
    /**
     * Data type.
     */
    type: "json";

    /**
     * JSON data.
     */
    data: string;
}

/**
 * Application object data.
 */
interface AppObjectData {
    /**
     * Data type.
     */
    type: "object";

    /**
     * Object data.
     */
    data: object;
}

/**
 * Application binary data.
 */
interface AppBinaryData {
    /**
     * Data type.
     */
    type: "binary";

    /**
     * Binary data.
     */
    data: Uint8Array;
}

/**
 * Application data.
 */
export type AppData = AppJSONData | AppTextData | AppObjectData | AppBinaryData;
