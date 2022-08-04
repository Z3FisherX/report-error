/*
 * @Author: FisherX
 * @Date: 2022-04-06
 * @LastEditTime: 2022-04-06
 * @LastEditors: FisherX
 * @Description:
 */
import { Space } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = () => {
    const { initialState } = useModel('@@initialState');

    if (!initialState) {
        return null;
    }

    return (
        <Space className={styles.right}>
            <Avatar />
        </Space>
    );
};

export default GlobalHeaderRight;
