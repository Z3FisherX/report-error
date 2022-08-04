/*
 * @Author: FisherX
 * @Date: 2020-12-01 14:08:20
 * @LastEditTime: 2022-04-02
 * @Description:
 */
export default {
    config: {
        systemName: '',
        copyRight: '',
        version: '1.1.2'
    },
    appMain: {
        serverDomain: 'http://10.158.200.210:8080',
        socketServer: 'ws://10.158.200.210:8080/',
        applicationDirectory: '/api/',
        applicationDirectoryReport: '/report/',
        tableListPageSize: 12,
        // documentPreviewServices: 'http://192.168.1.8:8012/onlinePreview?url='
        // documentPreviewServices: '/onlinePreview?url='
        documentPreviewServices: 'documentPreviewServices/onlinePreview?url='
    }
};
