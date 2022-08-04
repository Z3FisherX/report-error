/*
 * @Author: FisherX
 * @Date: 2022-03-29
 * @LastEditTime: 2022-03-30
 * @LastEditors: FisherX
 * @Description:
 */
import api from '@/api';
export default {
    appMain: api.appMain,
    user: {
        getSystemConfigs: 'system/config/list',
        doLogin: 'system/user/login',
        logout: 'system/user/logout',
        getInfo: 'system/user/getInfo',
        sysNoticeGetList: 'system/notice/list' // 系统公告 查询列表
    }
};
