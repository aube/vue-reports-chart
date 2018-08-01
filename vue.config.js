let assetsDir = './';

module.exports = {
    assetsDir: assetsDir,

    configureWebpack: {
        output: {
            filename: assetsDir + "/main.js",
            chunkFilename: assetsDir + "/chunk.js"
        }
    },

    productionSourceMap: false,

    chainWebpack: config => {
        config.plugins
            .delete("html")
            .delete("prefetch")
            .delete("preload");
    }
};