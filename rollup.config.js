import resolve from 'rollup-plugin-node-resolve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import serve from 'rollup-plugin-serve'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs' 
import jsx from 'rollup-plugin-jsx'
import clear from 'rollup-plugin-clear'
export default {
    input: 'test/main.tsx',
    output: {
        file: 'dist/future-html.js',
        format: 'es',
        sourcemap: true,
    },
    external: ['html'], 

    watch: {
        include:"src/**",
        exclude:"node_modules"
      },
    plugins: [
        clear({
            targets: ['dist'],
          }),
    resolve({
        extensions: [ '.mjs', '.js', '.ts', '.json' ,'.jsx','tsx'],  
    }),htmlTemplate({
        template: 'example/demo.html',
        target: 'dist/index.html',
    }),
    serve('dist'),
    json(),
    typescript(),
    jsx({ factory: 'html', passUnknownTagsToFactory: true }),
    commonjs()
    ]
}

