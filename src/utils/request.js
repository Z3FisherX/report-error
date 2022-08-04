/*
 * @Author: FisherX
 * @Date: 2022-03-29
 * @LastEditTime: 2022-07-26
 * @LastEditors: FisherX
 * @Description: 系统的request封装，对应原来系统的Network/network.js
 */
import { request } from 'umi';
import qs from 'qs';

/**
 * 根据请求Api获取token
 */
export const getToken = () => {
    let token = '';
    if (sessionStorage.getItem('token') != null) {
        token = {
            [sessionStorage.getItem('tokenPrefix')]: sessionStorage.getItem('token')
        };
    }
    return token;
};

/**
 * POST 请求
 * @param {*} requestUrl
 * @param {*} requestParams
 * @param {*} responseParams
 * @returns
 */
export function postData(requestUrl, requestParams, responseParams) {
    return requestFunction('POST', requestUrl, requestParams, responseParams);
}

/**
 * GET 请求
 * @param {*} requestUrl
 * @param {*} requestParams
 * @param {*} responseParams
 */
export function getData(requestUrl, requestParams, responseParams) {
    return requestFunction('GET', requestUrl, requestParams, responseParams);
}

/**
 * PUT 请求
 * @param {*} requestUrl
 * @param {*} requestParams
 * @param {*} responseParams
 * @returns
 */
export function putData(requestUrl, requestParams, responseParams) {
    return requestFunction('PUT', requestUrl, requestParams, responseParams);
}

/**
 * DELETE 请求
 * @param {*} requestUrl
 * @param {*} requestParams
 * @param {*} responseParams
 */
export function deleteData(requestUrl, requestParams, responseParams) {
    return requestFunction('DELETE', requestUrl, requestParams, responseParams);
}

/**
 * 从服务器获取数据 request for formData
 * @param {*} requestUrl 接口地址
 * @param {*} requestParams 请求参数
 * @param {Array} responseParams 返回数据中需要的参数名 返回的数据会根据responseParams参数列表的顺序返回数据。
 */
export function postFormData(requestUrl, requestParams, responseParams) {
    return requestFunction('POST', requestUrl, requestParams, responseParams);
}

/**
 * 上传文件
 * @param {*} requestUrl
 * @param {*} requestParams
 * @param {*} responseParams
 * @returns
 */
export function uploadFile(requestUrl, requestParams, responseParams) {
    return requestFunction('POST', requestUrl, requestParams, responseParams);
}

/**
 * 下载文件  发送请求 获取 返回的blob数据
 * @param {*} method
 * @param {*} url
 * @param {*} params
 * @returns
 */
export function downloadFileGetBlob(method = 'POST', url, requestParams) {
    let params = {};
    let newUrl = url;
    if (method == 'GET') {
        // params = {
        //     data: requestParams
        // };

        if (requestParams) {
            newUrl += '?' + qs.stringify(requestParams);
        }
    } else {
        params = {
            data: requestParams
        };
    }
    return new Promise((resolve, reject) => {
        fetch(newUrl, {
            method: method,
            headers: {
                ...getToken()
            },
            ...params,
            responseType: 'blob',
            getResponse: true,
            parseResponse: false
        }).then((res) =>
            res.blob().then((blob) => {
                let contentDisposition = res.headers.get('Content-disposition');
                let fileName = '';
                if (contentDisposition && contentDisposition.indexOf('filename=') > -1) {
                    fileName = decodeURIComponent(
                        contentDisposition.substr(contentDisposition.indexOf('filename=') + 9)
                    );
                }

                const objectURL = URL.createObjectURL(blob);
                let btn = document.createElement('a');
                btn.download = fileName;
                btn.href = objectURL;
                btn.click();
                URL.revokeObjectURL(objectURL);
                btn = null;
                resolve(res);
            })
        );
    });
}

/**
 * 下载文件(仓库)  发送请求 获取 返回的blob数据
 * @param {*} method
 * @param {*} url
 * @param {*} params
 * @returns
 */
export function downloadStockFileGetBlob(method = 'POST', url, requestParams, fileName = '') {
    let params = {};
    if (method == 'GET') {
        params = {
            params: requestParams
        };
    } else {
        params = {
            body: JSON.stringify(requestParams)
        };
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            headers: {
                ...getToken(),
                'Content-Type': 'application/json'
            },
            ...params,
            responseType: 'blob',
            getResponse: true,
            parseResponse: false
        }).then((res) =>
            res.blob().then((blob) => {
                let contentDisposition = res.headers.get('Content-disposition');
                let name = fileName;
                if (!name) {
                    // let fileName = '';
                    if (contentDisposition && contentDisposition.indexOf('filename=') > -1) {
                        name = decodeURIComponent(
                            contentDisposition.substr(contentDisposition.indexOf('filename=') + 9)
                        );
                    }
                }

                const objectURL = URL.createObjectURL(blob);
                let btn = document.createElement('a');
                btn.download = name;
                btn.href = objectURL;
                btn.click();
                URL.revokeObjectURL(objectURL);
                btn = null;
                resolve(res);
            })
        );
    });
}

/**
 * 下载文件  导出数据 对blob数据的处理
 * @param {*} responseData  blob 流数据
 * @returns 文件
 */
export function downloadFileByBlob(responseData, filename) {
    responseData.blob().then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);

        const aElement = document.createElement('a');

        document.body.appendChild(aElement);

        aElement.style.display = 'none';

        aElement.href = blobUrl;

        aElement.download = filename;

        aElement.click();

        document.body.removeChild(aElement);
    });
}

/**
 * 请求 functions
 * @param {*} method
 * @param {*} requestUrl
 * @param {*} requestParams
 * @param {*} responseParams
 * @returns
 */
function requestFunction(method, requestUrl, requestParams, responseParams) {
    return new Promise((resolve, reject) => {
        let params = {};
        if (method == 'GET') {
            params = {
                params: requestParams
            };
        } else {
            params = {
                data: requestParams
            };
        }
        request(requestUrl, {
            method: method,
            headers: {
                ...getToken()
            },
            ...params
        }).then((data) => {
            let { error } = data;
            if (error == null) {
                if (responseParams == 'all') {
                    resolve(data);
                } else {
                    const { code, msg } = data;
                    // code 4002登录状态超时 拦截器已处理
                    if (code == 0) {
                        resolve(getApiReturnDataByResponseParams(data, responseParams));
                    } else {
                        reject(msg);
                    }
                }
            } else {
                reject(error);
            }
        });
    });
}

/**
 * 从api返回数据中取出指定的数据
 */
function getApiReturnDataByResponseParams(resData, responseParams) {
    let resultData = [];
    if (responseParams != null && typeof responseParams != 'undefined') {
        responseParams.map((ele) => {
            let responseParamData = resData[ele];
            if (responseParamData) {
                resultData.push(responseParamData);
            }
        });
    }
    return resultData;
}
