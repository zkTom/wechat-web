const isProd = process.env.NODE_ENV === 'production';
// let baseURL = process.env.VUE_APP_URL;

module.exports = {
    assetsDir: 'static',
    pages: {
        app: {
            entry: 'src/main.ts',
            template: './public/index.html',
            filename: 'index.html',
            title: '邯郸市养犬登记证管理平台'
            //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        'custom-menu': {
            // entry for the page
            entry: 'src/pages/custom-menu/index.ts',
            // the source template
            template: './public/index.html',
            // output as dist/index.html
            filename: 'pages/custom-menu.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '自定义菜单'
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        fans: {
            entry: 'src/pages/fans/index.ts',
            template: './public/index.html',
            filename: 'pages/fans.html',
            title: '粉丝列表'
            //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        'composition-api': {
            entry: 'src/pages/composition-api/index.ts',
            template: './public/index.html',
            filename: 'pages/composition-api.html',
            title: 'vue3 composition api 试用'
        },
        'wechat-receive-form': {
            entry: 'src/pages/wechat-receive-form/index.js',
            template: 'src/pages/wechat-receive-form/index.html',
            filename: 'pages/wechat-receive-form.html',
            title: '河北在哪电车推广活动'
        },
        'order-form': {
            entry: 'src/pages/order-form/index.js',
            template: 'src/pages/order-form/index.html',
            filename: 'pages/order-form.html',
            title: '河北在哪上门安装预约'
        },
        'order-result': {
            entry: 'src/pages/order-result/index.js',
            template: 'src/pages/order-result/index.html',
            filename: 'pages/order-result.html',
            title: '河北在哪儿上门安装预约'
            //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        'double-eleven': {
            entry: 'src/pages/double-eleven/index.js',
            template: 'src/pages/double-eleven/index.html',
            filename: 'pages/double-eleven.html',
            title: '河北在哪儿双11上牌活动'
        },
        'double-eleven-game': {
            entry: 'src/pages/double-eleven-game/index.js',
            template: 'src/pages/double-eleven-game/index.html',
            filename: 'pages/double-eleven-game.html',
            title: '河北在哪儿双11上牌活动小游戏'
        },
        'video-game-tree': {
            // entry for the page
            entry: 'src/pages/video-game-tree/index.ts',
            // the source template
            template: 'src/pages/video-game-tree/index.html',
            // output as dist/index.html
            filename: 'pages/video-game-tree.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: '视频游戏自定义菜单树'
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    },
    chainWebpack: config => {
        // 指定环境打包js路径
        config.output.filename('static/js/[name].[hash:8].js').chunkFilename('static/js/chunk-[name].[chunkhash:8].js');
    },
    css: {
        // 为css后缀添加hash
        extract: {
            filename: 'static/css/[name].[hash:8].css',
            chunkFilename: 'static/css/chunk-[hash:8].[chunkhash:8].css'
        },
        // css预设器配置项
        loaderOptions: {
            sass: {
                prependData: '@import "@/assets/scss/variable.scss";'
            },
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        // 把px单位换算成rem单位
                        rootValue: 75, // 换算的基数(设计图750的根字体为32) 默认37.5  依然按设计稿的750/75
                        selectorBlackList: ['van'], // 忽略转换正则匹配项
                        propList: ['*']
                    })
                ]
            }
        }
    },
    configureWebpack: config => {
        // 取消生产环境的log
        if (isProd) {
            // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
            // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
            // config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [ 'console.log' ]
        }
        const plugins = [];
        return { plugins };
    },
    publicPath: '/',
    devServer: {
        port: 3000,
        proxy: {
            '/wxin': {
                target: 'https://ais.hbzner.com/api',
                ws: true,
                changeOrigin: true
            },
            '/evi': {
                target: 'http://192.168.60.59:8081',
                ws: true,
                changeOrigin: true
            },
            '/api': {
                target: 'http://localhost:9000/',
                // target: 'http://192.168.60.158:9000',
                ws: true,
                changeOrigin: true
            }
        },
        disableHostCheck: true
    }
};
