import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import {copyPlugin} from "@alorel/rollup-plugin-copy";
import modWrapPlugin from "./build/mod-wrap.mjs";
import replacePlugin from "@rollup/plugin-replace";
import iifeWrapPlugin from "./build/iife-wrap.mjs";
import {threadedTerserPlugin} from "@alorel/rollup-plugin-threaded-terser";
import {assetLoader} from "./build/asset-loader.mjs";
import jsonPlugin from "@rollup/plugin-json";
import cleanPlugin from "./build/clean-plugin.mjs";
import scssLoader from "./build/scss-loader.mjs";
import loadFirstPlugin from "./build/load-first.mjs";

const srcInclude = /src[\\/].+\.m?tsx?$/;
const srcExclude = /node_modules[\\/]/;

export default function (opts) {
  const watch = opts.watch;
  const prod = Boolean(getOpt(opts, 'prod'));

  return {
    input: 'src/setup.tsx',
    cache: false,
    output: {
      dir: 'dist',
      format: 'es',
      generatedCode: {
        arrowFunctions: true,
        constBindings: true,
        objectShorthand: true,
      },
      preserveModules: false,
      sourcemap: false,
      entryFileNames: 'setup.mjs',
    },
    plugins: [
      cleanPlugin(),
      mkNodeResolve(),
      jsonPlugin({
        compact: true,
        include: '**/*.json',
        namedExports: true,
        preferConst: true,
      }),
      scssLoader({prod}),
      typescript({exclude: srcExclude, include: srcInclude}),
      !prod && loadFirstPlugin(),
      replacePlugin({
        exclude: srcExclude,
        include: srcInclude,
        preventAssignment: true,
        values: {
          'process.env.MELVOR_MOD_VERSION': JSON.stringify(process.env.MELVOR_MOD_VERSION || 'dev'),
          'process.env.PRODUCTION': String(prod),
        },
      }),
      assetLoader({
        reg: /\.png$/,
      }),
      prod && mkIifeWrap(),
      modWrapPlugin({prod}),
      prod && threadedTerserPlugin({
        terserOpts: {
          output: {
            comments: false,
          },
        },
      }),
      copyPlugin({
        copy: [
          {
            from: [
              'manifest.json',
              // 'public_api.d.ts',
            ],
            opts: {glob: {cwd: 'src'}}
          },
          {from: 'LICENSE'},
        ],
        defaultOpts: {
          emitNameKind: 'fileName',
        },
        watch,
      }),
      zipPlugin(),
    ],
    watch: {
      exclude: 'node_modules/**/*',
    },
  };
}

function getOpt(opts, opt) {
  if (opt in opts) {
    const out = opts[opt];
    delete opts[opt];

    return out;
  }
}

function mkIifeWrap() {
  return iifeWrapPlugin({
    async: true,
    vars: [
      'AltMagicConsumptionID',
      'Array',
      'AttackTypeID',
      'Bank',
      'Boolean',
      'cdnMedia',
      'CombatManager',
      'console',
      'document',
      'Equipment',
      'EquippedFood',
      'Error',
      'game',
      'isNaN',
      'JSON',
      'Map',
      'NamespacedObject',
      'NamespaceRegistry',
      'Number',
      'Object',
      'Player',
      'Promise',
      'RegExp',
      'sidebar',
      'SkillWithMastery',
      'String',
      'Symbol',
      'Swal',
      'TypeError',
      'undefined',
      'WeakMap',
      'window',
    ],
  });
}

function mkNodeResolve() {
  return  nodeResolve({
    exportConditions: [
      'es2015',
      'module',
      'import',
      'default',
    ],
    mainFields: [
      'es2015',
      'esm2015',
      'module',
      'browser',
      'main',
    ],
  });
}

function zipPlugin() {  
  return {  
    name: 'zip-plugin',  
    writeBundle: async () => {  
      const JSZip = (await import('jszip')).default;  
      const fs = await import('fs');  
      const path = await import('path');  
        
      const zip = new JSZip();  
      const distPath = path.resolve('dist');  
      const files = fs.readdirSync(distPath);  
        
      files.forEach(file => {  
        const filePath = path.join(distPath, file);  
        const fileContent = fs.readFileSync(filePath);  
        zip.file(file, fileContent);  
      });  
        
      const content = await zip.generateAsync({ type: 'nodebuffer' });  
      fs.writeFileSync('dist.zip', content);  
      console.log('dist.zip created successfully');  
    }  
  };  
}