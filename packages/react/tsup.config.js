import { execSync } from "child_process";
import { defineConfig } from "tsup";

export default defineConfig((opts) => ({
    sourcemap: true,
    dts: true,
    format: ["esm"],
    // async onSuccess(){
    //     execSync("pnpm tsc --project tsconfig.sourcemap.json");
    // },
    entry: ["./src/index.ts"],
    clean: !opts.watch,
    esbuildOptions: (option) => {
        option.banner = {
        js: `"use client";`,
        };
    },
}));