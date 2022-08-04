/*
 * @Author: devfpy
 * @Date: 2021-08-10 14:49:10
 * @LastEditTime: 2022-05-13
 * @LastEditors: devfpy
 * @Description:  b
 */
import React from 'react';
import { Message, notification } from 'antd';
import { PageLoading } from '@ant-design/pro-layout';
import { history } from 'umi';
import qs from 'qs';
import RightContent from '@/components/RightContent/index';
import logo_app from './assets/images/logo.png';

const homePath = '/home';
const loginPath = '/login';
const formDetailsPath = '/formDetails';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading />
};

export function getInitialState() {
    let userDataObj =
        sessionStorage.getItem('userData') &&
        sessionStorage.getItem('userData') != null &&
        sessionStorage.getItem('userData') != ''
            ? JSON.parse(sessionStorage.getItem('userData'))
            : null;

    let userMenus =
        sessionStorage.getItem('userMenus') &&
        sessionStorage.getItem('userMenus') != null &&
        sessionStorage.getItem('userMenus') != ''
            ? JSON.parse(sessionStorage.getItem('userMenus'))
            : [];

    if (history.location.pathname !== loginPath && history.location.pathname !== formDetailsPath) {
        if (userDataObj && userDataObj != null) {
            return {
                currentUser: userDataObj,
                userMenus: userMenus,
                settings: {}
            };
        } else {
            history.push({
                pathname: loginPath,
                search: qs.stringify(
                    { redirect: history.location.pathname },
                    { addQueryPrefix: true }
                )
            });
        }
    }

    if (userDataObj && userDataObj != null) {
        history.push(homePath);
        return {
            currentUser: userDataObj,
            userMenus: userMenus,
            settings: {}
        };
    }

    return {
        currentUser: null,
        userMenus: [],
        settings: {}
    };
}

export const layout = ({ initialState }) => {
    if (window.__POWERED_BY_QIANKUN__) {
        return {
            headerRender: false,
            footerRender: false,
            menuRender: false,
            menuHeaderRender: false
        };
    } else {
        return {
            logo: logo_app,
            title: 'device子应用',
            rightContentRender: () => <RightContent />,
            disableContentMargin: false,
            footerRender: null, // () => <Footer />,
            onPageChange: () => {
                const { location } = history;

                if (
                    !initialState?.currentUser &&
                    location?.pathname !== loginPath &&
                    location?.pathname !== formDetailsPath
                ) {
                    history.push(loginPath);
                } else {
                    if (location?.pathname == '/') {
                        let defaultPath =
                            sessionStorage.getItem('defaultPath') &&
                            sessionStorage.getItem('defaultPath') != null &&
                            sessionStorage.getItem('defaultPath') != ''
                                ? JSON.parse(sessionStorage.getItem('defaultPath'))
                                : homePath;
                        history.push(defaultPath);
                    }
                }
            },
            // 自定义 403 页面
            ...initialState?.settings
        };
    }
};

/**
 * dva 全局错误处理
 */
export const dva = {
    config: {
        onError(e) {
            e.preventDefault();
            let errorMsg = '';
            if (typeof e == 'string') {
                errorMsg = e;
            } else {
                let { message } = e;
                errorMsg = message;
            }

            Message.error(errorMsg);
        }
    }
};

/**
 * request 配置
 */
export const request = {
    errorConfig: {
        adaptor: (resData) => {
            const { code, msg } = resData;
            // 当api返回的数据中不包含 code 时说明该api不是已正常json格式返回数据，跳过adaptor配置
            if (!code) {
                return {
                    ...resData,
                    success: true,
                    errorMessage: ''
                };
            }

            let success = false;
            switch (code) {
                case 0:
                    success = true;
                    break;
                default:
                    success = false;
                    break;
            }
            return {
                ...resData,
                success: success,
                errorMessage: msg
            };
        }
    },
    errorHandler: (error) => {
        const { response, message } = error;
        return {
            error: message && message != null && message != '' ? message : null,
            resData: response
        };
    },
    responseInterceptors: [
        async (response) => {
            let data = '';
            let code = '';
            try {
                data = await response.clone().json();
                code = data?.code;
            } catch (err) {
                // 将api返回数据转json报错时 将response返回
                return response;
            }

            if (code === 4002) {
                const { pathname } = history.location;
                //清空session中存储的用户信息
                sessionStorage.removeItem('token');
                sessionStorage.setItem('isLogined', false);
                sessionStorage.removeItem('loginedUserName');
                sessionStorage.removeItem('userData');
                sessionStorage.removeItem('userPermissions');
                sessionStorage.removeItem('userRoles');
                history.replace({
                    pathname: loginPath,
                    search: qs.stringify({ redirect: pathname }, { addQueryPrefix: true })
                });

                return {
                    error: '登录状态超时，请重新登录。',
                    resData: response
                };
            } else {
                return response;
            }
        }
    ]
};
