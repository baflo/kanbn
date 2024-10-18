import esbuild from 'esbuild';

/** @type { esbuild.BuildOptions } */
const buildOptions = {
    entryPoints: ["src/**/*.js"],
    platform: 'node',
}

/** @type { esbuild.BuildOptions } */
const cjsBuildOptions = {
    ...buildOptions,
    format: 'cjs',
    bundle: true,
    entryPoints: ["src/main.js", "src/utility.js"],
    outdir: "build/cjs/",
    outExtension: { '.js' : '.cjs' },
    external: ['*/README']
}

/** @type { esbuild.BuildOptions } */
const esmBuildOptions = {
    ...buildOptions,
    format: 'esm',
    outdir: "build/esm/"
}


await Promise.all([cjsBuildOptions, esmBuildOptions].map(opts => esbuild.build(opts)));