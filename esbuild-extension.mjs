import esbuild from 'esbuild'

const optionWatch = process.argv.slice(2).includes('--watch')

esbuild
    .build({
        entryPoints: [
            'src/extension.ts'
        ],
        platform: 'node',
        format: 'cjs',
        outfile: 'out/extension.js',
        external: [
            'vscode',
        ],
        bundle: true,
        minify: false,
        splitting: false,
        sourcemap: 'inline',
        metafile: true,
        watch: (optionWatch ? {
            onRebuild(error, result) {
                console.log('[watch] build started')
                if (error) {
                    error.errors.forEach(error => console.error(`> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`))
                } else {
                    console.log('[watch] build finished')
                }
            },
        } : false),
    })
    .then(() => optionWatch && console.log('[watch] build finished'))
    .catch(() => process.exit(1))
