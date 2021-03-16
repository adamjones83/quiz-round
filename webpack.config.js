const path = require('path');

module.exports = {
  entry: "./src/mainWindow.tsx",
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/, // transform tsx files with typescript
        exclude: /node_modules/,
        use: "ts-loader"
      },
      {
        test: /\.jsx/, // jsx files with babel - primarily for jest testing
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ],
  },
  externals: {
      react: 'React',
      "react-dom": 'ReactDOM'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "target"),
  },
};
