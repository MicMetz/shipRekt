import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)
import babel   from 'rollup-plugin-babel';



export default {
    input  : 'src/main.js',
    output : [
        {
            format: 'umd',
            name  : 'ShipRekt',
            file  : 'build/bundle.js',
            inlineDynamicImports: true,
        }
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
    ]
};
