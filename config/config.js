/*
 * @Author: devfpy
 * @Date: 2021-08-09 17:31:05
 * @LastEditTime: 2022-04-24
 * @LastEditors: FisherX
 * @Description:
 */
import { defineConfig } from 'umi';
import proxy from './proxy';
import defaultSettings from './defaultSettings';
import routes from './routes';
import _ from 'lodash';

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const { REACT_APP_ENV } = process.env;
const assetDir = 'static';

export default defineConfig({
    title: false,
    hash: false,
    history: { type: 'hash' },
    antd: {},
    dva: {
        hmr: true
    },
    layout: {
        locale: true,
        siderWidth: 208,
        ...defaultSettings
    },
    // layout: false,
    qiankun: {
        slave: {}
    },
    outputPath: 'build',
    nodeModulesTransform: {
        type: 'none'
    },
    fastRefresh: {},
    // mfsu: {},
    // webpack5: {},
    dynamicImport: {
        loading: '@ant-design/pro-layout/es/PageLoading'
    },
    routes: routes,
    proxy: proxy[REACT_APP_ENV || 'dev'],
    theme: {
        'primary-color': defaultSettings.primaryColor,
        'tab-left-menu': defaultSettings.tabLeftMenuColor, //'#5E5E5E',
        'border-color-base': defaultSettings.borderColorBase,
        'font-size-sm': defaultSettings.fontSizeSm,
        'text-color': defaultSettings.textColor,
        'layout-body-background': defaultSettings.layoutBodyBackground,
        'layout-header-background': defaultSettings.layoutHeaderBackground,
        black: defaultSettings.black,
        'close-icon-hover': defaultSettings.closeIconHover
    },
    manifest: {
        basePath: '/'
    },
    extraBabelPresets: ['@babel/env', '@babel/react'],
    extraBabelPlugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['babel-plugin-import', { libraryName: 'antd', style: true }, 'antd']
    ],
    // 生产环境去除console日志打印
    terserOptions: {
        compress: {
            drop_console: isEnvProduction
        }
    },
    chainWebpack(config) {
        // 修改js，js chunk文件输出目录
        config.output
            .filename(assetDir + '/js/[name].[hash:8].js')
            .chunkFilename(assetDir + '/js/[name].[contenthash:8].chunk.js');

        // 修改css输出目录
        config.plugin('extract-css').tap(() => [
            {
                filename: `${assetDir}/css/[name].[contenthash:8].css`,
                chunkFilename: `${assetDir}/css/[name].[contenthash:8].chunk.css`,
                ignoreOrder: true
            }
        ]);

        // 修改图片输出目录
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
            .use('url-loader')
            .loader(require.resolve('url-loader'))
            .tap((options) => {
                const newOptions = {
                    ...options,
                    name: `${assetDir}/images/[name].[contenthash:8].[ext]`,
                    fallback: {
                        ...options.fallback,
                        options: {
                            publicPath: '../../',
                            name: `${assetDir}/images/[name].[contenthash:8].[ext]`,
                            esModule: false
                        }
                    }
                };
                return newOptions;
            });
        // 修改svg输出目录
        config.module
            .rule('svg')
            .test(/\.(svg)(\?.*)?$/)
            .use('file-loader')
            .loader(require.resolve('file-loader'))
            .tap((options) => ({
                ...options,
                publicPath: '../../',
                name: `${assetDir}/images/[name].[contenthash:8].[ext]`
            }));

        // 修改fonts输出目录
        config.module
            .rule('fonts')
            .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
            .use('file-loader')
            .loader(require.resolve('file-loader'))
            .tap((options) => ({
                ...options,
                name: `${assetDir}/fonts/[name].[contenthash:8].[ext]`,
                fallback: {
                    ...options.fallback,
                    options: {
                        publicPath: '../../',
                        name: `${assetDir}/fonts/[name].[contenthash:8].[ext]`,
                        esModule: false
                    }
                }
            }));
    }
});
