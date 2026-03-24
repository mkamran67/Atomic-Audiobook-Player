import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process. The scanner entry is the utility process
   * for background audiobook scanning.
   */
  entry: {
    index: './src/index.ts',
    scanner: './src/scanner/worker.ts',
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  output: {
    filename: '[name].js',
  },
  externals: {
    'music-metadata': 'commonjs music-metadata',
  },
};
