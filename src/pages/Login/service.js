/*
 * @Author: FisherX
 * @Date: 2022-03-29
 * @LastEditTime: 2022-04-24
 * @LastEditors: FisherX
 * @Description:
 */
import api from './api';
import { getData, postData, deleteData } from '@/utils/request';

/**
 * 用户登录
 * @returns
 */
export function login(params) {
    const { username, password, remember } = params;
    let requestUrl = api.appMain.applicationDirectory + api.user.doLogin;
    let requestParam = {
        username,
        password,
        rememberMe: remember
        // code: captcha,
        // uuid: captchaImageUuid,
    };
    return new Promise((resolve, reject) => {
        postData(requestUrl, requestParam, ['data'])
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 获取当前登录用户的信息
 */
export function getCurrentUser() {
    let requestUrl = api.appMain.applicationDirectory + api.user.getInfo;
    return new Promise((resolve, reject) => {
        getData(requestUrl, null, ['permissions', 'roles', 'user'])
            .then((data) => {
                // // 保存用户的权限标识到session
                // sessionStorage.setItem('permissions', JSON.stringify(data[0]));
                // sessionStorage.setItem('roles', JSON.stringify(data[1]));
                resolve({
                    permissions: data[0],
                    roles: data[1],
                    user: data[2]
                });
            })
            .catch((error) => {
                console.log(error);
                if (error && typeof error == 'string') {
                    reject(error);
                } else {
                    let { message } = error ? error : {};
                    reject(message ? message : '发生未知错误！');
                }
            });
    });
}

/**
 * 退出登录
 * @returns <Promise>
 */
export function logout() {
    // let requestUrl = api.appMain.applicationDirectory + api.logModule.logout;
    let requestUrl = api.appMain.applicationDirectory + api.user.logout;
    return new Promise((resolve, reject) => {
        deleteData(requestUrl, null, null)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
