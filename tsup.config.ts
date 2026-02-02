import { tsupConfig } from "@aidc-toolkit/dev";
import { defineConfig } from "tsup";

export default defineConfig(options => ({
    ...tsupConfig(options),
    entry: ["src/index.ts", "src/gs1/index.ts", "src/generator/index.ts"]
}));
