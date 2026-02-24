import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { chmodSync } from 'fs';
import { join } from 'path';
import type { Compiler } from 'webpack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

class FixNativeBinaryPermissionsPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap('FixNativeBinaryPermissionsPlugin', (compilation) => {
      for (const assetName of Object.keys(compilation.assets)) {
        if (assetName.includes('native_modules/ffprobe')) {
          const outputPath = join(compiler.outputPath, assetName);
          try {
            chmodSync(outputPath, 0o755);
          } catch {
            // Ignore if file doesn't exist yet
          }
        }
      }
    });
  }
}

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new FixNativeBinaryPermissionsPlugin(),
];

