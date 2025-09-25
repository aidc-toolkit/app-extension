import { esLintConfigAIDCToolkit } from "@aidc-toolkit/dev";
import { defineConfig } from "eslint/config";

export default defineConfig([
    ...esLintConfigAIDCToolkit,
    {
        files: [
            "src/*/**/*-proxy.ts"
        ],
        rules: {
            // Same rule minus ClassDeclaration, ClassProperty, and MethodDefinition contexts.
            "jsdoc/require-description": ["warn", {
                contexts: ["FunctionDeclaration", "TSEnumDeclaration", "TSInterfaceDeclaration", "TSModuleDeclaration", "TSTypeAliasDeclaration"]
            }],
            // Same rule minus ClassDeclaration, ClassProperty, and MethodDefinition contexts.
            "jsdoc/require-jsdoc": ["warn", {
                contexts: ["FunctionDeclaration", "TSEnumDeclaration", "TSInterfaceDeclaration", "TSModuleDeclaration", "TSTypeAliasDeclaration"]
            }]
        }
    }
]);
