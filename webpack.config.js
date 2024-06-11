const config = {
  mode: 'production', // "production" | "development" | "none"
  resolve: {
    extensions: ['*', '.mjs', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-nullish-coalescing-operator']
          }
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  }
}

module.exports = config
