import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
// import 'tailwindcss/tailwind.css'; // Import Tailwind CSS styles

rules.push({
  test: /\.s?css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
