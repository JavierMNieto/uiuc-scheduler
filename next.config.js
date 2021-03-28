const withPWA = require("next-pwa");

/*
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
})

module.exports = withBundleAnalyzer({});
*/

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
  }
});