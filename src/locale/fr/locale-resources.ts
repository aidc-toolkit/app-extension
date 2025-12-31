export default {
    AppExtension: {
        sequenceCountMustBeLessThanOrEqualTo: "Le nombre de séquences {{sequenceCount, number}} doit être inférieur ou égal à {{maximumSequenceCount, number}}"
    },
    Proxy: {
        matrixMustBeArray: "La matrice d'entrée doit être unidimensionnelle"
    },
    IdentifierCreatorProxy: {
        prefixDefinitionMustBeOneDimensional: "La définition du préfixe doit être une matrice unidimensionnelle",
        prefixDefinitionMustHaveMaximumThreeElements: "La définition du préfixe doit comporter un maximum de 3 éléments",
        prefixMustBeString: "Le préfixe doit être une chaîne",
        prefixTypeMustBeNumber: "Le type de préfixe doit être un nombre compris entre 0 et {{maximumPrefixType, number}}",
        invalidPrefixType: "Type de préfixe invalide",
        tweakFactorMustBeNumber: "Le facteur de réglage doit être un nombre"
    },
    ServiceProxy: {
        invalidIdentifierType: "Type d'identifiant invalide «{{identifierType}}»"
    },
    Parameters: {
        spillMatrix: {
            name: "matrice",
            description: "Matrice unidimensionnelle à renverser."
        },
        spillMaximumWidth: {
            name: "largeurMaximale",
            description: "Largeur maximale dans laquelle déverser la matrice. Si non fournie, la largeur restante de la feuille est utilisée."
        },
        spillMaximumHeight: {
            name: "hauteurMaximale",
            description: "Hauteur maximale dans laquelle déverser la matrice. Si non fournie, la hauteur restante de la feuille est utilisée."
        },
        domain: {
            name: "domaine",
            description: "Domaine de transformation. Les valeurs d'entrée valides vont de zéro au domaine-1."
        },
        value: {
            name: "valeur",
            description: "Valeur à transformer."
        },
        startValue: {
            name: "valeurInitiale",
            description: "Valeur de départ d'un domaine de valeurs à transformer."
        },
        count: {
            name: "compte",
            description: "Nombre de valeurs à transformer. Si positive, les valeurs transformées vont de valeurInitiale ascendante à valeurInitiale+compte-1. Si négative, les valeurs transformées vont de valeurInitiale descendant à valeurInitiale+compte+1."
        },
        transformedValue: {
            name: "valeurTransformee",
            description: "Valeur de sortie précédente d'une transformation."
        },
        tweak: {
            name: "reglage",
            description: "Valeur par laquelle réglager la transformation. Si non fourni ou nul, la sortie est séquentielle. Sinon, la sortie est cryptée de manière à paraître aléatoire, masquant les valeurs utilisées comme entrées de la séquence."
        },
        regExp: {
            name: "expReg",
            description: "Expression régulière par rapport à laquelle valider une chaîne."
        },
        validateS: {
            name: "c",
            description: "Chaîne à valider."
        },
        valueForS: {
            name: "c",
            description: "Chaîne pour laquelle déterminer la valeur."
        },
        errorMessage: {
            name: "messageDErreur",
            description: "Message d'erreur personnalisé à utiliser si la validation échoue. S'il n'est pas fourni, un message d'erreur interne est utilisé."
        },
        exclusionNone: {
            name: "exclusion",
            description: "Valeurs de chaîne à exclure. La seule valeur valide est 0 (aucune exclusion)."
        },
        exclusionFirstZero: {
            name: "exclusion",
            description: "Valeurs de chaîne à exclure. Les valeurs valides sont 0 (aucune exclusion) et 1 (chaînes commençant par 0 exclues)."
        },
        exclusionAllNumeric: {
            name: "exclusion",
            description: "Valeurs de chaîne à exclure. Les valeurs valides sont 0 (aucune exclusion) et 2 (chaînes entièrement numériques exclues)."
        },
        exclusionAny: {
            name: "exclusion",
            description: "Valeurs de chaîne à exclure. Les valeurs valides sont 0 (aucune exclusion), 1 (chaînes commençant par 0 exclues) et 2 (chaînes toutes numériques exclues)."
        },
        length: {
            name: "longueur",
            description: "Longueur de chaîne à créer."
        },
        numericS: {
            name: "c",
            description: "Chaîne numérique."
        },
        numericSFourOrFiveDigits: {
            name: "c",
            description: "Chaîne numérique à quatre ou cinq chiffres."
        },
        numericSWithCheckDigit: {
            name: "c",
            description: "Chaîne numérique avec chiffre de contrôle."
        },
        checkDigit: {
            name: "chiffreDeControle",
            description: "Chiffre de contrôle."
        },
        ai82S: {
            name: "c",
            description: "Chaîne de caractères GS1 AI 82."
        },
        ai82SWithCheckCharacterPair: {
            name: "c",
            description: "Chaîne de caractères GS1 AI 82 avec paire de caractères de contrôle."
        },
        validateIdentifier: {
            name: "cleDIdentification",
            description: "Clé d'identification à valider."
        },
        splitIdentifier: {
            name: "splitIdentifier",
            description: "Identifiant à diviser."
        },
        zeroSuppressibleGTIN12: {
            name: "gtin12",
            description: "GTIN-12 pour lequel supprimer les zéros."
        },
        zeroSuppressedGTIN12: {
            name: "gtin12SupprimeAZero",
            description: "GTIN-12 supprimé à zéro pour s'étendre."
        },
        convertGTIN: {
            name: "gtin",
            description: "GTIN à convertir en GTIN-14."
        },
        normalizeGTIN: {
            name: "gtin",
            description: "GTIN à normaliser."
        },
        validateGTIN: {
            name: "gtin",
            description: "GTIN à valider."
        },
        validateGTIN14: {
            name: "gtin14",
            description: "GTIN-14 à valider."
        },
        gcpLengthIdentifier: {
            name: "identifiant",
            description: "Identifiant pour lequel obtenir la longueur du préfixe d'entreprise GS1."
        },
        baseIdentifier: {
            name: "cleDIdentificationDeBase",
            description: "Clé d'identification de base."
        },
        hyperlinkIdentifier: {
            name: "identifiant",
            description: "Identifiant pour lequel créer un lien hypertexte."
        },
        indicatorDigit: {
            name: "indicatorDigit",
            description: "Chiffre indicateur."
        },
        gtinLevel: {
            name: "niveau",
            description: "Niveau auquel valider le GTIN. Les valeurs valides sont 0 (n'importe lequel), 1 (article commercial de consommation au détail) et 2 (autre que le niveau de l'article commercial de consommation au détail)."
        },
        prefix: {
            name: "prefixe",
            description: "Préfixe."
        },
        prefixType: {
            name: "typeDePréfixe",
            description: "Type de préfixe. Les valeurs valides sont 0 (préfixe d'entreprise GS1), 1 (préfixe d'entreprise U.P.C.) et 2 (préfixe GS1)."
        },
        tweakFactor: {
            name: "facteurDeReglage",
            description: "Facteur de réglage, utilisé pour prendre en charge la création de clés d'identification éparses. Le facteur de réglage par défaut est basé sur le préfixe d'entreprise GS1 et est généralement suffisant pour l'obscurcissement. Cela permet un meilleur contrôle du cryptage lorsqu'une sécurité plus élevée est requise."
        },
        identifierType: {
            name: "typeDIdentifiant",
            description: "Type d'identifiant (GTIN, GLN, SSCC, ...)."
        },
        prefixDefinitionAny: {
            name: "prefixeDefinition",
            description: "Définition de préfixe, soit un préfixe d'entreprise simple GS1 (sous forme de chaîne), soit le résultat d'un appel à definePrefix. Tout type de préfixe est pris en charge."
        },
        prefixDefinitionGS1UPC: {
            name: "prefixeDefinition",
            description: "Définition de préfixe, soit un préfixe d'entreprise simple GS1 (sous forme de chaîne), soit le résultat d'un appel à definePrefix. Seuls les types de préfixes 0 (préfixe d'entreprise GS1) et 1 (préfixe d'entreprise U.P.C.) sont pris en charge."
        },
        sparse: {
            name: "clairsemee",
            description: "Si cette valeur est vraie, la valeur est mappée sur une séquence clairsemée résistante à la découverte. La valeur par défaut est faux."
        },
        serialComponent: {
            name: "composanteSerie",
            description: "Composante série."
        },
        reference: {
            name: "reference",
            description: "Partie de référence de la clé d'identification."
        },
        rcnFormat: {
            name: "format",
            description: "Format de numéro de diffusion restreinte."
        },
        rcn: {
            name: "rcn",
            description: "Numéro de diffusion restreint à analyser."
        },
        rcnItemReference: {
            name: "referenceDArticle",
            description: "Référence d'article."
        },
        rcnPriceOrWeight: {
            name: "prixOuPoids",
            description: "Prix ou poids (nombre entier uniquement)."
        },
        hyperlinkText: {
            name: "texte",
            description: "Texte du lien hypertexte. À défaut, l'identifiant est utilisé."
        },
        hyperlinkDetails: {
            name: "details",
            description: "Détails à afficher au survol du lien hypertexte."
        }
    },
    Functions: {
        version: {
            name: "version",
            description: "Obtener la version de la boîte à outils AIDC."
        },
        spill: {
            name: "deverser",
            description: "Déverser une matrice unidimensionnelle pour l'adapter à un rectangle dont la hauteur et la largeur maximales sont données."
        },
        forwardTransform: {
            name: "transformerAvant",
            description: "Transformer une valeur en avant."
        },
        forwardTransformSequence: {
            name: "transformerSequenceAvant",
            description: "Transformer une séquence de valeurs en avant."
        },
        reverseTransform: {
            name: "transformerArriere",
            description: "Transformer une valeur en arrière."
        },
        validateRegExp: {
            name: "validerExpReg",
            description: "Valider une chaîne par rapport à une expression régulière."
        },
        isValidRegExp: {
            name: "estValideExpReg",
            description: "Déterminer si une chaîne est valide par rapport à une expression régulière."
        },
        validateNumeric: {
            name: "validerNumerique",
            description: "Valider une chaîne numérique."
        },
        isValidNumeric: {
            name: "estValideNumerique",
            description: "Déterminer si une chaîne est numérique."
        },
        createNumeric: {
            name: "creerNumerique",
            description: "Créer une chaîne numérique."
        },
        createNumericSequence: {
            name: "creerSequenceNumerique",
            description: "Créer une séquence de chaînes numériques."
        },
        valueForNumeric: {
            name: "valeurDeNumerique",
            description: "Obtenir la valeur d'une chaîne numérique."
        },
        validateHexadecimal: {
            name: "validerHexadecimale",
            description: "Valider une chaîne hexadécimale."
        },
        isValidHexadecimal: {
            name: "estValideHexadecimale",
            description: "Déterminer si une chaîne est hexadécimale."
        },
        createHexadecimal: {
            name: "creerHexadecimale",
            description: "Créer une chaîne hexadécimale."
        },
        createHexadecimalSequence: {
            name: "creerSequenceHexadecimale",
            description: "Créer une séquence de chaînes hexadécimales."
        },
        valueForHexadecimal: {
            name: "valeurDeHexadecimale",
            description: "Obtenir la valeur d'une chaîne hexadécimale."
        },
        validateAlphabetic: {
            name: "validerAlphabetique",
            description: "Valider une chaîne alphabétique."
        },
        isValidAlphabetic: {
            name: "estValideAlphabetique",
            description: "Déterminer si une chaîne est alphabétique."
        },
        createAlphabetic: {
            name: "creerAlphabetique",
            description: "Créer une chaîne alphabétique."
        },
        createAlphabeticSequence: {
            name: "creerSequenceAlphabetique",
            description: "Créer une séquence de chaînes alphabétiques."
        },
        valueForAlphabetic: {
            name: "valeurDeAlphabetique",
            description: "Obtenir la valeur d'une chaîne alphabétique."
        },
        validateAlphanumeric: {
            name: "validerAlphanumerique",
            description: "Valider une chaîne alphanumérique."
        },
        isValidAlphanumeric: {
            name: "estValideAlphanumerique",
            description: "Déterminer si une chaîne est alphanumérique."
        },
        createAlphanumeric: {
            name: "creerAlphanumerique",
            description: "Créer une chaîne alphanumérique."
        },
        createAlphanumericSequence: {
            name: "creerSequenceAlphanumerique",
            description: "Créer une séquence de chaînes alphanumériques."
        },
        valueForAlphanumeric: {
            name: "valeurDeAlphanumerique",
            description: "Obtenir la valeur d'une chaîne alphanumérique."
        },
        GS1: {
            validateAI82: {
                name: "validerAI82",
                description: "Valider une chaîne de caractères GS1 AI 82."
            },
            isValidAI82: {
                name: "estValideAI82",
                description: "Déterminer si une chaîne est un jeu de caractères GS1 AI 82."
            },
            createAI82: {
                name: "creerAI82",
                description: "Créer une chaîne de caractères GS1 AI 82."
            },
            createAI82Sequence: {
                name: "creerSequenceAI82",
                description: "Créer une séquence de chaînes de caractères GS1 AI 82."
            },
            valueForAI82: {
                name: "valeurDeAI82",
                description: "Obtenez la valeur d'une chaîne de caractères GS1 AI 82."
            },
            validateAI39: {
                name: "validerAI39",
                description: "Valider une chaîne de caractères GS1 AI 39."
            },
            isValidAI39: {
                name: "estValideAI39",
                description: "Déterminer si une chaîne est un jeu de caractères GS1 AI 39."
            },
            createAI39: {
                name: "creerAI39",
                description: "Créer une chaîne de caractères GS1 AI 39."
            },
            createAI39Sequence: {
                name: "creerSequenceAI39",
                description: "Créer une séquence de chaînes de caractères GS1 AI 39."
            },
            valueForAI39: {
                name: "valeurDeAI39",
                description: "Obtenez la valeur d'une chaîne de caractères GS1 AI 39."
            },
            validateAI64: {
                name: "validerAI64",
                description: "Valider une chaîne de caractères GS1 AI 64."
            },
            isValidAI64: {
                name: "estValideAI64",
                description: "Déterminer si une chaîne est un jeu de caractères GS1 AI 64."
            },
            checkDigit: {
                name: "chiffreDeControle",
                description: "Calculer le chiffre de contrôle pour une chaîne numérique."
            },
            hasValidCheckDigit: {
                name: "aChiffreDeControleValide",
                description: "Déterminer si une chaîne a un chiffre de contrôle valide."
            },
            priceOrWeightCheckDigit: {
                name: "chiffreDeControlePrixOuPoids",
                description: "Calculer le chiffre de contrôle pour un prix ou un poids."
            },
            isValidPriceOrWeightCheckDigit: {
                name: "estChiffreDeControlePrixOuPoidsValide",
                description: "Déterminer si un chiffre de contrôle de prix ou de poids est valide."
            },
            checkCharacterPair: {
                name: "paireDeCaracteresDeControle",
                description: "Calculer la paire de caractères de contrôle pour une chaîne de caractères."
            },
            hasValidCheckCharacterPair: {
                name: "aPaireDeCaracteresDeControleValide",
                description: "Déterminez si une chaîne de caractères GS1 AI 82 a une paire de caractères de contrôle valide."
            },
            validateGTIN13: {
                name: "validerGTIN13",
                description: "Valider un GTIN-13."
            },
            isValidGTIN13: {
                name: "estValideGTIN13",
                description: "Déterminer si un GTIN-13 est valide."
            },
            validateGTIN12: {
                name: "validerGTIN12",
                description: "Valider un GTIN-12."
            },
            isValidGTIN12: {
                name: "estValideGTIN12",
                description: "Déterminer si un GTIN-12 est valide."
            },
            validateGTIN8: {
                name: "validerGTIN8",
                description: "Valider un GTIN-8."
            },
            isValidGTIN8: {
                name: "estValideGTIN8",
                description: "Déterminer si un GTIN-8 est valide."
            },
            zeroSuppressGTIN12: {
                name: "supprimerZeroGTIN12",
                description: "Supprimer les zéros d'un GTIN-12."
            },
            zeroExpandGTIN12: {
                name: "etendrerZeroGTIN12",
                description: "Étendrer un GTIN-12 supprimé à zéro."
            },
            convertToGTIN14: {
                name: "convertirEnGTIN14",
                description: "Convertir un GTIN en GTIN-14."
            },
            normalizeGTIN: {
                name: "normalizeGTIN",
                description: "Normaliser un GTIN."
            },
            validateGTIN: {
                name: "validerGTIN",
                description: "Valider un GTIN de n'importe quelle longueur."
            },
            isValidGTIN: {
                name: "estValideGTIN",
                description: "Déterminer si un GTIN, quelle que soit sa longueur, est valide."
            },
            validateGTIN14: {
                name: "validerGTIN14",
                description: "Valider un GTIN-14."
            },
            isValidGTIN14: {
                name: "estValideGTIN14",
                description: "Déterminer si un GTIN-14 est valide."
            },
            validateGLN: {
                name: "validerGLN",
                description: "Valider un GLN."
            },
            isValidGLN: {
                name: "estValideGLN",
                description: "Déterminer si un GLN est valide."
            },
            validateSSCC: {
                name: "validerSSCC",
                description: "Valider un SSCC."
            },
            isValidSSCC: {
                name: "estValideSSCC",
                description: "Déterminer si un SSCC est valide."
            },
            validateGRAI: {
                name: "validerGRAI",
                description: "Valider un GRAI."
            },
            isValidGRAI: {
                name: "estValideGRAI",
                description: "Déterminer si un GRAI est valide."
            },
            splitGRAI: {
                name: "splitGRAI",
                description: "Séparer un GRAI en son identifiant de base et son composant sériel."
            },
            validateGIAI: {
                name: "validerGIAI",
                description: "Valider un GIAI."
            },
            isValidGIAI: {
                name: "estValideGIAI",
                description: "Déterminer si un GIAI est valide."
            },
            validateGSRN: {
                name: "validerGSRN",
                description: "Valider un GSRN."
            },
            isValidGSRN: {
                name: "estValideGSRN",
                description: "Déterminer si un GSRN est valide."
            },
            validateGDTI: {
                name: "validerGDTI",
                description: "Valider un GDTI."
            },
            isValidGDTI: {
                name: "estValideGDTI",
                description: "Déterminer si un GDTI est valide."
            },
            splitGDTI: {
                name: "splitGDTI",
                description: "Séparer un GDTI en son identifiant de base et son composant sériel."
            },
            validateGINC: {
                name: "validerGINC",
                description: "Valider un GINC."
            },
            isValidGINC: {
                name: "estValideGINC",
                description: "Déterminer si un GINC est valide."
            },
            validateGSIN: {
                name: "validerGSIN",
                description: "Valider un GSIN."
            },
            isValidGSIN: {
                name: "estValideGSIN",
                description: "Déterminer si un GSIN est valide."
            },
            validateGCN: {
                name: "validerGCN",
                description: "Valider un GCN."
            },
            isValidGCN: {
                name: "estValideGCN",
                description: "Déterminer si un GCN est valide."
            },
            splitGCN: {
                name: "splitGCN",
                description: "Séparer un GCN en son identifiant de base et son composant sériel."
            },
            validateCPID: {
                name: "validerCPID",
                description: "Valider un CPID."
            },
            isValidCPID: {
                name: "estValideCPID",
                description: "Déterminer si un CPID est valide."
            },
            validateGMN: {
                name: "validerGMN",
                description: "Valider un GMN."
            },
            isValidGMN: {
                name: "estValideGMN",
                description: "Déterminer si un GMN est valide."
            },
            definePrefix: {
                name: "definisserPrefixe",
                description: "Définisser un préfixe à utiliser dans les fonctions de création de clé d'identification GS1."
            },
            gcpLength: {
                name: "longueurGCPDe",
                description: "Obtenez la longueur du préfixe d'entreprise GS1 pour un identifiant."
            },
            gcpLengthDateTime: {
                name: "dateHeureLongueurGCP",
                description: "Obtenez la date et l'heure de la dernière mise à jour des données relatives à la longueur du préfixe d'entreprise GS1."
            },
            createGTIN: {
                name: "creerGTIN",
                description: "Créer un GTIN."
            },
            createGTINSequence: {
                name: "creerSequenceGTIN",
                description: "Créer un séquence de GTIN."
            },
            createAllGTIN: {
                name: "creerTousGTIN",
                description: "Créez tous les GTIN pour un préfixe."
            },
            createGTIN14: {
                name: "creerGTIN14",
                description: "Créer un GTIN-14."
            },
            createGLN: {
                name: "creerGLN",
                description: "Créer un GLN."
            },
            createGLNSequence: {
                name: "creerSequenceGLN",
                description: "Créer un séquence de GLN."
            },
            createAllGLN: {
                name: "creerTousGLN",
                description: "Créez tous les GLN pour un préfixe."
            },
            createSSCC: {
                name: "creerSSCC",
                description: "Créer un SSCC."
            },
            createSSCCSequence: {
                name: "creerSequenceSSCC",
                description: "Créer un séquence de SSCC."
            },
            createAllSSCC: {
                name: "creerTousSSCC",
                description: "Créez tous les SSCC pour un préfixe."
            },
            createGRAI: {
                name: "creerGRAI",
                description: "Créer un GRAI."
            },
            createGRAISequence: {
                name: "creerSequenceGRAI",
                description: "Créer un séquence de GRAI."
            },
            createAllGRAI: {
                name: "creerTousGRAI",
                description: "Créez tous les GRAI pour un préfixe."
            },
            createSerializedGRAI: {
                name: "creerGRAISerialise",
                description: "Créer un GRAI sérialisé."
            },
            concatenateGRAI: {
                name: "concatenerGRAI",
                description: "Concaténer une base GRAI avec un composant série."
            },
            createGIAI: {
                name: "creerGIAI",
                description: "Créer un GIAI."
            },
            createGSRN: {
                name: "creerGSRN",
                description: "Créer un GSRN."
            },
            createGSRNSequence: {
                name: "creerSequenceGSRN",
                description: "Créer un séquence de GSRN."
            },
            createAllGSRN: {
                name: "creerTousGSRN",
                description: "Créez tous les GSRN pour un préfixe."
            },
            createGDTI: {
                name: "creerGDTI",
                description: "Créer un GDTI."
            },
            createGDTISequence: {
                name: "creerSequenceGDTI",
                description: "Créer un séquence de GDTI."
            },
            createAllGDTI: {
                name: "creerTousGDTI",
                description: "Créez tous les GDTI pour un préfixe."
            },
            createSerializedGDTI: {
                name: "creerGDTISerialise",
                description: "Créer un GDTI sérialisé."
            },
            concatenateGDTI: {
                name: "concatenerGDTI",
                description: "Concaténer une base GDTI avec un composant série."
            },
            createGINC: {
                name: "creerGINC",
                description: "Créer un GINC."
            },
            createGSIN: {
                name: "creerGSIN",
                description: "Créer un GSIN."
            },
            createGSINSequence: {
                name: "creerSequenceGSIN",
                description: "Créer un séquence de GSIN."
            },
            createAllGSIN: {
                name: "creerTousGSIN",
                description: "Créez tous les GSIN pour un préfixe."
            },
            createGCN: {
                name: "creerGCN",
                description: "Créer un GCN."
            },
            createGCNSequence: {
                name: "creerSequenceGCN",
                description: "Créer un séquence de GCN."
            },
            createAllGCN: {
                name: "creerTousGCN",
                description: "Créez tous les GCN pour un préfixe."
            },
            createSerializedGCN: {
                name: "creerGCNSerialise",
                description: "Créer un GCN sérialisé."
            },
            concatenateGCN: {
                name: "concatenerGCN",
                description: "Concaténer une base GCN avec un composant série."
            },
            createCPID: {
                name: "creerCPID",
                description: "Créer un CPID."
            },
            createGMN: {
                name: "creerGMN",
                description: "Créer un GMN."
            },
            parseVariableMeasureRCN: {
                name: "parseVariableMeasureRCN",
                description: "Analyser un numéro de diffusion restreinte (RCN) à l'aide d'un format d'article commercial à mesure variable."
            },
            createVariableMeasureRCN: {
                name: "creerMesureVariableRCN",
                description: "Créer un numéro de diffusion restreinte (RCN) à l'aide d'un format d'article commercial à mesure variable."
            },
            verifiedByGS1: {
                name: "verifiedByGS1",
                description: "Créer un lien hypertexte «Vérifié par GS1»."
            }
        }
    }
};
