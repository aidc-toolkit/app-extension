export default {
    AppExtension: {
        sequenceCountMustBeLessThanOrEqualTo: "Sequence count {{sequenceCount, number}} must be less than or equal to {{maximumSequenceCount, number}}"
    },
    Proxy: {
        vSpillMustBeHorizontalArray: "Input must be a horizontal array",
        hSpillMustBeVerticalArray: "Input must be a vertical array",
        matrixMustBeArray: "Input must be a one-dimensional array"
    },
    IdentifierCreatorProxy: {
        prefixDefinitionMustBeOneDimensional: "Prefix definition must be a one-dimensional matrix",
        prefixDefinitionMustHaveMaximumThreeElements: "Prefix definition must have a maximum of 3 elements",
        prefixMustBeString: "Prefix must be a string",
        prefixTypeMustBeNumber: "Prefix type must be a number in the range of 0 to {{maximumPrefixType, number}}",
        invalidPrefixType: "Invalid prefix type",
        tweakFactorMustBeNumber: "Tweak factor must be a number"
    },
    ServiceProxy: {
        invalidIdentifierType: "Invalid identifier type \"{{identifierType}}\""
    },
    Parameters: {
        spillMatrix: {
            name: "matrix",
            description: "One-dimensional matrix to spill."
        },
        spillMaximumWidth: {
            name: "maximumWidth",
            description: "Maximum width into which to spill the matrix. If not provided, the remaining width is used."
        },
        spillMaximumHeight: {
            name: "maximumHeight",
            description: "Maximum height into which to spill the matrix. If not provided, the remaining height is used."
        },
        domain: {
            name: "domain",
            description: "Transformation domain. Valid input values are from zero to domain-1."
        },
        value: {
            name: "value",
            description: "Value to transform."
        },
        startValue: {
            name: "startValue",
            description: "Start value of a domain of values to transform."
        },
        count: {
            name: "count",
            description: "Count of values to transform. If positive, values transformed are startValue to startValue+count-1. If negative, values transformed are startValue down to startValue+count+1."
        },
        transformedValue: {
            name: "transformedValue",
            description: "Previous output value of a transformation."
        },
        tweak: {
            name: "tweak",
            description: "Value by which to tweak the transformation. If not provided or zero, the output is sequential. Otherwise, the output is encrypted in such a way as to appear random, masking the values used as inputs to the sequence."
        },
        regExp: {
            name: "regExp",
            description: "Regular expression against which to validate a string."
        },
        validateS: {
            name: "s",
            description: "String to validate."
        },
        valueForS: {
            name: "s",
            description: "String for which to determine the value."
        },
        errorMessage: {
            name: "errorMessage",
            description: "Custom error message to use if validation fails. If not provided, an internal error message is used."
        },
        exclusionNone: {
            name: "exclusion",
            description: "String values to exclude. The only valid value is 0 (no exclusions)."
        },
        exclusionFirstZero: {
            name: "exclusion",
            description: "String values to exclude. Valid values are 0 (no exclusions) and 1 (strings starting with 0 excluded)."
        },
        exclusionAllNumeric: {
            name: "exclusion",
            description: "String values to exclude. Valid values are 0 (no exclusions) and 2 (strings that are all numeric excluded)."
        },
        exclusionAny: {
            name: "exclusion",
            description: "String values to exclude. Valid values are 0 (no exclusions), 1 (strings starting with 0 excluded), and 2 (strings that are all numeric excluded)."
        },
        length: {
            name: "length",
            description: "Length of string to create."
        },
        numericS: {
            name: "s",
            description: "Numeric string."
        },
        numericSFourOrFiveDigits: {
            name: "s",
            description: "Four- or five-digit numeric string."
        },
        numericSWithCheckDigit: {
            name: "s",
            description: "Numeric string with check digit."
        },
        checkDigit: {
            name: "checkDigit",
            description: "Check digit."
        },
        ai82S: {
            name: "s",
            description: "GS1 AI encodable character set 82 string."
        },
        ai82SWithCheckCharacterPair: {
            name: "s",
            description: "GS1 AI encodable character set 82 string with check character pair."
        },
        validateIdentifier: {
            name: "identifier",
            description: "Identifier to validate."
        },
        zeroSuppressibleGTIN12: {
            name: "gtin12",
            description: "GTIN-12 for which to suppress zeros."
        },
        zeroSuppressedGTIN12: {
            name: "zeroSuppressedGTIN12",
            description: "Zero-suppressed GTIN-12 to expand."
        },
        convertGTIN: {
            name: "gtin",
            description: "GTIN to convert to GTIN-14."
        },
        normalizeGTIN: {
            name: "gtin",
            description: "GTIN to normalize."
        },
        validateGTIN: {
            name: "gtin",
            description: "GTIN to validate."
        },
        validateGTIN14: {
            name: "gtin14",
            description: "GTIN-14 to validate."
        },
        baseIdentifier: {
            name: "baseIdentifier",
            description: "Base identifier."
        },
        hyperlinkIdentifier: {
            name: "identifier",
            description: "Identifier for which to create hyperlink."
        },
        indicatorDigit: {
            name: "indicatorDigit",
            description: "Indicator digit."
        },
        gtinLevel: {
            name: "level",
            description: "Level at which to validate the GTIN. Valid values are 0 (any), 1 (retail consumer trade item), and 2 (other than retail consumer trade item level)."
        },
        rcnFormat: {
            name: "format",
            description: "Restricted Circulation Number format."
        },
        rcn: {
            name: "rcn",
            description: "Restricted Circulation Number to parse."
        },
        prefix: {
            name: "prefix",
            description: "Prefix."
        },
        prefixType: {
            name: "prefixType",
            description: "Prefix type. Valid values are 0 (GS1 Company Prefix), 1 (U.P.C. Company Prefix), and 2 (GS1 Prefix)."
        },
        tweakFactor: {
            name: "tweakFactor",
            description: "Tweak factor, used to support the creation of sparse identifiers. The default tweak factor is based on the GS1 Company Prefix, and is usually sufficient for obfuscation. This allows more control over the encryption when higher security is required."
        },
        prefixDefinitionAny: {
            name: "prefixDefinition",
            description: "Prefix definition, either a simple GS1 Company Prefix (as a string) or the result of a call to definePrefix. Any prefix type is supported."
        },
        prefixDefinitionGS1UPC: {
            name: "prefixDefinition",
            description: "Prefix definition, either a simple GS1 Company Prefix (as a string) or the result of a call to definePrefix. Only prefix types 0 (GS1 Company Prefix) and 1 (U.P.C. Company Prefix) are supported."
        },
        sparse: {
            name: "sparse",
            description: "If true, value is mapped to a sparse sequence resistant to discovery. Default is false."
        },
        rcnItemReference: {
            name: "itemReference",
            description: "Item reference."
        },
        rcnPriceOrWeight: {
            name: "priceOrWeight",
            description: "Price or weight (whole number only)."
        },
        serialComponent: {
            name: "serialComponent",
            description: "Serial component."
        },
        reference: {
            name: "reference",
            description: "Reference portion of identifier."
        },
        identifierType: {
            name: "identifierType",
            description: "Identifier type (GTIN, GLN, SSCC, ...)."
        },
        hyperlinkText: {
            name: "text",
            description: "Text for hyperlink. If not provided, the identifier is used."
        },
        hyperlinkDetails: {
            name: "details",
            description: "Details to display when hovering over hyperlink."
        }
    },
    Functions: {
        version: {
            name: "version",
            description: "Get the version of the AIDC Toolkit."
        },
        vSpill: {
            name: "vSpill",
            description: "Spill a horizontal array vertically to fit within a given maximum width and height."
        },
        hSpill: {
            name: "hSpill",
            description: "Spill a vertical array horizontally to fit within a given maximum height and width."
        },
        forwardTransform: {
            name: "forwardTransform",
            description: "Transform a value forward."
        },
        forwardTransformSequence: {
            name: "forwardTransformSequence",
            description: "Transform a sequence of values forward."
        },
        reverseTransform: {
            name: "reverseTransform",
            description: "Transform a value in reverse."
        },
        validateRegExp: {
            name: "validateRegExp",
            description: "Validate a string against a regular expression."
        },
        isValidRegExp: {
            name: "isValidRegExp",
            description: "Determine if a string is valid against a regular expression."
        },
        validateNumeric: {
            name: "validateNumeric",
            description: "Validate a numeric string."
        },
        isValidNumeric: {
            name: "isValidNumeric",
            description: "Determine if a string is numeric."
        },
        createNumeric: {
            name: "createNumeric",
            description: "Create a numeric string."
        },
        createNumericSequence: {
            name: "createNumericSequence",
            description: "Create a sequence of numeric strings."
        },
        valueForNumeric: {
            name: "valueForNumeric",
            description: "Get the value for a numeric string."
        },
        validateHexadecimal: {
            name: "validateHexadecimal",
            description: "Validate a hexadecimal string."
        },
        isValidHexadecimal: {
            name: "isValidHexadecimal",
            description: "Determine if a string is hexadecimal."
        },
        createHexadecimal: {
            name: "createHexadecimal",
            description: "Create a hexadecimal string."
        },
        createHexadecimalSequence: {
            name: "createHexadecimalSequence",
            description: "Create a sequence of hexadecimal strings."
        },
        valueForHexadecimal: {
            name: "valueForHexadecimal",
            description: "Get the value for a hexadecimal string."
        },
        validateAlphabetic: {
            name: "validateAlphabetic",
            description: "Validate an alphabetic string."
        },
        isValidAlphabetic: {
            name: "isValidAlphabetic",
            description: "Determine if a string is alphabetic."
        },
        createAlphabetic: {
            name: "createAlphabetic",
            description: "Create an alphabetic string."
        },
        createAlphabeticSequence: {
            name: "createAlphabeticSequence",
            description: "Create a sequence of alphabetic strings."
        },
        valueForAlphabetic: {
            name: "valueForAlphabetic",
            description: "Get the value for an alphabetic string."
        },
        validateAlphanumeric: {
            name: "validateAlphanumeric",
            description: "Validate an alphanumeric string."
        },
        isValidAlphanumeric: {
            name: "isValidAlphanumeric",
            description: "Determine if a string is alphanumeric."
        },
        createAlphanumeric: {
            name: "createAlphanumeric",
            description: "Create an alphanumeric string."
        },
        createAlphanumericSequence: {
            name: "createAlphanumericSequence",
            description: "Create a sequence of alphanumeric strings."
        },
        valueForAlphanumeric: {
            name: "valueForAlphanumeric",
            description: "Get the value for an alphanumeric string."
        },
        GS1: {
            validateAI82: {
                name: "validateAI82",
                description: "Validate a GS1 AI 82 encodable character set string."
            },
            isValidAI82: {
                name: "isValidAI82",
                description: "Determine if a string is GS1 AI 82 encodable character set."
            },
            createAI82: {
                name: "createAI82",
                description: "Create a GS1 AI 82 encodable character set string."
            },
            createAI82Sequence: {
                name: "createAI82Sequence",
                description: "Create a sequence of GS1 AI 82 encodable character set strings."
            },
            valueForAI82: {
                name: "valueForAI82",
                description: "Get the value for a GS1 AI 82 encodable character set string."
            },
            validateAI39: {
                name: "validateAI39",
                description: "Validate a GS1 AI 39 encodable character set string."
            },
            isValidAI39: {
                name: "isValidAI39",
                description: "Determine if a string is GS1 AI 39 encodable character set."
            },
            createAI39: {
                name: "createAI39",
                description: "Create a GS1 AI 39 encodable character set string."
            },
            createAI39Sequence: {
                name: "createAI39Sequence",
                description: "Create a sequence of GS1 AI 39 encodable character set strings."
            },
            valueForAI39: {
                name: "valueForAI39",
                description: "Get the value for a GS1 AI 39 encodable character set string."
            },
            validateAI64: {
                name: "validateAI64",
                description: "Validate a GS1 AI 64 encodable character set string."
            },
            isValidAI64: {
                name: "isValidAI64",
                description: "Determine if a string is GS1 AI 64 encodable character set."
            },
            checkDigit: {
                name: "checkDigit",
                description: "Calculate the check digit for a numeric string."
            },
            hasValidCheckDigit: {
                name: "hasValidCheckDigit",
                description: "Determine if a string has a valid check digit."
            },
            priceOrWeightCheckDigit: {
                name: "priceOrWeightCheckDigit",
                description: "Calculate the check digit for a price or weight."
            },
            isValidPriceOrWeightCheckDigit: {
                name: "isValidPriceOrWeightCheckDigit",
                description: "Determine if a price or weight check digit is valid."
            },
            checkCharacterPair: {
                name: "checkCharacterPair",
                description: "Calculate the check character pair for a GS1 AI 82 encodable character set string."
            },
            hasValidCheckCharacterPair: {
                name: "hasValidCheckCharacterPair",
                description: "Determine if a GS1 AI 82 encodable character set string has a valid check character pair."
            },
            validateGTIN13: {
                name: "validateGTIN13",
                description: "Validate a GTIN-13."
            },
            validateGTIN12: {
                name: "validateGTIN12",
                description: "Validate a GTIN-12."
            },
            validateGTIN8: {
                name: "validateGTIN8",
                description: "Validate a GTIN-8."
            },
            zeroSuppressGTIN12: {
                name: "zeroSuppressGTIN12",
                description: "Zero-suppress a GTIN-12."
            },
            zeroExpandGTIN12: {
                name: "zeroExpandGTIN12",
                description: "Expand a zero-suppressed GTIN-12."
            },
            convertToGTIN14: {
                name: "convertToGTIN14",
                description: "Convert a GTIN to GTIN-14."
            },
            normalizeGTIN: {
                name: "normalizeGTIN",
                description: "Normalize a GTIN."
            },
            validateGTIN: {
                name: "validateGTIN",
                description: "Validate any GTIN."
            },
            validateGTIN14: {
                name: "validateGTIN14",
                description: "Validate a GTIN-14."
            },
            parseVariableMeasureRCN: {
                name: "parseVariableMeasureRCN",
                description: "Parse a Restricted Circulation Number (RCN) using a variable measure trade item format."
            },
            validateGLN: {
                name: "validateGLN",
                description: "Validate a GLN."
            },
            validateSSCC: {
                name: "validateSSCC",
                description: "Validate an SSCC."
            },
            validateGRAI: {
                name: "validateGRAI",
                description: "Validate a GRAI."
            },
            validateGIAI: {
                name: "validateGIAI",
                description: "Validate a GIAI."
            },
            validateGSRN: {
                name: "validateGSRN",
                description: "Validate a GSRN."
            },
            validateGDTI: {
                name: "validateGDTI",
                description: "Validate a GDTI."
            },
            validateGINC: {
                name: "validateGINC",
                description: "Validate a GINC."
            },
            validateGSIN: {
                name: "validateGSIN",
                description: "Validate a GSIN."
            },
            validateGCN: {
                name: "validateGCN",
                description: "Validate a GCN."
            },
            validateCPID: {
                name: "validateCPID",
                description: "Validate a CPID."
            },
            validateGMN: {
                name: "validateGMN",
                description: "Validate a GMN."
            },
            definePrefix: {
                name: "definePrefix",
                description: "Define a prefix for use in GS1 identifier creation functions."
            },
            createGTIN: {
                name: "createGTIN",
                description: "Create a GTIN."
            },
            createGTINSequence: {
                name: "createGTINSequence",
                description: "Create a sequence of GTINs."
            },
            createAllGTIN: {
                name: "createAllGTIN",
                description: "Create all GTINs for a prefix."
            },
            createGTIN14: {
                name: "createGTIN14",
                description: "Create a GTIN-14."
            },
            createVariableMeasureRCN: {
                name: "createVariableMeasureRCN",
                description: "Create a variable measure Restricted Circulation Number (RCN)."
            },
            createGLN: {
                name: "createGLN",
                description: "Create a GLN."
            },
            createGLNSequence: {
                name: "createGLNSequence",
                description: "Create a sequence of GLNs."
            },
            createAllGLN: {
                name: "createAllGLN",
                description: "Create all GLNs for a prefix."
            },
            createSSCC: {
                name: "createSSCC",
                description: "Create an SSCC."
            },
            createSSCCSequence: {
                name: "createSSCCSequence",
                description: "Create a sequence of SSCCs."
            },
            createAllSSCC: {
                name: "createAllSSCC",
                description: "Create all SSCCs for a prefix."
            },
            createGRAI: {
                name: "createGRAI",
                description: "Create a GRAI."
            },
            createGRAISequence: {
                name: "createGRAISequence",
                description: "Create a sequence of GRAIs."
            },
            createAllGRAI: {
                name: "createAllGRAI",
                description: "Create all GRAIs for a prefix."
            },
            createSerializedGRAI: {
                name: "createSerializedGRAI",
                description: "Create a serialized GRAI."
            },
            concatenateGRAI: {
                name: "concatenateGRAI",
                description: "Concatenate a base GRAI with a serial component."
            },
            createGIAI: {
                name: "createGIAI",
                description: "Create a GIAI."
            },
            createGSRN: {
                name: "createGSRN",
                description: "Create a GSRN."
            },
            createGSRNSequence: {
                name: "createGSRNSequence",
                description: "Create a sequence of GSRNs."
            },
            createAllGSRN: {
                name: "createAllGSRN",
                description: "Create all GSRNs for a prefix."
            },
            createGDTI: {
                name: "createGDTI",
                description: "Create a GDTI."
            },
            createGDTISequence: {
                name: "createGDTISequence",
                description: "Create a sequence of GDTIs."
            },
            createAllGDTI: {
                name: "createAllGDTI",
                description: "Create all GDTIs for a prefix."
            },
            createSerializedGDTI: {
                name: "createSerializedGDTI",
                description: "Create a serialized GDTI."
            },
            concatenateGDTI: {
                name: "concatenateGDTI",
                description: "Concatenate a base GDTI with a serial component."
            },
            createGINC: {
                name: "createGINC",
                description: "Create a GINC."
            },
            createGSIN: {
                name: "createGSIN",
                description: "Create a GSIN."
            },
            createGSINSequence: {
                name: "createGSINSequence",
                description: "Create a sequence of GSINs."
            },
            createAllGSIN: {
                name: "createAllGSIN",
                description: "Create all GSINs for a prefix."
            },
            createGCN: {
                name: "createGCN",
                description: "Create a GCN."
            },
            createGCNSequence: {
                name: "createGCNSequence",
                description: "Create a sequence of GCNs."
            },
            createAllGCN: {
                name: "createAllGCN",
                description: "Create all GCNs for a prefix."
            },
            createSerializedGCN: {
                name: "createSerializedGCN",
                description: "Create a serialized GCN."
            },
            concatenateGCN: {
                name: "concatenateGCN",
                description: "Concatenate a base GCN with a serial component."
            },
            createCPID: {
                name: "createCPID",
                description: "Create a CPID."
            },
            createGMN: {
                name: "createGMN",
                description: "Create a GMN."
            },
            verifiedByGS1: {
                name: "verifiedByGS1",
                description: "Create a Verified by GS1 hyperlink."
            }
        }
    }
};
