import resolve from '@rollup/plugin-node-resolve';
// import copy    from "rollup-plugin-copy";



export default {
    input  : 'src/main.js',
    output : [
        {
            format: 'umd',
            name  : 'ShipRekt',
            file  : 'build/bundle.js',
        }
    ],
    plugins: [
        resolve(),
        /* copy({
            targets : [
                {src: 'src/models/!**', dest: 'build/assets'},
            ],
            verbose : true,
            copyOnce: true,
        }) */
    ]
};
