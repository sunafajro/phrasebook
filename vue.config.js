module.exports = {
  filenameHashing: false,
  devServer: {
    port: 3000,
    proxy: "http://localhost:8081"
  },
  productionSourceMap: false
}