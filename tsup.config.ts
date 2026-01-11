import { defineConfig } from 'tsup';

export default defineConfig([
    // Standard library build (externals)
    {
        entry: ['src/index.ts'],
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true, // Clean output directory before building
        outDir: 'dist',
        external: ['lit', 'chart.js'],
    },
    // Browser bundle (bundled deps) for demo/Usage without bundlers
    {
        entry: { 'index.bundle': 'src/index.ts' },
        format: ['esm'],
        sourcemap: true,
        outDir: 'dist',
        noExternal: ['lit', 'chart.js', 'chartjs-plugin-datalabels'], // Bundle dependencies
    }
]);