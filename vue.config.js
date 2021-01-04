// 基础路径 注意发布之前要先修改这里
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const UglifyJsPlugin=require('uglifyjs-webpack-plugin')
module.exports = {
    publicPath: './', // 根据你的实际情况更改这里
    lintOnSave: true,
    productionSourceMap: false,
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         return {
    //             plugins: [
    //                 new UglifyJsPlugin({
    //                     uglifyOptions: {
    //                         compress: {
    //                             drop_debugger: true,  //去掉debugger
    //                             drop_console: true,  // 去掉console
    //                         }
    //                     }
    //                 })
    //             ]
    //         }
    //     }
    // },
    devServer: {
        port: 1888,
        proxy: {
            '/api': {
                //本地服务接口地址
                // target: 'http://192.168.1.89:8765',
                // target: 'http://192.168.1.90:8765',
                target: 'http://serp-test.520mro.com',
                // target: 'http://39.100.151.178:8765',
                //远程演示服务地址
                //target: 'https://saber.bladex.vip/api',
                ws: true,
                pathRewrite: {
                    '^/api': '/api/'
                }
            },
            '/a': {
                target: 'http://static.hejizx.com:20000', //正式
                pathRewrite: {
                    '^/a': '/a/api'
                }
            }
        }
    },
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
        entry
            .add('@/mock')
            .end()
    }
}
