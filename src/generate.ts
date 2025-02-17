/* eslint-disable no-console -- Console application. */

import type { Generator } from "./generator.js";
import { MicrosoftGenerator } from "./microsoft.js";

let generator: Generator | undefined = undefined;

if (process.argv.length >= 3) {
    switch (process.argv[2]) {
        case "microsoft":
            if (process.argv.length === 6) {
                generator = new MicrosoftGenerator(process.argv[3], process.argv[4], process.argv[5]);
            }
            break;

        case "google":
            // Not yet supported.
            break;
    }
}

if (generator === undefined) {
    throw new Error("Syntax: generate microsoft sourceFileName configFileName | generate google sourceFileName");
}

await generator.generate().catch((error: unknown) => {
    console.error(error);
});
