/*
 * @Author: qdx
 * @Date: 2020-05-28 08:39:31
 * @LastEditTime: 2022-04-24
 * @Description:
 */

import api from '@/api';
export default {
    appMain: api.appMain,
    commonServices: {
        commonQueryBySql: 'forms/common/commonQueryBySql', //通用查询
        getUserList: 'system/user/list',
        upload: 'common/upload',
        getDepTreeData: 'system/dept/treeselect', //获取组织机构树
        getRoleList: 'system/role/list', //获取角色列表
        getPostList: 'system/post/list', //获取岗位列表
        getCommonSerialNumber: 'forms/common/queryCommonSerialNumber', //序列号查询
        getDataByColmun: 'forms/common/queryDataByColmun', //根据表名、字段名查数据
        getHistoricTask: 'forms/activiti/general/getHistoricTask', //查询流程明细
        getNodeList: 'forms/activiti/general/getNodeList', //获取流程所有节点
        getDictDataListByDictCode: 'system/dict/data/list',
        getUserListByRoleIds: 'system/role/selectUserMessageByroleId', //根据角色ids查询用户列表
        getUserListByPostIds: 'system/post/seleUserMessageByPostId', //根据岗位Ids查询用户列表
        getUserListByDeptId: 'system/dept/selectUserMessageByUserId' //根据部门id查询用户列表
    }
};
