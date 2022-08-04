/*
 * @Author: FisherX
 * @Date: 2022-04-06
 * @LastEditTime: 2022-04-07
 * @LastEditors: FisherX
 * @Description:
 */
import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import avatarPic from './user_avatar_default.png';
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
    const { query = {}, search, pathname } = history.location;
    const { redirect } = query; // Note: There may be security issues, please note

    if (window.location.pathname !== '/user/login' && !redirect) {
        sessionStorage.clear();
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: pathname + search
            })
        });
    }
};

const AvatarDropdown = ({ menu }) => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const onMenuClick = useCallback(
        (event) => {
            const { key } = event;

            if (key === 'logout') {
                setInitialState((s) => ({ ...s, currentUser: undefined }));
                loginOut();
                return;
            }

            history.push(`/account/${key}`);
        },
        [setInitialState]
    );
    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
            <Spin
                size="small"
                style={{
                    marginLeft: 8,
                    marginRight: 8
                }}
            />
        </span>
    );

    if (!initialState) {
        return loading;
    }

    const { currentUser } = initialState;

    if (!currentUser || !currentUser.nickName) {
        return loading;
    }

    const menuHeaderDropdown = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            {menu && (
                <Menu.Item key="center">
                    <UserOutlined />
                    个人中心
                </Menu.Item>
            )}
            {menu && (
                <Menu.Item key="settings">
                    <SettingOutlined />
                    个人设置
                </Menu.Item>
            )}
            {menu && <Menu.Divider />}

            <Menu.Item key="logout">
                <LogoutOutlined />
                退出登录
            </Menu.Item>
        </Menu>
    );
    return (
        <HeaderDropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={avatarPic} alt="avatar" />
                <span className={`${styles.name} anticon`}>{currentUser.nickName}</span>
            </span>
        </HeaderDropdown>
    );
};

export default AvatarDropdown;
