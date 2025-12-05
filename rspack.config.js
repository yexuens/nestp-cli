const path = require('path');
const { BannerPlugin, CopyRspackPlugin } = require('@rspack/core'); // 引入 CopyRspackPlugin

/** @type {import('@rspack/cli').Configuration} */
module.exports = {
    // 1. 设置目标环境为 Node.js
    target: 'node',
    mode: 'production',

    // 2. 入口文件
    entry: {
        main: './src/index.ts',
    },

    // 3. 各种文件扩展名的解析
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },

    // 4. 处理 TypeScript (Rspack 内置了 TS 支持，无需额外 loader)
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: 'builtin:swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                        },
                    },
                },
            },
        ],
    },

    // 5. 输出配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        clean: true, // 每次构建清理 dist 目录
    },

    // 6. 关键：添加 Shebang 头
    // 即使你在源码里写了 #!/usr/bin/env node，打包时可能会被移到后面
    // 使用 BannerPlugin 强制将其放在文件最顶部
    plugins: [
        // ... 原有的 BannerPlugin ...
        new BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true,
            entryOnly: true,
        }),

        // ✅ 新增：将 src/templates 复制到 dist/templates
        new CopyRspackPlugin({
            patterns: [
                {
                    from: 'src/templates', // 源目录 (假设你的模板在 src/templates)
                    to: 'templates'        // 目标目录 (相对于 dist)
                }
            ],
        }),
    ],
};