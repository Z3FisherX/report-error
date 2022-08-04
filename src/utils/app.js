/*
 * @Author: devfpy
 * @Date: 2021-08-21 20:27:44
 * @LastEditTime: 2021-11-02 19:11:23
 * @LastEditors: devfpy
 * @Description:
 */
import React from 'react';
import { HomeOutlined, PicLeftOutlined, SmileOutlined, SettingOutlined } from '@ant-design/icons';
import { iconEnumAntdOutlined } from './antdesignIconOutlined';
import { iconEnumAntdFilled } from './antdesignIconFilled';
import { iconEnumAntdTwoTone } from './antdesignIconTwoTone';

const iconEnum = {
    nodiot_home_line_bold: <PicLeftOutlined />,
    list: <HomeOutlined />,
    nodiot_setting_01: <SettingOutlined />,
    ...iconEnumAntdOutlined,
    ...iconEnumAntdFilled,
    ...iconEnumAntdTwoTone
};

export function filterRoute(routes, authRoute) {
    const arr = [];
    authRoute.forEach((item, aIndex) => {
        let authMenuPath = item.path;
        let authoMenuType = item.menuType;

        let routeItem = findRouteItemByPath(routes, authMenuPath);

        let obj = routeItem && routeItem != null ? _.cloneDeep(routeItem) : {};

        let keyStr = _.cloneDeep(authMenuPath);
        obj.key = keyStr && keyStr != '' ? keyStr : 'menu_' + aIndex;
        obj.title = item.menuName;
        obj.name = item.menuName;
        obj.icon = iconEnum[item.icon];
        obj.path = authMenuPath;

        if (item.children && item.children.length > 0) {
            obj.routes = filterRoute(routeItem?.children || routes, item.children);
        }
        obj['initialized'] = true;
        obj['keepAliveName'] = authMenuPath;

        arr.push(obj);
    });
    // authRoute.forEach((item, aIndex) => {
    //     routes.forEach((route, rIndex) => {
    //         let authMenuPath = item.path;
    //         let authoMenuType = item.menuType;
    //         let routePath = route.path;

    //         let isEqual = false;
    //         if (routePath.indexOf(':') > 0) {
    //             //只有路由path中带有:的 判断 时才可以使用indexOf包含的方式  否则其他情况必须使用==进行判断
    //             routePath = routePath.substr(0, routePath.indexOf(':') - 1);
    //             if (authMenuPath.indexOf(routePath) > -1) {
    //                 isEqual = true;
    //             }
    //         } else {
    //             if (authMenuPath == routePath) {
    //                 isEqual = true;
    //             }
    //         }

    //         if (isEqual) {
    //             let obj = _.cloneDeep(route);

    //             let keyStr = _.cloneDeep(authMenuPath);
    //             obj.key = keyStr;
    //             obj.title = item.menuName;
    //             obj.name = item.menuName;
    //             obj.icon = iconEnum[item.icon];
    //             obj.path = authMenuPath;

    //             if (
    //                 route.children &&
    //                 item.children &&
    //                 route.children.length > 0 &&
    //                 item.children.length > 0
    //             ) {
    //                 obj.routes = filterRoute(route.children, item.children);
    //             }
    //             obj['initialized'] = true;
    //             obj['keepAliveName'] = authMenuPath;

    //             arr.push(obj);
    //         }
    //     });
    // });
    return arr;
}

function findRouteItemByPath(routes, path) {
    let item = null;
    if (routes.length > 0 && path != '') {
        for (let i = 0; i < routes.length; i++) {
            let ele = routes[i];

            let { children } = ele;
            let routePath = ele.path;

            let isEqual = false;
            if (routePath.indexOf(':') > 0) {
                //只有路由path中带有:的 判断 时才可以使用indexOf包含的方式  否则其他情况必须使用==进行判断
                routePath = routePath.substr(0, routePath.indexOf(':') - 1);
                if (path.indexOf(routePath) > -1) {
                    isEqual = true;
                }
            } else {
                if (path == routePath) {
                    isEqual = true;
                }
            }

            if (isEqual) {
                item = ele;
                break;
            } else {
                if (children && children != null && children.length > 0) {
                    let tmpItem = findRouteItemByPath(children, path);
                    if (tmpItem && tmpItem != null) {
                        item = tmpItem;
                        break;
                    }
                }
            }
        }
    }

    return item;
}
