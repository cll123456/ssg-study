import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/node/cli.ts'],
    splitting: true,
    outDir: 'dist',
    bundle: true,
    dts: true,
    format: ['cjs', 'esm'],
    clean: true,
    banner: {
        js: 'import { createRequire as createRequire0 } from "module"; const require = createRequire0(import.meta.url);'
    },
    shims: true
})
