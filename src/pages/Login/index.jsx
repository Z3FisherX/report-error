/*
 * @Author: FisherX
 * @Date: 2022-03-28
 * @LastEditTime: 2022-08-04
 * @LastEditors: FisherX
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message, Button, Form, Input, Checkbox } from 'antd';
import { history, useModel } from 'umi';
// import Footer from '@/components/Footer';
import { login } from './service';
import styles from './index.less';
import api from '@/api';

/**
 * 遍历生成用户菜单默认选中id和url
 * @param {*} menuItem 用户菜单第一项
 */
const getDefaultMenu = (menuItem) => {
    let menuId = '';
    let menuName = '';
    let menuUrl = '';
    let menuType = '';
    let openedKey = [];

    let id = menuItem.menuId;
    let name = menuItem.menuName;
    let url = menuItem.path;
    let type = menuItem.menuType;
    let children = menuItem.children;

    menuId = id;
    menuName = name;
    menuUrl = url;
    menuType = type; //菜单类型 当菜单类型为按钮时 需要跳过
    openedKey.push(id);

    if (menuType == 'F') {
        //菜单类型 当菜单类型为按钮时 需要跳过
        return null;
    }

    if (children && children.length > 0) {
        let returnData = getDefaultMenu(children[0]);
        if (returnData != null) {
            let childrenMenuId = returnData.id;
            let childrenMenuUrl = returnData.path;
            let childrenMenuType = returnData.menuType;
            let childrenOpenedKey = returnData.openedKey;

            menuId = childrenMenuId;
            menuUrl = childrenMenuUrl;
            menuType = childrenMenuType;

            openedKey.push.apply(openedKey, childrenOpenedKey);
        }
    }

    return {
        id: menuId,
        name: menuName,
        path: menuUrl,
        menuType: menuType,
        openedKey: openedKey
    };
};

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { initialState, setInitialState } = useModel('@@initialState');

    useEffect(() => {
        try {
            const loginData = JSON.parse(localStorage.getItem('loginData'));
            form.setFieldsValue(loginData);
        } catch (error) {}

        return () => {};
    }, [form]);

    //初始化sessionStorage中的用户信息
    const initSessionStorage = (data) => {
        const { access_token, token_prefix, menus, permissions, roles, user } = data;
        sessionStorage.setItem('token', access_token);
        sessionStorage.setItem('tokenPrefix', token_prefix);
        sessionStorage.setItem('currentUsername', JSON.stringify(user?.userName));
        sessionStorage.setItem('userData', JSON.stringify(user));
        sessionStorage.setItem('userPermissions', JSON.stringify(permissions));
        sessionStorage.setItem('userRoles', JSON.stringify(roles));
        sessionStorage.setItem('userMenus', JSON.stringify(menus));
    };

    const goto = (defaultPath) => {
        if (!history) {
            return;
        }
        let path = defaultPath ?? '/home';
        setTimeout(() => {
            history.push(path);
        }, 10);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const { username, password, remember } = values;
            const res = await login({ username, password, remember });
            const { menus, user } = res[0];

            initSessionStorage(res[0]);
            let defaultMenu = getDefaultMenu(menus);
            let defaultPath = defaultMenu?.path;

            //记住密码功能
            if (remember) {
                localStorage.setItem('loginData', JSON.stringify({ username, password, remember }));
            } else {
                localStorage.removeItem('loginData');
            }
            setInitialState({
                ...initialState,
                currentUser: user,
                userMenus: menus
            });
            goto(defaultPath);
        } catch (error) {
            console.error(error);
            message.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.systemName}>{api.config.systemName}</h1>
                <Form
                    name="login"
                    form={form}
                    wrapperCol={{ span: 24 }}
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input
                            size="large"
                            placeholder="请输入用户名"
                            prefix={<UserOutlined />}
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                        <Input.Password
                            size="large"
                            placeholder="请输入密码"
                            prefix={<LockOutlined />}
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ span: 24 }}>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.button}
                            size="large"
                            loading={loading}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default Login;
