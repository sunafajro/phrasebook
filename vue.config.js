module.exports = {
  filenameHashing: false,
  devServer: {
    port: 3000,
    proxy: "http://localhost:5000"
  },
  productionSourceMap: false
}