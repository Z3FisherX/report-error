/*
 * @Author: devfpy
 * @Date: 2021-08-09 17:30:41
 * @LastEditTime: 2022-07-29
 * @LastEditors: FisherX
 * @Description:
 */
export default {
    dev: {
        '/api': {
            // 要代理的地址
            target: 'http://192.168.1.17:8885/',
            // target: 'http://192.168.1.63:8880/',

            // 配置了这个可以从 http 代理到 https
            // 依赖 origin 的功能可能需要这个，比如 cookie
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/'
            }
        },
        // 文件地址
        '/common/isite90-form-server/': {
            target: 'http://192.168.1.16:9000/',
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '^/common/isite90-form-server/': '/common/isite90-form-server/'
            }
        },
        // 文档预览服务
        '/documentPreviewServices': {
            target: 'http://192.168.1.16:8012',
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '/documentPreviewServices': ''
            }
        }
    }
};
