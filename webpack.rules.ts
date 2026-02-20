import type { ModuleOptions } from 'webpack';

type RuleEntry = Required<ModuleOptions>['rules'][number];

// Base rules shared by all configs
export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.jsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        exclude: /node_modules/,
        presets: ['@babel/preset-react']
      }
    }
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.(png|jpg|gif|svg|glb)$/,
    type: 'asset/resource'
  }
];

// Asset relocator rule — only for the main process where __dirname is available.
// The @vercel/webpack-asset-relocator-loader injects __dirname references that
// break in sandboxed renderer/preload contexts (target: 'web').
export const assetRelocatorRule: RuleEntry = {
  test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
  parser: { amd: false },
  use: {
    loader: '@vercel/webpack-asset-relocator-loader',
    options: {
      outputAssetBase: 'native_modules',
    },
  },
};
