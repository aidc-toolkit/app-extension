import { type IdentifierType, IdentifierTypes } from "@aidc-toolkit/gs1";
import { i18nextAppExtension } from "../locale/i18n.js";

/**
 * Determine if an identifier type is valid.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is valid.
 */
export function isIdentifierType(identifierType: string): identifierType is IdentifierType {
    return identifierType in IdentifierTypes;
}

/**
 * Validate an identifier type and return it normalized.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * Normalized identifier type.
 */
export function validateIdentifierType(identifierType: string): IdentifierType {
    // Ignore case.
    const upperIdentifierType = identifierType.toUpperCase();

    if (!isIdentifierType(upperIdentifierType)) {
        throw new RangeError(i18nextAppExtension.t("ServiceProxy.invalidIdentifierType", {
            identifierType
        }));
    }

    return upperIdentifierType;
}
