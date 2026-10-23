import { type IdentifierType, isIdentifierType } from "@aidc-toolkit/gs1";
import { i18nextAppExtensionT } from "../locale/i18n.js";

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
        throw new RangeError(i18nextAppExtensionT("ServiceProxy.invalidIdentifierType", {
            identifierType
        }));
    }

    return upperIdentifierType;
}
